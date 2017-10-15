var http = require('http');
var util = require('util');
var jsdom = require('jsdom');
var funds = require('../_output/funds.js')
var i=0;

function Stock(code, name, price, percent){
	this.code=code;
	this.name=name;
	this.price=price;
	this.percent=percent;
}

function func_get_price(gpdmList, position, fund){
	url='http://nufm3.dfcfw.com/EM_Finance2014NumericApplication/JS.aspx?type=CT&cmd='+gpdmList+'&sty=E1OQCPZT&st=z&sr=&p=%20%20%20%20&ps=&cb=&js=var%20js_fav=%7Bfavif%3A%5B(x)%5D%7D&token=8a36403b92724d5d1dd36dc40534aec5&rt=0.6179517152094732'
	var req = http.request(url);
	req.on('response', (res)=>{
		var detail='';
		res.on('data', (chunk)=>{
			detail += chunk;
		});
		res.on('end', ()=>{
			var tmp = eval(detail+';js_fav;')
			var total=0.0;
			var all_total=0.0;
			var prices=tmp['favif'];
			for (var i = 0; i < prices.length; i ++ ){
				var price=prices[i].split(',');
//				position[i].price=price[3];
//				position[i].name=price[2];
				if(price[3] == '-'){
					total += position[i].percent;
				}
				all_total += position[i].percent;
			}
//			console.log(process.argv[2], fund, total, all_total, 100*total/(all_total+1));
			console.log("%d,%s,%d,%d,%d", process.argv[2], fund, total, all_total, 100*total/(all_total+1));
		});
	});
	req.on('error', function(err){
		util.log('Error: ' + 'fund' + ' : ' + err);
	});
	req.end();
}

function func_fund_detail(res){
	var detail='';
	res.on('data',function(chunk){
		detail += chunk;
	});
	var gpdmList='';
	res.on('end',()=>{
		var data= eval(detail+'apidata;');
		if(data['content'] != ""){
			jsdom.env(data['content'],
				["http://code.jquery.com/jquery.js"],
				function(err, window){
					var $ = window.$;
					var fund = $('a:eq(0)').attr('href');
					var position = new Array();
					gpdmList = $('#gpdmList').text();
					$('tbody:eq(0) tr').each(function(index){
						var code=$(this).find('td:eq(1)').text();
						var name=$(this).find('td:eq(2)').text();
						var percent=$(this).find('td:eq(6)').text();
						percent=parseFloat(percent.replace(/%/,''));
						position[index]= new Stock(code,name,0,percent);
					});
					func_get_price(gpdmList, position, fund);
				});
		}
	});
}

function func_fund_entry(fund){
	var url ='http://fund.eastmoney.com/f10/FundArchivesDatas.aspx?type=jjcc&code='+fund[0]+'&topline=10&year=&month=6&rt=0.48942602592734985';
//	util.log(url);
	var req = http.request(url);
	req.on('response', (res)=>{
		func_fund_detail(res);
	});
	req.on('error', function(err){
		util.log('Error func_fund_entry: ' + url +' : ' + err);
	});
	req.end();
}

function func_list_process(list){
//	util.log('length:', list.length);
	try{
		func_fund_entry(list[process.argv[2]]);
	}
	catch(e){
		util.log('Exception: ' + list[process.argv[2]] + ' : ' + e.message);
	}
}

func_list_process(funds.r);
