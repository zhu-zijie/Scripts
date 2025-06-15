const https = require("https");
const querystring = require("querystring");
const http = require("http");
const url = require("url");

// 基础URL
const baseUrl = "https://www.douyin.com/aweme/v1/web/general/search/single/";

// 搜索参数
const searchParams = {
  keyword: "美女",
  search_channel: "aweme_general",
  search_source: "search_history",
  search_id: "2025060600121269146484485DCC928163",
  enable_history: 1,
  query_correct_type: 1,
  is_filter_search: 0,
  offset: 10,
  count: 10,
  need_filter_settings: 0,
};

// 设备和浏览器信息
const deviceInfo = {
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
};

// 应用版本信息
const appInfo = {
  aid: 6383,
  channel: "channel_pc_web",
  version_code: 190600,
  version_name: "19.6.0",
  update_version_code: 170400,
  pc_client_type: 1,
  support_h265: 1,
  support_dash: 1,
};

// 网络信息
const networkInfo = {
  downlink: 6,
  effective_type: "4g",
  round_trip_time: 250,
};

// 安全令牌
const securityTokens = {
  webid: "7479039824662414875",
  uifid:
    "37c879f32637ebc5496b02d59029bbf7616da5849e10d44e1e2ee2dac28cdd6b2bb58216b45ff669e915df41220433cb4b055f4d79ee27f570f10ebe30caba2819b0e5f9bad2f2793002d37e05c0e5089d0ad5ee3d93fd17b09c0abd38540cb7c9426ef9aaebd9e4b8fb4b1ad225668e5d748dc9c6cac03e2aeb1236495df1caa8cc2042c81e90bbc9c32aac8d6a1089d2d0a7435981cc0d472c3006f487b8bb",
  msToken:
    "_fwEi7MGnzlsjw0b3HKhXo6_yd6AHMUprm-FXB0xXDmg6VM48Wd-VUikaquB6tSRc3Vd5t503jq-h7mkptw_4dCwzceW3UbMrq3O694MdaGe9jHM3Kj_Uu_FgUFGMGjUqypygdHQi_Buq99xNw4LIs6IjP8p42MyIiKE-MOMS0eH",
  a_bogus:
    "dJUVketLdo/cedMG8CButl5UjyLlrsWyY-iKWKxPHPOdGXeO6YPnxxCebxz9WterKuZTw1oHfDGAanxbOGXsZFokumpkuw7f8T2cIuXL0ZJXGGJgnpfBCjGxLvsrUWsYTK5aidwXWt0eI2Q3NNciAMF9HKFaQ8mMTqPfdpRZ7xu2QCjqp3l8unSBwh1J",
};

