/**************************************************************
 *@ base.js 自定义工具库
 *@作者: 有一份田
 *@日期:2013.07.13
 *@Email:youyifentian@gmail.com
 *@地址:http://git.oschina.net/youyifentian/mychrome.git
 *@转载重用请保留此信息.
 *
 *@最后修改时间:2013.07.16
 *
 ***************************************************************/
//获取网页DOM节点的函数
function $O(id) {return document.getElementById(id);}
/**
 *选用的所有搜索引擎信息的保存对象
 *
 *"搜索引擎的Host":{"title":"引擎标题","key":"引擎输入框的name","qurl":"搜索引擎的Post地址加上必须的搜索参数,并以key=结尾"},
 *pourbar字段为搜索设置选项,请勿添加替换且为唯一的字符串键值(即扩展该对象或代码时保留此项不动即可)
 *
 *
 */
var hostArr={
	"www.google.com":{"title":"谷 歌","key":"q","qurl":"http:/www.google.com.hk/search?hl=zh-CN&newwindow=1&q="},
	"www.google.com.hk":{"title":"谷 歌","key":"q","qurl":"http:/www.google.com.hk/search?hl=zh-CN&newwindow=1&q="},
	"www.baidu.com":{"title":"百 度","key":"wd","qurl":"http:/www.baidu.com/s?ie=utf-8&tn=baiduhome_pg&wd="},
	"www.sogou.com":{"title":"搜 狗","key":"query","qurl":"http://www.sogou.com/web?query="},
	//"www.youdao.com":{"title":"有 道","key":"q","qurl":"http://www.youdao.com/search?ue=utf8&q="},
	//"www.soso.com":{"title":"搜 搜","key":"w","qurl":"http://www.soso.com/q?w="},
	//"www.yahoo.cn":{"title":"雅 虎","key":"q","qurl":"http://www.yahoo.cn/s?q="},
	"cn.bing.com":{"title":"必 应","key":"q","qurl":"http://cn.bing.com/search?q="},
	"www.so.com":{"title":"360搜索","key":"q","qurl":"http://www.so.com/s?ie=utf-8&q="},
	"pourbar":"pourbar"
};
//获取用户关于 "注入" 设置的状态
function getPourInfo(){
	return {"pour":localStorage["pourstatus"],"pourbar":localStorage["pourbar"]};
}
//用于组织popup.html和options.html中的相应代码
function makeHtml(type){
	var slist=$O("slist"),html="";
	for(var i in hostArr){
		if("www.google.com"==i)continue;
		var item=hostArr[i],title=item.title;
		if(typeof item==='object'){
			if("popup"==type)
				html+='<a id="'+i+'" href="javascript:void(0);">'+title+'</a>';
			else if("options"==type)
				html+='<input id="'+i+'" type="checkbox"'+("www.google.com.hk"==i ? ' disabled="true" ' : "")+'/><label for="'+i+'" title="'+title+'">'+title+'</label><br>';
		}
	}
slist.innerHTML=html;
}
//解析给出的url,返回相应的部分,host,key,以及用户在搜索引擎中的搜索关键字 word
//并匹配hostArr对象设置数据,成功则返回相应结果,否则返回null
function getHostInfo(url){
	if(!url)return;
	if("chrome://newtab/"==url)
		return {"scheme":"","host":url,"url":url,"word":""};
	var re_host=/(.+:\/\/)?((\w+\.)?(\w+\.)?(\w+\.)(\w+))/ig,
	    arr_host=re_host.exec(url),
	    hosturl=arr_host[0],
	    scheme=arr_host[1],
	    host=arr_host[2],
	    word="",qurl="";
	if(!hostArr[host])return;
	var item=hostArr[host],key=item.key,qurl=item.qurl,
	    re_word=new RegExp("[&|\\?]"+key+"=([^&]*)","ig"),
	    arr_word=re_word.exec(url);
	word=arr_word ? arr_word[1] : "";
	return {"scheme":scheme,"host":host,"url":qurl+word,"word":word};
}
//以下为Google Analytics的分析代码,主要为了反馈扩展使用信息,不会收集用户隐私
var _gaq = _gaq || [];
_gaq.push(['_setAccount', 'UA-42453067-2']);
_gaq.push(['_trackPageview']);
function googleAnalytics(){
  	var ga = document.createElement('script'); ga.type = 'text/javascript'; ga.async = true;
  	ga.src = 'https://ssl.google-analytics.com/ga.js';
  	var s = document.getElementsByTagName('script')[0]; s.parentNode.insertBefore(ga, s);
}
