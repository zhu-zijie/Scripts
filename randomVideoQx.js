/*
[rewrite_local]
https:\/\/zijier\.com url script-response-body https://raw.githubusercontent.com/zhu-zijie/Scripts/main/randomVideoQx.js
[mitm]
hostname = zijier.com
*/

// 可用视频源
const videoSources = [
  "http://api.qemao.com/api/douyin",
  "https://api.kuleu.com/api/MP4_xiaojiejie",
];

// 处理请求
function handleRequest() {
  const html = `<!DOCTYPE html>
  <html lang="zh">
  <head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0, maximum-scale=1.0, user-scalable=no">
    <title>随机短视频</title>
    <style>
      * {margin:0; padding:0; box-sizing:border-box;}
      html, body {
        width: 100%;
        height: 100%;
        overflow: hidden;
        background: #000;
        touch-action: manipulation;
      }
      .container {
        position: relative;
        width: 100%;
        height: 100%;
        display: flex;
        justify-content: center;
        align-items: center;
      }
      video {
        width: 100%;
        height: 100%;
        object-fit: contain;
        background: #000;
      }
      .play-btn {
        position: absolute;
        top: 50%;
        left: 50%;
        transform: translate(-50%, -50%);
        padding: 12px 24px;
        background: rgba(255,255,255,0.8);
        color: #000;
        border: none;
        border-radius: 6px;
        font-size: 18px;
        font-weight: bold;
        z-index: 10;
      }
      .status {
        position: absolute;
        bottom: 20px;
        left: 50%;
        transform: translateX(-50%);
        color: white;
        background: rgba(0,0,0,0.5);
        padding: 5px 10px;
        border-radius: 5px;
        font-size: 12px;
        opacity: 0.7;
        z-index: 5;
      }
      .hidden {display: none;}
    </style>
  </head>
  <body>
    <div class="container">
      <video id="videoPlayer" playsinline webkit-playsinline></video>
      <button id="playBtn" class="play-btn">点击开始播放</button>
      <div id="status" class="status hidden"></div>
    </div>
  
    <script>
    (function() {
      const sources = ${JSON.stringify(videoSources)};
      const video = document.getElementById('videoPlayer');
      const playBtn = document.getElementById('playBtn');
      const status = document.getElementById('status');
      
      // 显示状态信息
      function showStatus(msg, autoHide = true) {
        status.textContent = msg;
        status.classList.remove('hidden');
        if (autoHide) {
          setTimeout(() => {
            status.classList.add('hidden');
          }, 3000);
        }
      }
      
      // 随机获取视频源
      function getRandomSource() {
        return sources[Math.floor(Math.random() * sources.length)];
      }
      
      // 播放视频
      function playRandomVideo() {
        showStatus('正在加载视频...', false);
        
        const source = getRandomSource();
        video.src = source;
        
        // 尝试播放
        video.load();
        const playPromise = video.play();
        
        if (playPromise !== undefined) {
          playPromise
            .then(() => {
              showStatus('播放中: ' + source);
            })
            .catch(err => {
              console.error('播放出错:', err);
              showStatus('播放失败，尝试下一个视频...');
              setTimeout(playRandomVideo, 1000);
            });
        }
      }
  
      // 事件监听
      playBtn.addEventListener('click', function() {
        playBtn.classList.add('hidden');
        playRandomVideo();
      });
      
      // 视频播放结束后自动播放下一个
      video.addEventListener('ended', playRandomVideo);
      
      // 视频播放出错时尝试下一个
      video.addEventListener('error', function() {
        showStatus('视频加载失败，尝试下一个...');
        setTimeout(playRandomVideo, 1000);
      });
      
      // 用户点击视频区域也可以开始播放
      video.addEventListener('click', function() {
        if (playBtn.classList.contains('hidden')) {
          if (video.paused) {
            video.play();
          } else {
            video.pause();
          }
        } else {
          playBtn.click();
        }
      });
    })();
    </script>
  </body>
  </html>`;

  const response = {
    status: "HTTP/1.1 200 OK",
    headers: {
      "Content-Type": "text/html;charset=UTF-8",
      "Cache-Control": "no-cache, no-store, must-revalidate",
      "Access-Control-Allow-Origin": "*",
      Connection: "keep-alive",
    },
    body: html,
  };

  $done(response);
}

// 脚本入口
if (typeof $request !== "undefined") {
  handleRequest();
} else {
  $notify("随机视频播放器", "", "脚本已直接执行，请通过重写规则使用");
  $done({});
}