// Cookies
const cookies =
  "ttwid=1%7CMWiPccGmEGB7fkh4NZI8QI2z1xUd5Yb9Tm10WkV6OcE%7C1741349671%7C63fe4e2d016a66a6504cba68dd3aaeecc7912e26731ea8bdc1e4729523b45406; UIFID_TEMP=37c879f32637ebc5496b02d59029bbf7616da5849e10d44e1e2ee2dac28cdd6bea7cc33c8b9a99c0a9cc24fb7eec418e7c5ebe5bfa4d54840825ea533fd78c684da63e72074f30f3ae34f7445cec51d8; hevc_supported=true; fpk1=U2FsdGVkX1+k1fXw06BVXlpq8x5EY2HCjPtAvN0GlhRv33D/A7XjTOTQLqmUD1YubyMJkW94Q0anClMP/rVzDw==; fpk2=b977e10d1cb26107909e97d51a688323; UIFID=37c879f32637ebc5496b02d59029bbf7616da5849e10d44e1e2ee2dac28cdd6b2bb58216b45ff669e915df41220433cb4b055f4d79ee27f570f10ebe30caba2819b0e5f9bad2f2793002d37e05c0e5089d0ad5ee3d93fd17b09c0abd38540cb7c9426ef9aaebd9e4b8fb4b1ad225668e5d748dc9c6cac03e2aeb1236495df1caa8cc2042c81e90bbc9c32aac8d6a1089d2d0a7435981cc0d472c3006f487b8bb; x-web-secsdk-uid=645a38d4-76cf-435c-b412-aa922aee46db; s_v_web_id=verify_mbhinrwd_X71nDKGN_niq4_4psN_83Cn_Qb6E3k2bBkaD; douyin.com; device_web_cpu_core=10; device_web_memory_size=8; dy_swidth=1280; dy_sheight=800; FORCE_LOGIN=%7B%22videoConsumedRemainSeconds%22%3A180%7D; passport_csrf_token=01d053d4051e48d055ef50723a156618; passport_csrf_token_default=01d053d4051e48d055ef50723a156618; is_staff_user=false; __security_mc_1_s_sdk_crypt_sdk=71fbbeda-4dd7-a040; bd_ticket_guard_client_web_domain=2; passport_assist_user=CjxyRsN5w9O4o7KMTJYUFO6UcgSIJX1SrTnIVeNijbp0BfDoKqdC6S7wRvm__dg3IGqkj9KF27DlY22AozEaSgo8AAAAAAAAAAAAAE8TbA-C5Qb9m19m-go9es6Uv1TBDjXuURMSvq85EraXUcMqI972AsQoTRLm_z0UfLTSEMeX8w0Yia_WVCABIgED-cbEFQ%3D%3D; n_mh=qogyIz1IMic5UHATYbxdbx6ZI5do3HFw90ZV0HdgRwI; sid_guard=1621fee187cdc26a630a94e0609eb3e2%7C1749015506%7C5183999%7CSun%2C+03-Aug-2025+05%3A38%3A25+GMT; uid_tt=e5f5c80f9bae051a44eb6fb50018c9d5; uid_tt_ss=e5f5c80f9bae051a44eb6fb50018c9d5; sid_tt=1621fee187cdc26a630a94e0609eb3e2; sessionid=1621fee187cdc26a630a94e0609eb3e2; sessionid_ss=1621fee187cdc26a630a94e0609eb3e2; sid_ucp_v1=1.0.0-KDQ4MDgwZGVhN2MyNDNiNWUwNWFlNGZiZDk2M2U2ODBhMDBjMzA3ZjQKHwj59Ov5sgIQ0rf_wQYY7zEgDDDW-_nRBTgHQPQHSAQaAmxxIiAxNjIxZmVlMTg3Y2RjMjZhNjMwYTk0ZTA2MDllYjNlMg; ssid_ucp_v1=1.0.0-KDQ4MDgwZGVhN2MyNDNiNWUwNWFlNGZiZDk2M2U2ODBhMDBjMzA3ZjQKHwj59Ov5sgIQ0rf_wQYY7zEgDDDW-_nRBTgHQPQHSAQaAmxxIiAxNjIxZmVlMTg3Y2RjMjZhNjMwYTk0ZTA2MDllYjNlMg; login_time=1749015505296; is_dash_user=1; publish_badge_show_info=%220%2C0%2C0%2C1749015505737%22; DiscoverFeedExposedAd=%7B%7D; _bd_ticket_crypt_cookie=5cfa99a7b46f10a917dc412974a4f6dc; __security_mc_1_s_sdk_sign_data_key_web_protect=4b1c7c43-4206-9797; __security_mc_1_s_sdk_cert_key=f656da03-4fa7-8544; __security_server_data_status=1; SelfTabRedDotControl=%5B%5D; FOLLOW_NUMBER_YELLOW_POINT_INFO=%22MS4wLjABAAAAa0XlhbtznRwjYnpJ8m1OVT5vlBznd4lwbJck5YF2ILE%2F1749052800000%2F0%2F1749017752482%2F0%22; volume_info=%7B%22isUserMute%22%3Afalse%2C%22isMute%22%3Afalse%2C%22volume%22%3A0.5%7D; download_guide=%223%2F20250604%2F0%22; __ac_signature=_02B4Z6wo00f01IrYavQAAIDBo9z0ivLq8MSK-G5AAEr86a; stream_recommend_feed_params=%22%7B%5C%22cookie_enabled%5C%22%3Atrue%2C%5C%22screen_width%5C%22%3A1280%2C%5C%22screen_height%5C%22%3A800%2C%5C%22browser_online%5C%22%3Atrue%2C%5C%22cpu_core_num%5C%22%3A10%2C%5C%22device_memory%5C%22%3A8%2C%5C%22downlink%5C%22%3A6%2C%5C%22effective_type%5C%22%3A%5C%224g%5C%22%2C%5C%22round_trip_time%5C%22%3A250%7D%22; strategyABtestKey=%221749123466.852%22; biz_trace_id=1f4efb84; bd_ticket_guard_client_data=eyJiZC10aWNrZXQtZ3VhcmQtdmVyc2lvbiI6MiwiYmQtdGlja2V0LWd1YXJkLWl0ZXJhdGlvbi12ZXJzaW9uIjoxLCJiZC10aWNrZXQtZ3VhcmQtcmVlLXB1YmxpYy1rZXkiOiJCTnROMW10dkc5REVLbW5VRnh1STZZWGhEQkMxTUFMV0NRV0VZQzlob251eitmZnFGM1ptZVJtRzVudnN6TVp6MDVyTk5Odi9XaVBMWkdkZU5HK3hpQUk9IiwiYmQtdGlja2V0LWd1YXJkLXdlYi12ZXJzaW9uIjoyfQ%3D%3D; FOLLOW_LIVE_POINT_INFO=%22MS4wLjABAAAAa0XlhbtznRwjYnpJ8m1OVT5vlBznd4lwbJck5YF2ILE%2F1749139200000%2F0%2F1749123471446%2F0%22; odin_tt=15b45c76850b9274d7482f73be72b826c3cd8c2b262688e9c51fcf4f0d0d8f641ca12beb5e68ab443c5f8e1220d8306b; home_can_add_dy_2_desktop=%221%22; vdg_s=1; IsDouyinActive=true; passport_fe_beating_status=true; __ac_nonce=06841c1c8003c4149fd9a";

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
          console.log("原始数据:", data.substring(0, 200) + "...");
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

