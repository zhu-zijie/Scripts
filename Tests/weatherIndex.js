/**
 * 天气生活指数信息获取脚本
 * 依赖: axios
 * 环境变量: LOCATION KEY
 */

const axios = require("axios");
const location = process.env.LOCATION || "101200101";
const key = process.env.KEY;
const notify = require("./sendNotify");

/**
 * 获取和风天气生活指数信息
 * @param {string} location - 城市ID,默认为武汉(101200101)
 * @param {string} key - 和风天气API密钥  type=0表示全部生活指数
 * @returns {Promise<Object>} 包含生活指数信息的对象
 */
async function getLifeIndices(location, key) {
  const url = `https://devapi.qweather.com/v7/indices/1d`;
  const params = {
    key,
    type: 0,
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

    // 发送通知
    try {
      const content = result.indices
        .map((item) => `${item.name}: ${item.category}\n${item.text}`)
        .join("\n\n");

      await notify.sendNotify("生活指数信息", content);
      console.log("通知发送成功");
    } catch (notifyError) {
      console.warn("通知发送失败:", notifyError.message);
    }
  } catch (error) {
    console.error("执行失败:", error);
    process.exit(1);
  }
}

// 执行函数
main();
