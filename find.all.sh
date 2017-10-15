#!/bin/bash

ROOT_DIR=`pwd`

cd cmds;
length=`node ./check.funds.js`
echo $length
echo -e "序号,基金,停牌股占比,股票占比,停牌股在股票中占比" >${ROOT_DIR}/_output/result.csv
for (( i = 0; i < $length; i++ ))
do
	echo $i
	node ./find.one.js $i  1>>${ROOT_DIR}/_output/result.csv  2>>${ROOT_DIR}/_output/fail.log &
	sleep 1
done
