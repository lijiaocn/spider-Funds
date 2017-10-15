#!/bin/bash
curl http://fund.eastmoney.com/js/fundcode_search.js?v=20160914135859 >_output/funds.js
echo "" >>_output/funds.js
echo "module.exports.r=r;" >>_output/funds.js
