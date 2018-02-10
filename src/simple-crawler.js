var http = require('cheerio');
var fs = require('fs');
var cheerio = require('cherio');
var request = require('request');
var i = 0;
var url = "";
//初始化url

function fetchPage(url){
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

           let time = 
        })
    })
}