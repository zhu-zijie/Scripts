/**
 * 羽毛球场地预约系统 -- 仅供学习和参考使用
 * 提前5-10分钟启动脚本，自动等待到9点整发送预约请求
 */

const axios = require("axios");
const CryptoJS = require("crypto-js");

const tomorrowDate = getTomorrowDate();
const TARGET_HOUR = 9; // 目标小时（24小时制）
const TARGET_MINUTE = 0; // 目标分钟
const TARGET_SECOND = 0; // 目标秒数
const ADVANCE_TIME_MS = 2000; // 提前准备时间(毫秒)
const MAX_RETRY_ATTEMPTS = 1000; // 最大重试次数
const RETRY_DELAY_MS = 1000; // 重试间隔(毫秒)
const coordinatesList = ["4-0", "4-1", "4-2"]; // 场地坐标
const appointTimeList = ["19:30-20:30", "20:30-21:30", "21:30-22:30"]; // 预约时段
const noRetryErrors = ["限购"]; // 不重试的错误信息
const TOKEN =
  "eyJhbGciOiJSUzI1NiJ9.eyJleHAiOjE3NTgwMzQ4MjYsIk9wZXJhdG9yIjoie1wiaWRzZXJpYWxcIjpcIjEwNzU1MjMwMDY5N1wiLFwibWVzc2FnZXR5cGVcIjpcIjBcIixcInBjb2RlXCI6XCIxMVwiLFwiY291bnRyeWNvZGVcIjpcIjE1NlwiLFwiaWRzZXJpYWwyXCI6XCI0MjEwMjMxOTk5MTEwMzI0MTJcIixcInNleFwiOlwiMVwiLFwicmVtYXJrXCI6XCI2NTZkZjYyYzEwOGJmNDgxNTFmMGY0MmM1OTY1NzJhZVwiLFwibmF0aW9uY29kZVwiOlwiMDFcIixcIm9yZ2lkXCI6MixcImlkZW50aXR5bm9cIjpcIjQyMTAyMzE5OTkxMTAzMjQxMlwiLFwic2Nob29sc3RhdHVzXCI6XCIxXCIsXCJkZXBhcnRpZFwiOjgxMTUsXCJ0ZWxcIjpcIjE1ODI2NjE4MjkzXCIsXCJpZFwiOjEwMTkyMTIxODE5NDM3NTQ3NTIsXCJpbnB1dGRhdGVcIjoxNzE1ODYwMjEzMDAwLFwidXNlcm5hbWVcIjpcIuacseaym-aWh1wifSIsInN1YiI6ImRhdGFsb29rIn0.Lui9CfJY-irtuQt_gWSTqMzllDwcclMJCZGt2a1t0Z9UGb_nz8ktSadeOHa8Iolkf0DBMg9orUUtd1w2ZMlYr0ShDx6hwfOWg4qpiRF3sPxWTQpKWCZqhPJs2ihLCIiQTo4NnLBe8m2hcL5KjJyCtborVZ7Vk52m7ZH5mxArwy8clTRzCB_Zcsm6iBpn7jhQho8GEYDSAp0OW5wSV43Gi6lpld4fNWUGDgjX0jzDZUpG55BYUt7DRMjSZSHmvzcE9CcOjKHf5JedPOun5MR7tn8xR-E3zP0n-qdd7gjSDWMipnJX0dJnhLYUgI3O8i9MR9gSImDGuo3Ma5xUCvl2wg";

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

// 预约参数配置
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
    "token": TOKEN,
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
      } else {
        console.error(
          `❌ 预约最终失败，已达到最大重试次数 (${MAX_RETRY_ATTEMPTS})`
        );
        return response.data;
      }
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
    } else {
      console.error(
        `❌ 网络请求最终失败，已达到最大重试次数 (${MAX_RETRY_ATTEMPTS})`
      );
      return { success: false, message: `网络请求失败: ${error.message}` };
    }
  }
}

/**
 * 睡眠函数
 * @param {number} ms - 睡眠毫秒数
 */
function sleep(ms) {
  return new Promise((resolve) => setTimeout(resolve, ms));
}

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
