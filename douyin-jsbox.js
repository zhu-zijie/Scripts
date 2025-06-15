// JSBox 抖音视频播放器
// 专为 JSBox 环境优化，不依赖端口，直接在应用内播放

// 检查是否在 JSBox 环境中运行
if (typeof $ui === "undefined") {
  console.log("此脚本需要在 JSBox 中运行");
  console.log("请将此文件导入到 JSBox 应用中使用");
  if (typeof process !== "undefined") {
    process.exit(1);
  }
}

const https = require("https");
const querystring = require("querystring");

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
    offset: 10,
    count: 10,
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
    "ttwid=1%7CMWiPccGmEGB7fkh4NZI8QI2z1xUd5Yb9Tm10WkV6OcE%7C1741349671%7C63fe4e2d016a66a6504cba68dd3aaeecc7912e26731ea8bdc1e4729523b45406; UIFID_TEMP=37c879f32637ebc5496b02d59029bbf7616da5849e10d44e1e2ee2dac28cdd6bea7cc33c8b9a99c0a9cc24fb7eec418e7c5ebe5bfa4d54840825ea533fd78c684da63e72074f30f3ae34f7445cec51d8; hevc_supported=true; fpk1=U2FsdGVkX1+k1fXw06BVXlpq8x5EY2HCjPtAvN0GlhRv33D/A7XjTOTQLqmUD1YubyMJkW94Q0anClMP/rVzDw==; fpk2=b977e10d1cb26107909e97d51a688323; UIFID=37c879f32637ebc5496b02d59029bbf7616da5849e10d44e1e2ee2dac28cdd6b2bb58216b45ff669e915df41220433cb4b055f4d79ee27f570f10ebe30caba2819b0e5f9bad2f2793002d37e05c0e5089d0ad5ee3d93fd17b09c0abd38540cb7c9426ef9aaebd9e4b8fb4b1ad225668e5d748dc9c6cac03e2aeb1236495df1caa8cc2042c81e90bbc9c32aac8d6a1089d2d0a7435981cc0d472c3006f487b8bb; x-web-secsdk-uid=645a38d4-76cf-435c-b412-aa922aee46db; s_v_web_id=verify_mbhinrwd_X71nDKGN_niq4_4psN_83Cn_Qb6E3k2bBkaD; douyin.com; device_web_cpu_core=10; device_web_memory_size=8; dy_swidth=1280; dy_sheight=800; FORCE_LOGIN=%7B%22videoConsumedRemainSeconds%22%3A180%7D; passport_csrf_token=01d053d4051e48d055ef50723a156618; passport_csrf_token_default=01d053d4051e48d055ef50723a156618; is_staff_user=false; __security_mc_1_s_dk_crypt_sdk=71fbbeda-4dd7-a040; bd_ticket_guard_client_web_domain=2; passport_assist_user=CjxyRsN5w9O4o7KMTJYUFO6UcgSIJX1SrTnIVeNijbp0BfDoKqdC6S7wRvm__dg3IGqkj9KF27DlY22AozEaSgo8AAAAAAAAAAAAAE8TbA-C5Qb9m19m-go9es6Uv1TBDjXuURMSvq85EraXUcMqI972AsQoTRLm_z0UfLTSEMeX8w0Yia_WVCABIgED-cbEFQ%3D%3D; n_mh=qogyIz1IMic5UHATYbxdbx6ZI5do3HFw90ZV0HdgRwI; sid_guard=1621fee187cdc26a630a94e0609eb3e2%7C1749015506%7C5183999%7CSun%2C+03-Aug-2025+05%3A38%3A25+GMT; uid_tt=e5f5c80f9bae051a44eb6fb50018c9d5; uid_tt_ss=e5f5c80f9bae051a44eb6fb50018c9d5; sid_tt=1621fee187cdc26a630a94e0609eb3e2; sessionid=1621fee187cdc26a630a94e0609eb3e2; sessionid_ss=1621fee187cdc26a630a94e0609eb3e2; sid_ucp_v1=1.0.0-KDQ4MDgwZGVhN2MyNDNiNWUwNWFlNGZiZDk2M2U2ODBhMDBjMzA3ZjQKHwj59Ov5sgIQ0rf_wQYY7zEgDDDW-_nRBTgHQPQHSAQaAmxxIiAxNjIxZmVlMTg3Y2RjMjZhNjMwYTk0ZTA2MDllYjNlMg; ssid_ucp_v1=1.0.0-KDQ4MDgwZGVhN2MyNDNiNWUwNWFlNGZiZDk2M2U2ODBhMDBjMzA3ZjQKHwj59Ov5sgIQ0rf_wQYY7zEgDDDW-_nRBTgHQPQHSAQaAmxxIiAxNjIxZmVlMTg3Y2RjMjZhNjMwYTk0ZTA2MDllYjNlMg; login_time=1749015505296; is_dash_user=1; publish_badge_show_info=%220%2C0%2C0%2C1749015505737%22; DiscoverFeedExposedAd=%7B%7D; _bd_ticket_crypt_cookie=5cfa99a7b46f10a917dc412974a4f6dc; __security_mc_1_s_sdk_sign_data_key_web_protect=4b1c7c43-4206-9797; __security_mc_1_s_sdk_cert_key=f656da03-4fa7-8544; __security_server_data_status=1; SelfTabRedDotControl=%5B%5D; FOLLOW_NUMBER_YELLOW_POINT_INFO=%22MS4wLjABAAAAa0XlhbtznRwjYnpJ8m1OVT5vlBznd4lwbJck5YF2ILE%2F1749052800000%2F0%2F1749017752482%2F0%22; volume_info=%7B%22isUserMute%22%3Afalse%2C%22isMute%22%3Afalse%2C%22volume%22%3A0.5%7D; download_guide=%223%2F20250604%2F0%22; __ac_signature=_02B4Z6wo00f01IrYavQAAIDBo9z0ivLq8MSK-G5AAEr86a; stream_recommend_feed_params=%22%7B%5C%22cookie_enabled%5C%22%3Atrue%2C%5C%22screen_width%5C%22%3A1280%2C%5C%22screen_height%5C%22%3A800%2C%5C%22browser_online%5C%22%3Atrue%2C%5C%22cpu_core_num%5C%22%3A10%2C%5C%22device_memory%5C%22%3A8%2C%5C%22downlink%5C%22%3A6%2C%5C%22effective_type%5C%22%3A%5C%224g%5C%22%2C%5C%22round_trip_time%5C%22%3A250%7D%22; strategyABtestKey=%221749123466.852%22; biz_trace_id=1f4efb84; bd_ticket_guard_client_data=eyJiZC10aWNrZXQtZ3VhcmQtdmVyc2lvbiI6MiwiYmQtdGlja2V0LWd1YXJkLWl0ZXJhdGlvbi12ZXJzaW9uIjoxLCJiZC10aWNrZXQtZ3VhcmQtcmVlLXB1YmxpYy1rZXkiOiJCTnROMW10dkc5REVLbW5VRnh1STZZWGhEQkMxTUFMV0NRV0VZQzlob251eitmZnFGM1ptZVJtRzVudnN6TVp6MDVyTk5Odi9XaVBMWkdkZU5HK3hpQUk9IiwiYmQtdGlja2V0LWd1YXJkLXdlYi12ZXJzaW9uIjoyfQ%3D%3D; FOLLOW_LIVE_POINT_INFO=%22MS4wLjABAAAAa0XlhbtznRwjYnpJ8m1OVT5vlBznd4lwbJck5YF2ILE%2F1749139200000%2F0%2F1749123471446%2F0%22; odin_tt=15b45c76850b9274d7482f73be72b826c3cd8c2b262688e9c51fcf4f0d0d8f641ca12beb5e68ab443c5f8e1220d8306b; home_can_add_dy_2_desktop=%221%22; vdg_s=1; IsDouyinActive=true; passport_fe_beating_status=true; __ac_nonce=06841c1c8003c4149fd9a",
};

