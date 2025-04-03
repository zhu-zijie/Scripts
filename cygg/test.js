const axios = require("axios");

const url = `https://cgyy.xju.edu.cn/service/appointment/appointment/phone/payOrderDetails`;
const method = `POST`;
const headers = {
  "Sec-Fetch-Dest": `empty`,
  Connection: `keep-alive`,
  "Accept-Encoding": `gzip, deflate, br`,
  "Content-Type": `application/json`,
  "Sec-Fetch-Site": `same-origin`,
  Origin: `https://cgyy.xju.edu.cn`,
  "User-Agent": `Mozilla/5.0 (iPhone; CPU iPhone OS 16_6_1 like Mac OS X) AppleWebKit/605.1.15 (KHTML, like Gecko) CriOS/134.0.6998.33 Mobile/15E148 Safari/604.1`,
  token: `填自己的token`,
  "Sec-Fetch-Mode": `cors`,
  Referer: `https://cgyy.xju.edu.cn/`,
  Host: `cgyy.xju.edu.cn`,
  "Accept-Language": `en-US,en;q=0.9`,
  Accept: `*/*`,
};
const bodyData = JSON.parse(`{"item":"encrypt自己生成"}`);

async function makeRequest() {
  try {
    const response = await axios({
      url: url,
      method: method,
      headers: headers,
      data: bodyData,
    });

    console.log(response.data);
  } catch (error) {
    console.error("Request failed:", error.message);
    if (error.response) {
      console.error("Status:", error.response.status);
      console.error("Response data:", error.response.data);
    }
  }
}

makeRequest();
