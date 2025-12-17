/**
 * 天气生活指数信息获取脚本
 * 依赖: axios
 * 环境变量: LOCATION KEY
 */

const axios = require("axios");

/**
 * sendNotify.js 在加载时会读取环境变量并可能请求“一言”。
 * 这里强制关闭一言：降低外部网络依赖，避免通知阶段偶发失败和日志穿插。
 * 注意：必须在 require("../sendNotify") 之前设置才生效。
 */
process.env.HITOKOTO = "false";

const location = process.env.LOCATION || "101200101";
const key = process.env.KEY;
const notify = require("../sendNotify");

function requireEnv(name, value) {
  if (value) return value;
  throw new Error(`缺少环境变量: ${name}`);
}

/**
 * 让 stdout 先把前面的日志刷出去，减少与 sendNotify 内部日志的穿插。
 */
function flushStdout() {
  return new Promise((resolve) => setImmediate(resolve));
}

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
      .map((paramKey) => `${paramKey}=${params[paramKey]}`)
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

async function run() {
  requireEnv("KEY", key);
  const result = await getLifeIndices(location, key);
  console.log(`更新时间: ${result.updateTime}`);

  const lines = result.indices.map(
    (item) => `${item.name}: ${item.category} - ${item.text}`
  );
  const printBlock = lines.join("\n");
  console.log(printBlock);

  const content = result.indices
    .map((item) => `${item.name}: ${item.category}\n${item.text}`)
    .join("\n\n");

  await flushStdout();

  return { title: "生活指数信息", content };
}

(async () => {
  let notifyInfo;
  try {
    notifyInfo = await run();
  } catch (e) {
    console.error("执行失败:", e);
    process.exit(1);
  } finally {
    if (notifyInfo) {
      const { title, content } = notifyInfo;
      try {
        console.log("📢 正在发送通知...");
        await flushStdout();
        await notify.sendNotify(title, content);
        console.log("✅ 通知发送成功");
      } catch (notifyErr) {
        console.warn("⚠️ 通知发送失败:", notifyErr.message);
      }
    }

    await new Promise((resolve) => setTimeout(resolve, 3000));
  }
})();
