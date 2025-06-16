// 抖音视频播放器 - Node.js版本
// 生成HTML页面在浏览器中播放

const https = require("https");
const querystring = require("querystring");
const fs = require("fs");
const path = require("path");
const { exec } = require("child_process");
const readline = require("readline");
const http = require("http");
const url = require("url");

// 抖音API配置
const API_CONFIG = {
  baseUrl: "https://www.douyin.com/aweme/v1/web/general/search/single/",
  searchParams: {
    keyword: "美女",
    search_channel: "aweme_general",
    search_source: "search_history",
    search_id: "2025060600121269146484485DCC928163",
    enable_history: 1,
    query_correct_type: 1,
    is_filter_search: 0,
    offset: 0,
    count: 20,
    need_filter_settings: 0,
  },
  deviceInfo: {
    device_platform: "webapp",
    platform: "PC",
    pc_libra_divert: "Mac",
    os_name: "Mac OS",
    os_version: "10.15.7",
    cpu_core_num: 10,
    device_memory: 8,
    browser_name: "Chrome",
    browser_version: "137.0.0.0",
    browser_language: "zh-CN",
    browser_platform: "MacIntel",
    browser_online: true,
    engine_name: "Blink",
    engine_version: "137.0.0.0",
    cookie_enabled: true,
    screen_width: 1280,
    screen_height: 800,
  },
  appInfo: {
    aid: 6383,
    channel: "channel_pc_web",
    version_code: 190600,
    version_name: "19.6.0",
    update_version_code: 170400,
    pc_client_type: 1,
    support_h265: 1,
    support_dash: 1,
  },
  networkInfo: {
    downlink: 6,
    effective_type: "4g",
    round_trip_time: 250,
  },
  securityTokens: {
    webid: "7479039824662414875",
    uifid:
      "37c879f32637ebc5496b02d59029bbf7616da5849e10d44e1e2ee2dac28cdd6b2bb58216b45ff669e915df41220433cb4b055f4d79ee27f570f10ebe30caba2819b0e5f9bad2f2793002d37e05c0e5089d0ad5ee3d93fd17b09c0abd38540cb7c9426ef9aaebd9e4b8fb4b1ad225668e5d748dc9c6cac03e2aeb1236495df1caa8cc2042c81e90bbc9c32aac8d6a1089d2d0a7435981cc0d472c3006f487b8bb",
    msToken:
      "_fwEi7MGnzlsjw0b3HKhXo6_yd6AHMUprm-FXB0xXDmg6VM48Wd-VUikaquB6tSRc3Vd5t503jq-h7mkptw_4dCwzceW3UbMrq3O694MdaGe9jHM3Kj_Uu_FgUFGMGjUqypygdHQi_Buq99xNw4LIs6IjP8p42MyIiKE-MOMS0eH",
    a_bogus:
      "dJUVketLdo/cedMG8CButl5UjyLlrsWyY-iKWKxPHPOdGXeO6YPnxxCebxz9WterKuZTw1oHfDGAanxbOGXsZFokumpkuw7f8T2cIuXL0ZJXGGJgnpfBCjGxLvsrUWsYTK5aidwXWt0eI2Q3NNciAMF9HKFaQ8mMTqPfdpRZ7xu2QCjqp3l8unSBwh1J",
  },
  cookies:
    "ttwid=1%7CMWiPccGmEGB7fkh4NZI8QI2z1xUd5Yb9Tm10WkV6OcE%7C1741349671%7C63fe4e2d016a66a6504cba68dd3aaeecc7912e26731ea8bdc1e4729523b45406; UIFID_TEMP=37c879f32637ebc5496b02d59029bbf7616da5849e10d44e1e2ee2dac28cdd6bea7cc33c8b9a99c0a9cc24fb7eec418e7c5ebe5bfa4d54840825ea533fd78c684da63e72074f30f3ae34f7445cec51d8; hevc_supported=true; fpk1=U2FsdGVkX1+k1fXw06BVXlpq8x5EY2HCjPtAvN0GlhRv33D/A7XjTOTQLqmUD1YubyMJkW94Q0anClMP/rVzDw==; fpk2=b977e10d1cb26107909e97d51a688323",
};