// HTTP请求封装
class DouyinAPI {
  static httpRequest(url, options) {
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
  }

  static async searchVideos(keyword, offset = 0, count = 20) {
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
      const data = await this.httpRequest(fullUrl, options);

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
  }
}

// 视频播放器类
class VideoPlayer {
  constructor() {
    this.currentVideos = [];
    this.currentIndex = 0;
    this.autoPlay = true;
  }

  // 显示视频列表
  showVideoList(videos, keyword) {
    if (!videos || videos.length === 0) {
      $ui.alert({
        title: "搜索结果",
        message: `没有找到关键词"${keyword}"相关的视频`,
        actions: [{ title: "确定" }],
      });
      return;
    }

    this.currentVideos = videos;
    this.currentIndex = 0;

    const items = videos.map((video, index) => ({
      title: `${video.author}`,
      subtitle: `${video.title.substring(0, 60)}${
        video.title.length > 60 ? "..." : ""
      }`,
      image: video.cover
        ? {
            url: video.cover,
            cornerRadius: 12,
          }
        : {
            symbol: "video.fill",
            tintColor: $color("#FF6B6B"),
          },
    }));

    $ui.menu({
      title: `🎥 ${keyword} (${videos.length}个视频)`,
      items: items,
      handler: (title, idx) => {
        this.playVideo(idx);
      },
      footer: {
        type: "view",
        props: {
          height: 80,
          bgcolor: $color("systemBackground"),
        },
        views: [
          {
            type: "button",
            props: {
              title: "🎬 连续播放全部",
              bgcolor: $color("#FF6B6B"),
              cornerRadius: 25,
              titleColor: $color("white"),
              font: $font("bold", 16),
            },
            layout: (make, view) => {
              make.centerX.equalTo(view.super);
              make.centerY.equalTo(view.super).offset(-10);
              make.width.equalTo(200);
              make.height.equalTo(50);
            },
            events: {
              tapped: () => {
                this.startAutoPlay();
              },
            },
          },
        ],
      },
    });
  }

