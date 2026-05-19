const SOURCES = [
  "http://api.qemao.com/api/douyin",
  "https://api.kuleu.com/api/MP4_xiaojiejie",
];

const renderHTML = () => `
  <!DOCTYPE html>
  <html lang="zh-CN">
  <head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0, viewport-fit=cover">
    <title>随机短视频播放器</title>
    <style>
      @import url("https://fonts.googleapis.com/css2?family=Outfit:wght@300;400;600;700&display=swap");

      :root {
        --bg-1: #070a12;
        --bg-2: #121a2a;
        --panel: rgba(12, 16, 26, 0.72);
        --accent: #ffb347;
        --accent-2: #35d6c8;
        --accent-3: #ffe7a8;
        --text: #f6f7fb;
        --muted: #9aa2b1;
        --shadow: 0 20px 60px rgba(5, 8, 17, 0.55);
      }

      * {
        box-sizing: border-box;
      }

      html, body {
        margin: 0;
        padding: 0;
        height: 100%;
      }

      body {
        background: radial-gradient(circle at 20% 18%, rgba(53, 214, 200, 0.22), transparent 45%),
          radial-gradient(circle at 84% 16%, rgba(255, 179, 71, 0.18), transparent 50%),
          radial-gradient(circle at 50% 78%, rgba(255, 255, 255, 0.08), transparent 55%),
          linear-gradient(160deg, var(--bg-1), var(--bg-2));
        color: var(--text);
        font-family: "Outfit", "Avenir Next", sans-serif;
        overflow: hidden;
      }

      body::before,
      body::after {
        content: "";
        position: fixed;
        inset: -20%;
        z-index: 0;
        pointer-events: none;
        opacity: 0.8;
      }

      body::before {
        background: radial-gradient(circle at 10% 20%, rgba(53, 214, 200, 0.24), transparent 45%),
          radial-gradient(circle at 78% 30%, rgba(255, 179, 71, 0.24), transparent 50%);
        filter: blur(20px);
      }

      body::after {
        background: radial-gradient(circle at 55% 85%, rgba(255, 231, 168, 0.18), transparent 50%);
        mix-blend-mode: screen;
      }

      .stage {
        position: relative;
        height: 100%;
        width: 100%;
        display: flex;
        align-items: center;
        justify-content: center;
        overflow: hidden;
      }

      video {
        width: 100%;
        height: 100%;
        object-fit: cover;
        background: #040507;
        position: relative;
        z-index: 1;
      }

      .vignette {
        position: absolute;
        inset: 0;
        background: linear-gradient(180deg, rgba(4, 8, 16, 0.2), rgba(4, 8, 16, 0.6));
        pointer-events: none;
        z-index: 2;
      }

      .status {
        position: absolute;
        top: clamp(14px, 2.6vw, 22px);
        left: clamp(14px, 2.6vw, 22px);
        padding: 6px 12px;
        background: rgba(10, 14, 24, 0.72);
        border-radius: 999px;
        border: 1px solid rgba(255, 255, 255, 0.12);
        font-size: 12px;
        color: var(--muted);
        letter-spacing: 0.06em;
        text-transform: uppercase;
        z-index: 4;
        backdrop-filter: blur(10px);
        transition: opacity 0.2s ease;
      }

      .status.hidden {
        opacity: 0;
        pointer-events: none;
      }

      .hint {
        position: absolute;
        bottom: clamp(118px, 16vw, 170px);
        left: 50%;
        transform: translateX(-50%);
        padding: 8px 16px;
        border-radius: 999px;
        background: rgba(10, 14, 24, 0.7);
        border: 1px solid rgba(255, 255, 255, 0.14);
        font-size: 13px;
        color: var(--text);
        letter-spacing: 0.04em;
        z-index: 4;
        backdrop-filter: blur(12px);
        animation: hintFloat 2.4s ease-in-out infinite;
        transition: opacity 0.2s ease, transform 0.2s ease;
      }

      .hint.hidden {
        opacity: 0;
        transform: translate(-50%, 10px);
        pointer-events: none;
      }

      .controls {
        position: absolute;
        left: 50%;
        bottom: clamp(16px, 4vw, 36px);
        transform: translateX(-50%);
        display: flex;
        align-items: center;
        gap: 10px;
        padding: 12px 16px;
        background: var(--panel);
        border-radius: 999px;
        border: 1px solid rgba(255, 255, 255, 0.08);
        backdrop-filter: blur(16px);
        box-shadow: var(--shadow);
        z-index: 5;
        animation: panelIn 0.6s ease;
        transition: opacity 0.2s ease, transform 0.2s ease;
      }

      .controls.hidden {
        opacity: 0;
        pointer-events: none;
        transform: translate(-50%, 14px);
      }

      .controls .cluster {
        display: flex;
        gap: 8px;
        align-items: center;
      }

      .controls button {
        appearance: none;
        border: none;
        background: rgba(255, 255, 255, 0.08);
        color: var(--text);
        border-radius: 999px;
        padding: 8px 14px;
        font-size: 13px;
        letter-spacing: 0.04em;
        cursor: pointer;
        transition: transform 0.15s ease, box-shadow 0.2s ease, background 0.2s ease;
      }

      .controls button.primary {
        background: linear-gradient(135deg, var(--accent), var(--accent-2));
        color: #0d0f12;
        font-weight: 700;
        box-shadow: 0 12px 26px rgba(53, 214, 200, 0.28);
      }

      .controls button.ghost {
        background: rgba(255, 255, 255, 0.04);
        border: 1px solid rgba(255, 255, 255, 0.1);
      }

      .controls button:hover {
        transform: translateY(-1px);
        box-shadow: 0 10px 20px rgba(5, 8, 17, 0.35);
      }

      .controls button:active {
        transform: translateY(0);
      }

      .controls button:focus-visible {
        outline: 2px solid rgba(255, 179, 71, 0.6);
        outline-offset: 2px;
      }

      .progress {
        display: flex;
        align-items: center;
        gap: 10px;
      }

      .time {
        font-size: 12px;
        color: var(--muted);
        min-width: 96px;
        text-align: right;
      }

      .controls input[type="range"] {
        width: clamp(160px, 26vw, 260px);
        height: 4px;
        appearance: none;
        background: transparent;
      }

      .controls input[type="range"]::-webkit-slider-runnable-track {
        height: 4px;
        background: rgba(255, 255, 255, 0.18);
        border-radius: 999px;
      }

      .controls input[type="range"]::-webkit-slider-thumb {
        appearance: none;
        width: 14px;
        height: 14px;
        border-radius: 50%;
        background: linear-gradient(135deg, var(--accent-3), var(--accent-2));
        box-shadow: 0 0 0 4px rgba(53, 214, 200, 0.15);
        margin-top: -5px;
      }

      .controls input[type="range"]::-moz-range-track {
        height: 4px;
        background: rgba(255, 255, 255, 0.18);
        border-radius: 999px;
      }

      .controls input[type="range"]::-moz-range-thumb {
        width: 14px;
        height: 14px;
        border-radius: 50%;
        border: none;
        background: linear-gradient(135deg, var(--accent-3), var(--accent-2));
        box-shadow: 0 0 0 4px rgba(53, 214, 200, 0.15);
      }

      @media (min-width: 920px) {
        video {
          object-fit: contain;
        }
      }

      @media (max-width: 720px) {
        .controls {
          flex-direction: column;
          border-radius: 20px;
          gap: 12px;
          width: min(92vw, 520px);
          padding: 14px 16px;
        }

        .controls .cluster {
          width: 100%;
          justify-content: center;
        }

        .progress {
          width: 100%;
        }

        .time {
          text-align: center;
          min-width: auto;
        }

        .controls input[type="range"] {
          width: 100%;
        }
      }

      @keyframes panelIn {
        from {
          opacity: 0;
          transform: translate(-50%, 18px);
        }
        to {
          opacity: 1;
          transform: translate(-50%, 0);
        }
      }

      @keyframes hintFloat {
        0%, 100% {
          transform: translate(-50%, 0);
        }
        50% {
          transform: translate(-50%, -6px);
        }
      }
    </style>
  </head>
  <body>
    <div class="stage">
      <video id="video" playsinline webkit-playsinline preload="metadata"></video>
      <div class="vignette"></div>
      <div id="status" class="status">准备就绪</div>
      <div id="hint" class="hint">点击开始</div>
      <div class="controls">
        <div class="cluster">
          <button id="toggleButton" class="primary" type="button">开始</button>
          <button id="nextButton" class="ghost" type="button">下一条</button>
          <button id="fullscreenButton" class="ghost" type="button">全屏</button>
        </div>
        <div class="progress">
          <span id="time" class="time">00:00 / 00:00</span>
          <input id="seek" type="range" min="0" max="100" value="0" />
        </div>
      </div>
    </div>

    <script>
      const channelAddr = ${JSON.stringify(SOURCES)};
      const videoElement = document.getElementById('video');
      const toggleButton = document.getElementById('toggleButton');
      const nextButton = document.getElementById('nextButton');
      const fullscreenButton = document.getElementById('fullscreenButton');
      const controls = document.querySelector('.controls');
      const seekBar = document.getElementById('seek');
      const timeLabel = document.getElementById('time');
      const status = document.getElementById('status');
      const hint = document.getElementById('hint');
      const stage = document.querySelector('.stage');

      const state = {
        isLoading: false,
        retryTimer: null,
        hideTimer: null,
        hintTimer: null,
        hasStarted: false,
        seeking: false,
      };

      const pickRandom = (items) => items[Math.floor(Math.random() * items.length)];

      const formatTime = (value) => {
        if (!Number.isFinite(value)) return '00:00';
        const minutes = Math.floor(value / 60);
        const seconds = Math.floor(value % 60);
        return String(minutes).padStart(2, '0') + ':' + String(seconds).padStart(2, '0');
      };

      const setStatus = (message, visible = true) => {
        status.textContent = message;
        status.classList.toggle('hidden', !visible);
      };

      const setHint = (message, visible = true) => {
        if (state.hintTimer) {
          clearTimeout(state.hintTimer);
          state.hintTimer = null;
        }
        hint.textContent = message;
        hint.classList.toggle('hidden', !visible);
      };

      const flashHint = (message) => {
        setHint(message, true);
        if (state.hintTimer) clearTimeout(state.hintTimer);
        state.hintTimer = setTimeout(() => setHint('', false), 1600);
      };

      const updateTimeLabel = () => {
        timeLabel.textContent =
          formatTime(videoElement.currentTime) +
          ' / ' +
          formatTime(videoElement.duration);
      };

      const updateToggleLabel = () => {
        if (!state.hasStarted) {
          toggleButton.textContent = '开始';
          return;
        }
        toggleButton.textContent = videoElement.paused ? '播放' : '暂停';
      };

      const showControls = (force = false) => {
        controls.classList.remove('hidden');
        if (!force) scheduleHideControls();
      };

      const hideControls = () => {
        controls.classList.add('hidden');
      };

      const scheduleHideControls = () => {
        if (state.hideTimer) clearTimeout(state.hideTimer);
        if (videoElement.paused || !state.hasStarted) return;
        state.hideTimer = setTimeout(() => hideControls(), 2200);
      };

      const clearRetry = () => {
        if (state.retryTimer) clearTimeout(state.retryTimer);
        state.retryTimer = null;
      };

      const scheduleRetry = () => {
        clearRetry();
        state.retryTimer = setTimeout(() => playRandomVideo(), 900);
      };

      const getFullscreenElement = () =>
        document.fullscreenElement || document.webkitFullscreenElement || null;

      const updateFullscreenLabel = () => {
        if (!fullscreenButton) return;
        fullscreenButton.textContent = getFullscreenElement() ? '退出全屏' : '全屏';
      };

      const requestFullscreen = () => {
        if (stage.requestFullscreen) return stage.requestFullscreen();
        if (stage.webkitRequestFullscreen) return stage.webkitRequestFullscreen();
        if (videoElement.webkitEnterFullscreen) return videoElement.webkitEnterFullscreen();
        return Promise.resolve();
      };

      const exitFullscreen = () => {
        if (document.exitFullscreen) return document.exitFullscreen();
        if (document.webkitExitFullscreen) return document.webkitExitFullscreen();
        return Promise.resolve();
      };

      const toggleFullscreen = () => {
        if (getFullscreenElement()) {
          exitFullscreen();
        } else {
          requestFullscreen();
        }
      };

      const isAutoplayError = (error) => {
        if (!error) return false;
        return (
          error.name === 'NotAllowedError' ||
          /not allowed|user gesture/i.test(String(error.message))
        );
      };

      const handlePlayError = (error) => {
        console.error('播放错误:', error);
        if (isAutoplayError(error)) {
          setStatus('需要手动播放');
          setHint('点击播放继续');
          showControls(true);
          updateToggleLabel();
          return;
        }
        setStatus('播放失败，正在切换...');
        scheduleRetry();
      };

      const safePlay = async () => {
        try {
          await videoElement.play();
        } catch (error) {
          handlePlayError(error);
        }
      };

      const playRandomVideo = async () => {
        if (state.isLoading) return;
        state.isLoading = true;
        clearRetry();
        setStatus('正在加载...');
        setHint('', false);

        const url = pickRandom(channelAddr);
        if (!url) {
          setStatus('没有可用视频源');
          state.isLoading = false;
          return;
        }

        videoElement.src = url;
        videoElement.load();
        seekBar.value = '0';
        updateTimeLabel();

        try {
          await videoElement.play();
          state.hasStarted = true;
          updateToggleLabel();
          setStatus('播放中', false);
          flashHint('轻触视频暂停');
          showControls();
        } catch (error) {
          handlePlayError(error);
        } finally {
          state.isLoading = false;
        }
      };

      toggleButton.addEventListener('click', () => {
        if (!state.hasStarted) {
          playRandomVideo();
          return;
        }
        if (videoElement.paused) {
          safePlay();
        } else {
          videoElement.pause();
        }
      });

      nextButton.addEventListener('click', () => {
        playRandomVideo();
      });

      if (fullscreenButton) {
        fullscreenButton.addEventListener('click', toggleFullscreen);
      }

      seekBar.addEventListener('input', () => {
        if (!Number.isFinite(videoElement.duration)) return;
        state.seeking = true;
        const nextTime = (Number(seekBar.value) / 100) * videoElement.duration;
        videoElement.currentTime = nextTime;
        updateTimeLabel();
      });

      seekBar.addEventListener('change', () => {
        state.seeking = false;
        scheduleHideControls();
      });

      videoElement.addEventListener('loadedmetadata', () => {
        updateTimeLabel();
      });

      videoElement.addEventListener('timeupdate', () => {
        if (!Number.isFinite(videoElement.duration)) return;
        if (!state.seeking) {
          const progress = (videoElement.currentTime / videoElement.duration) * 100;
          seekBar.value = String(progress);
        }
        updateTimeLabel();
      });

      videoElement.addEventListener('ended', () => {
        playRandomVideo();
      });

      videoElement.addEventListener('error', () => {
        setStatus('加载失败，正在切换...');
        scheduleRetry();
      });

      videoElement.addEventListener('play', () => {
        updateToggleLabel();
        status.classList.add('hidden');
        setHint('', false);
        showControls();
        scheduleHideControls();
      });

      videoElement.addEventListener('pause', () => {
        updateToggleLabel();
        setStatus('已暂停');
        setHint('点击继续播放');
        showControls(true);
      });

      stage.addEventListener('pointerup', (event) => {
        if (event.target.closest('.controls')) return;
        if (!state.hasStarted) {
          playRandomVideo();
          return;
        }
        if (videoElement.paused) {
          safePlay();
        } else {
          videoElement.pause();
        }
      });

      const handleActivity = () => {
        showControls();
      };

      ['pointermove', 'pointerdown', 'touchstart'].forEach((eventName) => {
        document.addEventListener(eventName, handleActivity, { passive: true });
      });

      document.addEventListener('keydown', (event) => {
        if (event.target.closest('input, button, textarea, select')) return;
        if (event.code === 'Space') {
          event.preventDefault();
          if (!state.hasStarted) {
            playRandomVideo();
          } else if (videoElement.paused) {
            safePlay();
          } else {
            videoElement.pause();
          }
        }
        if (event.code === 'ArrowRight') {
          playRandomVideo();
        }
      });

      document.addEventListener('visibilitychange', () => {
        if (document.hidden && !videoElement.paused) {
          videoElement.pause();
        }
      });

      document.addEventListener('fullscreenchange', updateFullscreenLabel);
      document.addEventListener('webkitfullscreenchange', updateFullscreenLabel);

      setStatus('准备就绪');
      setHint('点击开始');
      updateToggleLabel();
      updateFullscreenLabel();
      showControls(true);
    </script>
  </body>
  </html>`;

const serveHTML = () => {
  const response = {
    status: "HTTP/1.1 200 OK",
    headers: {
      "Content-Type": "text/html;charset=UTF-8",
      "Cache-Control": "no-store, no-cache, must-revalidate",
      Pragma: "no-cache",
      Expires: "0",
    },
    body: renderHTML(),
  };

  $done(response);
};

// 运行脚本时记录
console.log("随机视频脚本已执行");
serveHTML();
