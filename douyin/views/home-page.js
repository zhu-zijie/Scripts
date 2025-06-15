// 首页HTML模板
const generateHomePage = () => {
  return `
<!DOCTYPE html>
<html>
<head>
    <title>抖音视频搜索</title>
    <meta charset="utf-8">
    <meta name="viewport" content="width=device-width, initial-scale=1">
    <style>
        body { 
            font-family: Arial, sans-serif; 
            margin: 0; 
            padding: 20px; 
            background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
            min-height: 100vh;
            color: white;
            text-align: center;
        }
        .container { 
            max-width: 600px; 
            margin: 100px auto;
        }
        h1 { 
            color: #fff; 
            font-size: 2.5em;
            margin-bottom: 30px;
            text-shadow: 2px 2px 4px rgba(0,0,0,0.3);
        }
        .search-form { 
            background: rgba(255, 255, 255, 0.1); 
            backdrop-filter: blur(10px);
            padding: 30px; 
            border-radius: 15px; 
            margin-bottom: 30px;
            border: 1px solid rgba(255, 255, 255, 0.2);
            box-shadow: 0 8px 32px rgba(0,0,0,0.1);
        }
        input { 
            padding: 15px; 
            width: 70%; 
            border: none; 
            border-radius: 8px; 
            font-size: 16px;
            margin-bottom: 20px;
            background: rgba(255, 255, 255, 0.9);
            color: #333;
        }
        button { 
            padding: 15px 30px; 
            background: linear-gradient(45deg, #ff6b6b, #ff8e8e);
            color: white; 
            border: none; 
            border-radius: 8px; 
            cursor: pointer; 
            font-size: 16px;
            transition: all 0.3s;
            box-shadow: 0 4px 15px rgba(255, 107, 107, 0.3);
        }
        button:hover { 
            transform: translateY(-2px);
            box-shadow: 0 6px 20px rgba(255, 107, 107, 0.4);
        }
        .api-link {
            margin-top: 20px;
            padding: 15px;
            background: rgba(255, 255, 255, 0.1);
            backdrop-filter: blur(10px);
            border-radius: 10px;
            border: 1px solid rgba(255, 255, 255, 0.2);
        }
        .api-link a {
            color: #4CAF50;
            text-decoration: none;
            font-family: monospace;
        }
        .api-link a:hover {
            text-decoration: underline;
        }
    </style>
</head>
<body>
    <div class="container">
        <h1>🎥 抖音视频搜索</h1>
        <div class="search-form">
            <form onsubmit="searchVideos(event)">
                <input type="text" id="searchInput" placeholder="输入搜索关键词，例如：美女、舞蹈、搞笑" required>
                <br>
                <button type="submit">🔍 搜索视频</button>
            </form>
        </div>
        
        <div class="api-link">
            <h3>📡 API接口</h3>
            <p>直接访问API获取JSON数据：</p>
            <a href="/search?keyword=美女" target="_blank">
                /search?keyword=美女
            </a>
        </div>
    </div>

    <script>
        function searchVideos(event) {
            event.preventDefault();
            const keyword = document.getElementById('searchInput').value;
            if (keyword.trim()) {
                window.location.href = '/play?keyword=' + encodeURIComponent(keyword);
            }
        }
        
        // 回车键搜索
        document.getElementById('searchInput').addEventListener('keypress', function(e) {
            if (e.key === 'Enter') {
                searchVideos(e);
            }
        });
    </script>
</body>
</html>`;
};

module.exports = generateHomePage;
