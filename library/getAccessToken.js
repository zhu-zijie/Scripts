/**
 * 将获取到的accessToken写入csv文件
 * 注意事项：1.把需要读写的csv文件在第一行必须插入表头（手机号，姓名）
 *          2.在37行把文件名修改为你要读取的文件名
 *          3.有条件的建议修改一下请求头里的User-Agent字段（不修改也行）
 *          4.只能读取csv文件，excel文件建议转换成csv文件格式，并且是utf-8编码的，写入的文件名为access_tokens.csv，自己手动创建放在同一目录下即可
 *
 */

const axios = require("axios");
const fs = require("fs");
const path = require("path");
const csv = require("csv-parser");

// 请求头，方式，链接
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

// 写入csv文件的路径
const writeCsvFilePath = path.join("./", "access_tokens.csv");
// 写入csv文件的表头
fs.writeFileSync(writeCsvFilePath, "AccessToken\n", "utf8");

/* // （推荐使用）读取csv文件的路径，文件名.csv换成你要读取的文件
const readCsvFilePath = path.join("./", "号码.csv");
// 定义一个数组来存储结果
const results = [];
// 读取csv文件内的手机号码，姓名
async function readCsvFile() {
  return new Promise((resolve, reject) => {
    fs.createReadStream(readCsvFilePath, { encoding: "utf8" })
      .pipe(csv())
      .on("data", (data) => {
        const phoneNumber = data["手机号"];
        const name = data["姓名"];
        results.push({ phoneNumber, name });
      })
      .on("end", () => {
        console.log("读取完成！");
        resolve();
      })
      .on("error", (error) => {
        reject(error);
      });
  });
}

// 构造请求体并发送请求
async function sendRequests() {
  const startTime = Date.now(); // 记录开始时间

  const promises = results.map((result, index) => {
    return new Promise((resolve) => {
      setTimeout(async () => {
        const body = `{"mobile":"${result.phoneNumber}","username":"${result.name}","address":"湖北省武汉市洪山区中国地质大学"}`;
        const myRequest = {
          url: url,
          method: method,
          headers: headers,
          data: body,
          responseType: "arraybuffer",
        };
        // 发送请求
        try {
          const response = await axios(myRequest);
          const decodedData = Buffer.from(response.data, "binary").toString(
            "utf-8"
          );
          const jsonData = JSON.parse(decodedData);
          const accessToken = jsonData.data.access_token;
          console.log("Access Token:", accessToken);
          fs.appendFileSync(writeCsvFilePath, `${accessToken}\n`, {
            flag: "a",
            encoding: "utf8",
          });
        } catch (error) {
          console.error("Error message:", error.message);
          console.error(
            "Error response:",
            error.response ? error.response.data : "No response data"
          );
        }
        resolve();
      }, index * 3000); // 每个请求延迟 index * 3000 毫秒
    });
  });

  await Promise.all(promises); // 等待所有请求完成

  const endTime = Date.now(); // 记录结束时间
  const totalTime = (endTime - startTime) / 1000; // 计算总时间（秒）
  console.log(`一共消耗: ${totalTime} seconds`);
}

// 主函数
async function main() {
  try {
    await readCsvFile();
    await sendRequests();
  } catch (error) {
    console.error("Error:", error);
  }
}

main(); */

/* // 读取csv文件内的手机号码，姓名
fs.createReadStream(readCsvFilePath, { encoding: "utf8" })
  .pipe(csv())
  .on("data", (data) => {
    // console.log(data);
    const phoneNumber = data["手机号"];
    const name = data["姓名"];
    results.push({ phoneNumber, name });
  })
  .on("end", () => {
    console.log("读取完成！");
    sendRequests();
  });

// 构造请求体并发送请求
function sendRequests() {
  results.forEach((result, index) => {
    setTimeout(() => {
      const body = `{"mobile":"${result.phoneNumber}","username":"${result.name}","address":"湖北省武汉市洪山区中国地质大学"}`;
      const myRequest = {
        url: url,
        method: method,
        headers: headers,
        data: body,
        responseType: "arraybuffer",
      };
      // 发送请求
      axios(myRequest)
        .then((response) => {
          const decodedData = Buffer.from(response.data, "binary").toString(
            "utf-8"
          );
          const jsonData = JSON.parse(decodedData);
          const accessToken = jsonData.data.access_token;
          console.log("Access Token:", accessToken);
          fs.appendFileSync(writeCsvFilePath, `${accessToken}\n`, {
            flag: "a",
            encoding: "utf8",
          });
        })
        .catch((error) => {
          console.error("Error message:", error.message);
          console.error(
            "Error response:",
            error.response ? error.response.data : "No response data"
          );
        });
    }, index * 3000); // 每个请求延迟 index * 3000 毫秒
  });
} */

