/**
 * 通过access_token发送请求
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
  body: body,
  responseType: "arraybuffer",
};

// 创建一个数组来存储AccessToken
const accessTokens = [];

// 创建读取流并解析CSV文件
/* fs.createReadStream(csvFilePath, { encoding: "utf8" })
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
  }); */

// 读取CSV文件
fs.createReadStream(csvFilePath, { encoding: "utf8" })
  .on("data", (data) => {
    // 将读取到的数据按行分割，并去掉每行末尾的\n
    const lines = data.split("\n");
    const tokens = lines.slice(1, -1).map((token) => token.trim()); // 跳过第一行
    accessTokens.push(...tokens);
  })
  .on("end", () => {
    console.log("读取完成！");
    sendRequests();
  })
  .on("error", (error) => {
    console.error("Error reading CSV file:", error);
  });

// 发送请求
function sendRequests() {
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
          } else {
            console.log("投票失败，状态码：" + response.status);
          }
        })
        .catch((error) => {
          console.log("请求失败，错误信息：" + error.message);
        });
    }, index * (Math.random() * (10000 - 5000) + 5000)); // 5-10秒的随机间隔
  });
}
