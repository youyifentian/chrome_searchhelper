/**************************************************************
 *@ popup.js 扩展的popup页的脚本
 *@作者: 有一份田
 *@日期:2013.07.13
 *@Email:youyifentian@gmail.com
 *@地址:http://git.oschina.net/youyifentian/mychrome.git
 *@转载重用请保留此信息.
 *
 *@最后修改时间:2013.07.16
 *
 ***************************************************************/
//生成相应的html数据到popup页面中
makeHtml("popup");
//根据用户的设置初始化可用的引擎列表,并注册相应事件
chrome.tabs.getSelected(null, function(tab){
	var tabid=tab.id,hostObj=getHostInfo(tab.url),
	    host=hostObj.host,word=hostObj.word;
	if("www.google.com"==host)host="www.google.com.hk";
	for(var i in hostArr){
		var o=$O(i);
		if(o){
			var item=hostArr[i],key=item.key,qurl=item.qurl,url=qurl+word;
			addClick(o,tabid,host,url)
		}
	}
	setCss($O(host));
	var pourObj=$O("pour");
	pourObj.checked=localStorage["pourstatus"];
	pourObj.addEventListener('click',function(e){
			localStorage["pourstatus"]=pourObj.checked ? "checked" : "";
			//发送Google Analytics
			_gaq.push(['_trackEvent', e.target.id,JSON.stringify(getPourInfo())]);
			//像后台发送用户的注入设置消息
			chrome.extension.sendRequest({"cmd":"pourchange"},function(response){});
	});
});
//设置popup页面中引擎列表的样式
function setCss(o){
	for(var i in hostArr){
		var t=$O(i);
		if(t)t.className=localStorage[i] ? "" : "hide";
	}
	if(o && !o.className)o.className="disable";
}
function addClick(o,tabid,host,url){
	o.onclick=function(e){
		goSearch(o,tabid,url);
		//发送Google Analytics
		_gaq.push(['_trackEvent','gosearch', JSON.stringify([host,e.target.id])]);
	};
}
//跳转到用户选择的搜索引擎
function goSearch(o,tabid,url){
	if(o.className)return;
	chrome.tabs.update(tabid,{url:url},function(tab){});
	setCss(o);
}
//检查更新
chrome.extension.sendRequest({"cmd":"checkupdate"},function(response){
	var isnew=response.isnew,msg=response.msg,url=response.url,title=response.title;
	if(!isnew){
		var o=$O("upbtn");
		o.href=url;
		o.style.display="";
		o.innerText=title;
	}
});
//在html的最后加载Google Analytics的分析代码
document.body.onload=function(){googleAnalytics();};
