// 获取原始请求头
const originalHeaders = $request.headers;

// 创建新的请求头对象
const newHeaders = {};

// 复制所有不需要过滤的请求头
for (const headerName in originalHeaders) {
  // 跳过需要移除的三个请求头
  if (
    headerName !== "Cookie" &&
    headerName !== "x-r-i" &&
    headerName !== "x-l-r-i"
  ) {
    newHeaders[headerName] = originalHeaders[headerName];
  }
}

// 返回处理后的请求头
$done({ headers: newHeaders });