// 随机号码和姓名
// 随机生成手机号码
function generateRandomPhoneNumber() {
  const prefix = "156"; // 手机号码的前缀
  const randomNumber = Math.floor(Math.random() * 90000000) + 10000000; // 后八位为随机数
  return prefix + randomNumber;
}

// 随机生成用户名
function generateRandomUsername() {
  const surnames = [
    "李",
    "王",
    "张",
    "刘",
    "陈",
    "杨",
    "赵",
    "黄",
    "周",
    "吴",
    "朱",
    "孙",
    "马",
    "胡",
    "郭",
    "林",
    "何",
    "高",
    "梁",
    "郑",
    "罗",
    "宋",
    "谢",
    "韩",
    "唐",
    "冯",
    "于",
    "董",
    "萧",
    "程",
    "曹",
    "袁",
    "邓",
    "许",
    "傅",
    "沈",
    "曾",
    "彭",
    "吕",
    "苏",
    "卢",
    "蒋",
    "蔡",
    "贾",
    "丁",
    "魏",
    "薛",
    "叶",
    "阎",
    "余",
    "潘",
    "杜",
    "戴",
    "夏",
    "钟",
    "汪",
    "田",
    "任",
    "姜",
    "范",
    "方",
    "石",
    "姚",
    "谭",
    "邹",
    "孔",
    "毛",
    "邱",
    "秦",
  ];
  const names = [
    "伟",
    "芳",
    "娜",
    "敏",
    "静",
    "丽",
    "强",
    "磊",
    "军",
    "洋",
    "梓",
    "雯",
    "雨",
    "晓",
    "明",
    "超",
    "婷",
    "涛",
    "浩",
    "紫薇",
    "浩洋",
    "梓涵",
    "梓轩",
    "梓熙",
    "博文",
    "伟泽",
    "伟诚",
    "明轩",
    "修杰",
    "思蕊",
    "",
  ];
  const surname = surnames[Math.floor(Math.random() * surnames.length)];
  const name = names[Math.floor(Math.random() * names.length)];
  return surname + name;
}

// 发送请求
function sendRequests() {
  for (let i = 0; i < 100; i++) {
    // 间隔3秒发送一次请求
    setTimeout(() => {
      // 构造请求体
      const randomPhoneNumber = generateRandomPhoneNumber();
      const randomName = generateRandomUsername();
      const body = `{"mobile":"${randomPhoneNumber}","username":"${randomName}","address":"湖北省武汉市洪山区中国地质大学"}`;

      // 封装请求
      const myRequest = {
        url: url,
        method: method,
        headers: headers,
        data: body,
        responseType: "arraybuffer",
      };

      // 发送请求
      axios(myRequest)
        .then((response) => {
          // 将响应转化为字符串
          // const decodedData = Buffer.from(response.data, 'binary').toString('utf-8');
          // console.log(response.status + "\n\n" + decodedData);
          const decodedData = Buffer.from(response.data, "binary").toString(
            "utf-8"
          );
          // 转化为Json对象
          const jsonData = JSON.parse(decodedData);
          // 获取access_token
          const accessToken = jsonData.data.access_token;
          console.log("Access Token:", accessToken);
          // 将access_token写入csv文件
          fs.appendFileSync(writeCsvFilePath, `${accessToken}\n`, {
            flag: "a",
            encoding: "utf8",
          });
        })
        .catch((error) => {
          console.log(error.message);
        });
    }, i * 3000);
  }
}

const startTime = Date.now(); // 记录开始时间
sendRequests(); // 发送请求
const endTime = Date.now(); // 记录结束时间
const totalTime = (endTime - startTime) / 1000; // 计算总时间（秒）
console.log(`一共消耗: ${totalTime} seconds`);
