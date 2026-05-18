const SOURCES = [
  "http://api.qemao.com/api/douyin",
  "https://api.kuleu.com/api/MP4_xiaojiejie",
];

const renderHTML = () => `
  <!DOCTYPE html>
  <html lang="zh">
  <head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>随机短视频播放器</title>
    <style>
      :root {
        --bg: #0b0b0d;
        --panel: rgba(14, 10, 14, 0.7);
        --accent: #ff7ab2;
        --accent-2: #ff4f9a;
        --text: #f8f4f6;
        --muted: #b9a9b3;
        --shadow: 0 18px 48px rgba(0, 0, 0, 0.45);
      }
      body, html {
        margin: 0;
        padding: 0;
        height: 100%;
        background-color: var(--bg);
        color: var(--text);
        font-family: "Space Grotesk", "Avenir Next", sans-serif;
      }
      body::before {
        content: "";
        position: fixed;
        inset: 0;
        background:
          radial-gradient(circle at 16% 18%, rgba(255, 122, 178, 0.22), transparent 45%),
          radial-gradient(circle at 82% 16%, rgba(255, 79, 154, 0.18), transparent 50%),
          radial-gradient(circle at 50% 78%, rgba(255, 255, 255, 0.06), transparent 55%);
        pointer-events: none;
        z-index: 0;
      }
      video {
        width: 100%;
        height: 100%;
        object-fit: contain;
        background: #000;
        position: relative;
        z-index: 1;
      }
      .status {
        position: absolute;
        top: 16px;
        left: 16px;
        padding: 6px 10px;
        background: rgba(10, 10, 12, 0.55);
        border-radius: 999px;
        font-size: 11px;
        color: var(--muted);
        text-transform: uppercase;
        letter-spacing: 0.08em;
        z-index: 2;
      }
      .status.hidden {
        opacity: 0;
        pointer-events: none;
      }
      .controls {
        position: absolute;
        left: 50%;
        bottom: 32px;
        transform: translateX(-50%);
        display: inline-flex;
        flex-wrap: wrap;
        gap: 8px;
        align-items: center;
        padding: 8px 12px;
        background: var(--panel);
        border-radius: 999px;
        border: 1px solid rgba(255, 255, 255, 0.08);
        backdrop-filter: blur(12px);
        box-shadow: var(--shadow);
        z-index: 3;
      }
      .controls button {
        background: rgba(255, 255, 255, 0.05);
        color: var(--text);
        border: 1px solid rgba(255, 255, 255, 0.12);
        border-radius: 999px;
        padding: 6px 12px;
        font-size: 13px;
        cursor: pointer;
      }
      .controls button.primary {
        background: linear-gradient(135deg, var(--accent), var(--accent-2));
        color: #111;
        border: none;
        font-weight: 700;
      }
      .controls button.ghost {
        background: transparent;
      }
      .controls input[type="range"] {
        accent-color: var(--accent);
      }
      .progress {
        display: flex;
        align-items: center;
        gap: 6px;
        min-width: 200px;
      }
      .controls.hidden {
        opacity: 0;
        pointer-events: none;
        transform: translate(-50%, 12px);
      }
      .hidden {
        display: none;
      }
    </style>
  </head>
  <body>
    <video id="video" playsinline webkit-playsinline controls></video>
    <div id="status" class="status">Ready</div>
    <div class="controls">
      <button id="playButton" class="primary">开始</button>
      <button id="nextButton" class="ghost">下一条</button>
      <div class="progress">
        <input id="seek" type="range" min="0" max="100" value="0" />
      </div>
    </div>
  
    <script>
      const channelAddr = ${JSON.stringify(SOURCES)};
      const videoElement = document.getElementById('video');
      const playButton = document.getElementById('playButton');
      const nextButton = document.getElementById('nextButton');
      const controls = document.querySelector('.controls');
      const seekBar = document.getElementById('seek');
      const status = document.getElementById('status');
      const state = { retryTimer: null };

      const pickRandom = (items) => items[Math.floor(Math.random() * items.length)];

      const showStatus = (msg) => {
        status.textContent = msg;
        status.classList.remove('hidden');
      };

      const showControls = (force = false) => {
        if (!force && !videoElement.paused) return;
        controls.classList.remove('hidden');
      };

      const hideControls = () => {
        controls.classList.add('hidden');
      };

      const scheduleRetry = () => {
        if (state.retryTimer) clearTimeout(state.retryTimer);
        state.retryTimer = setTimeout(playRandomVideo, 1000);
      };

      const playRandomVideo = () => {
        showStatus('正在加载视频...');
        const url = pickRandom(channelAddr);
        videoElement.src = url;

        videoElement.play().then(() => {
          showStatus('正在播放');
          showControls();
        }).catch(error => {
          console.error('播放错误:', error);
          showStatus('播放失败，尝试下一个...');
          scheduleRetry();
        });
      };

      playButton.addEventListener('click', () => {
        playRandomVideo();
        playButton.style.display = 'none';
        hideControls();
      });

      nextButton.addEventListener('click', () => {
        playRandomVideo();
      });

      seekBar.addEventListener('input', () => {
        if (!Number.isFinite(videoElement.duration)) return;
        const nextTime = (Number(seekBar.value) / 100) * videoElement.duration;
        videoElement.currentTime = nextTime;
      });

      videoElement.addEventListener('ended', playRandomVideo);

      videoElement.addEventListener('error', () => {
        showStatus('视频加载失败，尝试下一个...');
        scheduleRetry();
      });

      videoElement.addEventListener('play', () => {
        hideControls();
        status.classList.add('hidden');
      });

      videoElement.addEventListener('pause', () => {
        showControls(true);
        status.classList.remove('hidden');
      });

      videoElement.addEventListener('click', () => {
        if (playButton.style.display !== 'none') return;
        if (videoElement.paused) {
          videoElement.play();
        } else {
          videoElement.pause();
        }
      });

      ['mousemove', 'touchstart', 'click'].forEach((eventName) => {
        document.addEventListener(eventName, () => showControls());
      });
    </script>
  </body>
  </html>`;

const serveHTML = () => {
  const response = {
    status: "HTTP/1.1 200 OK",
    headers: {
      "Content-Type": "text/html;charset=UTF-8",
    },
    body: renderHTML(),
  };

  $done(response);
};

// 运行脚本时记录
console.log("随机视频脚本已执行");
serveHTML();
