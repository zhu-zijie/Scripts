// 仅供测试使用，禁止用于商业用途
// 2025-04-02

var body = $response.body;

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

// 先进行文本替换
body = body.replace(
  /"paytime" : "\d{4}-\d{2}-\d{2} \d{2}:\d{2}:\d{2}"/,
  `"paytime" : "${yesterdayDate} ${payTime}"`
);

body = body.replace(
  /"bookingtime" : "(\d{4}-\d{2}-\d{2}) (\d{2}:\d{2}:\d{2})"/,
  `"bookingtime" : "${currentDate} ${desiredTime}"`
);

body = body.replace(
  /"createdate" : "\d{4}-\d{2}-\d{2} \d{2}:\d{2}:\d{2}"/,
  `"createdate" : "${yesterdayDate} ${createTime}"`
);

body = body.replace(/"username" : "([^"]*)"/, '"username" : "祝子杰"');

$done({ body });
