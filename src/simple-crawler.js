var http = require('http');
var fs = require('fs');
var cheerio = require('cheerio');
var request = require('request');
var path = require('path');
var Util = require('./util')
console.log(Util)
var i = 0;
var url = "http://news.zust.edu.cn/html/zonghexinwen/jiaoxueyuandi/18914.html";


//初始化url

function fetchPage(url){
    Util.timeout(1000)
    startRequest(url);
}

function startRequest(url){
    http.get(url, res => {
        let html = '';
        let titles = [];
        res.setEncoding('utf-8');//设置编码

        //监听data事件，每次取一块数据
        res.on('data', chunk => {
            html += chunk;
        })

        //监听end事件，如果整个网页内容的html都获取完毕，就执行回调函数
        res.on('end', () => {

           let $ = cheerio.load(html);//采用cheerio模块来解析html

           let time = $('.infos .head-info:first-child').text().substring(3);

           let article_title = $('.content .title').text().trim();

           let article = {
               
               no:i = i + 1,

               //获取文章的标题
               title:article_title,
               
               //获取文章发布的时间
               time:time,
               
               //获取文章的作者
               author:$('.infos .head-info:nth-child(2)').text().substring(2)

           };
           try{
            saveContent($, article_title);
            saveImg($, article_title);
           }catch(err){
             console.log(err)
           }
           let src = $('.prenext ul li:first-child a').attr('href');
           if(src){
           let preLink = `http://news.zust.edu.cn${src}`;
           console.log(preLink)
           if(i <= 500){
             fetchPage(encodeURI(preLink))
            }
           }
        })
    })
}

/**
 * 存储文章内容
 * @param {*} $ 
 * @param {*} title 
 */
async function saveContent($, title){
    if(!fs.existsSync(path.join(path.resolve(__dirname, '..'), 'news'))){
      await new Promise((resolve, reject) => {
            try{
                fs.mkdir(path.join(path.resolve(__dirname, '..'), 'news'), err => {
                    if(err){
                        throw err;
                    }
                    resolve(1);
                });
            }catch(error){
                reject(error)
            }
        })
     }
    $('#MainContent p').each(function(index, item)  {
        let x = $(this).text();

        // let y = x.substring(0,1).trim();  

            x += '\n';
            fs.appendFile('./news/' + title + '.txt', x, 'utf-8', err => {
                if(err){
                    console.log(err);
                }
            })
    })
}

async function saveImg($, title) {
    if(!fs.existsSync(path.join(path.resolve(__dirname, '..'), 'image'))){
        await new Promise((resolve, reject) => {
              try{
                  fs.mkdir(path.join(path.resolve(__dirname, '..'), 'image'),err => {
                      if(err){
                          throw err
                      }
                      resolve(1);
                  });
              }catch(error){
                  reject(error)
              }
          })
       }
    $('#MainContent p img').each(function(index, item){
        let img_src = 'http://news.zust.edu.cn'+ $(this).attr('src');
        request.head(img_src, (err, res, body) => {
            if(err){
               console.log(err);
            }
        });
        request(img_src).pipe(fs.createWriteStream(`./image/${title}.jpg`));
    })
}

fetchPage(url)