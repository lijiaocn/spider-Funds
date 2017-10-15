for i in `cat ./aa |awk '{print $1}'`
do
	open $i
done
