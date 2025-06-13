/**
 * 羽毛球场地自动查询与预约系统 -- 仅供学习和参考使用
 * 1. 先查询可用场地
 * 2. 自动选择最佳场地
 * 3. 在9点准时发送预约请求
 */

const axios = require("axios");
const CryptoJS = require("crypto-js");
const readline = require("readline");

// =============== 配置区域 ===============
// 定时任务配置
const TARGET_HOUR = 9; // 目标小时（24小时制）
const TARGET_MINUTE = 0; // 目标分钟
const TARGET_SECOND = 0; // 目标秒数
const ADVANCE_TIME_MS = 2000; // 提前准备时间(毫秒)
const MAX_RETRY_ATTEMPTS = 5; // 最大重试次数
const RETRY_DELAY_MS = 1000; // 重试间隔(毫秒)

// 预约时间偏好 - 按优先级排序
const PREFERRED_TIMES = [
  "19:30-20:30",
  "20:30-21:30",
  "21:30-12:30",
  "11:30-12:30",
  "12:30-13:30",
];

// 预约场地偏好 - 按优先级排序 (0开始计数)
const PREFERRED_COURTS = [4, 3, 5, 2, 6, 1, 7, 0]; // 偏好5、4、6号场地...

// 认证令牌
const TOKEN =
  "eyJhbGciOiJSUzI1NiJ9.eyJleHAiOjE3NTU3MzQ2NTksIk9wZXJhdG9yIjoie1wiaWRzZXJpYWxcIjpcIjEwNzU1MjMwMDY5N1wiLFwibWVzc2FnZXR5cGVcIjpcIjBcIixcInBjb2RlXCI6XCIxMVwiLFwiY291bnRyeWNvZGVcIjpcIjE1NlwiLFwiaWRzZXJpYWwyXCI6XCI0MjEwMjMxOTk5MTEwMzI0MTJcIixcInNleFwiOlwiMVwiLFwicmVtYXJrXCI6XCI2NTZkZjYyYzEwOGJmNDgxNTFmMGY0MmM1OTY1NzJhZVwiLFwibmF0aW9uY29kZVwiOlwiMDFcIixcIm9yZ2lkXCI6MixcImlkZW50aXR5bm9cIjpcIjQyMTAyMzE5OTkxMTAzMjQxMlwiLFwic2Nob29sc3RhdHVzXCI6XCIxXCIsXCJkZXBhcnRpZFwiOjgxMTUsXCJ0ZWxcIjpcIjE1ODI2NjE4MjkzXCIsXCJpZFwiOjEwMTkyMTIxODE5NDM3NTQ3NTIsXCJpbnB1dGRhdGVcIjoxNzE1ODYwMjEzMDAwLFwidXNlcm5hbWVcIjpcIuacseaym-aWh1wifSIsInN1YiI6ImRhdGFsb29rIn0.V2IuTpDemz6_JDj35LvHqIxFrusdurjtxCoIqtFmYhPEbuCRLejml7qDmdIXJxl1g4RQyQWS5NOf8GvJhlLkB7zaWLKSwDLDyRoSHV3LMhNbFUzTcJAjcpYYGZ61xh9Sq2u4xJnI7mh4OgvCTaFZioKG6J10xhnspeiJgAfwGgZFQs4nSdZq0QecIPTXOH7u-h5K9bHhHaU56t9FDBDrUZMN41Tos4q_WvpCkG-RcFUEO9J2rE93rED4QDF5ew0Z5IQt851nUWzIYt89kJnx4MWNaaPPiWC3OOv7HzRM3u5P2---l2238FHNh8RWM-lKkWjaUP87EvrQTsMUD6DBeQ";

// =============== 工具函数 ===============
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
 * 构建请求头
 */
