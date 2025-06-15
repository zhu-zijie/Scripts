const https = require("https");
const zlib = require("zlib");

// HTTP请求工具函数
const httpRequest = (url, options) => {
  return new Promise((resolve, reject) => {
    const req = https.request(url, options, (res) => {
      console.log(`📡 HTTP状态码: ${res.statusCode}`);
      // console.log(`📋 响应头:`, {
      //   "content-type": res.headers["content-type"],
      //   "content-encoding": res.headers["content-encoding"],
      //   "content-length": res.headers["content-length"],
      // });

      let data = [];

      // 处理gzip压缩
      let stream = res;
      if (res.headers["content-encoding"] === "gzip") {
        console.log("🗜️ 检测到gzip压缩，正在解压...");
        stream = res.pipe(zlib.createGunzip());
      } else if (res.headers["content-encoding"] === "deflate") {
        console.log("🗜️ 检测到deflate压缩，正在解压...");
        stream = res.pipe(zlib.createInflate());
      } else if (res.headers["content-encoding"] === "br") {
        console.log("🗜️ 检测到br压缩，正在解压...");
        stream = res.pipe(zlib.createBrotliDecompress());
      }

      stream.on("data", (chunk) => {
        data.push(chunk);
      });

      stream.on("end", () => {
        try {
          const responseText = Buffer.concat(data).toString("utf8");
          // console.log(`📄 响应数据长度: ${responseText.length} 字符`);
          // console.log(`📝 响应前200字符: ${responseText.substring(0, 200)}...`);

          const jsonData = JSON.parse(responseText);
          console.log(`✅ JSON解析成功`);
          resolve(jsonData);
        } catch (parseError) {
          console.log("❌ JSON解析失败:", parseError.message);
          // const responseText = Buffer.concat(data).toString("utf8");
          // console.log(
          //   "原始数据前500字符:",
          //   responseText.substring(0, 500) + "..."
          // );
          reject(new Error("解析JSON失败: " + parseError.message));
        }
      });

      stream.on("error", (streamError) => {
        console.log("❌ 数据流错误:", streamError.message);
        reject(streamError);
      });
    });

    req.on("error", (requestError) => {
      console.log("❌ HTTP请求错误:", requestError.message);
      reject(requestError);
    });

    req.end();
  });
};

module.exports = httpRequest;
