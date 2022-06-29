const canvas = document.getElementById('canvas');
const ctx = canvas.getContext('2d');

// 获取body的宽高
const body = document.getElementsByTagName('body')[0];
const width = body.clientWidth;
const height = body.clientHeight;

// 设置canvas的宽高
canvas.width = width - 40;
canvas.height = height - 120;

// [当前得分]dom
const scoreText = document.getElementById('scoreText');

// 计时器
let timer;
// 当前得分
let count = 0;
// 当前蛇的朝向
let direction = 37;
// 是否游戏结束
let done = false;

scoreText.innerText = '当前得分: ' + count;

// 定义蛇的每一节身体
class Rect {
  constructor(x, y, w, h, color) {
    this.x = x;
    this.y = y;
    this.w = w;
    this.h = h;
    this.color = color;
  }

  /**
   * 画出一节身体
   * @param {*} context
   */
  draw(context) {
    context.beginPath();
    context.fillStyle = this.color;
    context.rect(this.x, this.y, this.w, this.h);
    context.fill();
    context.stroke();
  }
}

// 定义蛇
class Snake {
  constructor() {
    const snakeArr = [];
    // 蛇初始有4节身体,其中包括一节蛇头
    for (let i = 0; i < 4; i++) {
      const rect = new Rect(i * 20, 0, 20, 20, '#000000');
      snakeArr.unshift(rect);
    }

    const head = snakeArr[0];
    head.color = '#ff0000';

    // 蛇头
    this.head = head;
    // 蛇身
    this.snakeArr = snakeArr;
    // 蛇的初始朝向: 右
    this.direction = 39; // 键盘右方向键的keycode
  }

  /**
   * 画出整个蛇
   */
  draw(context) {
    for (let i = 0; i < this.snakeArr.length; i++) {
      this.snakeArr[i].draw(context);
    }
  }

  /**
   * 蛇的移动
   * 创建一节新的身体,将其的位置设定与蛇头一致
   * 将其插入Snake数组蛇头位置的后面
   * 根据是否吃掉食物来判断是否去掉蛇尾,如果没吃掉,则去掉蛇尾,如果吃掉,则保留蛇尾
   * 最后将蛇头往对应的方向移动一格的距离
   */
  move(food) {
    const moveRect = new Rect(
      this.head.x,
      this.head.y,
      this.head.w,
      this.head.h,
      '#000000'
    );
    this.snakeArr.splice(1, 0, moveRect);

    // 判断是否吃到食物
    // 吃到的话就重新生成食物
    // 否则就去掉蛇尾
    if (this.head.x === food.x && this.head.y === food.y) {
      const newFood = initFood(this.snakeArr);
      food.x = newFood.x;
      food.y = newFood.y;
      count++;
      scoreText.innerText = '当前得分: ' + count;
    } else {
      this.snakeArr.pop();
    }

    // 根据蛇头的运动方向来移动
    // 37 左
    // 38 上
    // 39 右
    // 40 下
    switch (this.direction) {
      case 37:
        this.head.x -= this.head.w;
        break;
      case 38:
        this.head.y -= this.head.h;
        break;
      case 39:
        this.head.x += this.head.w;
        break;
      case 40:
        this.head.y += this.head.h;
        break;
      default:
        break;
    }

    // 撞墙
    if (
      this.head.x >= canvas.width ||
      this.head.x < 0 ||
      this.head.y >= canvas.height ||
      this.head.y < 0
    ) {
      timer && clearInterval(timer);
      alert('Game Over!');
      done = true;
    }

    // 吃到自己的蛇身
    // 循环从下标1开始,避开蛇头与蛇头比较的情况
    for (let i = 1; i < this.snakeArr.length; i++) {
      if (
        this.snakeArr[i].x == this.head.x &&
        this.snakeArr[i].y == this.head.y
      ) {
        console.log(this.snakeArr);
        timer && clearInterval(timer);
        alert('Game Over!');
        done = true;
      }
    }
  }
}

/**
 * 随机函数，获得[min, max]范围的整数值
 * @param {*} min
 * @param {*} max
 * @returns
 */
function getRandomNumber(min, max) {
  const range = max - min;
  return Math.round(Math.random() * range + min);
}

/**
 * 创建食物
 * @returns
 */
function initFood(arr) {
  // 标识位
  let onSnake = false;
  let x = 0,
    y = 0;

  // 判断食物是否与蛇重叠,如果重叠则重新生成
  do {
    // 默认蛇的每节身体宽高为20
    x = getRandomNumber(0, canvas.width / 20 - 1);
    y = getRandomNumber(0, canvas.height / 20 - 1);

    const flag = arr.findIndex(rect => {
      return rect.x === x && rect.y === y;
    });
    onSnake = flag !== -1;
  } while (onSnake);

  return new Rect(x * 20, y * 20, 20, 20, 'green');
}

// 创建蛇
const snake = new Snake();
// 绘制
snake.draw(ctx);

// 创建食物
let food = initFood(snake.snakeArr);

// 创建定时器
timer = setInterval(function () {
  getDirection(direction);
  snake.move(food);
  if (done) return;
  ctx.clearRect(0, 0, canvas.width, canvas.height);
  food.draw(ctx);
  snake.draw(ctx);
}, 100);

function getDirection(direction) {
  switch (direction) {
    case 37: {
      // 判断接下来的方向是否与目前蛇前进的方向相反
      if (snake.direction !== 39) {
        snake.direction = 37;
      }
      break;
    }
    case 38: {
      // 判断接下来的方向是否与目前蛇前进的方向相反
      if (snake.direction !== 40) {
        snake.direction = 38;
      }
      break;
    }
    case 39: {
      // 判断接下来的方向是否与目前蛇前进的方向相反
      if (snake.direction !== 37) {
        snake.direction = 39;
      }
      break;
    }
    case 40: {
      // 判断接下来的方向是否与目前蛇前进的方向相反
      if (snake.direction !== 38) {
        snake.direction = 40;
      }
      break;
    }
  }
}

// 键盘事件
document.onkeydown = function (e) {
  e.preventDefault();
  direction = e.keyCode;
};
