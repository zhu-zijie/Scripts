/**
 * 页面加载完成后执行的初始化函数
 * 设置动态线条背景和页面交互效果
 */
document.addEventListener("DOMContentLoaded", function () {
  // 获取Canvas元素
  const canvas = document.getElementById("bgCanvas");
  const ctx = canvas.getContext("2d");

  // 设置Canvas尺寸为窗口大小
  canvas.width = window.innerWidth;
  canvas.height = window.innerHeight;

  // 根据屏幕大小调整线条数量
  function getLineCount() {
    // 计算屏幕面积（像素数）
    // const screenArea = window.innerWidth * window.innerHeight;

    // 对于小屏幕设备（如手机）减少线条数量
    if (window.innerWidth <= 768) {
      return 100; // 手机设备使用更少线条
    } else if (window.innerWidth <= 1024) {
      return 200; // 平板设备使用中等数量线条
    } else {
      return 300; // 桌面设备使用较多线条
    }
  }

  // 动态设置线条数量
  const lineCount = getLineCount();
  const lines = []; // 存储线条对象的数组

  // 当窗口大小改变时，重新设置Canvas尺寸
  window.addEventListener("resize", function () {
    canvas.width = window.innerWidth;
    canvas.height = window.innerHeight;
    const newLineCount = getLineCount();
    if (newLineCount !== lines.length) {
      lines.length = 0; // 清空数组
      for (let i = 0; i < newLineCount; i++) {
        lines.push(new Line());
      }
    }
  });

  // 定义线条类
  class Line {
    constructor() {
      this.reset();
    }

    // 重置线条位置和速度
    reset() {
      this.x = Math.random() * canvas.width;
      this.y = Math.random() * canvas.height;
      this.vx = (Math.random() - 0.5) * 1;
      this.vy = (Math.random() - 0.5) * 1;
      this.opacity = Math.random() * 0.5 + 0.2;
      this.length = Math.random() * 30 + 10;
      this.width = Math.random() * 2;
      this.targetX = null;
      this.targetY = null;
      this.isMovingToTarget = false;
      this.color = `rgba(${Math.round(Math.random() * 100 + 155)}, 
                        ${Math.round(Math.random() * 100 + 155)}, 
                        ${Math.round(Math.random() * 100 + 155)}, ${
        this.opacity
      })`;
    }

    // 更新线条位置
    update() {
      // 如果有目标点，向目标点移动
      if (
        this.isMovingToTarget &&
        this.targetX !== null &&
        this.targetY !== null
      ) {
        const dx = this.targetX - this.x;
        const dy = this.targetY - this.y;
        const distance = Math.sqrt(dx * dx + dy * dy);

        if (distance > 10) {
          // 如果没有非常靠近目标
          this.vx = dx / 50;
          this.vy = dy / 50;
        } else {
          // 恢复随机移动
          this.vx = (Math.random() - 0.5) * 1;
          this.vy = (Math.random() - 0.5) * 1;
          this.isMovingToTarget = false;
          this.targetX = null;
          this.targetY = null;
        }
      }

      // 更新位置
      this.x += this.vx;
      this.y += this.vy;

      // 边界检查，当线条移出屏幕时让它从另一侧重新进入
      if (this.x < 0) this.x = canvas.width;
      if (this.x > canvas.width) this.x = 0;
      if (this.y < 0) this.y = canvas.height;
      if (this.y > canvas.height) this.y = 0;
    }

    // 绘制线条
    draw() {
      ctx.beginPath();
      ctx.moveTo(this.x, this.y);

      // 根据运动方向确定线条结束点
      const angle = Math.atan2(this.vy, this.vx);
      const endX = this.x + Math.cos(angle) * this.length;
      const endY = this.y + Math.sin(angle) * this.length;

      ctx.lineTo(endX, endY);
      ctx.strokeStyle = this.color;
      ctx.lineWidth = this.width;
      ctx.stroke();
    }

    // 设置目标点
    setTarget(x, y) {
      this.targetX = x;
      this.targetY = y;
      this.isMovingToTarget = true;
    }

    // 计算到指定点的距离
    distanceTo(x, y) {
      const dx = this.x - x;
      const dy = this.y - y;
      return Math.sqrt(dx * dx + dy * dy);
    }
  }

  // 创建线条
  for (let i = 0; i < lineCount; i++) {
    lines.push(new Line());
  }

  // 检查两条线是否靠近，以便绘制连接线
  function checkProximity(line1, line2) {
    const dx = line1.x - line2.x;
    const dy = line1.y - line2.y;
    const distance = Math.sqrt(dx * dx + dy * dy);

    if (distance < 150) {
      ctx.beginPath();
      ctx.moveTo(line1.x, line1.y);
      ctx.lineTo(line2.x, line2.y);
      ctx.strokeStyle = `rgba(200, 200, 200, ${0.15 * (1 - distance / 150)})`;
      ctx.lineWidth = 0.5;
      ctx.stroke();
      return true;
    }
    return false;
  }

  // 动画循环函数 - 之前缺少这个函数
  function animate() {
    // 清除Canvas
    ctx.clearRect(0, 0, canvas.width, canvas.height);

    // 更新和绘制所有线条
    for (let i = 0; i < lines.length; i++) {
      lines[i].update();
      lines[i].draw();

      // 检查与其他线条的连接
      for (let j = i + 1; j < lines.length; j++) {
        checkProximity(lines[i], lines[j]);
      }
    }

    // 持续动画
    requestAnimationFrame(animate);
  }

  // 使用document级别的点击事件，只让周围一定范围内的线条聚集
  document.addEventListener("click", function (e) {
    const x = e.clientX;
    const y = e.clientY;

    // 定义影响范围（像素）
    const effectRadius = 300;

    // 让范围内的线条向点击点移动
    lines.forEach((line) => {
      const distance = line.distanceTo(x, y);
      if (distance < effectRadius) {
        // 距离越近，越容易被吸引
        if (Math.random() < 1 - distance / effectRadius) {
          line.setTarget(x, y);
        }
      }
    });
  });

  // 启动动画
  animate();

  /**
   * 在控制台显示网站已加载信息
   * 用于调试和确认脚本正在运行
   */
  console.log("zijier.top 网站已加载完成，动态线条背景已激活");
});
