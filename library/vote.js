/**
 * 通过accessToken进行投票
 *
 */

const axios = require("axios");
const fs = require("fs");
const csv = require("csv-parser");
const path = require("path");

// 指定CSV文件路径
const csvFilePath = path.join("./", "access_tokens.csv");

// 请求头，链接，方式
const url = `https://vote.diyi.cn/api/activity/vote/115`;
const method = `POST`;
const headers = {
  "Sec-Fetch-Dest": `empty`,
  Connection: `keep-alive`,
  "Accept-Encoding": `gzip, deflate, br`,
  "Content-Type": `application/json`,
  "Sec-Fetch-Site": `same-origin`,
  Origin: `https://vote.diyi.cn`,
  "User-Agent": `Mozilla/5.0 (iPhone; CPU iPhone OS 16_6_1 like Mac OS X) AppleWebKit/605.1.15 (KHTML, like Gecko) Mobile/15E148 MicroMessenger/8.0.33(0x18002129) NetType/WIFI Language/en`,
  Authorization: ``,
  "Sec-Fetch-Mode": `cors`,
  Host: `vote.diyi.cn`,
  Referer: `https://vote.diyi.cn/h5/index.html`,
  "Accept-Language": `en-US,en;q=0.9`,
  Accept: `*/*`,
};

// 请求体
const body = `{}`;

// 封装请求
const myRequest = {
  url: url,
  method: method,
  headers: headers,
  data: body,
  responseType: "arraybuffer",
};

// 创建一个数组来存储AccessToken
const accessTokens = [];
// 创建读取流并解析CSV文件
fs.createReadStream(csvFilePath, { encoding: "utf8" })
  .pipe(csv())
  .on("data", (accessToken) => {
    // console.log(accessToken.AccessToken);
    if (accessToken.AccessToken) {
      accessTokens.push(accessToken.AccessToken);
    }
  })
  .on("end", () => {
    console.log("读取完成！");
    sendRequests();
  });

// 发送请求
function sendRequests() {
  let successfulVotes = 0; // 计数器，记录成功投票的次数

  accessTokens.forEach((token, index) => {
    setTimeout(() => {
      myRequest.headers["Authorization"] = `Bearer ${token}`;
      // console.log(myRequest.headers);
      axios(myRequest)
        .then((response) => {
          if (response.status === 200) {
            const resp = Buffer.from(response.data, "binary").toString("utf-8");
            const jsonRespond = JSON.parse(resp);
            const residueNum = jsonRespond.data.residue_num;
            console.log("投票成功! 剩余票数：" + residueNum);
            successfulVotes++; // 成功投票计数器加1
          } else {
            console.log("投票失败，状态码：" + response.status);
          }
        })
        .catch((error) => {
          console.log("请求失败，错误信息：" + error.message);
        })
        .finally(() => {
          // 检查是否所有请求都已完成
          if (index === accessTokens.length - 1) {
            console.log(`投票结束！成功投票次数：${successfulVotes}`);
          }
        });
    }, index * (Math.random() * (10000 - 4000) + 10000)); // 10-16秒的随机间隔
  });
}
