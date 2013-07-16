/**************************************************************
 *@ options.js 扩展的"选项"脚本,用于保存扩展的配置数据
 *@作者: 有一份田
 *@日期:2013.07.13
 *@Email:youyifentian@gmail.com
 *@地址:http://git.oschina.net/youyifentian/mychrome.git
 *@转载重用请保留此信息.
 *
 *@最后修改时间:2013.07.16
 *
 ***************************************************************/
//调用相应的html生成函数
makeHtml("options");
//初始化html中的相应事件
for(var i in hostArr){
	var o=$O(i);
	if(!o)continue;
	o.checked=localStorage[i];
	o.addEventListener('click',function(){
		var id=this.id,tip=$O("tip");
		//保存用户的设置
		localStorage[id]=this.checked ? "checked" : "";
		//判断用户设置的注入条件,并向合适的所有标签发送消息
		if("pourbar"==id && "checked"==localStorage["pourstatus"])
			chrome.extension.sendRequest({"cmd":"pourchange"},function(response){});
		tip.style.display="block";
		setTimeout(function() {
			tip.style.display="none";
		}, 1000);
	});
}
googleAnalytics();