// 请求函数
const fetchDouyinData = async (keyword, offset = 0, count = 20) => {
  try {
    const params = {
      ...searchParams,
      keyword: keyword,
      offset: offset,
      count: count,
    };

    const allParams = {
      ...params,
      ...deviceInfo,
      ...appInfo,
      ...networkInfo,
      ...securityTokens,
    };

    const urlParams = querystring.stringify(allParams);
    const fullUrl = `${baseUrl}?${urlParams}`;

    const options = {
      headers: {
        Cookie: cookies,
        Referer: `https://www.douyin.com/jingxuan/search/${encodeURIComponent(
          keyword
        )}`,
        "User-Agent":
          "Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_7) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/137.0.0.0 Safari/537.36",
      },
    };

    console.log(`正在搜索: ${keyword}`);
    const data = await httpRequest(fullUrl, options);

    if (data.data && data.data.length > 0) {
      return data.data
        .map((item) => {
          const awemeInfo = item?.aweme_info;
          if (!awemeInfo) return null;

          // 尝试获取多个视频URL
          let videoUrl = "未知";
          if (awemeInfo.video?.play_addr?.url_list?.length > 0) {
            // 优先使用第一个URL，如果失败则提供备用
            videoUrl = awemeInfo.video.play_addr.url_list[0];
          }

          return {
            aweme_id: awemeInfo.aweme_id || "未知",
            author: awemeInfo.author?.nickname || "未知",
            uid: awemeInfo.author?.uid || "未知",
            videoUrl: videoUrl,
            // 添加备用URL
            videoUrls: awemeInfo.video?.play_addr?.url_list || [],
            duration: awemeInfo.video?.duration || 15000,
            title: awemeInfo.desc || "无标题",
            // 添加封面图
            cover: awemeInfo.video?.cover?.url_list?.[0] || "",
            // 添加抖音链接
            shareUrl: `https://www.douyin.com/video/${awemeInfo.aweme_id}`,
          };
        })
        .filter((item) => Boolean(item));
    }
    return [];
  } catch (error) {
    console.log("请求出错：", error.message);
    return [];
  }
};

