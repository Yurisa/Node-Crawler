// 延时器
let timeout = function (delay) {
    console.log('延迟函数：', `延迟 ${delay} 毫秒`)
    return new Promise((resolve, reject) => {
      setTimeout(() => {
        try {
          resolve(1)
        } catch (error) {
          reject(error)
        }
      }, delay);
    })
  }
  exports.timeout = timeout;