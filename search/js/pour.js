/**************************************************************
 *@ pour.js 在扩展设置的对应条件下注入的content_scripts脚本(注意扩展配置文件中的注入条件)
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
//获取工具栏Dom
//获取表单Dom
//用于存储工具栏中需要修改的Node(节点)
//用于保存搜索引擎必要的参数的表单Input对象
var bar=$O("nv"),form=document.forms[0],barNodeArr=[],inputArr=[];
/**
 * 需要注入的搜索引擎的新action地址
 * 	formInfo={"nAction":"新引擎的action地址"}
 *
 * 需要修改的工具栏Node(节点),其中格式为
 *	barNodeInfo={
 *		"需要修改的节点的名字(不要包含特殊字符)":{"nHref":"节点的url(支持JS跳转)","nText":"该节点的新名字"}
 *	}
 *
 * 需要修改的搜索引擎必要的参数,即表单必要的Input对象设置
 *	inputInfo={
 *		    "旧引擎搜索关键字的表单Input的name":{"n":"对应的新引擎的","v":""},
 *  		    "旧引擎的必要参数的表单Input的name":{"n":"对应的新引擎的","v":"新参数的值"},
 *		    //如果新引擎的必要参数比旧的多,则添加一个相同的新引擎参数即可,如下
 *		    "一个不影响就引擎的参数name即可(不是特殊即可)":{"n":"新的","v":"新值"},
 *
 *		    "旧引擎表单提交按钮的name或id":{"n":"新的","v":"新的提交按钮的value"}
 *	    },
 *
 */
(function(){
	var formInfo={"nAction":"http://www.google.com.hk/search"},
	    barNodeInfo={
		    "知道":{"nHref":"https://mail.google.com/mail/?tab=wm","nText":"Gmail"},
    		    "地图":{"nHref":"https://maps.google.com/","nText":"Maps"},
    		    "文库":{"nHref":"javascript:window.location.href='http://zh.wikipedia.org/wiki/'+document.getElementById('kw').value;","nText":"维基"},
    		    "更多":{"nHref":"https://www.youtube.com/","nText":"YouTube"}
	    },
    	    inputInfo={
		    "wd":{"n":"q","v":""},
    		    "rsv_spt":{"n":"newwindow","v":"1"},
		    "tn":{"n":"hl","v":"zh-CN"},
		    "su":{"n":"btnK","v":"Google搜索"}
	    },
    	    childs=bar.childNodes;
	if(!form)return;
	form.oAction=form.action;
	form.nAction=formInfo.nAction;
	for(var i in inputInfo){
		var o=form[i],item=inputInfo[i];
		if(!o)o=createInput(form);
		o.oName=i;
		o.nName=item.n;
		o.oValue=o.value || "";
		o.nValue=item.v;
		inputArr.push(o);
	}
	if(!bar)return;
	for(var i=0;i<childs.length;i++){
		var node=childs[i];
		if("A"!=node.tagName)continue;
		var value=node.innerHTML,
    		    text=value.replace(/&nbsp;/ig,"").replace(/&gt;/ig,""),
    		    item=barNodeInfo[text];
		if(item){
			node.nHref=item.nHref;
			node.nText=item.nText;
			node.oHref=node.href;
			node.oText=value;
			barNodeArr.push(node);
		}
	}
}());
//创建表单的input节点
function createInput(o){
	var newInput=document.createElement("input");
	newInput.type="hidden";
	o.appendChild(newInput); 
}
//工具栏注入
function resetBar(type){
	for(var i=0;i<barNodeArr.length;i++){
		var node=barNodeArr[i];
		node.href=type ? node.nHref : node.oHref;
		node.innerHTML=type ? node.nText : node.oText;
		if("YouTube"==node.innerHTML)
			bar.style.marginLeft="-10px";
		else
			bar.style.marginLeft="0px";
	}
}
//表单注入
function resetForm(type){
	for(var i=0;i<inputArr.length;i++){
		var o=inputArr[i];
		o.name=type ? o.nName : o.oName;
		o.value=type ? o.nValue : o.oValue;
	}
	if(bar)form.action=type ? form.nAction : form.oAction;
}
//通过扩展传递的消息进行数据的注入
function myReset(pourInfo){
	var pour="checked"==pourInfo.pour,pourbar="checked"==pourInfo.pourbar;
	resetForm(pour);
	resetBar(pour && pourbar);
}
if(form)chrome.extension.sendRequest({"cmd":"pour"},function(response){myReset(response);});
chrome.extension.onConnect.addListener(function(port){myReset(JSON.parse(port.name));});
