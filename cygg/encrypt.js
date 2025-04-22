// 导入 CryptoJS 库
const CryptoJS = require("crypto-js");
// 定义加密所需变量
const a = CryptoJS;
const t = a.enc.Utf8.parse("0102030405060708"); // 16字节密钥
const i = a.enc.Utf8.parse("0102030405060708"); // 16字节IV

function Encrypt(e) {
  var n = a.enc.Utf8.parse(e);
  var o = a.AES.encrypt(n, t, {
    iv: i,
    mode: a.mode.CBC,
    padding: a.pad.Pkcs7,
  });
  return o.ciphertext.toString().toUpperCase();
}

// function Decrypt(e) {
//   var n = a.enc.Hex.parse(e);
//   var o = a.enc.Base64.stringify(n);
//   var r = a.AES.decrypt(o, t, {
//     iv: i,
//     mode: a.mode.CBC,
//     padding: a.pad.Pkcs7,
//   });
//   var s = r.toString(a.enc.Utf8);
//   return s.toString();
// }

let data = { bookingno: "填自己的" };

console.log(Encrypt(JSON.stringify(data)));
