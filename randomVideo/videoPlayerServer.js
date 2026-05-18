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
      <html lang="en">
      <head>
        <meta charset="UTF-8">
        <meta name="viewport" content="width=device-width, initial-scale=1.0">
        <title>Video Player</title>
        <link rel="stylesheet" href="/player.css">
      </head>
      <body>
        <video id="video" controls></video>
        <div id="status" class="status">Ready</div>
        <div class="controls">
          <button id="playButton" class="primary">开始</button>
          <button id="toggleButton">暂停</button>
          <button id="nextButton" class="ghost">下一条</button>
          <div class="progress">
            <span id="time">00:00 / 00:00</span>
            <input id="seek" type="range" min="0" max="100" value="0" />
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
      res.writeHead(200, {
        "Content-Type": "application/json",
        "Cache-Control": "no-store",
      });
      const url = channels.length > 0 ? pickRandom(channels) : null;
      res.end(JSON.stringify({ url }));
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
