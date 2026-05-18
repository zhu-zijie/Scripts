const videoElement = document.getElementById("video");
const playButton = document.getElementById("playButton");
const toggleButton = document.getElementById("toggleButton");
const nextButton = document.getElementById("nextButton");
const controls = document.querySelector(".controls");
const seekBar = document.getElementById("seek");
const timeLabel = document.getElementById("time");
const status = document.getElementById("status");

const state = { isLoading: false, retryTimer: null };

const formatTime = (value) => {
  if (!Number.isFinite(value)) return "00:00";
  const minutes = Math.floor(value / 60);
  const seconds = Math.floor(value % 60);
  return (
    String(minutes).padStart(2, "0") + ":" + String(seconds).padStart(2, "0")
  );
};

const updateStatus = (message) => {
  status.textContent = message;
};

const showControls = (force = false) => {
  if (!force && !videoElement.paused) return;
  controls.classList.remove("hidden");
};

const hideControls = () => {
  controls.classList.add("hidden");
};

const scheduleRetry = () => {
  if (state.retryTimer) clearTimeout(state.retryTimer);
  state.retryTimer = setTimeout(() => playRandomVideo(), 800);
};

const fetchNextUrl = async () => {
  const response = await fetch("/api/next", { cache: "no-store" });
  if (!response.ok) {
    throw new Error("Failed to fetch next url");
  }
  const payload = await response.json();
  return payload && typeof payload.url === "string" ? payload.url : null;
};

const playRandomVideo = async () => {
  if (state.isLoading) return;
  state.isLoading = true;
  updateStatus("加载中...");

  try {
    const url = await fetchNextUrl();
    if (!url) {
      updateStatus("没有可用视频源");
      return;
    }

    videoElement.src = url;
    await videoElement.play();
    console.log("Video is playing from URL:", url);
    updateStatus("播放中");
    showControls();
  } catch (error) {
    console.error("Error occurred while trying to play the video:", error);
    updateStatus("播放失败，正在重试...");
    scheduleRetry();
  } finally {
    state.isLoading = false;
  }
};

playButton.addEventListener("click", () => {
  playRandomVideo();
  playButton.classList.add("hidden");
  hideControls();
});

toggleButton.addEventListener("click", () => {
  if (videoElement.paused) {
    videoElement.play();
  } else {
    videoElement.pause();
  }
});

nextButton.addEventListener("click", () => {
  playRandomVideo();
});

seekBar.addEventListener("input", () => {
  if (!Number.isFinite(videoElement.duration)) return;
  const nextTime = (Number(seekBar.value) / 100) * videoElement.duration;
  videoElement.currentTime = nextTime;
});

videoElement.addEventListener("ended", playRandomVideo);

videoElement.addEventListener("timeupdate", () => {
  if (!Number.isFinite(videoElement.duration)) return;
  const progress = (videoElement.currentTime / videoElement.duration) * 100;
  seekBar.value = String(progress);
  timeLabel.textContent =
    formatTime(videoElement.currentTime) +
    " / " +
    formatTime(videoElement.duration);
});

videoElement.addEventListener("play", () => {
  toggleButton.textContent = "暂停";
  hideControls();
  status.classList.add("hidden");
});

videoElement.addEventListener("pause", () => {
  toggleButton.textContent = "播放";
  showControls(true);
  status.classList.remove("hidden");
});

videoElement.addEventListener("click", () => {
  if (videoElement.paused) {
    videoElement.play();
  } else {
    videoElement.pause();
  }
});

videoElement.addEventListener("error", () => {
  updateStatus("加载失败，正在切换...");
  scheduleRetry();
});

["mousemove", "touchstart", "click"].forEach((eventName) => {
  document.addEventListener(eventName, () => showControls());
});
