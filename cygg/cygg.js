const axios = require("axios");
const CryptoJS = require("crypto-js");

const t = CryptoJS.enc.Utf8.parse("0102030405060708"); // 16字节密钥
const i = CryptoJS.enc.Utf8.parse("0102030405060708"); // 16字节IV
const url = `https://cgyy.xju.edu.cn/service/appointment/appointment/phone/payOrderForPhone`;
const method = `POST`;
let orderData = { pageNumber: 1, pageSize: 10, ordertype: 1 };
let bodyData = { item: Encrypt(JSON.stringify(orderData)) };
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

const response = axios({
  url: url,
  method: method,
  headers: headers,
  data: bodyData,
});
const responseData = JSON.stringify(response.data);
console.log("请求成功完成，返回数据:", responseData);

function Encrypt(e) {
  var n = a.enc.Utf8.parse(e);
  var o = a.AES.encrypt(n, t, {
    iv: i,
    mode: a.mode.CBC,
    padding: a.pad.Pkcs7,
  });
  return o.ciphertext.toString().toUpperCase();
}