// HTTP请求函数
const httpRequest = (url, options) => {
  return new Promise((resolve, reject) => {
    const req = https.request(url, options, (res) => {
      let data = "";

      res.on("data", (chunk) => {
        data += chunk;
      });

      res.on("end", () => {
        try {
          resolve(JSON.parse(data));
        } catch (parseError) {
          console.log("JSON解析失败:", parseError.message);
          reject(new Error("解析JSON失败: " + parseError.message));
        }
      });
    });

    req.on("error", (requestError) => {
      console.log("HTTP请求错误:", requestError.message);
      reject(requestError);
    });

    req.end();
  });
};

// 搜索抖音视频
const searchDouyinVideos = async (keyword, offset = 0, count = 20) => {
  try {
    const params = {
      ...API_CONFIG.searchParams,
      keyword: keyword,
      offset: offset,
      count: count,
    };

    const allParams = {
      ...params,
      ...API_CONFIG.deviceInfo,
      ...API_CONFIG.appInfo,
      ...API_CONFIG.networkInfo,
      ...API_CONFIG.securityTokens,
    };

    const urlParams = querystring.stringify(allParams);
    const fullUrl = `${API_CONFIG.baseUrl}?${urlParams}`;

    const options = {
      headers: {
        Cookie: API_CONFIG.cookies,
        Referer: `https://www.douyin.com/jingxuan/search/${encodeURIComponent(
          keyword
        )}`,
        "User-Agent":
          "Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_7) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/137.0.0.0 Safari/537.36",
      },
    };

    console.log(`🔍 正在搜索: ${keyword}`);
    const data = await httpRequest(fullUrl, options);

    if (data.data && data.data.length > 0) {
      return data.data
        .map((item) => {
          const awemeInfo = item?.aweme_info;
          if (!awemeInfo) return null;

          let videoUrl = "";
          if (awemeInfo.video?.play_addr?.url_list?.length > 0) {
            videoUrl = awemeInfo.video.play_addr.url_list[0];
          }

          return {
            id: awemeInfo.aweme_id || "未知",
            author: awemeInfo.author?.nickname || "未知",
            uid: awemeInfo.author?.uid || "未知",
            videoUrl: videoUrl,
            videoUrls: awemeInfo.video?.play_addr?.url_list || [],
            duration: awemeInfo.video?.duration || 15000,
            title: awemeInfo.desc || "无标题",
            cover: awemeInfo.video?.cover?.url_list?.[0] || "",
            shareUrl: `https://www.douyin.com/video/${awemeInfo.aweme_id}`,
          };
        })
        .filter((item) => Boolean(item) && item.videoUrl);
    }
    return [];
  } catch (error) {
    console.log("❌ 搜索出错：", error.message);
    return [];
  }
};

