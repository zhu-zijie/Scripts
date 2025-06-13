/**
 * 羽毛球场地预约系统 -- 仅供学习和参考使用
 * 提前5-10分钟启动脚本，自动等待到9点整发送预约请求
 */

const axios = require("axios");
const CryptoJS = require("crypto-js");

/**
 * 获取明天日期，格式：YYYY-MM-DD
 */
function getTomorrowDate() {
  const tomorrow = new Date();
  tomorrow.setDate(tomorrow.getDate() + 1);
  return `${tomorrow.getFullYear()}-${String(tomorrow.getMonth() + 1).padStart(
    2,
    "0"
  )}-${String(tomorrow.getDate()).padStart(2, "0")}`;
}

// 日期和价格自动计算
const tomorrowDate = getTomorrowDate();
const coordinatesList = ["3-1", "3-2"]; // 场地坐标
const appointTimeList = ["11:30-12:30", "12:30-13:30"]; // 预约时段

// 预约参数配置（不需要改）
const bookingData = {
  unitPrice: "5",
  nodeList: [
    { sitename: "南区羽毛球馆1号场", nodeid: "814925434071556096" },
    { sitename: "南区羽毛球馆2号场", nodeid: "814925496096923648" },
    { sitename: "南区羽毛球馆3号场", nodeid: "814925536915890176" },
    { sitename: "南区羽毛球馆4号场", nodeid: "814925570327715840" },
    { sitename: "南区羽毛球馆5号场", nodeid: "814925637193310208" },
    { sitename: "南区羽毛球馆6号场", nodeid: "814925691589238784" },
    { sitename: "南区羽毛球馆7号场", nodeid: "814925742428397568" },
    { sitename: "南区羽毛球馆8号场", nodeid: "814925780974051328" },
  ],
  payprice: "0",
  appointmentDate: tomorrowDate,
  timeList: [
    { time: "10:30", status: "0" },
    { time: "11:30", status: "0" },
    { time: "12:30", status: "0" },
    { time: "13:30", status: "1" },
    { time: "15:30", status: "0" },
    { time: "16:30", status: "0" },
    { time: "17:30", status: "0" },
    { time: "18:30", status: "1" },
    { time: "19:30", status: "0" },
    { time: "20:30", status: "0" },
    { time: "21:30", status: "0" },
    { time: "22:30", status: "1" },
  ],
  coordinatesList: coordinatesList,
  appointTimeList: appointTimeList,
  reserveDate: tomorrowDate,
  booktype: 2,
  appointmentType: 2,
  nodeid: "814925270195904512",
};

/**
 * AES加密函数
 * @param {string|object} data - 要加密的数据
 * @returns {string} - 加密后的字符串
 */
function encrypt(data) {
  // 定义加密所需变量
  const key = CryptoJS.enc.Utf8.parse("0102030405060708"); // 16字节密钥
  const iv = CryptoJS.enc.Utf8.parse("0102030405060708"); // 16字节IV

  // 如果是对象，先转为JSON字符串
  const jsonData = typeof data === "object" ? JSON.stringify(data) : data;

  const dataUtf8 = CryptoJS.enc.Utf8.parse(jsonData);
  const encrypted = CryptoJS.AES.encrypt(dataUtf8, key, {
    iv: iv,
    mode: CryptoJS.mode.CBC,
    padding: CryptoJS.pad.Pkcs7,
  });

  return encrypted.ciphertext.toString().toUpperCase();
}

/**
 * 发送羽毛球场地预约请求
 * @param {number} attemptNum - 当前尝试次数
 * @returns {Promise<Object>} - 预约结果
 */
