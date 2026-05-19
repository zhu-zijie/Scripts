const videoElement = document.getElementById("video");
const toggleButton = document.getElementById("toggleButton");
const nextButton = document.getElementById("nextButton");
const controls = document.querySelector(".controls");
const seekBar = document.getElementById("seek");
const timeLabel = document.getElementById("time");
const status = document.getElementById("status");
const hint = document.getElementById("hint");
const stage = document.querySelector(".stage");
const sourceSelect = document.getElementById("sourceSelect");

const state = {
  isLoading: false,
  retryTimer: null,
  hideTimer: null,
  hintTimer: null,
  hasStarted: false,
  seeking: false,
  sources: [],
  selectedSource: "random",
};

const formatTime = (value) => {
  if (!Number.isFinite(value)) return "00:00";
  const minutes = Math.floor(value / 60);
  const seconds = Math.floor(value % 60);
  return (
    String(minutes).padStart(2, "0") + ":" + String(seconds).padStart(2, "0")
  );
};

const setStatus = (message, visible = true) => {
  status.textContent = message;
  status.classList.toggle("hidden", !visible);
};

const setHint = (message, visible = true) => {
  if (state.hintTimer) {
    clearTimeout(state.hintTimer);
    state.hintTimer = null;
  }
  hint.textContent = message;
  hint.classList.toggle("hidden", !visible);
};

const flashHint = (message) => {
  setHint(message, true);
  state.hintTimer = setTimeout(() => setHint("", false), 1600);
};

const clearHint = () => setHint("", false);

const isDurationReady = () => Number.isFinite(videoElement.duration);

const updateTimeLabel = () => {
  timeLabel.textContent = `${formatTime(videoElement.currentTime)} / ${formatTime(
    videoElement.duration,
  )}`;
};

const updateToggleLabel = () => {
  if (!state.hasStarted) {
    toggleButton.textContent = "开始";
    return;
  }
  toggleButton.textContent = videoElement.paused ? "播放" : "暂停";
};

const showControls = (force = false) => {
  controls.classList.remove("hidden");
  if (!force) scheduleHideControls();
};

const hideControls = () => {
  controls.classList.add("hidden");
};

const scheduleHideControls = () => {
  if (state.hideTimer) clearTimeout(state.hideTimer);
  if (videoElement.paused || !state.hasStarted) return;
  state.hideTimer = setTimeout(() => hideControls(), 2200);
};

const hideSourceSelect = () => {
  if (!sourceSelect) return;
  sourceSelect.disabled = true;
  const container = sourceSelect.closest(".source");
  if (container) {
    container.classList.add("is-hidden");
  }
};

const clearRetry = () => {
  if (state.retryTimer) clearTimeout(state.retryTimer);
  state.retryTimer = null;
};

const scheduleRetry = () => {
  clearRetry();
  state.retryTimer = setTimeout(() => playRandomVideo(), 900);
};

const updateSeekUI = () => {
  if (!isDurationReady()) return;
  if (!state.seeking) {
    const progress = (videoElement.currentTime / videoElement.duration) * 100;
    seekBar.value = String(progress);
  }
  updateTimeLabel();
};

const applySeekFromInput = () => {
  if (!isDurationReady()) return;
  state.seeking = true;
  const nextTime = (Number(seekBar.value) / 100) * videoElement.duration;
  videoElement.currentTime = nextTime;
  updateTimeLabel();
};

const normalizeSources = (payload) => {
  const raw = Array.isArray(payload)
    ? payload
    : payload && Array.isArray(payload.sources)
      ? payload.sources
      : [];

  return raw
    .map((item, index) => {
      if (typeof item === "string") {
        return { id: String(index), label: item };
      }
      if (item && typeof item === "object") {
        const id = item.id ?? String(index);
        const label = item.label ?? item.url ?? String(id);
        return { id: String(id), label: String(label) };
      }
      return null;
    })
    .filter(Boolean);
};

const renderSourceOptions = (sources) => {
  if (!sourceSelect) return;
  sourceSelect.innerHTML = "";

  const randomOption = document.createElement("option");
  randomOption.value = "random";
  randomOption.textContent = "随机全部";
  sourceSelect.append(randomOption);

  sources.forEach((source) => {
    const option = document.createElement("option");
    option.value = source.id;
    option.textContent = source.label;
    sourceSelect.append(option);
  });

  sourceSelect.value = state.selectedSource;
};

