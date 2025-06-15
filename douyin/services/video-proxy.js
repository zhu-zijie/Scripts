const https = require("https");

class VideoProxyService {
  // 代理视频请求
  static handleVideoProxy(req, res, videoUrl) {
    try {
      const videoReq = https.request(
        videoUrl,
        {
          headers: {
            "User-Agent":
              "Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_7) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/137.0.0.0 Safari/537.36",
            Referer: "https://www.douyin.com/",
            Accept:
              "video/webm,video/ogg,video/*;q=0.9,application/ogg;q=0.7,audio/*;q=0.6,*/*;q=0.5",
            Range: req.headers.range || "bytes=0-",
          },
        },
        (videoRes) => {
          res.writeHead(videoRes.statusCode, {
            "Content-Type": videoRes.headers["content-type"] || "video/mp4",
            "Content-Length": videoRes.headers["content-length"],
            "Accept-Ranges": "bytes",
            "Content-Range": videoRes.headers["content-range"],
            "Access-Control-Allow-Origin": "*",
          });

          videoRes.pipe(res);
        }
      );

      videoReq.on("error", (proxyError) => {
        console.log("视频代理请求错误:", proxyError.message);
        res.writeHead(500);
        res.end("Video proxy error: " + proxyError.message);
      });

      videoReq.end();
    } catch (proxyException) {
      console.log("视频代理异常:", proxyException.message);
      res.writeHead(500);
      res.end("Video proxy failed: " + proxyException.message);
    }
  }
}

module.exports = VideoProxyService;
