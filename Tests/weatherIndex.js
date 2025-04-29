const axios = require("axios");
const isNode =
  typeof process !== "undefined" && process.versions && process.versions.node;
const location = (isNode && process.env.LOCATION) || "101200101"; // 默认武汉
const key = isNode && process.env.KEY;
const notify = isNode ? require("./sendNotify") : "";

/**
 * 获取和风天气生活指数信息
 * @param {string} location - 城市ID,默认为武汉(101200101)
 * @param {string} key - 和风天气API密钥
 * @returns {Promise<Object>} 包含生活指数信息的对象
 */
async function getLifeIndices(location, key) {
  const url = `https://devapi.qweather.com/v7/indices/1d`;
  const params = {
    key,
    type: 0, // 0表示全部生活指数
    location,
  };

  try {
    console.log(`正在获取${location}的生活指数信息...`);

    // 构建查询字符串
    const queryString = Object.keys(params)
      .map((key) => `${key}=${params[key]}`)
      .join("&");

    // 发送请求
    const { data: response } = await axios({
      url: `${url}?${queryString}`,
      method: "GET",
      timeout: 10000,
    });

    // 检查返回状态码
    if (response.code !== "200") {
      throw new Error(`API请求失败,状态码: ${response.code}`);
    }

    // 提取生活指数数据
    const indices = response.daily.map((item) => ({
      name: item.name, // 指数名称
      category: item.category, // 指数等级
      text: item.text, // 指数详情
      type: item.type, // 指数类型ID
    }));

    // 构建返回结果
    const result = {
      updateTime: response.updateTime,
      location: location,
      indices,
      count: indices.length,
    };

    console.log(`成功获取${indices.length}条生活指数信息`);
    return result;
  } catch (error) {
    console.error("获取生活指数失败:", error.message);
    throw error;
  }
}

async function main() {
  try {
    const result = await getLifeIndices(location, key);
    console.log(`更新时间: ${result.updateTime}`);

    // 打印每条生活指数信息
    result.indices.forEach((item) => {
      console.log(`${item.name}: ${item.category} - ${item.text}`);
    });

    // 如果需要发送通知
    if (isNode) {
      const content = result.indices
        .map((item) => `${item.name}: ${item.category}\n${item.text}`)
        .join("\n\n");

      await notify.sendNotify("生活指数信息", content);
    }
  } catch (error) {
    console.error("执行失败:", error);
  }
}

// 执行函数
main();
