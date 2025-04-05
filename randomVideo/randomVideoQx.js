// 添加调试信息
console.log("脚本被执行");

// 从远程加载HTML
function loadRemoteHTML() {
  // 替换为您的远程HTML文件URL
  const remoteURL =
    "https://raw.githubusercontent.com/zhu-zijie/Scripts/main/randomVideo/randomVideo.html";

  $httpClient.get(remoteURL, function (error, response, data) {
    if (error) {
      console.log("加载远程HTML失败:", error);
      // 加载失败时返回错误信息
      const errorResponse = {
        status: "HTTP/1.1 500 Internal Server Error",
        headers: { "Content-Type": "text/html" },
        body:
          "<html><body><h1>无法加载视频播放器</h1><p>错误信息: " +
          error +
          "</p></body></html>",
      };
      $done(errorResponse);
      return;
    }

    // 成功获取远程HTML
    console.log("成功加载远程HTML");
    const htmlResponse = {
      status: "HTTP/1.1 200 OK",
      headers: { "Content-Type": "text/html;charset=UTF-8" },
      body: data,
    };

    $done(htmlResponse);
  });
}

// 如果请求存在，记录请求信息
if ($request) {
  console.log("请求URL:", $request.url);
  console.log("请求方法:", $request.method);
}

// 执行远程HTML加载
loadRemoteHTML();