  // 播放单个视频
  playVideo(index) {
    if (index < 0 || index >= this.currentVideos.length) {
      return;
    }

    const video = this.currentVideos[index];
    this.currentIndex = index;

    console.log(
      `▶️ 播放视频 [${index + 1}/${this.currentVideos.length}]: ${
        video.author
      } - ${video.title}`
    );

    // 显示当前播放信息
    $ui.toast(`🎬 [${index + 1}/${this.currentVideos.length}] ${video.author}`);

    // 使用 JSBox 内置播放器
    $media.play({
      url: video.videoUrl,
      poster: video.cover,
      autoplay: true,
      showsControl: true,
      handler: {
        ended: () => {
          console.log(`✅ 视频播放结束: ${video.author}`);
          this.handleVideoEnded(index);
        },
        failed: (error) => {
          console.log(`❌ 视频播放失败: ${video.author}`, error);
          this.handleVideoFailed(index);
        },
        ready: () => {
          console.log(`📺 视频加载完成: ${video.author}`);
        },
      },
    });
  }

  // 处理视频播放结束
  handleVideoEnded(index) {
    if (index < this.currentVideos.length - 1) {
      if (this.autoPlay) {
        // 自动播放下一个
        setTimeout(() => {
          this.playVideo(index + 1);
        }, 1000);
      } else {
        // 询问是否播放下一个
        $ui.alert({
          title: "视频播放完毕",
          message: "是否播放下一个视频？",
          actions: [
            {
              title: "下一个",
              style: "default",
              handler: () => {
                this.playVideo(index + 1);
              },
            },
            {
              title: "返回列表",
              style: "cancel",
            },
          ],
        });
      }
    } else {
      // 所有视频播放完毕
      $ui.alert({
        title: "播放完成",
        message: "🎉 所有视频播放完毕！",
        actions: [
          {
            title: "重新播放",
            handler: () => {
              this.playVideo(0);
            },
          },
          {
            title: "返回",
            style: "cancel",
          },
        ],
      });
    }
  }

  // 处理视频播放失败
  handleVideoFailed(index) {
    $ui.alert({
      title: "播放失败",
      message: "视频播放失败，可能是网络问题或视频链接失效",
      actions: [
        {
          title: "重试",
          handler: () => {
            this.playVideo(index);
          },
        },
        {
          title: "下一个",
          handler: () => {
            if (index < this.currentVideos.length - 1) {
              this.playVideo(index + 1);
            }
          },
        },
        {
          title: "返回列表",
          style: "cancel",
        },
      ],
    });
  }

  // 开始自动播放模式
  startAutoPlay() {
    this.autoPlay = true;
    if (this.currentVideos.length > 0) {
      $ui.toast("🔄 开始连续播放模式");
      this.playVideo(0);
    }
  }
}

// 主应用类
class DouyinApp {
  constructor() {
    this.player = new VideoPlayer();
    this.hotKeywords = [
      "美女",
      "舞蹈",
      "搞笑",
      "音乐",
      "美食",
      "风景",
      "宠物",
      "旅行",
    ];
  }