// 生成HTML播放页面
const generateHTML = (videos, keyword) => {
  return `
<!DOCTYPE html>
<html lang="zh-CN">
<head>
    <meta charset="utf-8">
    <meta name="viewport" content="width=device-width, initial-scale=1">
    <title>🎥 抖音视频播放器 - ${keyword}</title>
    <style>
        * {
            margin: 0;
            padding: 0;
            box-sizing: border-box;
        }
        
        body {
            font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', system-ui, sans-serif;
            background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
            color: white;
            min-height: 100vh;
            padding: 20px;
        }
        
        .container {
            max-width: 800px;
            margin: 0 auto;
        }
        
        .header {
            text-align: center;
            background: rgba(0,0,0,0.3);
            padding: 30px;
            border-radius: 20px;
            margin-bottom: 30px;
            backdrop-filter: blur(10px);
        }
        
        .header h1 {
            font-size: 2.5em;
            margin-bottom: 10px;
        }
        
        .header p {
            opacity: 0.9;
            font-size: 1.1em;
        }
        
        .controls {
            background: rgba(0,0,0,0.3);
            padding: 20px;
            border-radius: 15px;
            margin-bottom: 20px;
            text-align: center;
            backdrop-filter: blur(10px);
        }
        
        .auto-play-label {
            display: inline-flex;
            align-items: center;
            gap: 10px;
            font-size: 16px;
            cursor: pointer;
            margin-bottom: 15px;
        }
        
        .auto-play-label input {
            width: 18px;
            height: 18px;
            cursor: pointer;
        }
        
        .control-buttons {
            display: flex;
            gap: 15px;
            justify-content: center;
            flex-wrap: wrap;
        }
        
        .btn {
            background: rgba(255, 107, 107, 0.8);
            color: white;
            border: none;
            padding: 12px 24px;
            border-radius: 25px;
            cursor: pointer;
            font-size: 14px;
            font-weight: bold;
            text-decoration: none;
            display: inline-block;
            transition: all 0.3s ease;
        }
        
        .btn:hover {
            background: rgba(255, 107, 107, 1);
            transform: translateY(-2px);
            box-shadow: 0 5px 15px rgba(0,0,0,0.3);
        }
        
        .btn-secondary {
            background: rgba(255,255,255,0.2);
        }
        
        .btn-secondary:hover {
            background: rgba(255,255,255,0.3);
        }
        
        .video-item {
            background: rgba(0,0,0,0.4);
            margin: 20px 0;
            border-radius: 20px;
            overflow: hidden;
            backdrop-filter: blur(10px);
            border: 1px solid rgba(255,255,255,0.1);
            transition: transform 0.3s ease;
        }
        
        .video-item:hover {
            transform: translateY(-5px);
        }
        
        .video-info {
            padding: 25px;
            border-bottom: 1px solid rgba(255,255,255,0.1);
        }
        
        .video-author {
            font-size: 20px;
            font-weight: bold;
            margin-bottom: 8px;
            color: #FFD93D;
        }
        
        .video-title {
            font-size: 16px;
            line-height: 1.5;
            margin-bottom: 12px;
            opacity: 0.9;
        }
        
        .video-meta {
            color: rgba(255,255,255,0.7);
            font-size: 14px;
        }
        
        video {
            width: 100%;
            max-height: 500px;
            background: #000;
            outline: none;
        }
        
        .video-controls {
            padding: 20px 25px;
            background: rgba(0,0,0,0.2);
            display: flex;
            gap: 10px;
            flex-wrap: wrap;
        }
        
        .progress-bar {
            background: rgba(255,255,255,0.2);
            height: 4px;
            border-radius: 2px;
            overflow: hidden;
            margin: 10px 25px;
        }
        
        .progress-fill {
            background: #FF6B6B;
            height: 100%;
            width: 0%;
            transition: width 0.3s ease;
        }
        
        .keyboard-hints {
            background: rgba(0,0,0,0.2);
            padding: 20px;
            border-radius: 15px;
            margin-top: 30px;
            text-align: center;
            font-size: 14px;
            opacity: 0.8;
        }
        
        .playing {
            border: 2px solid #FF6B6B;
            box-shadow: 0 0 20px rgba(255, 107, 107, 0.3);
        }

        @media (max-width: 768px) {
            .container {
                padding: 10px;
            }
            
            .header h1 {
                font-size: 2em;
            }
            
            .control-buttons {
                flex-direction: column;
                align-items: center;
            }
            
            .video-controls {
                flex-direction: column;
            }
        }
    </style>
</head>
<body>
    <div class="container">
        <div class="header">
            <h1>🎥 抖音视频播放器</h1>
            <p>关键词: ${keyword} | 找到 ${videos.length} 个视频</p>
        </div>

        <div class="controls">
            <label class="auto-play-label">
                <input type="checkbox" id="autoPlay" checked>
                <span>自动播放下一个视频</span>
            </label>
            <div class="control-buttons">
                <button class="btn" onclick="playAllVideos()">🔄 连续播放全部</button>
                <button class="btn btn-secondary" onclick="location.reload()">🔄 刷新页面</button>
                <button class="btn btn-secondary" onclick="toggleFullscreen()">📺 全屏模式</button>
            </div>
        </div>

        <div id="videoContainer">
            ${videos
              .map(
                (video, index) => `
                <div class="video-item" id="video-${index}">
                    <div class="video-info">
                        <div class="video-author">👤 ${video.author}</div>
                        <div class="video-title">${video.title}</div>
                        <div class="video-meta">
                            ⏱️ ${Math.round(video.duration / 1000)}秒 | 
                            🆔 ${video.id} | 
                            📍 第${index + 1}个视频
                        </div>
                    </div>
                    <video id="player-${index}" controls preload="metadata">
                        <source src="http://localhost:8080/proxy-video?url=${encodeURIComponent(
                          video.videoUrl
                        )}" type="video/mp4">
                        您的浏览器不支持视频播放
                    </video>
                    <div class="progress-bar">
                        <div class="progress-fill" id="progress-${index}"></div>
                    </div>
                    <div class="video-controls">
                        <button class="btn" onclick="playVideo(${index})">▶️ 播放</button>
                        <a href="${
                          video.shareUrl
                        }" target="_blank" class="btn btn-secondary">🎵 抖音打开</a>
                        <button class="btn btn-secondary" onclick="copyUrl('${
                          video.videoUrl
                        }')">📋 复制链接</button>
                    </div>
                </div>
            `
              )
              .join("")}
        </div>

        <div class="keyboard-hints">
            ⌨️ 键盘控制: 空格 播放/暂停 | ↑↓ 切换视频 | ← → 快进/快退 | F 全屏 | A 自动播放开关
        </div>
    </div>

    <script>
        let currentVideoIndex = 0;
        let autoPlayEnabled = document.getElementById('autoPlay').checked;
        let videos = ${JSON.stringify(videos)};

        // 初始化
        document.addEventListener('DOMContentLoaded', function() {
            console.log('🎥 视频播放器已加载，共', videos.length, '个视频');
            initializeVideos();
            initializeKeyboardControls();
        });

        function initializeVideos() {
            document.querySelectorAll('video').forEach((video, index) => {
                // 进度更新
                video.addEventListener('timeupdate', function() {
                    if (video.duration > 0) {
                        const progress = (video.currentTime / video.duration) * 100;
                        document.getElementById('progress-' + index).style.width = progress + '%';
                    }
                });

                // 播放开始
                video.addEventListener('play', function() {
                    currentVideoIndex = index;
                    document.querySelectorAll('.video-item').forEach(item => {
                        item.classList.remove('playing');
                    });
                    document.getElementById('video-' + index).classList.add('playing');
                    console.log('▶️ 开始播放视频:', index);
                });

                // 播放结束
                video.addEventListener('ended', function() {
                    console.log('✅ 视频播放结束:', index);
                    document.getElementById('video-' + index).classList.remove('playing');
                    document.getElementById('progress-' + index).style.width = '100%';
                    
                    if (autoPlayEnabled && currentVideoIndex === index) {
                        playNextVideo();
                    }
                });

                // 播放出错
                video.addEventListener('error', function() {
                    console.log('❌ 视频播放错误:', index);
                    if (autoPlayEnabled && currentVideoIndex === index) {
                        playNextVideo();
                    }
                });
            });

            // 自动播放开关
            document.getElementById('autoPlay').addEventListener('change', function() {
                autoPlayEnabled = this.checked;
                console.log('自动播放模式:', autoPlayEnabled ? '开启' : '关闭');
            });
        }

        function initializeKeyboardControls() {
            document.addEventListener('keydown', function(e) {
                // 如果在输入框中，不响应快捷键
                if (e.target.tagName === 'INPUT' || e.target.tagName === 'TEXTAREA') {
                    return;
                }
                
                const currentVideo = document.getElementById('player-' + currentVideoIndex);
                
                switch(e.key) {
                    case 'ArrowUp':
                        e.preventDefault();
                        if (currentVideoIndex > 0) {
                            playVideo(currentVideoIndex - 1);
                        }
                        break;
                    case 'ArrowDown':
                        e.preventDefault();
                        if (currentVideoIndex < videos.length - 1) {
                            playVideo(currentVideoIndex + 1);
                        }
                        break;
                    case ' ':
                        e.preventDefault();
                        if (currentVideo) {
                            if (currentVideo.paused) {
                                currentVideo.play();
                            } else {
                                currentVideo.pause();
                            }
                        }
                        break;
                    case 'f':
                    case 'F':
                        e.preventDefault();
                        toggleFullscreen();
                        break;
                    case 'a':
                    case 'A':
                        e.preventDefault();
                        const checkbox = document.getElementById('autoPlay');
                        checkbox.checked = !checkbox.checked;
                        autoPlayEnabled = checkbox.checked;
                        console.log('自动播放模式:', autoPlayEnabled ? '开启' : '关闭');
                        break;
                }
            });
        }

        function playVideo(index) {
            if (index < 0 || index >= videos.length) return;
            
            const video = document.getElementById('player-' + index);
            currentVideoIndex = index;
            
            // 暂停其他视频
            document.querySelectorAll('video').forEach((v, i) => {
                if (i !== index) {
                    v.pause();
                }
            });
            
            // 滚动到视频位置
            document.getElementById('video-' + index).scrollIntoView({ 
                behavior: 'smooth', 
                block: 'center' 
            });
            
            // 延迟播放
            setTimeout(() => {
                video.play().catch(error => {
                    console.log('播放失败:', error);
                });
            }, 500);
        }

        function playNextVideo() {
            if (currentVideoIndex < videos.length - 1) {
                console.log('🔄 播放下一个视频');
                setTimeout(() => {
                    playVideo(currentVideoIndex + 1);
                }, 1500);
            } else {
                console.log('🎉 所有视频播放完毕');
                autoPlayEnabled = false;
                document.getElementById('autoPlay').checked = false;
                alert('🎉 所有视频播放完毕！');
            }
        }

        function playAllVideos() {
            autoPlayEnabled = true;
            document.getElementById('autoPlay').checked = true;
            playVideo(0);
            console.log('🔄 开始连续播放模式');
        }

        function toggleFullscreen() {
            if (currentVideoIndex >= 0) {
                const video = document.getElementById('player-' + currentVideoIndex);
                
                if (document.fullscreenElement) {
                    document.exitFullscreen();
                } else {
                    if (video.requestFullscreen) {
                        video.requestFullscreen();
                    } else if (video.webkitRequestFullscreen) {
                        video.webkitRequestFullscreen();
                    } else if (video.mozRequestFullScreen) {
                        video.mozRequestFullScreen();
                    } else if (video.msRequestFullscreen) {
                        video.msRequestFullscreen();
                    }
                }
            }
        }

        function copyUrl(url) {
            if (navigator.clipboard) {
                navigator.clipboard.writeText(url).then(() => {
                    alert('✅ 视频链接已复制到剪贴板');
                }).catch(() => {
                    prompt('复制视频链接:', url);
                });
            } else {
                prompt('复制视频链接:', url);
            }
        }

        console.log('🎥 抖音视频播放器初始化完成');
    </script>
</body>
</html>`;
};

