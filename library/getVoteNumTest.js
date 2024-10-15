/**
 * 通过access_token获取票数
 *
 */

const axios = require("axios");

const url = `https://vote.diyi.cn/api/activity/1?page=12&page_count=10`;
const method = `GET`;
const headers = {
  "Sec-Fetch-Dest": `empty`,
  Connection: `keep-alive`,
  "Accept-Encoding": `gzip, deflate, br`,
  "Content-Type": `application/json`,
  "Sec-Fetch-Site": `same-origin`,
  Origin: `https://vote.diyi.cn`,
  "User-Agent": `Mozilla/5.0 (iPhone; CPU iPhone OS 16_6_1 like Mac OS X) AppleWebKit/605.1.15 (KHTML, like Gecko) Mobile/15E148 MicroMessenger/8.0.33(0x18002129) NetType/WIFI Language/en`,
  Authorization: `Bearer 17b3bf90bf5995a471f1abdfb08616d0`,
  "Sec-Fetch-Mode": `cors`,
  Host: `vote.diyi.cn`,
  Referer: `https://vote.diyi.cn/h5/index.html`,
  "Accept-Language": `en-US,en;q=0.9`,
  Accept: `*/*`,
};
const body = ``;

const myRequest = {
  url: url,
  method: method,
  headers: headers,
  data: body,
  responseType: "arraybuffer",
};

axios(myRequest)
  .then((response) => {
    const decodedData = Buffer.from(response.data, "binary").toString("utf-8");
    const jsonData = JSON.parse(decodedData);
    const currentTime = new Date().toLocaleString();
    const voteNum = jsonData.data.data.data[4].total_vote;
    const title = jsonData.data.data.data[4].title;
    console.log(`${title}\n当前时间: ${currentTime}, 当前票数: ${voteNum}`);
  })
  .catch((error) => {
    console.log(error.message);
  });