  // 显示主界面
  showMainInterface() {
    $ui.render({
      props: {
        title: "🎥 抖音视频播放器",
      },
      views: [
        {
          type: "scroll",
          props: {
            bgcolor: $color("systemBackground"),
          },
          layout: $layout.fill,
          views: [
            // 渐变背景
            {
              type: "gradient",
              props: {
                colors: [$color("#667EEA"), $color("#764BA2")],
                locations: [0, 1],
                startPoint: $point(0, 0),
                endPoint: $point(1, 1),
              },
              layout: (make) => {
                make.top.left.right.equalTo(0);
                make.height.equalTo(300);
              },
            },
            // 标题
            {
              type: "label",
              props: {
                text: "🎥 抖音视频播放器",
                font: $font("bold", 32),
                textColor: $color("white"),
                align: $align.center,
              },
              layout: (make) => {
                make.centerX.equalTo();
                make.top.equalTo(80);
                make.width.equalTo(300);
                make.height.equalTo(40);
              },
            },
            // 副标题
            {
              type: "label",
              props: {
                text: "搜索并播放抖音视频",
                font: $font(18),
                textColor: $color("white"),
                alpha: 0.9,
                align: $align.center,
              },
              layout: (make) => {
                make.centerX.equalTo();
                make.top.equalTo(130);
                make.width.equalTo(300);
                make.height.equalTo(25);
              },
            },
            // 搜索输入框
            {
              type: "input",
              props: {
                id: "searchInput",
                placeholder: "输入搜索关键词",
                text: "美女",
                bgcolor: $color("white"),
                cornerRadius: 25,
                font: $font(18),
                align: $align.center,
                borderWidth: 0,
                shadowColor: $color("black"),
                shadowOffset: $size(0, 2),
                shadowOpacity: 0.1,
                shadowRadius: 8,
              },
              layout: (make) => {
                make.centerX.equalTo();
                make.top.equalTo(180);
                make.width.equalTo(280);
                make.height.equalTo(50);
              },
            },
            // 搜索按钮
            {
              type: "button",
              props: {
                title: "🔍 搜索播放",
                bgcolor: $color("#FF6B6B"),
                cornerRadius: 25,
                titleColor: $color("white"),
                font: $font("bold", 18),
                shadowColor: $color("black"),
                shadowOffset: $size(0, 4),
                shadowOpacity: 0.2,
                shadowRadius: 8,
              },
              layout: (make) => {
                make.centerX.equalTo();
                make.top.equalTo(250);
                make.width.equalTo(200);
                make.height.equalTo(50);
              },
              events: {
                tapped: () => {
                  this.performSearch();
                },
              },
            },
            // 快捷搜索标题
            {
              type: "label",
              props: {
                text: "🔥 热门搜索",
                font: $font("bold", 20),
                textColor: $color("label"),
                align: $align.center,
              },
              layout: (make) => {
                make.centerX.equalTo();
                make.top.equalTo(340);
                make.width.equalTo(300);
                make.height.equalTo(30);
              },
            },
            // 热门关键词网格
            {
              type: "matrix",
              props: {
                columns: 2,
                itemHeight: 50,
                spacing: 15,
                bgcolor: $color("clear"),
                data: this.hotKeywords.map((keyword) => ({
                  keyword: {
                    text: keyword,
                    textColor: $color("white"),
                    bgcolor: this.getRandomColor(),
                    cornerRadius: 20,
                    align: $align.center,
                    font: $font("bold", 16),
                  },
                })),
              },
              layout: (make) => {
                make.centerX.equalTo();
                make.top.equalTo(380);
                make.width.equalTo(300);
                make.height.equalTo(200);
              },
              events: {
                didSelect: (sender, indexPath, data) => {
                  const keyword = this.hotKeywords[indexPath.row];
                  $("searchInput").text = keyword;
                  this.searchAndPlay(keyword);
                },
              },
            },
            // 使用说明
            {
              type: "label",
              props: {
                text: "💡 点击关键词或输入自定义关键词搜索\n🎬 支持连续播放和手动切换\n📱 直接在应用内播放，无需浏览器",
                font: $font(14),
                textColor: $color("secondaryLabel"),
                align: $align.center,
                lines: 0,
              },
              layout: (make) => {
                make.centerX.equalTo();
                make.top.equalTo(600);
                make.width.equalTo(300);
                make.height.equalTo(80);
              },
            },
          ],
        },
      ],
    });
  }

  // 执行搜索
  async performSearch() {
    const keyword = $("searchInput").text.trim();
    if (!keyword) {
      $ui.toast("请输入搜索关键词");
      return;
    }

    await this.searchAndPlay(keyword);
  }

  // 搜索并播放
  async searchAndPlay(keyword) {
    $ui.loading(`正在搜索"${keyword}"...`);

    try {
      const videos = await DouyinAPI.searchVideos(keyword, 0, 20);
      $ui.loading(false);

      if (videos.length > 0) {
        console.log(`✅ 找到 ${videos.length} 个视频`);
        this.player.showVideoList(videos, keyword);
      } else {
        $ui.alert({
          title: "搜索结果",
          message: `没有找到关键词"${keyword}"相关的视频`,
          actions: [{ title: "确定" }],
        });
      }
    } catch (error) {
      $ui.loading(false);
      console.log("搜索失败:", error);
      $ui.alert({
        title: "搜索失败",
        message: error.message || "网络请求失败，请检查网络连接",
        actions: [{ title: "确定" }],
      });
    }
  }

  // 获取随机颜色
  getRandomColor() {
    const colors = [
      "#FF6B6B",
      "#4ECDC4",
      "#45B7D1",
      "#96CEB4",
      "#FFEAA7",
      "#DDA0DD",
      "#98D8C8",
      "#F7DC6F",
      "#BB8FCE",
      "#85C1E9",
      "#F8C471",
      "#82E0AA",
    ];
    return $color(colors[Math.floor(Math.random() * colors.length)]);
  }

  // 启动应用
  start() {
    console.log("🎥 抖音视频播放器启动");
    this.showMainInterface();
  }
}

// 启动应用
const app = new DouyinApp();
app.start();
