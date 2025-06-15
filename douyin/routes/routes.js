const url = require("url");
const DouyinAPIService = require("../services/douyin-api");
const VideoProxyService = require("../services/video-proxy");
const generateHomePage = require("../views/home-page");
const generateVideoPage = require("../views/video-player");
const generateErrorPage = require("../views/error-page");

class Routes {
  static async handleRequest(req, res) {
    const parsedUrl = url.parse(req.url, true);
    console.log(`📡 请求路径: ${parsedUrl.pathname}`);

    try {
      switch (parsedUrl.pathname) {
        case "/":
          await Routes.handleHomePage(req, res);
          break;
        case "/search":
          await Routes.handleSearchAPI(req, res, parsedUrl.query);
          break;
        case "/play":
          await Routes.handleVideoPlayer(req, res, parsedUrl.query);
          break;
        case "/proxy-video":
          await Routes.handleVideoProxy(req, res, parsedUrl.query);
          break;
        default:
          Routes.handleNotFound(req, res);
      }
    } catch (error) {
      console.error("❌ 路由处理错误:", error);
      Routes.handleError(req, res, error);
    }
  }

  // 首页
  static async handleHomePage(req, res) {
    res.writeHead(200, { "Content-Type": "text/html; charset=utf-8" });
    res.end(generateHomePage());
  }

  // 搜索API
  static async handleSearchAPI(req, res, query) {
    const keyword = query.keyword;
    if (!keyword) {
      res.writeHead(400, { "Content-Type": "application/json; charset=utf-8" });
      res.end(JSON.stringify({ error: "缺少搜索关键词" }));
      return;
    }

    const videos = await DouyinAPIService.searchVideos(keyword);
    res.writeHead(200, { "Content-Type": "application/json; charset=utf-8" });
    res.end(
      JSON.stringify({
        keyword: keyword,
        count: videos.length,
        videos: videos,
      })
    );
  }

  // 视频播放页面
  static async handleVideoPlayer(req, res, query) {
    const keyword = query.keyword;
    if (!keyword) {
      res.writeHead(400, { "Content-Type": "text/html; charset=utf-8" });
      res.end(generateErrorPage("缺少搜索关键词"));
      return;
    }

    try {
      const videos = await DouyinAPIService.searchVideos(keyword);
      if (videos.length === 0) {
        res.writeHead(200, { "Content-Type": "text/html; charset=utf-8" });
        res.end(
          generateErrorPage(`没有找到关键词 "${keyword}" 的视频`, keyword)
        );
        return;
      }

      res.writeHead(200, { "Content-Type": "text/html; charset=utf-8" });
      res.end(generateVideoPage(videos, keyword));
    } catch (error) {
      res.writeHead(500, { "Content-Type": "text/html; charset=utf-8" });
      res.end(generateErrorPage(error.message, keyword));
    }
  }

  // 视频代理
  static async handleVideoProxy(req, res, query) {
    const videoUrl = query.url;
    if (!videoUrl) {
      res.writeHead(400);
      res.end("Missing video url");
      return;
    }

    VideoProxyService.handleVideoProxy(req, res, videoUrl);
  }

  // 404页面
  static handleNotFound(req, res) {
    res.writeHead(404, { "Content-Type": "text/html; charset=utf-8" });
    res.end(generateErrorPage("页面未找到 (404)"));
  }

  // 错误处理
  static handleError(req, res, error) {
    res.writeHead(500, { "Content-Type": "text/html; charset=utf-8" });
    res.end(generateErrorPage(error.message || "服务器内部错误"));
  }
}

module.exports = Routes;
