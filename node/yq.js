const crypto = require('crypto')
const axios = require('axios');
const xlsx = require('node-xlsx')
const fs = require('fs');
const contentDisposition = require('content-disposition');
const previewHtml = require('./preview')

const requestUrl = 'http://103.66.32.242:8005/zwfwMovePortal/interface/interfaceJson'
const nonceHeader = '123456789abcdefg'


function fetchYQLevel() {
  const timestamp = (new Date().getTime() / 1e3).toFixed()
  const signatureHeaderStr = timestamp + "23y0ufFl5YxIyGrI8hWRUZmKkvtSjLQA" + nonceHeader + timestamp
  const signatureHeader = crypto.createHash('SHA256').update(signatureHeaderStr).digest('hex').toUpperCase()
  
  
  const signatureStr = timestamp + "fTN2pfuisxTavbTuYVSsNJHetwq5bJvCQkjjtiLM2dCratiA" + timestamp;
  const signature = crypto.createHash('SHA256').update(signatureStr).digest('hex').toUpperCase()

  return new Promise((resolve, reject) => {
    axios({
      method: "POST",
      url: requestUrl,
      data: {
        appId: 'NcApplication',
        paasHeader: 'zdww',
        key: '3C502C97ABDA40D0A60FBEE50FAAD1DA',
        timestampHeader: timestamp,
        nonceHeader: nonceHeader,
        signatureHeader: signatureHeader,
      },
      headers: {
        'x-wif-nonce': 'QkjjtiLM2dCratiA',
        'x-wif-paasid': 'smt-application',
        'x-wif-signature': signature,
        'x-wif-timestamp': timestamp,
      }
    }).then(res => {
      resolve(res.data)
    }).catch(() => {
      reject({
        data: null,
        code: -1,
        msg: '查询失败'
      })
    })
  })
  
}


const tableheadhtml = `
<thead class="table-header">
  <tr>
    <th>序号</th>
    <th>省份</th>
    <th>城市</th>
    <th>区县</th>
    <th>地区</th>
  </tr>
</thead>
`

module.exports = {
  queryYQLevel(req, response) {
    fetchYQLevel()
    .then(data => response.send(data))
    .catch(data => response.send(data))
  },
  downloadYQLevel(req, response) {
    const kv = {
      highlist: '高',
      middlelist: '中',
      province: '省',
      city: '市',
      county: '区',
      community: '区域'
    }
    fetchYQLevel()
    .then(({data}) => {
      const items = [
        [`更新时间`, `高风险数量`, `中风险数量`],
        [data.end_update_time, data.hcount, data.mcount],
        [],
        [ '序号', '风险等级', '省', '市', '区', '区域'],
      ]
      function forEach(level) {
        let index = 1
        data[level].forEach(item => {
          item.communitys.forEach(community => {
            items.push([index++,kv[level], item.province, item.city, item.county, community])
          })
        })
      }

      forEach('highlist')
      items.push([])
      forEach('middlelist')

      const buffer = xlsx.build([{
        name:'sheet1',
        data: items
      }]);
      // fs.writeFileSync('~/Desktop/yqlevel.xlsx',buffer, {'flag':'w'});
      response.set('Content-Disposition', contentDisposition("全国疫情风险等级.xlsx"))
      response.end(buffer)
    })
    .catch(data => response.send(data))
  },
  previewYQLevel(req, response) {
   
    fetchYQLevel()
    .then(({data}) => {
      const { end_update_time, hcount, mcount, highlist, middlelist } = data

      function getTableBody(data) {
        let hb = ''
        let index = 1
        data.forEach((item) => {
          item.communitys.forEach(community => {
            
            hb += `<tr>
              <th>${index++}</th>
              <th>${item.province}</th>
              <th>${item.city}</th>
              <th>${item.county}</th>
              <th class="th-community">${community}</th>
              </tr>`
          })
        })
        return `
          <tbody>
            ${hb}
          </tbody>
        `
      }

      const body = `
        <h4>
          <a href="/level/download">下载Excel</a>
          <a target="blank" href="/level/query">JSON接口</a>
        </h4>  
        <div class="header">
          <div>更新时间：${end_update_time}</div>
        </div>
        
        <h4 class="table-title">高风险地区: 共${hcount}处</h4>
        <table>
          ${tableheadhtml}
          ${getTableBody(highlist)}
        </table>
        <h4 class="table-title">中风险地区: 共${mcount}处</h4>
        <table>
          ${tableheadhtml}
          ${getTableBody(middlelist)}
        </table>
      `

      response.send(previewHtml(body))
    })
    .catch(data => response.send(data))
  }
}