const axios = require("axios");
const { exec } = require("child_process");

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

// 构建URL参数
const buildUrlParams = () => {
  const allParams = {
    ...searchParams,
    ...deviceInfo,
    ...appInfo,
    ...networkInfo,
    ...securityTokens,
  };

  return Object.entries(allParams)
    .map(([key, value]) => `${key}=${encodeURIComponent(value)}`)
    .join("&");
};

// Cookies
const cookies =
  "ttwid=1%7CMWiPccGmEGB7fkh4NZI8QI2z1xUd5Yb9Tm10WkV6OcE%7C1741349671%7C63fe4e2d016a66a6504cba68dd3aaeecc7912e26731ea8bdc1e4729523b45406; UIFID_TEMP=37c879f32637ebc5496b02d59029bbf7616da5849e10d44e1e2ee2dac28cdd6bea7cc33c8b9a99c0a9cc24fb7eec418e7c5ebe5bfa4d54840825ea533fd78c684da63e72074f30f3ae34f7445cec51d8; hevc_supported=true; fpk1=U2FsdGVkX1+k1fXw06BVXlpq8x5EY2HCjPtAvN0GlhRv33D/A7XjTOTQLqmUD1YubyMJkW94Q0anClMP/rVzDw==; fpk2=b977e10d1cb26107909e97d51a688323; UIFID=37c879f32637ebc5496b02d59029bbf7616da5849e10d44e1e2ee2dac28cdd6b2bb58216b45ff669e915df41220433cb4b055f4d79ee27f570f10ebe30caba2819b0e5f9bad2f2793002d37e05c0e5089d0ad5ee3d93fd17b09c0abd38540cb7c9426ef9aaebd9e4b8fb4b1ad225668e5d748dc9c6cac03e2aeb1236495df1caa8cc2042c81e90bbc9c32aac8d6a1089d2d0a7435981cc0d472c3006f487b8bb; x-web-secsdk-uid=645a38d4-76cf-435c-b412-aa922aee46db; s_v_web_id=verify_mbhinrwd_X71nDKGN_niq4_4psN_83Cn_Qb6E3k2bBkaD; douyin.com; device_web_cpu_core=10; device_web_memory_size=8; dy_swidth=1280; dy_sheight=800; FORCE_LOGIN=%7B%22videoConsumedRemainSeconds%22%3A180%7D; passport_csrf_token=01d053d4051e48d055ef50723a156618; passport_csrf_token_default=01d053d4051e48d055ef50723a156618; is_staff_user=false; __security_mc_1_s_sdk_crypt_sdk=71fbbeda-4dd7-a040; bd_ticket_guard_client_web_domain=2; passport_assist_user=CjxyRsN5w9O4o7KMTJYUFO6UcgSIJX1SrTnIVeNijbp0BfDoKqdC6S7wRvm__dg3IGqkj9KF27DlY22AozEaSgo8AAAAAAAAAAAAAE8TbA-C5Qb9m19m-go9es6Uv1TBDjXuURMSvq85EraXUcMqI972AsQoTRLm_z0UfLTSEMeX8w0Yia_WVCABIgED-cbEFQ%3D%3D; n_mh=qogyIz1IMic5UHATYbxdbx6ZI5do3HFw90ZV0HdgRwI; sid_guard=1621fee187cdc26a630a94e0609eb3e2%7C1749015506%7C5183999%7CSun%2C+03-Aug-2025+05%3A38%3A25+GMT; uid_tt=e5f5c80f9bae051a44eb6fb50018c9d5; uid_tt_ss=e5f5c80f9bae051a44eb6fb50018c9d5; sid_tt=1621fee187cdc26a630a94e0609eb3e2; sessionid=1621fee187cdc26a630a94e0609eb3e2; sessionid_ss=1621fee187cdc26a630a94e0609eb3e2; sid_ucp_v1=1.0.0-KDQ4MDgwZGVhN2MyNDNiNWUwNWFlNGZiZDk2M2U2ODBhMDBjMzA3ZjQKHwj59Ov5sgIQ0rf_wQYY7zEgDDDW-_nRBTgHQPQHSAQaAmxxIiAxNjIxZmVlMTg3Y2RjMjZhNjMwYTk0ZTA2MDllYjNlMg; ssid_ucp_v1=1.0.0-KDQ4MDgwZGVhN2MyNDNiNWUwNWFlNGZiZDk2M2U2ODBhMDBjMzA3ZjQKHwj59Ov5sgIQ0rf_wQYY7zEgDDDW-_nRBTgHQPQHSAQaAmxxIiAxNjIxZmVlMTg3Y2RjMjZhNjMwYTk0ZTA2MDllYjNlMg; login_time=1749015505296; is_dash_user=1; publish_badge_show_info=%220%2C0%2C0%2C1749015505737%22; DiscoverFeedExposedAd=%7B%7D; _bd_ticket_crypt_cookie=5cfa99a7b46f10a917dc412974a4f6dc; __security_mc_1_s_sdk_sign_data_key_web_protect=4b1c7c43-4206-9797; __security_mc_1_s_sdk_cert_key=f656da03-4fa7-8544; __security_server_data_status=1; SelfTabRedDotControl=%5B%5D; FOLLOW_NUMBER_YELLOW_POINT_INFO=%22MS4wLjABAAAAa0XlhbtznRwjYnpJ8m1OVT5vlBznd4lwbJck5YF2ILE%2F1749052800000%2F0%2F1749017752482%2F0%22; volume_info=%7B%22isUserMute%22%3Afalse%2C%22isMute%22%3Afalse%2C%22volume%22%3A0.5%7D; download_guide=%223%2F20250604%2F0%22; __ac_signature=_02B4Z6wo00f01IrYavQAAIDBo9z0ivLq8MSK-G5AAEr86a; stream_recommend_feed_params=%22%7B%5C%22cookie_enabled%5C%22%3Atrue%2C%5C%22screen_width%5C%22%3A1280%2C%5C%22screen_height%5C%22%3A800%2C%5C%22browser_online%5C%22%3Atrue%2C%5C%22cpu_core_num%5C%22%3A10%2C%5C%22device_memory%5C%22%3A8%2C%5C%22downlink%5C%22%3A6%2C%5C%22effective_type%5C%22%3A%5C%224g%5C%22%2C%5C%22round_trip_time%5C%22%3A250%7D%22; strategyABtestKey=%221749123466.852%22; biz_trace_id=1f4efb84; bd_ticket_guard_client_data=eyJiZC10aWNrZXQtZ3VhcmQtdmVyc2lvbiI6MiwiYmQtdGlja2V0LWd1YXJkLWl0ZXJhdGlvbi12ZXJzaW9uIjoxLCJiZC10aWNrZXQtZ3VhcmQtcmVlLXB1YmxpYy1rZXkiOiJCTnROMW10dkc5REVLbW5VRnh1STZZWGhEQkMxTUFMV0NRV0VZQzlob251eitmZnFGM1ptZVJtRzVudnN6TVp6MDVyTk5Odi9XaVBMWkdkZU5HK3hpQUk9IiwiYmQtdGlja2V0LWd1YXJkLXdlYi12ZXJzaW9uIjoyfQ%3D%3D; FOLLOW_LIVE_POINT_INFO=%22MS4wLjABAAAAa0XlhbtznRwjYnpJ8m1OVT5vlBznd4lwbJck5YF2ILE%2F1749139200000%2F0%2F1749123471446%2F0%22; odin_tt=15b45c76850b9274d7482f73be72b826c3cd8c2b262688e9c51fcf4f0d0d8f641ca12beb5e68ab443c5f8e1220d8306b; home_can_add_dy_2_desktop=%221%22; vdg_s=1; IsDouyinActive=true; passport_fe_beating_status=true; __ac_nonce=06841c1c8003c4149fd9a";

