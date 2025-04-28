const axios = require("axios");

const url = `https://cgyy.xju.edu.cn/service/appointment/appointment/phone/payOrderForPhone`;
const method = `POST`;
const headers = {
  "Sec-Fetch-Dest": `empty`,
  Connection: `keep-alive`,
  "Accept-Encoding": `gzip, deflate, br`,
  "Content-Type": `application/json`,
  "Sec-Fetch-Site": `same-origin`,
  Origin: `https://cgyy.xju.edu.cn`,
  "User-Agent": `Mozilla/5.0 (iPhone; CPU iPhone OS 16_6_1 like Mac OS X) AppleWebKit/605.1.15 (KHTML, like Gecko) CriOS/134.0.6998.33 Mobile/15E148 Safari/604.1`,
  // token: `填自己的token`,
  "Sec-Fetch-Mode": `cors`,
  Referer: `https://cgyy.xju.edu.cn/`,
  Host: `cgyy.xju.edu.cn`,
  "Accept-Language": `en-US,en;q=0.9`,
  Accept: `*/*`,
};

const bodyData = {
  // item: "encrypt自己生成",
};

async function makeRequest() {
  try {
    const response = await axios({
      url: url,
      method: method,
      headers: headers,
      data: bodyData,
    });
    const responseData = JSON.stringify(response.data);
    return responseData;
  } catch (error) {
    console.error("请求失败:", error.message);
    if (error.response) {
      console.error("状态码:", error.response.status);
      console.error("响应数据:", JSON.stringify(error.response.data));
      console.error("响应头:", JSON.stringify(error.response.headers));
    } else if (error.request) {
      console.error("未收到响应，请求信息:", error.request);
    } else {
      console.error("请求配置出错:", error.config);
    }
    throw error;
  }
}

makeRequest()
  .then((result) => {
    console.log("请求成功完成，返回数据:", result);
  })
  .catch((error) => {
    console.log("请求最终处理失败，错误:", error.message);
  });
