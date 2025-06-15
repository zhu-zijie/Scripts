const querystring = require("querystring");
const douyinConfig = require("../config/douyin-config");
const httpRequest = require("../utils/http-request");

class DouyinAPIService {
  // 搜索视频
  static async searchVideos(keyword) {
    try {
      console.log(`🔍 搜索关键词: ${keyword}`);

      const params = {
        ...douyinConfig.defaultSearchParams,
        keyword: keyword,
        offset: 0,
        count: 20,
      };

      const allParams = {
        ...params,
        ...douyinConfig.deviceInfo,
        ...douyinConfig.appInfo,
        ...douyinConfig.networkInfo,
        ...douyinConfig.securityTokens,
      };

      const queryStr = querystring.stringify(allParams);
      const requestUrl = douyinConfig.baseUrl + "?" + queryStr;

      console.log(`📡 请求URL: ${requestUrl.substring(0, 100)}...`);

      const requestOptions = {
        method: "GET",
        headers: {
          ...douyinConfig.headers,
          Cookie: douyinConfig.cookie,
          Referer: `https://www.douyin.com/jingxuan/search/${encodeURIComponent(
            keyword
          )}`,
        },
      };

      const response = await httpRequest(requestUrl, requestOptions);
      console.log(`✅ API响应状态: ${response.status_code}`);

      // console.log(`📊 响应数据结构:`, {
      //   has_data: !!response.data,
      //   data_type: Array.isArray(response.data)
      //     ? "array"
      //     : typeof response.data,
      //   data_length: Array.isArray(response.data)
      //     ? response.data.length
      //     : "N/A",
      //   has_more: !!response.has_more,
      //   cursor: response.cursor || "N/A",
      // });

      // if (response.data && Array.isArray(response.data)) {
      //   console.log(
      //     `📝 前3个数据项的结构:`,
      //     response.data.slice(0, 3).map((item, index) => ({
      //       index,
      //       has_aweme_info: !!item?.aweme_info,
      //       aweme_id: item?.aweme_info?.aweme_id || "N/A",
      //       author: item?.aweme_info?.author?.nickname || "N/A",
      //       has_video: !!item?.aweme_info?.video,
      //       has_play_addr: !!item?.aweme_info?.video?.play_addr,
      //       video_urls_count:
      //         item?.aweme_info?.video?.play_addr?.url_list?.length || 0,
      //     }))
      //   );
      // }

      if (response.status_code !== 0) {
        throw new Error(`API错误: ${response.status_msg || "未知错误"}`);
      }

      return this.parseVideoData(response, keyword);
    } catch (error) {
      console.error("❌ 搜索视频失败:", error.message);
      throw error;
    }
  }

  static parseVideoData(response, keyword) {
    console.log(`🔄 开始解析视频数据，关键词: ${keyword}`);

    if (!response.data || !Array.isArray(response.data)) {
      console.log("⚠️ 没有找到视频数据或数据格式不正确");
      console.log("响应数据:", response);
      return [];
    }

    console.log(`📋 原始数据包含 ${response.data.length} 个项目`);

    const videos = response.data
      .map((item, index) => {
        console.log(`🔍 处理第 ${index + 1} 个项目...`);

        const awemeInfo = item?.aweme_info;
        if (!awemeInfo) {
          console.log(`  ❌ 第 ${index + 1} 个项目没有 aweme_info`);
          return null;
        }

        console.log(
          `  ✅ 第 ${index + 1} 个项目有效，aweme_id: ${awemeInfo.aweme_id}`
        );

        let videoUrl = "";
        let downloadUrl = "";
        const videoUrls = awemeInfo.video?.play_addr?.url_list || [];

        if (videoUrls.length > 0) {
          videoUrl = videoUrls[0];
          downloadUrl = videoUrls[2];
          console.log(`  📹 找到 ${videoUrls.length} 个视频URL`);
        } else {
          console.log(`  ❌ 第 ${index + 1} 个项目没有视频URL`);
          return null;
        }

        const videoData = {
          aweme_id: awemeInfo.aweme_id || "未知",
          author: awemeInfo.author?.nickname || "未知",
          uid: awemeInfo.author?.uid || "未知",
          videoUrl: videoUrl,
          downloadUrl: downloadUrl,
          videoUrls: videoUrls,
          duration: awemeInfo.video?.duration || 15000,
          title: awemeInfo.desc || "无标题",
          coverUrl: awemeInfo.video?.cover?.url_list?.[0] || "",
          shareUrl: `https://www.douyin.com/video/${awemeInfo.aweme_id}`,
        };

        console.log(
          `  📝 视频数据: ${videoData.author} - ${videoData.title?.substring(
            0,
            20
          )}...`
        );
        return videoData;
      })
      .filter((item) => {
        const isValid = Boolean(item) && item.videoUrl;
        if (!isValid && item) {
          console.log(`  🚫 过滤掉无效项目: ${item.author || "unknown"}`);
        }
        return isValid;
      });

    console.log(`🎬 最终解析到 ${videos.length} 个有效视频`);

    if (videos.length === 0) {
      console.log("⚠️ 没有解析到任何有效视频，可能的原因:");
      console.log("  1. API返回的数据结构已改变");
      console.log("  2. 所有视频都缺少播放URL");
      console.log("  3. 搜索结果为空");
      console.log("  4. Cookie或token已过期");
    }

    return videos;
  }
}

module.exports = DouyinAPIService;