async function sendRequest(attemptNum = 1) {
  console.log(`开始第 ${attemptNum} 次预约尝试...`);

  const url =
    "https://cgyy.xju.edu.cn/service/appointment/appointment/phone/createBookingBytime";

  // 构建请求头
  // prettier-ignore
  const headers = {
    "Host": "cgyy.xju.edu.cn",
    "Connection": "keep-alive",
    "Content-Type": "application/json",
    "User-Agent": "Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_7) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/137.0.0.0 Safari/537.36",
    "token": "eyJhbGciOiJSUzI1NiJ9.eyJleHAiOjE3NTU3MzQ2NTksIk9wZXJhdG9yIjoie1wiaWRzZXJpYWxcIjpcIjEwNzU1MjMwMDY5N1wiLFwibWVzc2FnZXR5cGVcIjpcIjBcIixcInBjb2RlXCI6XCIxMVwiLFwiY291bnRyeWNvZGVcIjpcIjE1NlwiLFwiaWRzZXJpYWwyXCI6XCI0MjEwMjMxOTk5MTEwMzI0MTJcIixcInNleFwiOlwiMVwiLFwicmVtYXJrXCI6XCI2NTZkZjYyYzEwOGJmNDgxNTFmMGY0MmM1OTY1NzJhZVwiLFwibmF0aW9uY29kZVwiOlwiMDFcIixcIm9yZ2lkXCI6MixcImlkZW50aXR5bm9cIjpcIjQyMTAyMzE5OTkxMTAzMjQxMlwiLFwic2Nob29sc3RhdHVzXCI6XCIxXCIsXCJkZXBhcnRpZFwiOjgxMTUsXCJ0ZWxcIjpcIjE1ODI2NjE4MjkzXCIsXCJpZFwiOjEwMTkyMTIxODE5NDM3NTQ3NTIsXCJpbnB1dGRhdGVcIjoxNzE1ODYwMjEzMDAwLFwidXNlcm5hbWVcIjpcIuacseaym-aWh1wifSIsInN1YiI6ImRhdGFsb29rIn0.V2IuTpDemz6_JDj35LvHqIxFrusdurjtxCoIqtFmYhPEbuCRLejml7qDmdIXJxl1g4RQyQWS5NOf8GvJhlLkB7zaWLKSwDLDyRoSHV3LMhNbFUzTcJAjcpYYGZ61xh9Sq2u4xJnI7mh4OgvCTaFZioKG6J10xhnspeiJgAfwGgZFQs4nSdZq0QecIPTXOH7u-h5K9bHhHaU56t9FDBDrUZMN41Tos4q_WvpCkG-RcFUEO9J2rE93rED4QDF5ew0Z5IQt851nUWzIYt89kJnx4MWNaaPPiWC3OOv7HzRM3u5P2---l2238FHNh8RWM-lKkWjaUP87EvrQTsMUD6DBeQ",
    "Accept": "*/*",
    "Origin": "https://cgyy.xju.edu.cn",
    "Referer": "https://cgyy.xju.edu.cn/",
    "Cookie": "datalook-appointment-phone=F143C21EBC37ABB3183732B039068C37"
  };

  // 加密请求数据
  const encryptedData = encrypt(JSON.stringify(bookingData));
  const requestBody = { item: encryptedData };

  try {
    const response = await axios.post(url, requestBody, {
      headers: headers,
      timeout: 10000, // 缩短超时时间，快速失败以便重试
    });

    console.log(`第 ${attemptNum} 次预约请求响应状态: ${response.status}`);

    if (response.data.success) {
      console.log("✅ 预约成功!");
      console.log("预约详情:", response.data.resultData || response.data);
      return response.data;
    } else {
      console.error(`❌ 第 ${attemptNum} 次预约失败: ${response.data.message}`);

      // 使用test.js中相同的重试逻辑 - 定义不需要重试的错误
      const noRetryErrors = [
        "已被预约",
        "您已预约",
        "已预约过",
        "不在开放时间",
        "限购,预约值已达最大",
      ];

      // 判断是否应该重试
      const shouldRetry = !noRetryErrors.some((msg) =>
        response.data.message.includes(msg)
      );

      if (attemptNum < MAX_RETRY_ATTEMPTS && shouldRetry) {
        console.log(
          `等待 ${RETRY_DELAY_MS}ms 后重试... (${attemptNum}/${MAX_RETRY_ATTEMPTS})`
        );
        await sleep(RETRY_DELAY_MS);
        return sendRequest(attemptNum + 1);
      }

      return response.data;
    }
  } catch (error) {
    console.error(`❌ 第 ${attemptNum} 次请求出错:`, error.message);

    // 网络错误或超时，自动重试
    if (attemptNum < MAX_RETRY_ATTEMPTS) {
      console.log(
        `等待 ${RETRY_DELAY_MS}ms 后重试... (${attemptNum}/${MAX_RETRY_ATTEMPTS})`
      );
      await sleep(RETRY_DELAY_MS);
      return sendRequest(attemptNum + 1);
    }

    throw error;
  }
}

/**
 * 睡眠函数
 * @param {number} ms - 睡眠毫秒数
 */
function sleep(ms) {
  return new Promise((resolve) => setTimeout(resolve, ms));
}

// 定时任务配置
const TARGET_HOUR = 9; // 目标小时（24小时制）
const TARGET_MINUTE = 0; // 目标分钟
const TARGET_SECOND = 0; // 目标秒数
const ADVANCE_TIME_MS = 2000; // 提前准备时间(毫秒)
const MAX_RETRY_ATTEMPTS = 5; // 最大重试次数
const RETRY_DELAY_MS = 1000; // 重试间隔(毫秒)

/**
 * 等待到指定时间然后执行预约
 */
async function scheduleBooking() {
  // 计算目标时间
  const now = new Date();
  const targetTime = new Date(
    now.getFullYear(),
    now.getMonth(),
    now.getDate(),
    TARGET_HOUR,
    TARGET_MINUTE,
    TARGET_SECOND
  );

  // 如果目标时间已过，则立即执行
  if (now >= targetTime) {
    console.log("目标时间已过，立即执行预约...");
    await sendRequest();
    return;
  }

  // 计算等待时间（减去提前准备时间）
  const waitTime = targetTime.getTime() - now.getTime() - ADVANCE_TIME_MS;

  // 打印等待信息
  const waitMinutes = Math.floor(waitTime / 60000);
  const waitSeconds = Math.floor((waitTime % 60000) / 1000);
  console.log(
    `将在 ${TARGET_HOUR}:${TARGET_MINUTE.toString().padStart(
      2,
      "0"
    )} 发送预约请求`
  );
  console.log(`等待时间: ${waitMinutes}分${waitSeconds}秒后开始准备`);

  // 等待到指定时间前的准备时间
  await sleep(waitTime);

  console.log(`⏰ 已到达准备时间，${ADVANCE_TIME_MS / 1000}秒后将发送请求...`);
  console.log("请求信息:", {
    日期: bookingData.reserveDate,
    时间段: bookingData.appointTimeList.join(", "),
    场地: coordinatesList.join(", "),
  });

  // 再等待准备时间
  await sleep(ADVANCE_TIME_MS);

  console.log("🚀 准时发送预约请求!");

  // 执行预约请求
  try {
    const result = await sendRequest();
    if (result.success) {
      console.log("🎉 成功预约场地!");
    } else {
      console.error("💔 最终预约失败:", result.message);
    }
  } catch (error) {
    console.error("💔 预约过程出错:", error.message);
  }
}

// 启动定时预约
scheduleBooking();
