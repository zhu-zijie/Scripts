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
const desiredTime = "21:30-23:30";
const createTime = "10:30:00";
const payTime = "10:32:15";

// 替换支付时间
body = body.replace(
  /"paytime":"\d{4}-\d{2}-\d{2} \d{2}:\d{2}-\d{2}:\d{2}"/,
  `"paytime":"${yesterday} ${payTime}"`
);

// 替换预定时间
body = body.replace(
  /"bookingtime":"(\d{4}-\d{2}-\d{2}) (\d{2}:\d{2}-\d{2}:\d{2})"/,
  `"bookingtime":"${currentDate} ${desiredTime}"`
);

// 替换订单生成时间
body = body.replace(
  /"paytime":"\d{4}-\d{2}-\d{2} \d{2}:\d{2}-\d{2}:\d{2}"/,
  `"paytime":"${yesterday} ${createTime}"`
);

$done({ body });
