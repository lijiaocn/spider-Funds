#!/bin/bash
for i in `cat ./_output/fail.log | awk '{print $13 }'`
do
	echo $i
	node ./find.js $i  >>retry.log &
	sleep 1
done