const loadSources = async () => {
  if (!sourceSelect) return;
  try {
    const response = await fetch("/api/sources", { cache: "no-store" });
    if (!response.ok) throw new Error("Failed to fetch sources");
    const payload = await response.json();
    const sources = normalizeSources(payload);
    state.sources = sources;
    renderSourceOptions(sources);
  } catch (error) {
    console.error("Failed to load sources:", error);
    renderSourceOptions([]);
  }
};

const fetchNextUrl = async (sourceId) => {
  const requestUrl =
    sourceId && sourceId !== "random"
      ? `/api/next?source=${encodeURIComponent(sourceId)}`
      : "/api/next";
  const response = await fetch(requestUrl, { cache: "no-store" });
  if (!response.ok) {
    throw new Error("Failed to fetch next url");
  }
  const payload = await response.json();
  return payload && typeof payload.url === "string" ? payload.url : null;
};

const isAutoplayError = (error) => {
  if (!error) return false;
  return (
    error.name === "NotAllowedError" ||
    /not allowed|user gesture/i.test(String(error.message))
  );
};

const handlePlayError = (error) => {
  console.error("播放错误:", error);
  if (isAutoplayError(error)) {
    setStatus("需要手动播放");
    setHint("点击播放继续");
    showControls(true);
    updateToggleLabel();
    return;
  }
  setStatus("播放失败，正在切换...");
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
  setStatus("正在加载...");
  clearHint();
  const isFirstStart = !state.hasStarted;

  try {
    const url = await fetchNextUrl(state.selectedSource);
    if (!url) {
      setStatus("没有可用视频源");
      return;
    }

    videoElement.src = url;
    videoElement.load();
    seekBar.value = "0";
    updateTimeLabel();

    await videoElement.play();
    state.hasStarted = true;
    updateToggleLabel();
    setStatus("播放中", false);
    flashHint("轻触视频暂停");
    hideSourceSelect();
    if (isFirstStart) {
      showControls();
      scheduleHideControls();
    } else {
      hideControls();
    }
  } catch (error) {
    handlePlayError(error);
  } finally {
    state.isLoading = false;
  }
};

const handleTogglePlayback = () => {
  if (!state.hasStarted) {
    playRandomVideo();
    return;
  }
  if (videoElement.paused) {
    safePlay();
  } else {
    videoElement.pause();
  }
};

toggleButton.addEventListener("click", () => {
  handleTogglePlayback();
});

nextButton.addEventListener("click", () => {
  playRandomVideo();
});

if (sourceSelect) {
  sourceSelect.addEventListener("change", () => {
    state.selectedSource = sourceSelect.value || "random";
    const label =
      sourceSelect.options[sourceSelect.selectedIndex]?.textContent || "";
    if (label) {
      flashHint(`来源: ${label}`);
    }
  });
}

seekBar.addEventListener("input", () => {
  applySeekFromInput();
});

seekBar.addEventListener("change", () => {
  state.seeking = false;
  scheduleHideControls();
});

videoElement.addEventListener("loadedmetadata", () => {
  updateTimeLabel();
});

videoElement.addEventListener("timeupdate", () => {
  updateSeekUI();
});

videoElement.addEventListener("ended", () => {
  playRandomVideo();
});

videoElement.addEventListener("error", () => {
  setStatus("加载失败，正在切换...");
  scheduleRetry();
});

videoElement.addEventListener("play", () => {
  updateToggleLabel();
  status.classList.add("hidden");
  clearHint();
  scheduleHideControls();
});

videoElement.addEventListener("pause", () => {
  updateToggleLabel();
  setStatus("已暂停");
  setHint("点击继续播放");
  showControls(true);
});

stage.addEventListener("pointerup", (event) => {
  if (event.target.closest(".controls")) return;
  handleTogglePlayback();
});

const handleActivity = () => {
  showControls();
};

["pointermove", "pointerdown", "touchstart"].forEach((eventName) => {
  document.addEventListener(eventName, handleActivity, { passive: true });
});

document.addEventListener("keydown", (event) => {
  if (event.target.closest("input, button, textarea, select")) return;
  if (event.code === "Space") {
    event.preventDefault();
    handleTogglePlayback();
  }
  if (event.code === "ArrowRight") {
    playRandomVideo();
  }
});

document.addEventListener("visibilitychange", () => {
  if (document.hidden && !videoElement.paused) {
    videoElement.pause();
  }
});

loadSources();
setStatus("准备就绪");
setHint("点击开始");
updateToggleLabel();
showControls(true);
