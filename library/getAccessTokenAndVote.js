/* 
注意事项：
    1. 本脚本用于投票，每次投票需要一个手机号码和姓名，所以需要随机生成手机号码和姓名
    2. 本脚本使用axios发送请求，需要安装axios   ----> 安装的命令：npm install axios
    3. 本脚本使用的是POST请求，请求头中包含了Authorization字段，这个字段是登录后获取的access_token
    4. voteUrl是投票的链接，其中的115是投票的id，可以根据实际情况修改
    5. 本脚本是在node环境下运行的，可以使用node getAccessTokenAndVote.js命令运行或者使用vscode的Run Code插件运行(建议后者)
    6. address字段的地址自己根据情况调整
    7. i * 2000 + Math.random() * 1000 这个2000代表2秒，1000代表1秒，math.random() * 1000代表0-1秒的随机数，所以每次请求的间隔是2-3秒,以此类推
    8. headers中的User-Agent字段是模拟手机端的请求头，可以根据实际情况修改(//是这行代码不运行的意思，自己从下面选择一个即可)
    9. 不要将时间调整的太短，否则会被封IP，理性投票
*/

const axios = require("axios");

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
  //"User-Agent": 'Mozilla/5.0 (iPhone; CPU iPhone OS 16_6 like Mac OS X) AppleWebKit/605.1.15 (KHTML, like Gecko) Mobile/15E148 MicroMessenger/8.0.33(0x18002129) NetType/WIFI Language/en',
  //"User-Agent": 'Mozilla/5.0 (Linux; Android 8.0.0; SM-G955U Build/R16NW) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/116.0.0.0 Mobile Safari/537.36',
  //"User-Agent": 'Mozilla/5.0 (iPhone; CPU iPhone OS 16_6 like Mac OS X) AppleWebKit/605.1.15 (KHTML, like Gecko) Version/16.6 Mobile/15E148 Safari/604.1',
  "User-Agent": 'Mozilla/5.0 (Linux; Android 13; SM-G981B) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/116.0.0.0 Mobile Safari/537.36',
  Authorization: ``,
  "Sec-Fetch-Mode": `cors`,
  Host: `vote.diyi.cn`,
  Referer: `https://vote.diyi.cn/h5/index.html`,
  "Accept-Language": `en-US,en;q=0.9`,
  Accept: `*/*`,
};

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
  const promises = [];
  for (let i = 0; i < 100; i++) {
    const promise = new Promise((resolve, reject) => {
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
            const decodedData = Buffer.from(response.data, "binary").toString(
              "utf-8"
            );
            // 转化为Json对象
            const jsonData = JSON.parse(decodedData);
            // 获取access_token
            const accessToken = jsonData.data.access_token;
            const voteUrl = `https://vote.diyi.cn/api/activity/vote/115`;
            myRequest.url = voteUrl;
            myRequest.headers["Authorization"] = `Bearer ${accessToken}`;
            console.log("Access Token:", accessToken);
            axios(myRequest)
              .then((response) => {
                const decodedData = Buffer.from(
                  response.data,
                  "binary"
                ).toString("utf-8");
                const jsonData = JSON.parse(decodedData);
                const residueNum = jsonData.data.residue_num;
                console.log("投票成功! 剩余票数：" + residueNum);
                resolve(); // 将 Promise 标记为已完成
              })
              .catch((error) => {
                console.log("投票失败，错误信息：" + error.message);
                reject(error); // 将 Promise 标记为失败
              });
          })
          .catch((error) => {
            console.log(error.message);
          });
      }, i * 2000 + Math.random() * 1000); //2-3秒运行一次
    });
    promises.push(promise);
  }
  return Promise.all(promises);
}

const startTime = Date.now(); // 记录开始时间
sendRequests()
  .then(() => {
    const endTime = Date.now(); // 记录结束时间
    const totalTime = (endTime - startTime) / 1000; // 计算总时间（秒）
    console.log(`--------- 一共消耗: ${totalTime} seconds ---------`);
  })
  .catch((error) => {
    console.log("Error in sending requests:", error);
  });