// 视频播放页面HTML
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
            background: #000;
            color: white;
        }
        .container { max-width: 800px; margin: 0 auto; }
        .search-form { 
            background: #222; 
            padding: 20px; 
            border-radius: 10px; 
            margin-bottom: 20px;
        }
        .search-form input { 
            padding: 10px; 
            width: 60%; 
            border: none; 
            border-radius: 5px;
            margin-right: 10px;
        }
        .search-form button { 
            padding: 10px 20px; 
            background: #ff6b6b; 
            color: white; 
            border: none; 
            border-radius: 5px; 
            cursor: pointer;
        }
        .auto-play {
            margin: 15px 0;
            display: flex;
            align-items: center;
            justify-content: space-between;
            flex-wrap: wrap;
        }
        .auto-play label {
            display: flex;
            align-items: center;
            cursor: pointer;
            font-size: 14px;
            padding: 8px 12px;
            background: rgba(255, 107, 107, 0.1);
            border-radius: 20px;
            border: 1px solid rgba(255, 107, 107, 0.3);
            transition: all 0.3s ease;
        }
        .auto-play label:hover {
            background: rgba(255, 107, 107, 0.2);
            border-color: rgba(255, 107, 107, 0.5);
        }
        .auto-play input[type="checkbox"] {
            width: 16px;
            height: 16px;
            margin-right: 8px;
            cursor: pointer;
            accent-color: #ff6b6b;
        }
        .control-buttons {
            display: flex;
            gap: 10px;
            flex-wrap: wrap;
        }
        .control-buttons button {
            padding: 8px 16px;
            background: #444;
            color: white;
            border: none;
            border-radius: 15px;
            cursor: pointer;
            font-size: 12px;
            transition: background 0.3s ease;
        }
        .control-buttons button:hover {
            background: #555;
        }
        .video-item { 
            background: #222; 
            margin: 20px 0; 
            border-radius: 10px; 
            overflow: hidden;
            position: relative;
        }
        .video-info { 
            padding: 15px; 
            border-bottom: 1px solid #444;
        }
        .video-title { 
            font-size: 16px; 
            margin-bottom: 5px;
        }
        .video-meta { 
            color: #888; 
            font-size: 14px;
        }
        video { 
            width: 100%; 
            height: 400px; 
            background: #000;
        }
        .play-btn {
            background: #ff6b6b;
            color: white;
            border: none;
            padding: 10px 20px;
            border-radius: 5px;
            cursor: pointer;
            margin: 5px;
            transition: background 0.3s ease;
        }
        .play-btn:hover {
            background: #ff5252;
        }
        .controls {
            padding: 10px 15px;
            background: #333;
        }
        .video-item.playing {
            border: 2px solid #ff6b6b;
            box-shadow: 0 0 20px rgba(255, 107, 107, 0.3);
        }
        .video-progress {
            position: absolute;
            top: 0;
            left: 0;
            height: 3px;
            background: #ff6b6b;
            transition: width 0.3s ease;
            z-index: 10;
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
                <label>
                    <input type="checkbox" id="autoPlay"> 
                    自动播放下一个视频 (${videos.length}个视频)
                </label>
                <div class="control-buttons">
                    <button onclick="playAll()">🔄 连续播放</button>
                    <button onclick="refreshPage()">🔄 刷新</button>
                    <button onclick="toggleFullscreen()">📺 全屏模式</button>
                </div>
            </div>
        </div>

        <div id="videoContainer">
            ${videos
              .map(
                (video, index) => `
                <div class="video-item" id="video-${index}">
                    <div class="video-progress" id="progress-${index}" style="width: 0%;"></div>
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
                          video.videoUrl
                        }')">📋 复制视频链接</button>
                        <button class="play-btn" onclick="downloadVideo('${
                          video.videoUrl
                        }', '${video.author}-${index}')">⬇️ 下载</button>
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
                clearTimeout(autoPlayTimer);
                autoPlayTimer = null;
                setTimeout(() => {
                    if (!isTransitioning) {
                        syncVideoState();
                    }
                }, 200);
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
            
            autoPlayTimer = setTimeout(() => {
                if (autoPlayEnabled && !isTransitioning) {
                    playNextVideo();
                }
                autoPlayTimer = null;
            }, 1500);
        }

        document.addEventListener('DOMContentLoaded', function() {
            console.log('🎥 视频播放器已加载');
            console.log('⌨️ 键盘控制: ↑↓ 切换视频, 空格 播放/暂停, F 全屏, A 自动播放 (仅在非输入状态下有效)');
            
            document.querySelectorAll('video').forEach((video, index) => {
                video.addEventListener('timeupdate', function() {
                    if (video.duration > 0) {
                        const progress = (video.currentTime / video.duration) * 100;
                        document.getElementById('progress-' + index).style.width = progress + '%';
                    }
                });

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
                    console.log('视频结束:', index, '当前视频索引:', currentVideoIndex, '全屏状态:', isInFullscreen);
                    document.getElementById('video-' + index).classList.remove('playing');
                    document.getElementById('progress-' + index).style.width = '100%';
                    
                    if (autoPlayEnabled && currentVideoIndex === index && !isTransitioning) {
                        console.log('准备播放下一个视频...');
                        
                        if (isInFullscreen) {
                            console.log('全屏模式下视频结束，准备退出全屏');
                            exitFullscreen().then(() => {
                                console.log('已退出全屏，等待状态同步');
                            });
                        } else {
                            scheduleNextVideo();
                        }
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
            
            if (isInFullscreen) {
                exitFullscreen().then(() => {
                    setTimeout(() => {
                        scrollAndPlay(video, index);
                    }, 500);
                });
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

        function downloadVideo(url, filename) {
            const a = document.createElement('a');
            a.href = '/proxy-video?url=' + encodeURIComponent(url);
            a.download = filename + '.mp4';
            a.target = '_blank';
            a.click();
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

// 创建Web服务器
const createWebServer = () => {
  const server = http.createServer(async (req, res) => {
    const parsedUrl = url.parse(req.url, true);

    console.log(`请求路径: ${parsedUrl.pathname}`);

    // 视频代理路由
    if (parsedUrl.pathname === "/proxy-video") {
      const videoUrl = parsedUrl.query.url;
      if (!videoUrl) {
        res.writeHead(400);
        res.end("Missing video url");
        return;
      }

      try {
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
            },
          },
          (videoRes) => {
            res.writeHead(videoRes.statusCode, {
              "Content-Type": videoRes.headers["content-type"] || "video/mp4",
              "Content-Length": videoRes.headers["content-length"],
              "Accept-Ranges": "bytes",
              "Content-Range": videoRes.headers["content-range"],
              "Access-Control-Allow-Origin": "*",
            });

            videoRes.pipe(res);
          }
        );

        videoReq.on("error", (proxyError) => {
          console.log("视频代理请求错误:", proxyError.message);
          res.writeHead(500);
          res.end("Video proxy error: " + proxyError.message);
        });

        videoReq.end();
      } catch (proxyException) {
        console.log("视频代理异常:", proxyException.message);
        res.writeHead(500);
        res.end("Video proxy failed: " + proxyException.message);
      }
      return;
    }

    if (parsedUrl.pathname === "/play") {
      try {
        const keyword = parsedUrl.query.keyword || "自贡移动";
        const offset = parseInt(parsedUrl.query.offset) || 0;
        const count = parseInt(parsedUrl.query.count) || 10;

        console.log(`正在获取视频: ${keyword}`);
        const results = await fetchDouyinData(keyword, offset, count);

        if (results.length > 0) {
          const html = generateVideoPage(results, keyword);
          res.setHeader("Content-Type", "text/html; charset=utf-8");
          res.writeHead(200);
          res.end(html);
        } else {
          res.setHeader("Content-Type", "text/html; charset=utf-8");
          res.writeHead(200);
          res.end(`
            <html>
            <body style="font-family: Arial; text-align: center; padding: 50px;">
              <h2>😕 没有找到相关视频</h2>
              <p>关键词: ${keyword}</p>
              <a href="/">返回首页</a>
            </body>
            </html>
          `);
        }
      } catch (error) {
        res.setHeader("Content-Type", "text/html; charset=utf-8");
        res.writeHead(500);
        res.end(`
          <html>
          <body style="font-family: Arial; text-align: center; padding: 50px;">
            <h2>❌ 服务器错误</h2>
            <p>${error.message}</p>
            <a href="/">返回首页</a>
          </body>
          </html>
        `);
      }
    } else if (parsedUrl.pathname === "/search") {
      // API接口保持不变
      try {
        const keyword = parsedUrl.query.keyword || "自贡移动";
        const offset = parseInt(parsedUrl.query.offset) || 0;
        const count = parseInt(parsedUrl.query.count) || 10;

        const results = await fetchDouyinData(keyword, offset, count);

        const response = {
          success: true,
          keyword: keyword,
          count: results.length,
          data: results,
        };

        res.setHeader("Content-Type", "application/json; charset=utf-8");
        res.setHeader("Access-Control-Allow-Origin", "*");
        res.writeHead(200);
        res.end(JSON.stringify(response, null, 2));
      } catch (error) {
        const errorResponse = {
          success: false,
          error: error.message,
        };
        res.setHeader("Content-Type", "application/json; charset=utf-8");
        res.writeHead(500);
        res.end(JSON.stringify(errorResponse, null, 2));
      }
    } else if (parsedUrl.pathname === "/") {
      // 首页 - 搜索表单
      const html = `
        <!DOCTYPE html>
        <html>
        <head>
          <title>抖音视频播放器</title>
          <meta charset="utf-8">
          <meta name="viewport" content="width=device-width, initial-scale=1">
          <style>
            body { 
              font-family: Arial, sans-serif; 
              background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
              color: white; 
              margin: 0; 
              padding: 0; 
              height: 100vh; 
              display: flex; 
              align-items: center; 
              justify-content: center;
            }
            .container { 
              text-align: center; 
              background: rgba(0,0,0,0.3); 
              padding: 40px; 
              border-radius: 20px; 
              backdrop-filter: blur(10px);
            }
            h1 { font-size: 3em; margin-bottom: 20px; }
            .search-form { margin: 30px 0; }
            .search-form input { 
              padding: 15px; 
              font-size: 18px; 
              border: none; 
              border-radius: 25px; 
              width: 300px; 
              margin-right: 10px;
            }
            .search-form button { 
              padding: 15px 30px; 
              font-size: 18px; 
              background: #ff6b6b; 
              color: white; 
              border: none; 
              border-radius: 25px; 
              cursor: pointer;
            }
            .quick-search { margin-top: 20px; }
            .quick-search a { 
              display: inline-block; 
              margin: 5px; 
              padding: 10px 20px; 
              background: rgba(255,255,255,0.2); 
              color: white; 
              text-decoration: none; 
              border-radius: 15px;
            }
          </style>
        </head>
        <body>
          <div class="container">
            <h1>🎥 抖音视频播放器</h1>
            <p>输入关键词搜索并播放抖音视频</p>
            
            <form class="search-form" onsubmit="searchVideos(event)">
              <input type="text" id="searchInput" placeholder="输入搜索关键词" value="自贡移动">
              <button type="submit">🔍 搜索播放</button>
            </form>
            
            <div class="quick-search">
              <p>快速搜索:</p>
              <a href="/play?keyword=美女">美女</a>
              <a href="/play?keyword=舞蹈">舞蹈</a>
              <a href="/play?keyword=搞笑">搞笑</a>
              <a href="/play?keyword=音乐">音乐</a>
              <a href="/play?keyword=美食">美食</a>
            </div>
            
            <div style="margin-top: 30px; font-size: 14px; opacity: 0.8;">
              <p>🎹 键盘控制: ↑↓ 切换视频, 空格 播放/暂停</p>
              <p>📱 API接口: <a href="/search?keyword=关键词" style="color: #ffd93d;">/search?keyword=关键词</a></p>
            </div>
          </div>

          <script>
            function searchVideos(event) {
              event.preventDefault();
              const keyword = document.getElementById('searchInput').value;
              if (keyword.trim()) {
                window.location.href = '/play?keyword=' + encodeURIComponent(keyword);
              }
            }
          </script>
        </body>
        </html>
      `;
      res.setHeader("Content-Type", "text/html; charset=utf-8");
      res.writeHead(200);
      res.end(html);
    } else {
      res.writeHead(404);
      res.end("Not Found");
    }
  });

  server.listen(3000, () => {
    console.log("🎥 抖音视频播放服务器已启动!");
    console.log("🌐 访问: http://localhost:3000");
    console.log("🎬 播放: http://localhost:3000/play?keyword=关键词");
    console.log("📡 API: http://localhost:3000/search?keyword=关键词");
  });
};

// 启动服务器
createWebServer();
