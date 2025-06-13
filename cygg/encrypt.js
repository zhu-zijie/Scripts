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

// const detailData = { bookingno: "填自己的" };
// console.log(Encrypt(JSON.stringify(detailData)));

// const orderData = { pageNumber: 1, pageSize: 10, ordertype: 1 };
// console.log(Encrypt(JSON.stringify(orderData)));

// 个人预约数据
// url = "https://cgyy.xju.edu.cn/service/appointment/appointment/phone/getPersonalBookingNode";
// const queryData = {
//   nodeid: "814927354769186816",
//   reserveTime: ["19:30-20:30"],
//   reserveDate: "2025-06-10",
//   accompanyPerson: [],
//   reservationPerson: "107552300697",
// };
// console.log(Encrypt(JSON.stringify(queryData)));

// 南区羽毛球包场全天预约信息
// url = "https://cgyy.xju.edu.cn/service/appointment/appointment/phone/createBookingBytime"
const bookingData = {
  unitPrice: "5",
  nodeList: [{ sitename: "南区羽毛球馆4号场", nodeid: "814925570327715840" }], // 几号场ID
  payprice: "0",
  appointmentDate: "2025-06-14",
  timeList: [
    { time: "10:30", status: "0" },
    { time: "11:30", status: "0" },
    { time: "12:30", status: "0" },
    { time: "13:30", status: "1" },
    { time: "15:30", status: "0" },
    { time: "16:30", status: "0" },
    { time: "17:30", status: "0" },
    { time: "18:30", status: "1" },
    { time: "19:30", status: "0" },
    { time: "20:30", status: "0" },
    { time: "21:30", status: "0" },
    { time: "22:30", status: "1" },
  ],
  coordinatesList: ["0-1", "0-2"],
  appointTimeList: ["11:30-12:30", "12:30-13:30"],
  reserveDate: "2025-06-14",
  booktype: 2,
  appointmentType: 2,
  nodeid: "814925270195904512", // 场馆ID
};
console.log(Encrypt(JSON.stringify(bookingData)));

// url = https://cgyy.xju.edu.cn/service/appointment/appointment/phone/bookingByTime
// ('{"nodeid":"814925270195904512","selectdate":"2025-06-10"}');
// const bookingByTimeData = {
//   nodeid: "814925270195904512",
//   selectdate: "2025-06-10",
// };
// console.log(Encrypt(JSON.stringify(bookingByTimeData)));
