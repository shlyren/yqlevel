module.exports = function(body) {
    return `
        <!DOCTYPE html>
        <html lang="en">
        <head>
            <meta charset="UTF-8">
            <meta http-equiv="X-UA-Compatible" content="IE=edge">
            <meta name="viewport" content="width=device-width, initial-scale=1.0">
            <title>全国疫情风险等级</title>
            <style>
                body {
                    color: #333333;
                }
                .text, p {
                    font-size: 14px;
                    line-height: 22px;
                }

                .strong {
                    font-weight: bold;
                }

                h5, h4 {
                    margin: 6px 0 4px;
                }
                
                table {
                    width: 100%;
                    border-collapse: collapse;
                    border-spacing: 0;
                    box-sizing: border-box;
                    text-indent: initial;
                    border-collapse: #f00;
                }
                table thead {
                    background: #cccccc;
                    font-size: 14px;
                }
                table th, table td {
                    border: 1px solid #000;
                    padding: 4px;
                }
                
                table .th-community {
                    text-align: start;
                }
                table tbody {
                    font-size: 13px;
                }

                table tbody tr:hover {
                    cursor: pointer;
                    background: #e3e3e3;
                }
                
                .table-title {
                    height: 32px;
                    line-height: 32px;
                    background-color: white;
                    position: sticky;
                    top: 0;
                }
                .table-header {
                    position: sticky;
                    top: 32px;
                }

                .footer {
                    font-size: 15px;
                    width: 100%;
                    height: 64px;
                    display: flex;
                    color: #999999;
                    align-items: center;
                    justify-content: center;
                }
            </style>
        </head>
        <body>
            ${body}
            <div class="footer">已全部加载完毕</div>
        </body>
        </html>
        `
}