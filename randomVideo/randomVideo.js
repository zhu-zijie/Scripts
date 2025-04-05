// node环境随机播放视频
const http = require("http");

const channelAddr = [
  "http://api.qemao.com/api/douyin",
  "https://api.kuleu.com/api/MP4_xiaojiejie",
];

const server = http.createServer((req, res) => {
  if (req.url === "/") {
    res.writeHead(200, { "Content-Type": "text/html" });
    res.end(`
      <!DOCTYPE html>
      <html lang="en">
      <head>
        <meta charset="UTF-8">
        <meta name="viewport" content="width=device-width, initial-scale=1.0">
        <title>Random Video</title>
        <style>
          body, html {
            margin: 0;
            padding: 0;
            height: 100%;
            background-color: black;
          }
          video {
            width: 100%;
            height: 100%;
          }
            #playButton {
              position: absolute;
              top: 50%;
              left: 50%;
              transform: translate(-50%, -50%);
              padding: 10px 20px;
              font-size: 16px;
              background-color: white;
              border: none;
              cursor: pointer;
    }
        </style>
      </head>
      <body>
        <video id="video" controls></video>
        <button id="playButton">开始播放</button>
        <script>
          const channelAddr = ${JSON.stringify(channelAddr)};
          const videoElement = document.getElementById('video');
          const playButton = document.getElementById('playButton');
          

          // 添加按钮点击事件监听器
          playButton.addEventListener('click', () => {
            playRandomVideo();
            playButton.style.display = 'none'; // 隐藏按钮
          });


          // 随机播放视频
          function playRandomVideo() {
            const url = channelAddr[Math.floor(Math.random() * channelAddr.length)];
            videoElement.src = url;
            videoElement.play().then(() => {
              console.log("Video is playing from URL:", url);
            }).catch(error => {
              console.error("Error occurred while trying to play the video:", error);
              playRandomVideo(); // 自动播放下一个随机视频
            });
          }

          // 当视频播放结束时，播放下一个随机视频
          videoElement.addEventListener('ended', playRandomVideo);
        </script>
      </body>
      </html>
    `);
  } else {
    res.writeHead(404, { "Content-Type": "text/plain" });
    res.end("Not Found");
  }
});

const PORT = 3000;
server.listen(PORT, () => {
  console.log(`Server is running at http://localhost:${PORT}`);
});
