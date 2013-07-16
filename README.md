快捷搜索引擎 一个多功能切换搜索引擎和搜索引擎注入的扩展
------
>这是俺的第一个开源项目，能力有限，欢迎批评指点。
****
## 1.快捷搜索引擎-----简介
**快捷搜索引擎**  是一个可以让你在用chrome时可以在不同的搜索引擎之间快速无缝切换，同时也提供了另一个十分有趣的功能--引擎注入，即可以将其他的搜索引擎注入到另一个里面，当然，这是简单的，主要针对这种情况，比如：你一直都在使用Google搜索，但是由于百度主页提供了便捷的网址导航服务，但是他确实百度搜索，而你想使用Google，这时你就可以使用本扩展，将Google搜索注入到百度首页当中，即利用了百度首页的网址导航功能，也可以继续使用Google搜索了。而且该扩展提供了丰富的自定义和自由扩展的功能，即便是技术小白也可以方便的打造自己的chrome快捷搜索引擎扩展。
****
>####扩展的自定义选项设置
>![Page action][1]
>![选项][2]
>****
>##2. 开发自己的Chrome扩展
本扩展源码以上传到本项目的 **search** 目录,编译打包好的Chrome扩展为 **search.crx** ,源码位于search目录
本扩展具有很强大的自定义开发功能,加上我**白痴式**的注释即使你是技术小白也能够开发出自己的个性扩展来

>####下面开始介绍本扩展的自定义开发功能
>   
>   **1**. 基础函数库文件 **base.js** 该脚本文件中提供一个搜索引擎对象,通过在该对象中添加搜索引擎信息来自定义自己所需的搜索引擎
>
	var hostArr={
>			"www.google.com":{"title":"谷 歌","key":"q","qurl":"http:/www.google.com.hk/search?hl=zh-CN&newwindow=1&q="},
>			"www.google.com.hk":{"title":"谷 歌","key":"q","qurl":"http:/www.google.com.hk/search?hl=zh-CN&newwindow=1&q="},
>			"www.baidu.com":{"title":"百 度","key":"wd","qurl":"http:/www.baidu.com/s?ie=utf-8&tn=baiduhome_pg&wd="},
>			"www.sogou.com":{"title":"搜 狗","key":"query","qurl":"http://www.sogou.com/web?query="},
>			//"www.youdao.com":{"title":"有 道","key":"q","qurl":"http://www.youdao.com/search?ue=utf8&q="},
>			//"www.soso.com":{"title":"搜 搜","key":"w","qurl":"http://www.soso.com/q?w="},
>			//"www.yahoo.cn":{"title":"雅 虎","key":"q","qurl":"http://www.yahoo.cn/s?q="},
>			"cn.bing.com":{"title":"必 应","key":"q","qurl":"http://cn.bing.com/search?q="},
>			"www.so.com":{"title":"360搜索","key":"q","qurl":"http://www.so.com/s?ie=utf-8&q="},
>			"pourbar":"pourbar"
>		};           
>
####搜索引擎信息的对象

>即:用搜索引擎的Host作为该对象的一个键,对应的值为由该搜索引擎的信息组成的信息对象,其中包含搜索引擎的 **标题** ,搜索引擎 **搜索输入框** 的 **name**,以及搜索引擎的搜索地址(该url包含该搜索引擎必须的参数,并且以**key=结尾**),具体格式如下

>		**"搜索引擎的Host"** : {"title":**"引擎标题"**,"key":**"引擎输入框的name"**,"qurl":**"搜索引擎的Post地址加上必须的搜索参数,并以key=结尾"**},**pourbar**字段为搜索设置选项,请勿添加替换且为唯一的字符串键值(即扩展该对象或代码时保留此项不动即可)
****
>   **2**. 搜索引擎注入 **pour.js** 该脚本文件中提供 **要注入的搜索引擎** 的多个对象信息,通过修改该这些对象来修改注入到 **百度首页** 的搜索引擎
>### **注意：** pour.js只在 **"http://www.baidu.com/\*"** 下运行,具体可见 **"manifest.json"** 配置文件中的 **"content_scripts"**值
>
>			需要注入的搜索引擎的新action地址
>				formInfo={"nAction":"新引擎的action地址"}
>			如:
>			formInfo{"nAction":"http://www.google.com.hk/search"}
>>
>
>			需要修改的工具栏Node(节点),其中格式为
>		    	barNodeInfo={
>					"需要修改的工具栏的节点(连接)的名字(不要包含特殊字符)":{"nHref":"节点的url(支持JS跳转)","nText":"该节点的新名字"}
>				}
>			如:
>			barNodeInfo={
>				"知道":{"nHref":"https://mail.google.com/mail/?tab=wm","nText":"Gmail"},
>				"地图":{"nHref":"https://maps.google.com/","nText":"Maps"},
>    		  	"文库":{"nHref":"javascript:window.location.href='http://zh.wikipedia.org/wiki/'+document.getElementById('kw').value;","nText":"维基"},
>    		    "更多":{"nHref":"https://www.youtube.com/","nText":"YouTube"}
	    	}
>
>
>>
>
>			需要修改的搜索引擎必要的参数,即表单必要的Input对象设置
>				inputInfo={
>		    		"旧引擎搜索关键字的表单Input的name":{"n":"对应的新引擎的","v":""},
>		 		    "旧引擎的必要参数的表单Input的name":{"n":"对应的新引擎的","v":"新参数的值"},
>				    //如果新引擎的必要参数比旧的多,则添加一个相同的新引擎参数即可,如下
>				    "一个不影响就引擎的参数name即可(不是特殊即可)":{"n":"新的","v":"新值"},	
>				    "旧引擎表单提交按钮的name或id":{"n":"新的","v":"新的提交按钮的value"}
>			  }
>			如:
>			inputInfo={//改为将Google注入到百度的input设置
>		    		"wd":{"n":"q","v":""},
>    		    	"rsv_spt":{"n":"newwindow","v":"1"},
>		    		"tn":{"n":"hl","v":"zh-CN"},
>		    		"su":{"n":"btnK","v":"Google搜索"}
>	    	}
>#####------------通过以上设置即可自定义自己的搜索引擎注入,将自己喜欢的搜索引擎注入到 **百度首页**
>![将Google注入到百度][3]
>
>
>
>



----
>##3. 关于我们
>* 为了 **"自由，开源，共"** 的精神
>* 本代码可自由传播分享,但 **转播请注明出处**
>* 官网：http://www.duoluohua.com/
>* 邮箱：youyifentian@gmail.com
  [1]: http://duoluohua.com/myapp/chrome/search/images/search_1.png
  [2]: http://duoluohua.com/myapp/chrome/search/images/search_2.png
  [3]: http://duoluohua.com/myapp/chrome/search/images/search_3.png

