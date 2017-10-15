#!/bin/bash

ROOT_DIR=`pwd`

cd cmds;
length=`node ./check.funds.js`
echo $length
echo -e "序号\t基金\t停牌股占比\t股票占比\t停牌股在股票中占比" >${ROOT_DIR}/_output/result.log
for (( i = 0; i < $length; i++ ))
do
	echo $i
	node ./find.one.js $i  1>>${ROOT_DIR}/_output/result.log  2>>${ROOT_DIR}/_output/fail.log &
	sleep 1
done
