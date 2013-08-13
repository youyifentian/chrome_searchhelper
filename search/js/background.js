/**************************************************************
 *@ background.js 扩展的背景页
 *@作者: 有一份田
 *@日期:2013.07.13
 *@Email:youyifentian@gmail.com
 *@地址:http://git.oschina.net/youyifentian/mychrome.git
 *@转载重用请保留此信息.
 *
 *@最后修改时间:2013.07.16
 *
 ***************************************************************/
//扩展安装时的数据初始化函数
var version="1.0.3";
chrome.runtime.onInstalled.addListener(function(ExtensionInfo){
	googleAnalytics();
	localStorage["version"]=version;
	for(var i in hostArr){
		if(localStorage[i])continue;
		localStorage[i]="checked";
	}
	localStorage["pourstatus"]=localStorage["pourstatus"] ? "checked" : "";
});
//用于注册的标签状态监控函数
function checkForValidUrl(tabId,changeInfo,tab){
	var status=changeInfo.status,url=tab.url;
	if('loading'==status){
		//标签开始加载,并且匹配正确的Host已经相应的关键字,以确定是否显示Page action
		var hostObj=getHostInfo(url);
		if(hostObj) chrome.pageAction.show(tabId);
	}
}
//用于注册的后台监听函数,并响应响应结果
function onRequest(request, sender, sendResponse){
	var cmd=request.cmd;
	if("pour"==cmd){
		//是否执行搜索引擎注入
		sendResponse(getPourInfo());
	}else if("pourchange"==cmd){
		//匹配合适标签并发送用户的搜索引擎注入设置的变更
		chrome.tabs.query({"url":"http://www.baidu.com/*"}, function(tabs){
			var data={name:JSON.stringify(getPourInfo())};
			for(var i=0;i<tabs.length;i++){
				var id=tabs[i].id;
				//向注入脚本pour.js中的监听函数发送消息
				chrome.tabs.connect(id,data);
			}
		});
	}else if("checkupdate"){
		var xhr=new XMLHttpRequest(),
		url="http://duoluohua.com/myapp/update?system=chrome&appname=search&apppot=pageaction&frompot=popup&type=0&version="+version+"&t="+Math.random();
		xhr.open("GET",url,true);
		xhr.onreadystatechange=function(){
			if(4==xhr.readyState){
				sendResponse(JSON.parse(xhr.responseText));
			}
		}
		xhr.send();
	}
}
//注册标签状态监听函数
chrome.tabs.onUpdated.addListener(checkForValidUrl);
//注册后台监听函数
chrome.extension.onRequest.addListener(onRequest);


