// node环境随机播放视频
const http = require("http");
const fs = require("fs/promises");
const path = require("path");
const crypto = require("crypto");

const CONFIG_PATH = path.join(__dirname, "sources.json");

const ASSET_MANIFEST = {
  "/player.css": { file: "player.css", type: "text/css" },
  "/player.js": { file: "player.js", type: "text/javascript" },
};

const createEtag = (content) =>
  `"${crypto.createHash("sha1").update(content).digest("hex")}"`;

const renderPage = () => `
      <!DOCTYPE html>
      <html lang="zh-CN">
      <head>
        <meta charset="UTF-8">
        <meta name="viewport" content="width=device-width, initial-scale=1.0, viewport-fit=cover">
        <title>随机短视频播放器</title>
        <link rel="stylesheet" href="/player.css">
      </head>
      <body>
        <div class="stage">
          <video id="video" playsinline webkit-playsinline preload="metadata"></video>
          <div class="vignette"></div>
          <div id="status" class="status">准备就绪</div>
          <div id="hint" class="hint">点击开始</div>
          <div class="controls">
            <div class="cluster">
              <button id="toggleButton" class="primary" type="button">开始</button>
              <button id="nextButton" class="ghost" type="button">下一条</button>
              <div class="source">
                <label for="sourceSelect">来源</label>
                <select id="sourceSelect">
                  <option value="random">随机全部</option>
                </select>
              </div>
            </div>
            <div class="progress">
              <span id="time" class="time">00:00 / 00:00</span>
              <input id="seek" type="range" min="0" max="100" value="0" />
            </div>
          </div>
        </div>
        <script src="/player.js" defer></script>
      </body>
      </html>
    `;

const loadAssets = async () => {
  const assets = new Map();
  const entries = Object.entries(ASSET_MANIFEST);

  for (const [route, meta] of entries) {
    const filePath = path.join(__dirname, meta.file);
    const [content, stats] = await Promise.all([
      fs.readFile(filePath, "utf8"),
      fs.stat(filePath),
    ]);
    assets.set(route, {
      content,
      type: meta.type,
      etag: createEtag(content),
      lastModified: stats.mtime.toUTCString(),
    });
  }

  return assets;
};

const loadChannels = async () => {
  const raw = await fs.readFile(CONFIG_PATH, "utf8");
  const parsed = JSON.parse(raw);

  if (
    !Array.isArray(parsed) ||
    parsed.some((value) => typeof value !== "string")
  ) {
    throw new Error("sources.json must be an array of strings");
  }

  return parsed;
};

const pickRandom = (items) => items[Math.floor(Math.random() * items.length)];

const labelForSource = (value) => {
  try {
    const url = new URL(value);
    return url.hostname || value;
  } catch (error) {
    return value;
  }
};

const isFresh = (req, { etag, lastModified }) => {
  const ifNoneMatch = req.headers["if-none-match"];
  const ifModifiedSince = req.headers["if-modified-since"];

  if (ifNoneMatch && etag && ifNoneMatch === etag) return true;
  if (ifModifiedSince && lastModified) {
    const since = new Date(ifModifiedSince).getTime();
    const modified = new Date(lastModified).getTime();
    if (!Number.isNaN(since) && !Number.isNaN(modified)) {
      return modified <= since;
    }
  }

  return false;
};

const startServer = async () => {
  const [assets, channels] = await Promise.all([loadAssets(), loadChannels()]);
  const html = renderPage();
  const htmlEtag = createEtag(html);
  const htmlLastModified = new Date().toUTCString();

  const server = http.createServer((req, res) => {
    const requestUrl = new URL(req.url, `http://${req.headers.host}`);
    const pathname = requestUrl.pathname;

    if (pathname === "/") {
      const meta = { etag: htmlEtag, lastModified: htmlLastModified };
      if (isFresh(req, meta)) {
        res.writeHead(304, {
          ETag: htmlEtag,
          "Last-Modified": htmlLastModified,
          "Cache-Control": "no-cache",
        });
        res.end();
        return;
      }

      res.writeHead(200, {
        "Content-Type": "text/html",
        ETag: htmlEtag,
        "Last-Modified": htmlLastModified,
        "Cache-Control": "no-cache",
      });
      res.end(html);
      return;
    }

    if (pathname === "/api/next") {
      const sourceId = requestUrl.searchParams.get("source");
      res.writeHead(200, {
        "Content-Type": "application/json",
        "Cache-Control": "no-store",
      });
      let url = null;
      if (channels.length > 0) {
        if (sourceId && sourceId !== "random") {
          const index = Number(sourceId);
          if (Number.isInteger(index) && channels[index]) {
            url = channels[index];
          } else {
            url = pickRandom(channels);
          }
        } else {
          url = pickRandom(channels);
        }
      }
      res.end(JSON.stringify({ url }));
      return;
    }

    if (pathname === "/api/sources") {
      res.writeHead(200, {
        "Content-Type": "application/json",
        "Cache-Control": "no-store",
      });
      const sources = channels.map((value, index) => ({
        id: String(index),
        label: labelForSource(value),
      }));
      res.end(JSON.stringify({ sources }));
      return;
    }

    const asset = assets.get(pathname);
    if (asset) {
      if (isFresh(req, asset)) {
        res.writeHead(304, {
          ETag: asset.etag,
          "Last-Modified": asset.lastModified,
          "Cache-Control": "no-cache",
        });
        res.end();
        return;
      }

      res.writeHead(200, {
        "Content-Type": asset.type,
        ETag: asset.etag,
        "Last-Modified": asset.lastModified,
        "Cache-Control": "no-cache",
      });
      res.end(asset.content);
      return;
    }

    res.writeHead(404, { "Content-Type": "text/plain" });
    res.end("Not Found");
  });

  const PORT = 3000;
  server.listen(PORT, () => {
    console.log(`Server is running at http://localhost:${PORT}`);
  });
};

startServer().catch((error) => {
  console.error("Failed to start server:", error);
  process.exitCode = 1;
});
