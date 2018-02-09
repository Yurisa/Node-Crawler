const puppeteer = require('puppeteer');
const fs = require('fs');
const request = require('request');
const path = require('path');
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

/**
 * One 爬虫类
 */
class OnePaChong {
  constructor () {
    // 最大索引
    this.maxIndex = 40
    // 初始化
    this.init()
  }
  // 初始化函数
  async init () {
    if(!fs.existsSync(path.join(path.resolve(__dirname, '..'), 'data'))){
       await new Promise((resolve, reject) => {
           try{
               resolve(1);
               fs.mkdir(path.join(path.resolve(__dirname, '..'), 'data'));
           }catch(error){
               reject(error)
           }
       })
    }
    console.log('正在启动浏览器...')
    this.browser = await puppeteer.launch();
    console.log('正在打开新页面...')
    this.page = await this.browser.newPage();
    // 顺序爬取页面
    for (let i = 14; i < this.maxIndex; i++) {
      await this.getPageInfo(i)
    }
    this.closeBrowser()
  }
  // 抓取页面内容
  async getPageInfo (actPage) {
    // 延时 1000 毫秒
    // await timeout(1000);
    let page = this.page
    await page.goto(`http://wufazhuce.com/one/${actPage}`);
    // 获取信息
    try {
      // 获取文本
      let sText = await page.$eval('.one-cita', el => el.innerText);
      // 获取图片描述，清除空格和特殊字符 & 和 /
      let sImgName = await page.$eval('.one-imagen-leyenda', el => {
        let str = el.innerText
        str = str.replace(/^\s+|\s+$/g, '')
        str = str.replace(/\&+|\/+/g, '-')
        return str;
      });
      // 获取图片URL
      let sImgURL = await page.$eval('.one-imagen img', el => el.src);

      console.log('-------------------------------------------- start')
      console.log('页面页码：', actPage);
      console.log('采集状态：', '成功');
      console.log('标题句子：', sText);
      console.log('图片描述：', sImgName);
      console.log('图片地址：', sImgURL);
      console.log('-------------------------------------------- end')
      
      // 保存图片
      await request(sImgURL).pipe(fs.createWriteStream(`data/${sImgName}.png`));
    
    } catch (error) {
      console.log('-------------------------------------------- start')
      console.log('页面页码：', actPage);
      console.log('采集状态：', '失败');
      console.log('错误信息：', error)
      console.log('-------------------------------------------- end')
    }
  }
  // 关闭浏览器
  async closeBrowser () {
    console.log('正在关闭浏览器...')
    await this.browser.close()
  }
}

// 启用爬虫
new OnePaChong()
