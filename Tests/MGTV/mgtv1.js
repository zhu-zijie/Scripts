const originalHeaders = $request.headers;
const newHeaders = {};

for (const headerName in originalHeaders) {
  if (
    headerName !== "Cookie" &&
    headerName !== "x-r-i" &&
    headerName !== "x-l-r-i"
  ) {
    newHeaders[headerName] = originalHeaders[headerName];
  }
}

$done({ headers: newHeaders });
