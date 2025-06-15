// 抖音API配置
const douyinConfig = {
  // 基础URL
  baseUrl: "https://www.douyin.com/aweme/v1/web/general/search/single/",

  // 默认搜索参数
  defaultSearchParams: {
    search_channel: "aweme_general",
    search_source: "search_history",
    search_id: "2025060600121269146484485DCC928163",
    enable_history: 1,
    query_correct_type: 1,
    is_filter_search: 0,
    offset: 0,
    count: 10,
    need_filter_settings: 0,
  },

  // 设备和浏览器信息
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

  // 应用版本信息
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

  // 网络信息
  networkInfo: {
    downlink: 6,
    effective_type: "4g",
    round_trip_time: 250,
  },

  // 安全令牌
  securityTokens: {
    webid: "7479039824662414875",
    uifid:
      "37c879f32637ebc5496b02d59029bbf7616da5849e10d44e1e2ee2dac28cdd6b2bb58216b45ff669e915df41220433cb4b055f4d79ee27f570f10ebe30caba2819b0e5f9bad2f2793002d37e05c0e5089d0ad5ee3d93fd17b09c0abd38540cb7c9426ef9aaebd9e4b8fb4b1ad225668e5d748dc9c6cac03e2aeb1236495df1caa8cc2042c81e90bbc9c32aac8d6a1089d2d0a7435981cc0d472c3006f487b8bb",
    msToken:
      "ZNSgT__FV5SwlL2-ac-547WTFCzGvY4a7XGIS-gaFOYmov7SrqkQDvjtOetP7XmAo3-eDL4lxvLyv1V_6wrm7xRkJ9FdcX9ycxg7cSYZYJeHOj6aRJu4AKobJ1ddpC7iTJCwPJt-B4g6zf4STN9oV5Z2MT9yVgxiuI1bFCoTcKXZ",
    a_bogus:
      "dJUVketLdo/cedMG8CButl5UjyLlrsWyY-iKWKxPHPOdGXeO6YPnxxCebxz9WterKuZTw1oHfDGAanxbOGXsZFokumpkuw7f8T2cIuXL0ZJXGGJgnpfBCjGxLvsrUWsYTK5aidwXWt0eI2Q3NNciAMF9HKFaQ8mMTqPfdpRZ7xu2QCjqp3l8unSBwh1J",
  },

  // Cookie
  cookie:
    "UIFID_TEMP=37c879f32637ebc5496b02d59029bbf7616da5849e10d44e1e2ee2dac28cdd6bea7cc33c8b9a99c0a9cc24fb7eec418e7c5ebe5bfa4d54840825ea533fd78c684da63e72074f30f3ae34f7445cec51d8; hevc_supported=true; fpk1=U2FsdGVkX1+k1fXw06BVXlpq8x5EY2HCjPtAvN0GlhRv33D/A7XjTOTQLqmUD1YubyMJkW94Q0anClMP/rVzDw==; fpk2=b977e10d1cb26107909e97d51a688323; UIFID=37c879f32637ebc5496b02d59029bbf7616da5849e10d44e1e2ee2dac28cdd6b2bb58216b45ff669e915df41220433cb4b055f4d79ee27f570f10ebe30caba2819b0e5f9bad2f2793002d37e05c0e5089d0ad5ee3d93fd17b09c0abd38540cb7c9426ef9aaebd9e4b8fb4b1ad225668e5d748dc9c6cac03e2aeb1236495df1caa8cc2042c81e90bbc9c32aac8d6a1089d2d0a7435981cc0d472c3006f487b8bb; x-web-secsdk-uid=645a38d4-76cf-435c-b412-aa922aee46db; s_v_web_id=verify_mbhinrwd_X71nDKGN_niq4_4psN_83Cn_Qb6E3k2bBkaD; douyin.com; device_web_cpu_core=10; device_web_memory_size=8; passport_csrf_token=01d053d4051e48d055ef50723a156618; passport_csrf_token_default=01d053d4051e48d055ef50723a156618; is_staff_user=false; __security_mc_1_s_sdk_crypt_sdk=71fbbeda-4dd7-a040; bd_ticket_guard_client_web_domain=2; passport_assist_user=CjxyRsN5w9O4o7KMTJYUFO6UcgSIJX1SrTnIVeNijbp0BfDoKqdC6S7wRvm__dg3IGqkj9KF27DlY22AozEaSgo8AAAAAAAAAAAAAE8TbA-C5Qb9m19m-go9es6Uv1TBDjXuURMSvq85EraXUcMqI972AsQoTRLm_z0UfLTSEMeX8w0Yia_WVCABIgED-cbEFQ%3D%3D; n_mh=qogyIz1IMic5UHATYbxdbx6ZI5do3HFw90ZV0HdgRwI; sid_guard=1621fee187cdc26a630a94e0609eb3e2%7C1749015506%7C5183999%7CSun%2C+03-Aug-2025+05%3A38%3A25+GMT; uid_tt=e5f5c80f9bae051a44eb6fb50018c9d5; uid_tt_ss=e5f5c80f9bae051a44eb6fb50018c9d5; sid_tt=1621fee187cdc26a630a94e0609eb3e2; sessionid=1621fee187cdc26a630a94e0609eb3e2; sessionid_ss=1621fee187cdc26a630a94e0609eb3e2; sid_ucp_v1=1.0.0-KDQ4MDgwZGVhN2MyNDNiNWUwNWFlNGZiZDk2M2U2ODBhMDBjMzA3ZjQKHwj59Ov5sgIQ0rf_wQYY7zEgDDDW-_nRBTgHQPQHSAQaAmxxIiAxNjIxZmVlMTg3Y2RjMjZhNjMwYTk0ZTA2MDllYjNlMg; ssid_ucp_v1=1.0.0-KDQ4MDgwZGVhN2MyNDNiNWUwNWFlNGZiZDk2M2U2ODBhMDBjMzA3ZjQKHwj59Ov5sgIQ0rf_wQYY7zEgDDDW-_nRBTgHQPQHSAQaAmxxIiAxNjIxZmVlMTg3Y2RjMjZhNjMwYTk0ZTA2MDllYjNlMg; login_time=1749015505296; is_dash_user=1; _bd_ticket_crypt_cookie=5cfa99a7b46f10a917dc412974a4f6dc; __security_mc_1_s_sdk_sign_data_key_web_protect=4b1c7c43-4206-9797; __security_mc_1_s_sdk_cert_key=f656da03-4fa7-8544; __security_server_data_status=1; SelfTabRedDotControl=%5B%5D; volume_info=%7B%22isUserMute%22%3Afalse%2C%22isMute%22%3Atrue%2C%22volume%22%3A0.5%7D; SEARCH_RESULT_LIST_TYPE=%22single%22; enter_pc_once=1; publish_badge_show_info=%220%2C0%2C0%2C1749812918138%22; download_guide=%221%2F20250613%2F0%22; strategyABtestKey=%221749970139.593%22; biz_trace_id=32195114; ttwid=1%7CMWiPccGmEGB7fkh4NZI8QI2z1xUd5Yb9Tm10WkV6OcE%7C1749970139%7Cbb2e5a9b43a9b37a4d1bfd0c0decb078f217fd9c9671cf9b6edca89619bd3b0e; __ac_nonce=0684ed9b5006735aae67c; __ac_signature=_02B4Z6wo00f01MPAVMQAAIDC8FWihvCVAYDD4FBAAFjEb6; FOLLOW_LIVE_POINT_INFO=%22MS4wLjABAAAAa0XlhbtznRwjYnpJ8m1OVT5vlBznd4lwbJck5YF2ILE%2F1750003200000%2F0%2F0%2F1749998609039%22; FOLLOW_NUMBER_YELLOW_POINT_INFO=%22MS4wLjABAAAAa0XlhbtznRwjYnpJ8m1OVT5vlBznd4lwbJck5YF2ILE%2F1750003200000%2F0%2F0%2F1749999209039%22; dy_swidth=400; dy_sheight=625; stream_recommend_feed_params=%22%7B%5C%22cookie_enabled%5C%22%3Atrue%2C%5C%22screen_width%5C%22%3A400%2C%5C%22screen_height%5C%22%3A625%2C%5C%22browser_online%5C%22%3Atrue%2C%5C%22cpu_core_num%5C%22%3A10%2C%5C%22device_memory%5C%22%3A8%2C%5C%22downlink%5C%22%3A8.2%2C%5C%22effective_type%5C%22%3A%5C%224g%5C%22%2C%5C%22round_trip_time%5C%22%3A150%7D%22; home_can_add_dy_2_desktop=%221%22; bd_ticket_guard_client_data=eyJiZC10aWNrZXQtZ3VhcmQtdmVyc2lvbiI6MiwiYmQtdGlja2V0LWd1YXJkLWl0ZXJhdGlvbi12ZXJzaW9uIjoxLCJiZC10aWNrZXQtZ3VhcmQtcmVlLXB1YmxpYy1rZXkiOiJCTnROMW10dkc5REVLbW5VRnh1STZZWGhEQkMxTUFMV0NRV0VZQzlob251eitmZnFGM1ptZVJtRzVudnN6TVp6MDVyTk5Odi9XaVBMWkdkZU5HK3hpQUk9IiwiYmQtdGlja2V0LWd1YXJkLXdlYi12ZXJzaW9uIjoyfQ%3D%3D; odin_tt=ab2247b69016834843c6e4c547dae4c9ef060049611641d35dd6a17b079795c9694a182d848cd11e0a33f90dafc26f82bb709b6dd83b9f3aedc2718a82644844; passport_fe_beating_status=true; IsDouyinActive=true",
  // 请求头
  headers: {
    Cookie: "",
    Referer: "https://www.douyin.com/",
    "User-Agent":
      "Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_7) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/137.0.0.0 Safari/537.36",
  },
};

module.exports = douyinConfig;
