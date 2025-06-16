// 测试 Node.js 版本的非交互运行
const { searchDouyinVideos, generateHTML } = require("./douyin-nodejs.js");
const fs = require("fs");
const path = require("path");

async function testNodejsVersion() {
  console.log("🧪 测试 Node.js 版本...");

  try {
    // 搜索视频
    console.log("🔍 搜索视频...");
    const videos = await searchDouyinVideos("美女", 0, 5);

    if (videos.length > 0) {
      console.log(`✅ 找到 ${videos.length} 个视频`);

      // 生成HTML
      console.log("📄 生成HTML页面...");
      const htmlContent = generateHTML(videos, "美女", 8080);
      const fileName = `test-douyin-${Date.now()}.html`;
      const filePath = path.join(__dirname, fileName);

      fs.writeFileSync(filePath, htmlContent, "utf8");
      console.log(`✅ HTML文件已生成: ${fileName}`);

      // 检查HTML内容
      const fileSize = fs.statSync(filePath).size;
      console.log(`📊 文件大小: ${fileSize} bytes`);

      // 检查是否包含代理链接
      const hasProxyLinks = htmlContent.includes("localhost:8080/proxy-video");
      console.log(`🔗 包含代理链接: ${hasProxyLinks ? "是" : "否"}`);

      console.log("\n📺 HTML页面生成成功！");
      console.log("💡 要测试播放功能，请运行: node douyin-nodejs.js");
    } else {
      console.log("❌ 没有找到视频");
    }
  } catch (error) {
    console.log("❌ 测试失败:", error.message);
  }
}

testNodejsVersion();
