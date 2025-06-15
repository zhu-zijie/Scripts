const http = require("http");
const serverConfig = require("./config/server-config");
const Routes = require("./routes/routes");

// 创建服务器
const server = http.createServer(Routes.handleRequest);

// 启动服务器
server.listen(serverConfig.port, () => {
  console.log("🎥 抖音视频播放服务器已启动!");
  console.log(`🌐 访问: http://${serverConfig.host}:${serverConfig.port}`);
  console.log(
    `🎬 播放: http://${serverConfig.host}:${serverConfig.port}/play?keyword=关键词`
  );
  console.log(
    `📡 API: http://${serverConfig.host}:${serverConfig.port}/search?keyword=关键词`
  );
  console.log("🔧 按 Ctrl+C 停止服务器");
});

// 优雅关闭
process.on("SIGINT", () => {
  console.log("\n🛑 正在关闭服务器...");
  server.close(() => {
    console.log("✅ 服务器已关闭");
    process.exit(0);
  });
});

process.on("SIGTERM", () => {
  console.log("🛑 收到终止信号，正在关闭服务器...");
  server.close(() => {
    console.log("✅ 服务器已关闭");
    process.exit(0);
  });
});