// 封装请求函数
const fetchDouyinData = async (keyword, offset = 0, count = 20) => {
  try {
    // 更新搜索关键词和分页
    searchParams.keyword = keyword;
    searchParams.offset = offset;
    searchParams.count = count;

    // 构建请求配置
    const config = {
      method: "get",
      maxBodyLength: Infinity,
      url: `${baseUrl}?${buildUrlParams()}`,
      headers: {
        Cookie: cookies,
        Referer: `https://www.douyin.com/jingxuan/search/${encodeURIComponent(
          keyword
        )}`,
      },
    };

    // 发送请求
    const response = await axios.request(config);
    const data = response.data;

    // 处理返回数据
    if (data.data && data.data.length > 0) {
      return data.data
        .map((item) => {
          const awemeInfo = item?.aweme_info;
          if (!awemeInfo) return null;

          return {
            aweme_id: awemeInfo.aweme_id || "未知",
            author: awemeInfo.author?.nickname || "未知",
            uid: awemeInfo.author?.uid || "未知",
            videoUrl: awemeInfo.video?.play_addr?.url_list?.[0] || "未知",
            duration: awemeInfo.video?.duration || 15000,
          };
        })
        .filter((item) => Boolean(item)); // 过滤掉无效数据
    }

    return [];
  } catch (error) {
    console.error("请求出错：", error);
    return [];
  }
};

