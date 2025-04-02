var body = $response.body;
let jsonData = JSON.parse(body);

// 提取第一个元素
let firstElement = jsonData.resultData.content[0];

// 获取当前时间
const now = new Date();
const year = now.getFullYear();
const month = String(now.getMonth() + 1).padStart(2, "0");
const day = String(now.getDate()).padStart(2, "0");
const currentDate = `${year}-${month}-${day}`;

// 设置预期的时间格式
const desiredTime = "21:30-22:30";
const createTime = "10:30:25";

// 修改第一个元素中的时间字段
if (firstElement) {
  // 修改reserveDate为当前日期
  firstElement.reserveDate = currentDate;

  // 修改bookingtime格式 "YYYY-MM-DD HH:MM-HH:MM"
  firstElement.bookingtime = `${currentDate} ${desiredTime}`;

  // 修改reserveTime数组
  firstElement.reserveTime = [desiredTime];

  // 修改createdate (今天的创建时间)
  firstElement.createdate = `${currentDate} ${createTime}`;

  // 打印修改成功信息
  console.log(`订单修改成功：${firstElement.nodename}`);
  console.log(`预约时间已修改为：${firstElement.bookingtime}`);

  // 使用通知功能（如果环境支持）
  if (typeof $notify === "function") {
    $notify(
      "预约修改成功",
      `场馆: ${firstElement.nodename}`,
      `时间: ${currentDate} ${desiredTime}`
    );
  }
}

// 转换回JSON字符串
body = JSON.stringify(jsonData);

$done({ body });
