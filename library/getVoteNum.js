/**
 * 通过手机号、姓名、地址获取票数
 *
 */

const axios = require("axios");

// 请求头，链接，方式
const url = `https://vote.diyi.cn/api/auth/login_by_code`;
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

// 自己修改手机号、姓名、地址
const body = `{"mobile":"13584802094","username":"张雨涵","address":"湖北省武汉市洪山区中国地质大学"}`;

// 封装请求
const myRequest = {
  url: url,
  method: method,
  headers: headers,
  data: body,
  responseType: "arraybuffer",
};

// 获取AccessToken
function getAccessToken() {
  return axios(myRequest)
    .then((response) => {
      const decodedData = Buffer.from(response.data, "binary").toString(
        "utf-8"
      );
      // 转化为Json对象
      const jsonData = JSON.parse(decodedData);
      // 获取access_token
      const accessToken = jsonData.data.access_token;
      // console.log("Access Token:", accessToken);
      return accessToken;
    })
    .catch((error) => {
      console.log(error.message);
    });
}

// 获取票数
getAccessToken().then((accessToken) => {
  const newUrl = "https://vote.diyi.cn/api/activity/1?page=12&page_count=10";
  const newMethod = "GET";
  const newBody = "";
  const newRequest = {
    url: newUrl,
    method: newMethod,
    headers: {
      ...myRequest.headers,
      Authorization: `Bearer ${accessToken}`,
    },
    data: newBody,
    responseType: "arraybuffer",
  };
  axios(newRequest)
    .then((response) => {
      const decodedData = Buffer.from(response.data, "binary").toString(
        "utf-8"
      );
      const jsonData = JSON.parse(decodedData);
      const currentTime = new Date().toLocaleString();
      const voteNum = jsonData.data.data.data[4].total_vote;
      const title = jsonData.data.data.data[4].title;
      console.log(`${title}\n当前时间: ${currentTime}, 当前票数: ${voteNum}`);
    })
    .catch((error) => {
      console.log(error.message);
    });
});