// const main = async () => {
//   const results = await fetchDouyinData("加绒摇");

//   if (results.length > 0) {
//     results.forEach((item, index) => {
//       console.log(`--- 视频 ${index + 1} ---`);
//       console.log(`aweme_id: ${item.aweme_id}`);
//       console.log(`Author: ${item.author}`);
//       console.log(`uid: ${item.uid}`);
//       console.log(`Video URL: ${item.videoUrl}`);
//       console.log("------------------------------------------------");
//     });
//   } else {
//     console.log("没有找到相关数据");
//   }
// };

// 浏览器自动播放
const main = async () => {
  const results = await fetchDouyinData("自贡移动", 0, 10);

  if (results.length > 0) {
    console.log(`找到 ${results.length} 个视频结果`);

    // 先创建一个专用标签页
    exec(`open -a "Google Chrome" about:blank`, (err) => {
      if (err) {
        console.error("无法创建专用标签页:", err);
        return;
      }

      // 等待浏览器打开
      setTimeout(() => {
        // 修改播放视频函数
        const playVideo = (index) => {
          if (index >= results.length) {
            console.log("所有视频已播放完毕");
            process.exit();
          }

          const video = results[index];
          console.log(`\n--- 正在播放 ${index + 1}/${results.length} ---`);
          console.log(`作者: ${video.author}`);
          console.log(`视频ID: ${video.aweme_id}`);
          console.log(`视频时长: ${Math.round(video.duration / 1000)}秒`);
          console.log(`视频链接: ${video.videoUrl}`);

          // 使用AppleScript在同一个标签页打开
          const appleScript = `
          tell application "Google Chrome"
            set targetWindow to window 1
            set URL of active tab of targetWindow to "${video.videoUrl}"
            activate
          end tell
          `;

          exec(`osascript -e '${appleScript}'`, (error) => {
            if (error) {
              console.error(`无法播放视频: ${error}`);
              setTimeout(() => playVideo(index + 1), 5000);
              return;
            }

            const waitTime = video.duration + 1000;
            console.log(
              `视频将播放 ${Math.round(
                video.duration / 1000
              )} 秒,之后播放下一个...`
            );

            setTimeout(() => playVideo(index + 1), waitTime);
          });
        };

        // 开始播放第一个视频
        playVideo(0);
      }, 2000); // 等待2秒确保浏览器已打开
    });
  } else {
    console.log("没有找到相关数据");
    process.exit();
  }
};

// 执行主函数
main();
