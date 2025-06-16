// 测试代理功能
const { searchDouyinVideos } = require("./douyin-nodejs.js");

async function test() {
  console.log("🧪 测试搜索功能...");
  const videos = await searchDouyinVideos("美女", 0, 3);

  if (videos.length > 0) {
    console.log(`✅ 搜索成功，找到 ${videos.length} 个视频`);
    console.log(
      "第一个视频:",
      videos[0].author,
      "-",
      videos[0].title.substring(0, 30)
    );
    console.log("视频URL长度:", videos[0].videoUrl.length);
    console.log("视频URL开头:", videos[0].videoUrl.substring(0, 50) + "...");
  } else {
    console.log("❌ 搜索失败");
  }
}

test().catch(console.error);
