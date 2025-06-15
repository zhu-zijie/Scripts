/**
 * 羽毛球场地预约系统 -- 仅供学习和参考使用
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
const coordinatesList = ["4-0", "4-1", "4-2"]; // 场地坐标
const appointTimeList = ["19:30-20:30", "20:30-21:30", "21:30-22:30"]; // 预约时段
const price = String(appointTimeList.length * 2000); // 计算价格

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
  payprice: price,
  appointmentDate: tomorrowDate,
  timeList: [
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
  txamt: price,
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
 */
async function sendRequest() {
  console.log("开始发送羽毛球场地预约请求...");

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
    console.log(`发送请求到: ${url}`);
    console.log("请求信息:", {
      场地: bookingData.nodeList[0].sitename,
      日期: bookingData.reserveDate,
      时间段: bookingData.appointTimeList.join(", "),
      价格: bookingData.payprice,
      时段数: appointTimeList.length,
      场地数: coordinatesList.length,
    });

    // 使用axios发送请求
    const response = await axios.post(url, requestBody, {
      headers: headers,
      timeout: 15000, // 设置超时时间
    });

    // 输出响应结果
    console.log("响应状态:", response.status);
    console.log("响应数据:", response.data);

    return response.data;
  } catch (error) {
    if (error.response) {
      // 服务器响应了，但状态码超出了2xx范围
      console.error("服务器错误:", error.response.status);
      console.error("错误详情:", error.response.data);
    } else if (error.request) {
      // 请求已发送但没有收到响应
      console.error("请求超时或网络错误");
    } else {
      // 请求设置出错
      console.error("请求配置错误:", error.message);
    }
    throw error;
  }
}

// 执行预约
sendRequest()
  .then((result) => {
    if (result.success) {
      console.log("✅ 预约成功!");
    } else {
      console.error("❌ 预约失败:", result.message);
    }
  })
  .catch((error) => console.error("程序执行错误:", error.message));