// 创建视频代理服务器
const createProxyServer = (port = 8080) => {
  return new Promise((resolve, reject) => {
    const server = http.createServer((req, res) => {
      const parsedUrl = url.parse(req.url, true);

      // 设置CORS头
      res.setHeader("Access-Control-Allow-Origin", "*");
      res.setHeader("Access-Control-Allow-Methods", "GET, POST, OPTIONS");
      res.setHeader("Access-Control-Allow-Headers", "Range, Content-Type");

      if (req.method === "OPTIONS") {
        res.writeHead(200);
        res.end();
        return;
      }

      if (parsedUrl.pathname === "/proxy-video") {
        const videoUrl = parsedUrl.query.url;
        if (!videoUrl) {
          res.writeHead(400);
          res.end("Missing video url");
          return;
        }

        try {
          console.log(`🎥 代理视频请求: ${videoUrl.substring(0, 100)}...`);

          // 代理视频请求，绕过防盗链
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
                "Accept-Encoding": "identity",
                Connection: "keep-alive",
              },
            },
            (videoRes) => {
              console.log(`📺 视频响应状态: ${videoRes.statusCode}`);

              res.writeHead(videoRes.statusCode, {
                "Content-Type": videoRes.headers["content-type"] || "video/mp4",
                "Content-Length": videoRes.headers["content-length"],
                "Accept-Ranges": "bytes",
                "Content-Range": videoRes.headers["content-range"],
                "Access-Control-Allow-Origin": "*",
                "Cache-Control": "public, max-age=3600",
              });

              videoRes.pipe(res);
            }
          );

          videoReq.on("error", (proxyError) => {
            console.log("❌ 视频代理请求错误:", proxyError.message);
            res.writeHead(500);
            res.end("Video proxy error: " + proxyError.message);
          });

          videoReq.end();
        } catch (proxyException) {
          console.log("❌ 视频代理异常:", proxyException.message);
          res.writeHead(500);
          res.end("Video proxy failed: " + proxyException.message);
        }
      } else {
        res.writeHead(404);
        res.end("Not Found");
      }
    });

    server.listen(port, "127.0.0.1", () => {
      console.log(`🚀 视频代理服务器已启动: http://localhost:${port}`);
      resolve(server);
    });

    server.on("error", (error) => {
      if (error.code === "EADDRINUSE") {
        console.log(`⚠️  端口 ${port} 已被占用，尝试使用端口 ${port + 1}`);
        createProxyServer(port + 1)
          .then(resolve)
          .catch(reject);
      } else {
        reject(error);
      }
    });
  });
};