// prettier-ignore
function getHeaders() {
  return {
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
}

/**
 * 睡眠函数
 * @param {number} ms - 睡眠毫秒数
 */
function sleep(ms) {
  return new Promise((resolve) => setTimeout(resolve, ms));
}

// =============== 查询相关函数 ===============
/**
 * 获取场地预约信息
 * @param {string} date - 预约日期，格式 YYYY-MM-DD
 * @returns {Promise<Object>} - 预约信息
 */
async function getBookingInfo(date) {
  const url =
    "https://cgyy.xju.edu.cn/service/appointment/appointment/phone/bookingByTime";
  const BADMINTON_COURT_ID = "814925270195904512"; // 南区羽毛球馆ID

  console.log(`🔍 查询日期: ${date}`);

  // 准备请求数据
  const bookingData = {
    nodeid: BADMINTON_COURT_ID,
    selectdate: date,
  };

  // 加密请求数据
  const encryptedData = encrypt(JSON.stringify(bookingData));
  const body = { item: encryptedData };

  try {
    console.log(`📤 发送查询请求...`);
    const startTime = Date.now();

    const response = await axios.post(url, body, {
      headers: getHeaders(),
      timeout: 10000, // 设置10秒超时
    });

    const endTime = Date.now();
    console.log(`✅ 查询成功! 耗时: ${endTime - startTime}ms`);

    return response.data;
  } catch (error) {
    if (error.response) {
      console.error(`🔴 服务器响应错误: ${error.response.status}`);
      if (error.response.data) {
        console.error(
          `详细信息:`,
          JSON.stringify(error.response.data, null, 2)
        );
      }
    } else if (error.request) {
      console.error(`🔴 请求超时或网络错误`);
    } else {
      console.error(`🔴 请求配置错误:`, error.message);
    }
    throw error;
  }
}

/**
 * 解析预约数据并找出可用场地
 * @param {Object} responseData - 服务器响应数据
 * @returns {Object} - 解析结果
 */
function parseAvailableCourts(responseData) {
  if (!responseData.success || !responseData.resultData) {
    throw new Error(`请求失败: ${responseData.message || "未知错误"}`);
  }

  const { timeList, nodeList, conflictList } = responseData.resultData;

  // 创建冲突集合，提高查找效率
  const conflictSet = new Set(conflictList);

  // 创建表格数据
  const courtTable = Array(nodeList.length)
    .fill()
    .map(() => Array(timeList.length).fill(""));

  // 可用场地列表
  const availableSlots = [];

  // 处理场地和时间数据
  for (let courtIndex = 0; courtIndex < nodeList.length; courtIndex++) {
    const court = nodeList[courtIndex];

    for (let timeIndex = 0; timeIndex < timeList.length; timeIndex++) {
      const timeSlot = timeList[timeIndex];

      // 检查时间是否可用
      if (timeSlot.status === "1") {
        courtTable[courtIndex][timeIndex] = "⛔"; // 不可用时间
        continue;
      }

      // 检查是否已被预约
      const slotKey = `${courtIndex}-${timeIndex}`;
      if (conflictSet.has(slotKey)) {
        courtTable[courtIndex][timeIndex] = "❌"; // 已预约
      } else {
        courtTable[courtIndex][timeIndex] = "✅"; // 可预约

        // 添加到可用列表
        availableSlots.push({
          court: court.sitename,
          courtId: court.nodeid,
          time: timeSlot.time,
          endTime: `${parseInt(timeSlot.time) + 1}:30`,
          timeIndex,
          courtIndex,
          coordinateStr: `${courtIndex}-${timeIndex}`,
        });
      }
    }
  }

  return {
    date:
      responseData.resultData.reserveDate ||
      responseData.resultData.bookingenddate,
    timeList: timeList,
    courts: nodeList, // 返回完整的场地信息而非仅名称
    courtTable,
    available: availableSlots.length,
    slots: availableSlots,
    rawData: responseData,
  };
}

/**
 * 格式化输出场地可用状态表格
 * @param {Object} bookingData - 解析后的预约数据
 */
function displayBookingTable(bookingData) {
  const { date, timeList, courts, courtTable, available, slots } = bookingData;

  console.log(`\n📅 预约日期: ${date}`);
  console.log(`🏸 可用场地数量: ${available}\n`);

  // 创建表头 - 使用更紧凑的布局
  let header = "场地号      ";
  timeList.forEach((time) => {
    header += `${time.time} `.padEnd(8);
  });
  console.log(header);

  // 创建分隔线
  console.log("-".repeat(header.length));

  // 显示每个场地的可用状态
  courts.forEach((court, courtIndex) => {
    // 简化表格中的场地显示
    let courtName = court.sitename.replace("南区羽毛球馆", "");
    let row = `${courtName}`.padEnd(8);

    courtTable[courtIndex].forEach((status) => {
      row += `${status}       `;
    });
    console.log(row);
  });

  // 场地ID列表(调试使用)
  //   console.log("\n📋 场地ID列表:");
  //   courts.forEach((court) => {
  //     let courtName = court.sitename.replace("南区羽毛球馆", "");
  //     console.log(`${courtName}: ${court.nodeid}`);
  //   });

  // 可用场地详情
  if (available > 0) {
    console.log("\n✨ 可预约场地:");

    // 按时间段排序
    const sortedSlots = [...slots].sort((a, b) => {
      // 首先按时间排序
      if (a.timeIndex !== b.timeIndex) {
        return a.timeIndex - b.timeIndex;
      }
      // 时间相同则按场地排序
      return a.courtIndex - b.courtIndex;
    });

    sortedSlots.forEach((slot, index) => {
      console.log(
        `${index + 1}. ${slot.court.replace("南区羽毛球馆", "")} [${
          slot.time
        }-${slot.endTime}] 坐标:${slot.coordinateStr} ID:${slot.courtId}`
      );
    });
  } else {
    console.log("\n😢 当前没有可用场地");
  }
}

/**
 * 自动选择最佳场地和时间 - 优先选择单场地连续时段
 * @param {Object} bookingData - 解析后的预约数据
 * @returns {Object} - 选择的场地和时间信息
 */
function selectBestCourtAndTime(bookingData) {
  const { slots, timeList } = bookingData;

  if (slots.length === 0) {
    throw new Error("没有可用场地");
  }

  // 构建时间段到索引的映射
  const timeMap = new Map();
  timeList.forEach((time, index) => {
    const nextTime = `${parseInt(time.time) + 1}:30`;
    const timeRange = `${time.time}-${nextTime}`;
    timeMap.set(timeRange, index);
  });

  // 按场地对可用时段进行分组
  const slotsByCourtIndex = {};
  for (const slot of slots) {
    if (!slotsByCourtIndex[slot.courtIndex]) {
      slotsByCourtIndex[slot.courtIndex] = [];
    }
    slotsByCourtIndex[slot.courtIndex].push(slot);
  }

  // 获取连续时段 (相邻时间段)
  function getConsecutiveTimeSlots(courtSlots) {
    // 按时间索引排序
    courtSlots.sort((a, b) => a.timeIndex - b.timeIndex);

    const consecutive = [];
    let currentChain = [courtSlots[0]];

    for (let i = 1; i < courtSlots.length; i++) {
      const current = courtSlots[i];
      const prev = courtSlots[i - 1];

      // 如果是连续的时间段
      if (current.timeIndex === prev.timeIndex + 1) {
        currentChain.push(current);
      } else {
        // 不连续，保存当前链并开始新链
        consecutive.push([...currentChain]);
        currentChain = [current];
      }
    }

    // 添加最后一个链
    consecutive.push(currentChain);

    // 按长度排序，优先选择最长的连续时间段
    return consecutive.sort((a, b) => b.length - a.length);
  }

  // 存储最佳选择
  let bestSelection = null;
  let bestScore = -1;

  // 1. 优先考虑场地偏好顺序
  for (const preferredCourtIndex of PREFERRED_COURTS) {
    const courtSlots = slotsByCourtIndex[preferredCourtIndex];
    if (!courtSlots || courtSlots.length === 0) continue;

    // 获取该场地的连续时段
    const consecutiveSlots = getConsecutiveTimeSlots(courtSlots);

    for (const chain of consecutiveSlots) {
      // 只考虑至少两个连续时段的链
      if (chain.length < 2) continue;

      // 计算分数 (基于时间偏好和连续长度)
      let score = chain.length * 10; // 连续长度得分

      // 加上时间偏好得分
      for (const slot of chain) {
        const timeRange = `${slot.time}-${slot.endTime}`;
        const preferredIndex = PREFERRED_TIMES.indexOf(timeRange);
        if (preferredIndex !== -1) {
          score += (PREFERRED_TIMES.length - preferredIndex) * 5;
        }
      }

      // 如果这是最佳分数，保存选择
      if (score > bestScore) {
        bestScore = score;

        // 限制最多取前3个时段
        const limitedChain = chain.slice(0, 3);

        bestSelection = {
          coordinatesList: limitedChain.map((s) => s.coordinateStr),
          appointTimeList: limitedChain.map((s) => `${s.time}-${s.endTime}`),
          timeIndices: limitedChain.map((s) => s.timeIndex),
          courtIndex: preferredCourtIndex,
          courtName: limitedChain[0].court,
          success: true,
        };
      }
    }

    // 如果我们已经找到了连续3个时段，直接返回
    if (bestSelection && bestSelection.coordinatesList.length === 3) {
      return bestSelection;
    }
  }

  // 2. 如果没有找到理想的连续时段，尝试找单个最佳时段
  if (!bestSelection) {
    // 按偏好对时间排序
    const preferredSlots = [...slots].sort((a, b) => {
      const timeRangeA = `${a.time}-${a.endTime}`;
      const timeRangeB = `${b.time}-${b.endTime}`;

      const preferredIndexA = PREFERRED_TIMES.indexOf(timeRangeA);
      const preferredIndexB = PREFERRED_TIMES.indexOf(timeRangeB);

      // 如果都不在偏好列表中，按场地偏好排序
      if (preferredIndexA === -1 && preferredIndexB === -1) {
        const courtA = PREFERRED_COURTS.indexOf(a.courtIndex);
        const courtB = PREFERRED_COURTS.indexOf(b.courtIndex);
        return courtA - courtB;
      }

      // 如果只有一个在偏好列表中，优先选择那个
      if (preferredIndexA === -1) return 1;
      if (preferredIndexB === -1) return -1;

      // 两个都在偏好列表中，按偏好顺序排序
      return preferredIndexA - preferredIndexB;
    });

    if (preferredSlots.length > 0) {
      const bestSlot = preferredSlots[0];
      bestSelection = {
        coordinatesList: [bestSlot.coordinateStr],
        appointTimeList: [`${bestSlot.time}-${bestSlot.endTime}`],
        timeIndices: [bestSlot.timeIndex],
        courtIndex: bestSlot.courtIndex,
        courtName: bestSlot.court,
        success: true,
      };
    }
  }

  // 3. 如果仍然没有找到，返回失败
  if (!bestSelection) {
    return { success: false };
  }

  return bestSelection;
}

// =============== 预约相关函数 ===============
/**
 * 发送羽毛球场地预约请求
 * @param {Object} bookingData - 预约参数
 * @param {number} attemptNum - 当前尝试次数
 * @returns {Promise<Object>} - 预约结果
 */
async function sendBookingRequest(bookingData, attemptNum = 1) {
  console.log(`开始第 ${attemptNum} 次预约尝试...`);

  const url =
    "https://cgyy.xju.edu.cn/service/appointment/appointment/phone/createBookingBytime";

  // 加密请求数据
  const encryptedData = encrypt(JSON.stringify(bookingData));
  const requestBody = { item: encryptedData };

  try {
    const response = await axios.post(url, requestBody, {
      headers: getHeaders(),
      timeout: 10000, // 缩短超时时间，快速失败以便重试
    });

    console.log(`第 ${attemptNum} 次预约请求响应状态: ${response.status}`);

    if (response.data.success) {
      console.log("✅ 预约成功!");
      console.log("预约详情:", response.data.resultData || response.data);
      return response.data;
    } else {
      console.error(`❌ 第 ${attemptNum} 次预约失败: ${response.data.message}`);

      const noRetryErrors = [
        "已被预约",
        "您已预约",
        "已预约过",
        "不在开放时间",
        "限购,预约值已达最大",
      ];

      const shouldRetry = !noRetryErrors.some((msg) =>
        response.data.message.includes(msg)
      );

      if (attemptNum < MAX_RETRY_ATTEMPTS && shouldRetry) {
        console.log(
          `等待 ${RETRY_DELAY_MS}ms 后重试... (${attemptNum}/${MAX_RETRY_ATTEMPTS})`
        );
        await sleep(RETRY_DELAY_MS);
        return sendBookingRequest(bookingData, attemptNum + 1);
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
      return sendBookingRequest(bookingData, attemptNum + 1);
    }

    throw error;
  }
}

/**
 * 等待到指定时间然后执行预约
 * @param {Object} bookingData - 预约参数
 */
async function scheduleBooking(bookingData) {
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
    await sendBookingRequest(bookingData);
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
    场地: bookingData.coordinatesList.join(", "),
  });

  // 再等待准备时间
  await sleep(ADVANCE_TIME_MS);

  console.log("🚀 准时发送预约请求!");

  // 执行预约请求
  try {
    const result = await sendBookingRequest(bookingData);
    if (result.success) {
      console.log("🎉 成功预约场地!");
    } else {
      console.error("💔 最终预约失败:", result.message);
    }
  } catch (error) {
    console.error("💔 预约过程出错:", error.message);
  }
}

