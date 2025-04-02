// 仅供测试使用，禁止用于商业用途
// 2025-04-02

var body = $response.body;
let jsonData = JSON.parse(body);

// 提取第一个元素
let element = jsonData.resultData;

// 获取当前日期
const now = new Date();
const year = now.getFullYear();
const month = String(now.getMonth() + 1).padStart(2, "0");
const day = String(now.getDate()).padStart(2, "0");
const currentDate = `${year}-${month}-${day}`;

// 获取前一天的日期
const yesterday = new Date(now);
yesterday.setDate(now.getDate() - 1);
const yesterdayYear = yesterday.getFullYear();
const yesterdayMonth = String(yesterday.getMonth() + 1).padStart(2, "0");
const yesterdayDay = String(yesterday.getDate()).padStart(2, "0");
const yesterdayDate = `${yesterdayYear}-${yesterdayMonth}-${yesterdayDay}`;

// 设置预期的时间格式
const desiredTime = "19:30-22:30";
const createTime = "10:30:00";
const payTime = "10:32:15";

if (element) {
  // 修改reserveDate为当前日期
  element.paytime = `${yesterdayDate} ${payTime}`;

  // 修改bookingtime格式 "YYYY-MM-DD HH:MM-HH:MM"
  element.bookingtime = `${currentDate} ${desiredTime}`;

  // 修改createdate
  element.createdate = `${yesterdayDate} ${createTime}`;

  element.username = "祝子杰";

  // 打印修改成功信息
  console.log(`订单修改成功：${element.username}`);
  console.log(`预约时间已修改为：${element.bookingtime}`);

  // 使用通知功能（如果环境支持）
  if (typeof $notify === "function") {
    $notify(
      "预约修改成功",
      `用户: ${element.username}`,
      `时间: ${currentDate} ${desiredTime}`
    );
  }
}

// 转换回JSON字符串
body = JSON.stringify(jsonData);
$done({ body });