// 停止代理服务器
const stopProxyServer = (server) => {
  if (server) {
    server.close(() => {
      console.log("🛑 视频代理服务器已停止");
    });
  }
};
const runInteractiveMode = async () => {
  console.log("\n🎥 抖音视频播放器 (Node.js 版本)");
  console.log("===================================\n");

  // 启动代理服务器
  console.log("🚀 正在启动视频代理服务器...");
  let proxyServer;
  try {
    proxyServer = await createProxyServer(8080);
  } catch (error) {
    console.log("❌ 代理服务器启动失败:", error.message);
    console.log("⚠️  将使用直接链接模式（可能无法播放）");
  }

  const rl = readline.createInterface({
    input: process.stdin,
    output: process.stdout,
  });

  const askQuestion = (question) => {
    return new Promise((resolve) => {
      rl.question(question, (answer) => {
        resolve(answer);
      });
    });
  };

  // 优雅退出处理
  const gracefulExit = () => {
    console.log("\n\n🛑 正在关闭程序...");
    if (proxyServer) {
      stopProxyServer(proxyServer);
    }
    rl.close();
    process.exit(0);
  };

  process.on("SIGINT", gracefulExit);
  process.on("SIGTERM", gracefulExit);

  try {
    console.log(
      "🔥 热门关键词: 美女, 舞蹈, 搞笑, 音乐, 美食, 风景, 宠物, 旅行\n"
    );
    const keyword = await askQuestion(
      '请输入搜索关键词 (直接回车使用默认"美女"): '
    );
    const searchKeyword = keyword.trim() || "美女";

    console.log(`\n🔍 正在搜索"${searchKeyword}"相关视频...`);

    const videos = await searchDouyinVideos(searchKeyword, 0, 20);

    if (videos.length > 0) {
      console.log(`\n✅ 找到 ${videos.length} 个视频:`);
      videos.forEach((video, index) => {
        console.log(
          `${index + 1}. ${video.author} - ${video.title.substring(0, 50)}${
            video.title.length > 50 ? "..." : ""
          }`
        );
      });

      console.log("\n📺 正在生成播放页面...");

      const htmlContent = generateHTML(videos, searchKeyword);
      const fileName = `douyin-${searchKeyword.replace(
        /[^a-zA-Z0-9\u4e00-\u9fa5]/g,
        "_"
      )}-${Date.now()}.html`;
      const filePath = path.join(__dirname, fileName);

      fs.writeFileSync(filePath, htmlContent, "utf8");
      console.log(`📄 HTML文件已生成: ${filePath}`);

      if (proxyServer) {
        console.log(`� 代理服务器运行中，视频可以正常播放`);
      } else {
        console.log(`⚠️  代理服务器未运行，视频可能无法播放`);
      }

      console.log(`�🌐 请在浏览器中打开此文件播放视频\n`);

      // 尝试自动打开浏览器
      const openCmd =
        process.platform === "darwin"
          ? "open"
          : process.platform === "win32"
          ? "start"
          : "xdg-open";

      exec(`${openCmd} "${filePath}"`, (error) => {
        if (error) {
          console.log(`❌ 无法自动打开浏览器: ${error.message}`);
          console.log(`请手动打开文件: ${filePath}`);
        } else {
          console.log("✅ 已在默认浏览器中打开视频播放页面");
        }

        // 询问是否继续运行代理服务器
        if (proxyServer) {
          askQuestion("\n按 Enter 键关闭代理服务器并退出程序: ").then(() => {
            gracefulExit();
          });
        } else {
          gracefulExit();
        }
      });
    } else {
      console.log(`\n❌ 没有找到关键词"${searchKeyword}"相关的视频`);
      console.log("💡 建议尝试其他关键词或检查网络连接");
      gracefulExit();
    }
  } catch (error) {
    console.log("\n❌ 程序执行失败:", error.message);
    gracefulExit();
  }
};

// 主程序
if (require.main === module) {
  runInteractiveMode().catch(console.error);
}

// 导出函数
module.exports = {
  searchDouyinVideos,
  generateHTML,
  runInteractiveMode,
};