/**
 * 创建用户交互界面，让用户确认预约选择
 */
function createUserInterface() {
  const rl = readline.createInterface({
    input: process.stdin,
    output: process.stdout,
  });

  return {
    confirm: (message) => {
      return new Promise((resolve) => {
        rl.question(`${message} (y/n): `, (answer) => {
          resolve(
            answer.toLowerCase() === "y" || answer.toLowerCase() === "yes"
          );
        });
      });
    },
    close: () => {
      rl.close();
    },
  };
}

// =============== 主程序 ===============
async function main() {
  try {
    console.log("🏸 羽毛球场地自动查询与预约系统启动");
    console.log(`⏰ 当前时间: ${new Date().toLocaleString()}`);

    // 获取明天的日期
    const tomorrowDate = getTomorrowDate();

    // 1. 查询可用场地
    console.log("\n第1步: 查询可用场地");
    const bookingResponse = await getBookingInfo(tomorrowDate);
    const bookingData = parseAvailableCourts(bookingResponse);

    // 显示可用场地
    displayBookingTable(bookingData);

    // 2. 自动选择最佳场地和时间
    console.log("\n第2步: 自动选择最佳场地和时间");

    if (bookingData.available === 0) {
      console.error("❌ 没有可用场地，无法进行预约");
      return;
    }

    const selection = selectBestCourtAndTime(bookingData);

    if (!selection.success) {
      console.error("❌ 无法找到合适的场地和时间");
      return;
    }

    console.log("📌 系统自动选择的预约信息:");
    console.log(`场地: ${selection.courtName.replace("南区羽毛球馆", "")}`);
    console.log(`时间段: ${selection.appointTimeList.join(", ")}`);
    console.log(`坐标: ${selection.coordinatesList.join(", ")}`);

    // 3. 用户确认
    const ui = createUserInterface();
    const confirmed = await ui.confirm("是否确认使用以上选择进行预约?");

    if (!confirmed) {
      console.log("❌ 用户取消了预约");
      ui.close();
      return;
    }

    ui.close();

    // 4. 准备预约数据
    console.log("\n第3步: 准备预约数据");

    // 构建完整的预约数据
    const fullBookingData = {
      unitPrice: "5",
      nodeList: bookingData.courts,
      payprice: "0",
      appointmentDate: tomorrowDate,
      timeList: bookingData.timeList,
      coordinatesList: selection.coordinatesList,
      appointTimeList: selection.appointTimeList,
      reserveDate: tomorrowDate,
      booktype: 2,
      appointmentType: 2,
      nodeid: "814925270195904512", // 场馆ID
    };

    console.log("预约数据准备完成,等待9点发送请求");

    // 5. 定时发送预约请求
    console.log("\n第4步: 定时发送预约请求");
    await scheduleBooking(fullBookingData);
  } catch (error) {
    console.error(`❌ 程序执行错误: ${error.message}`);
    process.exit(1);
  }
}

// 启动程序
main();
