/**
 * 通过手机号，姓名获取access_token
 *
 */

const axios = require("axios");

const getAccessTokenUrl = `https://vote.diyi.cn/api/auth/login_by_code`;
const method = `POST`;
const headers = {
  "Sec-Fetch-Dest": `empty`,
  Connection: `keep-alive`,
  "Accept-Encoding": `gzip, deflate, br`,
  "Content-Type": `application/json`,
  "Sec-Fetch-Site": `same-origin`,
  Origin: `https://vote.diyi.cn`,
  "User-Agent": `Mozilla/5.0 (iPhone; CPU iPhone OS 16_6 like Mac OS X) AppleWebKit/605.1.15 (KHTML, like Gecko) Mobile/15E148 MicroMessenger/8.0.33(0x18002129) NetType/WIFI Language/en`,
  Authorization: ``,
  "Sec-Fetch-Mode": `cors`,
  Host: `vote.diyi.cn`,
  Referer: `https://vote.diyi.cn/h5/index.html`,
  "Accept-Language": `en-US,en;q=0.9`,
  Accept: `*/*`,
};
const body = `{"mobile":"手机号","username":"姓名","address":"地址"}`;

const myRequest = {
  url: getAccessTokenUrl,
  method: method,
  headers: headers,
  data: body,
  responseType: "arraybuffer",
};

axios(myRequest)
  .then((response) => {
    const decodedData = Buffer.from(response.data, "binary").toString("utf-8");
    // 转化为Json对象
    const jsonData = JSON.parse(decodedData);
    // 获取access_token
    const accessToken = jsonData.data.access_token;
    console.log("Access Token:", accessToken);
  })
  .catch((error) => {
    console.log(error.message);
  });
