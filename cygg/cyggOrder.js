// 仅供测试使用，禁止用于商业用途
// 2025-04-02
const $ = new Env("新大体育馆");
$.isNode() && require("dotenv").config();
const desiredTime = $.isNode()
  ? process.env.TIME_PERIOD
  : $.getdata("time_period") || "19:30-20:30";
let body = $response.body;
let jsonData = JSON.parse(body);

// 获取当前时间
const now = new Date();
const year = now.getFullYear();
const month = String(now.getMonth() + 1).padStart(2, "0");
const day = String(now.getDate()).padStart(2, "0");
const currentDate = `${year}-${month}-${day}`;

// 设置可用的时间段
const timeSlots = desiredTime;
const createTime = "10:30:25";

// 获取需要修改的元素（从索引1开始）
const elementsToUpdate = jsonData.resultData.content[1];
const updatedElements = [];

// 使用循环修改每个元素
for (let i = 0; i < elementsToUpdate.length; i++) {
  const element = elementsToUpdate[i];
  if (!element) continue;

  // 为每个元素分配不同的时间段
  const desiredTime = timeSlots[i % timeSlots.length];

  // 修改reserveDate为当前日期
  element.reserveDate = currentDate;

  // 修改bookingtime格式 "YYYY-MM-DD HH:MM-HH:MM"
  element.bookingtime = `${currentDate} ${desiredTime}`;

  // 修改reserveTime数组
  element.reserveTime = [desiredTime];

  // 修改createdate
  element.createdate = `${currentDate} ${createTime}`;

  // 记录已更新的元素和对应的时间段
  updatedElements.push({
    element: element,
    timeSlot: desiredTime,
  });

  // 打印修改成功信息
  console.log(`订单修改成功：${element.nodename}`);
  console.log(`预约时间已修改为：${element.bookingtime}`);
}

if (typeof $notify === "function" && updatedElements.length > 0) {
  const venueInfo = updatedElements
    .map(
      (item, index) =>
        `场馆${index + 1}: ${item.element.nodename} (${item.timeSlot})`
    )
    .join("\n");

  $notify(
    `已修改 ${updatedElements.length} 个预约`,
    `时间: ${currentDate}\n${venueInfo}`
  );
}

// 转换回JSON字符串
body = JSON.stringify(jsonData);
$done({ body });
