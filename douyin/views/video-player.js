// 视频播放页面HTML模板
const generateVideoPage = (videos, keyword) => {
  return `
<!DOCTYPE html>
<html>
<head>
    <title>抖音视频播放 - ${keyword}</title>
    <meta charset="utf-8">
    <meta name="viewport" content="width=device-width, initial-scale=1">
    <style>
        body { 
            font-family: Arial, sans-serif; 
            margin: 0; 
            padding: 20px; 
            background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
            min-height: 100vh;
            color: white;
        }
        .container { max-width: 800px; margin: 0 auto; }
        .search-form { 
            background: rgba(255, 255, 255, 0.1); 
            backdrop-filter: blur(10px);
            padding: 20px; 
            border-radius: 10px; 
            margin-bottom: 20px;
            border: 1px solid rgba(255, 255, 255, 0.2);
        }
        .search-form input { 
            padding: 10px; 
            width: 60%; 
            border: none; 
            border-radius: 5px;
            margin-right: 10px;
            background: rgba(255, 255, 255, 0.9);
            color: #333;
        }
        .search-form button { 
            padding: 10px 20px; 
            background: linear-gradient(45deg, #ff6b6b, #ff8e8e);
            color: white; 
            border: none; 
            border-radius: 5px; 
            cursor: pointer;
        }
        .video-item { 
            background: rgba(255, 255, 255, 0.1); 
            backdrop-filter: blur(10px);
            margin: 20px 0; 
            border-radius: 10px; 
            overflow: hidden;
            position: relative;
            border: 1px solid rgba(255, 255, 255, 0.2);
        }
        .video-info { 
            padding: 15px; 
            border-bottom: 1px solid rgba(255, 255, 255, 0.1);
        }
        .video-title { 
            font-size: 16px; 
            margin-bottom: 5px;
        }
        .video-meta { 
            color: rgba(255, 255, 255, 0.7); 
            font-size: 14px;
        }
        video { 
            width: 100%; 
            height: 400px; 
            background: #000;
        }
        .play-btn {
            background: linear-gradient(45deg, #ff6b6b, #ff8e8e);
            color: white;
            border: none;
            padding: 10px 20px;
            border-radius: 5px;
            cursor: pointer;
            margin: 5px;
            transition: all 0.3s ease;
        }
        .play-btn:hover {
            transform: translateY(-1px);
            box-shadow: 0 4px 15px rgba(255, 107, 107, 0.3);
        }
        .controls {
            padding: 10px 15px;
            background: rgba(255, 255, 255, 0.05);
        }
        .video-item.playing {
            border: 2px solid #ff6b6b;
            box-shadow: 0 0 20px rgba(255, 107, 107, 0.3);
        }
        .auto-play {
            margin: 15px 0;
            display: flex;
            align-items: center;
            justify-content: space-between;
            gap: 15px;
            flex-wrap: wrap;
        }

        .auto-play-left {
            display: flex;
            align-items: center;
            gap: 10px;
        }

        .auto-play-checkbox {
            display: flex;
            align-items: center;
            gap: 8px;
            padding: 10px 15px;
            background: rgba(255, 107, 107, 0.1);
            border-radius: 25px;
            border: 1px solid rgba(255, 107, 107, 0.3);
            transition: all 0.3s ease;
            cursor: pointer;
            font-size: 14px;
            white-space: nowrap;
        }

        .auto-play-checkbox:hover {
            background: rgba(255, 107, 107, 0.2);
            border-color: rgba(255, 107, 107, 0.5);
            transform: translateY(-1px);
        }

        .auto-play-checkbox input[type="checkbox"] {
            width: 18px;
            height: 18px;
            margin: 0;
            cursor: pointer;
            accent-color: #ff6b6b;
        }

        .video-count {
            padding: 8px 12px;
            background: rgba(76, 175, 80, 0.1);
            border: 1px solid rgba(76, 175, 80, 0.3);
            border-radius: 20px;
            font-size: 13px;
            color: #4CAF50;
            font-weight: 500;
        }

        .control-buttons {
            display: flex;
            gap: 8px;
            flex-wrap: wrap;
        }

        .control-buttons button {
            padding: 10px 16px;
            background: rgba(255, 255, 255, 0.1);
            color: white;
            border: 1px solid rgba(255, 255, 255, 0.2);
            border-radius: 20px;
            cursor: pointer;
            font-size: 13px;
            transition: all 0.3s ease;
            backdrop-filter: blur(5px);
            white-space: nowrap;
        }

        .control-buttons button:hover {
            background: rgba(255, 255, 255, 0.2);
            border-color: rgba(255, 255, 255, 0.4);
            transform: translateY(-1px);
        }

        /* 响应式设计 */
        @media (max-width: 768px) {
            .auto-play {
                flex-direction: column;
                align-items: stretch;
                gap: 10px;
            }
            
            .auto-play-left {
                justify-content: center;
                flex-wrap: wrap;
            }
            
            .control-buttons {
                justify-content: center;
            }
        }
    </style>
</head>
<body>
    <div class="container">
        <div class="search-form">
            <h2>🎥 抖音视频播放器</h2>
            <form onsubmit="searchVideos(event)">
                <input type="text" id="searchInput" placeholder="输入搜索关键词" value="${keyword}">
                <button type="submit">搜索</button>
            </form>
            <div class="auto-play">
                <div class="auto-play-left">
                    <label class="auto-play-checkbox">
                        <input type="checkbox" id="autoPlay"> 
                        <span>🎵 自动播放下一个</span>
                    </label>
                    <div class="video-count">
                        📊 共${videos.length}个视频
                    </div>
                </div>
                <div class="control-buttons">
                    <button onclick="playAll()">🔄 连续播放</button>
                    <button onclick="refreshPage()">🔄 刷新页面</button>
                    <button onclick="toggleFullscreen()">📺 全屏模式</button>
                </div>
            </div>
        </div>

        <div id="videoContainer">
            ${videos
              .map(
                (video, index) => `
                <div class="video-item" id="video-${index}">
                    <div class="video-info">
                        <div class="video-title">👤 ${video.author} ${
                  video.title ? "- " + video.title : ""
                }</div>
                        <div class="video-meta">
                            ⏱️ ${Math.round(video.duration / 1000)}秒 | 
                            🆔 ${video.aweme_id} | 
                            📍 第${index + 1}个视频
                        </div>
                    </div>
                    <video id="player-${index}" controls preload="metadata">
                        <source src="/proxy-video?url=${encodeURIComponent(
                          video.videoUrl
                        )}" type="video/mp4">
                        您的浏览器不支持视频播放
                    </video>
                    <div class="controls">
                        <button class="play-btn" onclick="playVideo(${index})">▶️ 播放</button>
                        <button class="play-btn" onclick="openInDouyin('${
                          video.shareUrl
                        }')">🎵 抖音中打开</button>
                        <button class="play-btn" onclick="copyUrl('${
                          video.downloadUrl || video.videoUrl
                        }')">📋 复制视频链接</button>
                    </div>
                </div>
            `
              )
              .join("")}
        </div>
    </div>

    <script>
        let currentVideoIndex = 0;
        let autoPlayEnabled = false;
        let isPlaying = false;
        let isInFullscreen = false;
        let isTransitioning = false;
        let autoPlayTimer = null;

        // 检查是否在输入状态
        function isInputFocused() {
            const activeElement = document.activeElement;
            return activeElement && (
                activeElement.tagName === 'INPUT' || 
                activeElement.tagName === 'TEXTAREA' || 
                activeElement.contentEditable === 'true'
            );
        }

        // 检测全屏状态变化
        document.addEventListener('fullscreenchange', handleFullscreenChange);
        document.addEventListener('webkitfullscreenchange', handleFullscreenChange);
        document.addEventListener('mozfullscreenchange', handleFullscreenChange);
        document.addEventListener('MSFullscreenChange', handleFullscreenChange);

        function handleFullscreenChange() {
            const wasInFullscreen = isInFullscreen;
            isInFullscreen = !!(document.fullscreenElement || 
                              document.webkitFullscreenElement || 
                              document.mozFullScreenElement || 
                              document.msFullscreenElement);
            
            console.log('全屏状态变化:', isInFullscreen ? '进入全屏' : '退出全屏');
            
            if (wasInFullscreen && !isInFullscreen) {
                // 退出全屏时，滚动到当前视频位置
                console.log('退出全屏，滚动到当前视频:', currentVideoIndex);
                
                clearTimeout(autoPlayTimer);
                autoPlayTimer = null;
                
                // 滚动到当前播放的视频位置
                if (currentVideoIndex >= 0) {
                    const currentVideoElement = document.getElementById('video-' + currentVideoIndex);
                    if (currentVideoElement) {
                        setTimeout(() => {
                            currentVideoElement.scrollIntoView({ 
                                behavior: 'smooth', 
                                block: 'center' 
                            });
                            
                            // 高亮当前播放的视频
                            currentVideoElement.classList.add('playing');
                            
                            // 继续同步视频状态
                            setTimeout(() => {
                                if (!isTransitioning) {
                                    syncVideoState();
                                }
                            }, 300);
                        }, 100);
                    }
                }
            }
        }

        function syncVideoState() {
            const currentVideo = document.getElementById('player-' + currentVideoIndex);
            if (currentVideo && autoPlayEnabled && currentVideo.ended && !isTransitioning) {
                console.log('同步状态：准备播放下一个视频');
                scheduleNextVideo();
            }
        }

        function scheduleNextVideo() {
            if (isTransitioning) {
                console.log('正在切换中，跳过调度');
                return;
            }
            
            if (autoPlayTimer) {
                clearTimeout(autoPlayTimer);
                autoPlayTimer = null;
            }
            
            console.log('调度下一个视频播放，延迟800ms');
            autoPlayTimer = setTimeout(() => {
                if (autoPlayEnabled && !isTransitioning) {
                    console.log('执行自动播放下一个视频');
                    playNextVideo();
                } else {
                    console.log('自动播放已取消或正在切换中');
                }
                autoPlayTimer = null;
            }, 800); // 减少延迟时间从1500ms到800ms
        }

        document.addEventListener('DOMContentLoaded', function() {
            console.log('🎥 视频播放器已加载');
            console.log('⌨️ 键盘控制: ↑↓ 切换视频, 空格 播放/暂停, F 全屏, A 自动播放 (仅在非输入状态下有效)');
            
            document.querySelectorAll('video').forEach((video, index) => {
                video.addEventListener('play', function() {
                    isPlaying = true;
                    document.getElementById('video-' + index).classList.add('playing');
                    console.log('开始播放视频:', index);
                });

                video.addEventListener('pause', function() {
                    if (currentVideoIndex === index) {
                        isPlaying = false;
                        console.log('暂停视频:', index);
                    }
                });

                video.addEventListener('ended', function() {
                    console.log('视频结束:', index, '当前视频索引:', currentVideoIndex, '自动播放:', autoPlayEnabled, '全屏状态:', isInFullscreen);
                    document.getElementById('video-' + index).classList.remove('playing');
                    
                    if (autoPlayEnabled && currentVideoIndex === index && !isTransitioning) {
                        console.log('准备播放下一个视频...');
                        
                        // 无论是否全屏，都直接播放下一个视频
                        scheduleNextVideo();
                    }
                });

                video.addEventListener('error', function() {
                    console.log('视频加载失败:', index);
                    if (autoPlayEnabled && currentVideoIndex === index && !isTransitioning) {
                        scheduleNextVideo();
                    }
                });
            });
        });

        function exitFullscreen() {
            return new Promise((resolve) => {
                if (document.exitFullscreen) {
                    document.exitFullscreen().then(resolve).catch(resolve);
                } else if (document.webkitExitFullscreen) {
                    document.webkitExitFullscreen();
                    setTimeout(resolve, 100);
                } else if (document.mozCancelFullScreen) {
                    document.mozCancelFullScreen();
                    setTimeout(resolve, 100);
                } else if (document.msExitFullscreen) {
                    document.msExitFullscreen();
                    setTimeout(resolve, 100);
                } else {
                    resolve();
                }
            });
        }

        function playNextVideo() {
            if (isTransitioning) {
                console.log('正在切换中，跳过播放下一个');
                return;
            }
            
            const totalVideos = document.querySelectorAll('video').length;
            if (currentVideoIndex < totalVideos - 1) {
                console.log('播放下一个视频:', currentVideoIndex + 1);
                playVideo(currentVideoIndex + 1);
            } else {
                console.log('所有视频播放完毕');
                autoPlayEnabled = false;
                document.getElementById('autoPlay').checked = false;
                alert('🎉 所有视频播放完毕！');
            }
        }

        function searchVideos(event) {
            event.preventDefault();
            const keyword = document.getElementById('searchInput').value;
            if (keyword.trim()) {
                window.location.href = '/play?keyword=' + encodeURIComponent(keyword);
            }
        }

        function playVideo(index) {
            if (isTransitioning) {
                console.log('正在切换中，跳过播放请求');
                return;
            }
            
            const video = document.getElementById('player-' + index);
            const totalVideos = document.querySelectorAll('video').length;
            
            if (index < 0 || index >= totalVideos) {
                return;
            }
            
            console.log('切换到视频:', index);
            isTransitioning = true;
            
            if (autoPlayTimer) {
                clearTimeout(autoPlayTimer);
                autoPlayTimer = null;
            }
            
            currentVideoIndex = index;
            
            document.querySelectorAll('.video-item').forEach(item => {
                item.classList.remove('playing');
            });
            
            document.querySelectorAll('video').forEach((v, i) => {
                if (i !== index) {
                    v.pause();
                    v.currentTime = 0;
                }
            });
            
            // 修复：在全屏状态下直接播放新视频，保持全屏状态
            if (isInFullscreen) {
                // 先滚动到目标视频位置（但不会影响全屏）
                document.getElementById('video-' + index).scrollIntoView({ 
                    behavior: 'smooth', 
                    block: 'center' 
                });
                
                // 直接播放新视频
                setTimeout(() => {
                    video.play().then(() => {
                        console.log('全屏模式下成功切换并播放视频:', index);
                        isPlaying = true;
                        isTransitioning = false;
                        
                        // 让新视频进入全屏
                        setTimeout(() => {
                            if (video.requestFullscreen) {
                                video.requestFullscreen();
                            } else if (video.webkitRequestFullscreen) {
                                video.webkitRequestFullscreen();
                            } else if (video.msRequestFullscreen) {
                                video.msRequestFullscreen();
                            } else if (video.mozRequestFullScreen) {
                                video.mozRequestFullScreen();
                            }
                        }, 100);
                        
                    }).catch((playError) => {
                        console.log('全屏模式下播放失败:', playError);
                        isTransitioning = false;
                        if (autoPlayEnabled && !isTransitioning) {
                            scheduleNextVideo();
                        }
                    });
                }, 200);
            } else {
                scrollAndPlay(video, index);
            }
        }

        function scrollAndPlay(video, index) {
            document.getElementById('video-' + index).scrollIntoView({ 
                behavior: 'smooth', 
                block: 'center' 
            });
            
            setTimeout(() => {
                video.play().then(() => {
                    console.log('成功播放视频:', index);
                    isPlaying = true;
                    isTransitioning = false;
                }).catch((playError) => {
                    console.log('播放失败:', index, playError.message);
                    isTransitioning = false;
                    alert('视频播放失败，请尝试刷新页面或在抖音中打开');
                });
            }, 800);
        }

        function playAll() {
            autoPlayEnabled = true;
            document.getElementById('autoPlay').checked = true;
            playVideo(0);
            console.log('开始连续播放模式');
        }

        function toggleFullscreen() {
            if (currentVideoIndex >= 0) {
                const video = document.getElementById('player-' + currentVideoIndex);
                
                if (isInFullscreen) {
                    exitFullscreen();
                } else {
                    if (video.requestFullscreen) {
                        video.requestFullscreen();
                    } else if (video.webkitRequestFullscreen) {
                        video.webkitRequestFullscreen();
                    } else if (video.msRequestFullscreen) {
                        video.msRequestFullscreen();
                    } else if (video.mozRequestFullScreen) {
                        video.mozRequestFullScreen();
                    }
                }
            }
        }

        function toggleAutoPlay() {
            const checkbox = document.getElementById('autoPlay');
            checkbox.checked = !checkbox.checked;
            autoPlayEnabled = checkbox.checked;
            console.log('自动播放模式:', autoPlayEnabled ? '开启' : '关闭');
            
            if (!autoPlayEnabled && autoPlayTimer) {
                clearTimeout(autoPlayTimer);
                autoPlayTimer = null;
            }
        }

        function openInDouyin(shareUrl) {
            window.open(shareUrl, '_blank');
        }

        function copyUrl(url) {
            navigator.clipboard.writeText(url).then(() => {
                alert('视频原链接已复制到剪贴板');
            }).catch(() => {
                prompt('复制下面的视频链接：', url);
            });
        }

        function refreshPage() {
            window.location.reload();
        }

        document.getElementById('autoPlay').addEventListener('change', function() {
            autoPlayEnabled = this.checked;
            console.log('自动播放模式:', autoPlayEnabled ? '开启' : '关闭');
            
            if (!autoPlayEnabled && autoPlayTimer) {
                clearTimeout(autoPlayTimer);
                autoPlayTimer = null;
            }
        });

        // 完美解决方案：既保留A和F键，又检测输入状态
        document.addEventListener('keydown', function(e) {
            // 如果正在输入框中输入，不响应快捷键
            if (isInputFocused()) {
                return;
            }
            
            const totalVideos = document.querySelectorAll('video').length;
            
            switch(e.key) {
                case 'ArrowUp':
                    e.preventDefault();
                    if (currentVideoIndex > 0) {
                        playVideo(currentVideoIndex - 1);
                    }
                    break;
                case 'ArrowDown':
                    e.preventDefault();
                    if (currentVideoIndex < totalVideos - 1) {
                        playVideo(currentVideoIndex + 1);
                    }
                    break;
                case ' ':
                    e.preventDefault();
                    const currentVideo = document.getElementById('player-' + currentVideoIndex);
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
                    toggleAutoPlay();
                    break;
                case 'Escape':
                    if (isInFullscreen) {
                        if (autoPlayTimer) {
                            clearTimeout(autoPlayTimer);
                            autoPlayTimer = null;
                        }
                    }
                    break;
            }
        });

        console.log('🎥 视频播放器已加载 (支持全屏自动播放)');
        console.log('⌨️ 键盘控制: ↑↓ 切换视频, 空格 播放/暂停, F 全屏切换, A 自动播放切换 (仅在非输入状态下有效)');
    </script>
</body>
</html>`;
};

module.exports = generateVideoPage;
