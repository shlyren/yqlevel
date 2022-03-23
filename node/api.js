const express = require('express')
const app = express()
const http = require('http')

const { queryYQLevel, downloadYQLevel, previewYQLevel } = require('./yq')
// 查询json数据
// https://yq.yuxiang.ren/level/query
app.get('/level/query', queryYQLevel)
// 下载excel表格
// https://yq.yuxiang.ren/level/download
app.get('/level/download', downloadYQLevel)
// 网页查看
// https://yq.yuxiang.ren/level/preview
app.get('/level/preview', previewYQLevel)


http.createServer(app).listen(9527, () => {
	console.log('HTTP Server is running on: http://127.0.0.1:9527');
});