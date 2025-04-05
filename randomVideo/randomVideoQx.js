function serveHTML() {
  const html = `
  <!DOCTYPE html>
  <html lang="zh">
  <head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>随机短视频播放器</title>
    <style>
      body, html { margin: 0; padding: 0; height: 100%; background-color: black; }
      video { width: 100%; height: 100%; object-fit: contain; }
      #playButton {
        position: absolute; top: 50%; left: 50%; transform: translate(-50%, -50%);
        padding: 10px 20px; font-size: 16px; background-color: white;
        border: none; border-radius: 4px; cursor: pointer;
      }
      .status {
        position: absolute; bottom: 20px; left: 50%; transform: translateX(-50%);
        color: white; background: rgba(0,0,0,0.5); padding: 5px 10px;
        border-radius: 5px; font-size: 12px; opacity: 0.7; z-index: 5;
      }
      .hidden {display: none;}
      #logArea {
        position: absolute;
        top: 10px;
        left: 10px;
        color: rgba(255,255,255,0.7);
        font-size: 12px;
        z-index: 100;
      }
    </style>
  </head>
  <body>
    <video id="video" playsinline webkit-playsinline controls></video>
    <button id="playButton">开始播放</button>
    <div id="status" class="status hidden"></div>
    <div id="logArea"></div>
  
    <script>
      const channelAddr = [
        "http://api.qemao.com/api/douyin",
        "https://api.kuleu.com/api/MP4_xiaojiejie"
      ];
      
      const videoElement = document.getElementById('video');
      const playButton = document.getElementById('playButton');
      const status = document.getElementById('status');
      const logArea = document.getElementById('logArea');
      
      // 记录视频链接到界面和控制台
      function logVideoUrl(url) {
        console.log("播放链接: " + url);
        // 记录到页面上
        const now = new Date().toLocaleTimeString();
        logArea.innerHTML += \`\${now}: \${url}<br>\`;
        
        // try {
        //   if (typeof $notify === 'function') {
        //     $notify("随机视频", "正在播放新视频", url);
        //   }
        // } catch(e) {
        //   console.log("通知发送失败");
        // }
      }
      
      function showStatus(msg, autoHide = true) {
        status.textContent = msg;
        status.classList.remove('hidden');
        if (autoHide) {
          setTimeout(() => { status.classList.add('hidden'); }, 3000);
        }
      }
  
      playButton.addEventListener('click', () => {
        playRandomVideo();
        playButton.style.display = 'none';
      });
  
      function playRandomVideo() {
        showStatus('正在加载视频...', false);
        
        const url = channelAddr[Math.floor(Math.random() * channelAddr.length)];
        videoElement.src = url;
        
        // 记录视频链接
        logVideoUrl(url);
        
        videoElement.play().then(() => {
          showStatus("正在播放: " + url);
        }).catch(error => {
          console.error("播放错误:", error);
          showStatus('播放失败，尝试下一个...');
          setTimeout(playRandomVideo, 1000);
        });
      }
  
      videoElement.addEventListener('ended', playRandomVideo);
      
      videoElement.addEventListener('error', function() {
        showStatus('视频加载失败，尝试下一个...');
        setTimeout(playRandomVideo, 1000);
      });
      
      videoElement.addEventListener('click', function() {
        if (playButton.style.display === 'none') {
          if (videoElement.paused) {
            videoElement.play();
          } else {
            videoElement.pause();
          }
        }
      });
    </script>
  </body>
  </html>`;

  const response = {
    status: "HTTP/1.1 200 OK",
    headers: {
      "Content-Type": "text/html;charset=UTF-8",
    },
    body: html,
  };

  $done(response);
}

// 运行脚本时记录
console.log("随机视频脚本已执行");
serveHTML();
