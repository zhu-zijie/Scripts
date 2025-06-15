// 错误页面HTML模板
const generateErrorPage = (error, keyword = "") => {
  return `
<!DOCTYPE html>
<html>
<head>
    <title>搜索出错</title>
    <meta charset="utf-8">
    <meta name="viewport" content="width=device-width, initial-scale=1">
    <style>
        body { 
            font-family: Arial, sans-serif; 
            margin: 0; 
            padding: 20px; 
            background: #000;
            color: white;
            text-align: center;
        }
        .container { 
            max-width: 600px; 
            margin: 100px auto;
        }
        .error-icon {
            font-size: 4em;
            margin-bottom: 20px;
        }
        h1 { 
            color: #ff6b6b; 
            margin-bottom: 20px;
        }
        .error-message {
            background: #333;
            padding: 20px;
            border-radius: 10px;
            margin: 20px 0;
            font-family: monospace;
        }
        .back-button {
            padding: 15px 30px; 
            background: #ff6b6b; 
            color: white; 
            border: none; 
            border-radius: 8px; 
            cursor: pointer; 
            font-size: 16px;
            text-decoration: none;
            display: inline-block;
            margin: 10px;
        }
        .back-button:hover {
            background: #ff5252;
        }
    </style>
</head>
<body>
    <div class="container">
        <div class="error-icon">❌</div>
        <h1>搜索出错</h1>
        <div class="error-message">
            <strong>错误信息:</strong><br>
            ${error}
        </div>
        ${keyword ? `<p>搜索关键词: <strong>${keyword}</strong></p>` : ""}
        
        <a href="/" class="back-button">🏠 返回首页</a>
        <a href="javascript:history.back()" class="back-button">⬅️ 返回上页</a>
        
        <div style="margin-top: 30px; color: #888;">
            <p>可能的解决方案:</p>
            <ul style="text-align: left; display: inline-block;">
                <li>检查网络连接</li>
                <li>尝试其他搜索关键词</li>
                <li>稍后再试</li>
                <li>检查服务器配置</li>
            </ul>
        </div>
    </div>
</body>
</html>`;
};

module.exports = generateErrorPage;
