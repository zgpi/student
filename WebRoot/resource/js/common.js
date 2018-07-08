var onlyOpenTitle = "主页";//不允许关闭的标签的标题
$(function () {
    tabClose();
    tabCloseEven();
})

function tabClose() {
    /*双击关闭TAB选项卡*/
    top.$(".tabs-inner").dblclick(function () {
        var subtitle = $(this).children(".tabs-closable").text();
        top.$('#tabs').tabs('close', subtitle);
    })
    /*为选项卡绑定右键*/
    top.$(".tabs-inner").bind('contextmenu', function (e) {
    	top.$('#mm').menu('show', {
            left: e.pageX,
            top: e.pageY
        });
        var subtitle = $(this).children(".tabs-closable").text();
        top.$('#mm').data("currtab", subtitle);
        top.$('#tabs').tabs('select', subtitle);
        return false;
    });
}
//绑定右键菜单事件
function tabCloseEven() {
	top.$('#mm').menu({
        onClick: function (item) {
            closeTab(item.id);
        }
    });
    return false;
}

//创建/移除tab
function addTab(subtitle, url, icon) {
	var tabs = top.$("#tabs");
    if (!tabs.tabs('exists', subtitle)) {
    	tabs.tabs('add', {
            title: subtitle,
            content: createFrame(url),
            closable: true,
            icon: icon
        });
    } else {
    	tabs.tabs('select', subtitle);
        $('#mm-tabupdate').click();
    }
    tabClose();
}
function removeTab() {
	var tabs = top.$("#tabs");
    var tab = tabs.tabs('getSelected');
    if (tab) {
        var index = tabs.tabs('getTabIndex', tab);
        tabs.tabs('close', index);
    }
}
//创建Frame
function createFrame(url) {
    var s = '<iframe scrolling="auto" frameborder="0"  src="' + url + '" style="width:100%;height:100%;display:block;"></iframe>';
    return s;
}

//关闭tab
function closeTab(action) {
	var tabs = top.$("#tabs");
    var alltabs = tabs.tabs('tabs');
    var currentTab = tabs.tabs('getSelected');
    var allTabtitle = [];
    
    $.each(alltabs, function (i, n) {
        allTabtitle.push(top.$(n).panel('options').title);
    })
    switch (action) {
        case "refresh":
            var iframe = currentTab.find('iframe')[0];
            var src = iframe.src;
            tabs.tabs('update', {
                tab: currentTab,
                options: {
                    content: createFrame(src)
                }
            })
            break;
        case "close":        	
            var currtab_title = currentTab.panel('options').title;
            if (currtab_title != onlyOpenTitle) {
            	tabs.tabs('close', currtab_title);
            }else{
            	alert("主页不能关闭  ^_^");
            }
            break;
        case "closeall":
            $.each(allTabtitle, function (i, n) {
                if (n != onlyOpenTitle) {
                	tabs.tabs('close', n);
                }
            });
            break;
        case "closeother":
            var currtab_title = currentTab.panel('options').title;
            $.each(allTabtitle, function (i, n) {
                if (n != currtab_title && n != onlyOpenTitle) {
                	tabs.tabs('close', n);
                }
            });
            break;
        case "closeright":
            var tabIndex = tabs.tabs('getTabIndex', currentTab);

            if (tabIndex == alltabs.length - 1) {
                alert('亲，后边没有啦 ^_^');
                return false;
            }
            $.each(allTabtitle, function (i, n) {
                if (i > tabIndex) {
                    if (n != onlyOpenTitle) {
                        $('#tabs').tabs('close', n);
                    }
                }
            });
            break;
        case "closeleft":
            var tabIndex = tabs.tabs('getTabIndex', currentTab);
            if (tabIndex == 1) {
                alert('亲，前边那个上头有人，咱惹不起哦。 ^_^');
                return false;
            }
            $.each(allTabtitle, function (i, n) {
                if (i < tabIndex) {
                    if (n != onlyOpenTitle) {
                    	tabs.tabs('close', n);
                    }
                }
            });
            break;
        case "exit":
            $('#closeMenu').menu('hide');
            break;
    }
}



//使不支持console对象的浏览器中使用console的下述方法不出错，避免中断正常的JS执行。
if (typeof console == 'undefined' || console == null) {
	console = {
		log : function(s) {
		},
		debug : function(s) {
		},
		info : function(s) {
		},
		warn : function(s) {
		},
		error : function(s) {
		},
		fatal : function(s) {
		},
		message : function(s) {
		}
	};
}

//remove whitespaces from both sides of a string
if (String.prototype.trim == undefined) {
	String.prototype.trim = function() {
	    return this.replace(/^\s+|\s+$/gm,'');
	};
}

(function() {
	var userAgent = window.navigator.userAgent.toLowerCase(), 
	ios = /iphone|ipod|ipad/.test(userAgent);
	if (ios) {
		// 设置body的宽度为窗口的宽度，已限定内容的宽度。因为在ipad中给iframe指定宽度无效，最终宽度由内容的宽度决定。
		if (self.frameElement && self.frameElement.tagName == "IFRAME") {
			var containerWidth = $(self.frameElement).parent().width() - 2;
			$('body').width(containerWidth);
			$(self.frameElement).parent().css({
				overflow: 'auto',
				'-webkit-overflow-scrolling': 'touch'
         });
		}
	}
})();

/* 打开一个标签 */
function openTab(title, url, icon){
 /**
  如果这个标题的标签存在，则选择该标签
  否则添加一个标签到标签组
  */
	var tabs = top.$("#home-tab");
 if(tabs.tabs('exists', title)){
		var t = tabs.tabs("getTab",title);
 	var _url = $(t.panel('options').content).attr('src');
 	if(_url != url) {
         /* 重新设置该标签 */
 		tabs.tabs('update',{
             tab:t,
             options:{
                 content: createTabContent(url,title)
             }
         });
 	}
 	tabs.tabs('select', title);
 }else{
 	var content = '';
     if(url==null) {
         content = "页面不存在";
     } else {
         content = createTabContent(url,title);
     }
     tabs.tabs('add',{
         title: title,
         content: content,
         closable: true,
         icon: icon
     });
     bindTabEvent();
     bindCtxMenuEvent();
 }
}

/* 生成标签内容 */
function createTabContent(url,title){
 return '<iframe name="'+title+'"style="width:100%;height:100%;" class="iframe-fit" scrolling="auto" frameborder="0" src="' + url + '"></iframe>';
}

/* 关闭标签 */
function closeTab(whitch) {
	var tabs = top.$("#home-tab");
 if(tabs.tabs('getTab',whitch)!=null)
     if(tabs.tabs('getTab',whitch).panel('options').closable)
     	tabs.tabs('close', whitch);
}
function closeCurTab(){
	var tab = top.$("#home-tab").tabs('getSelected');
	var index = top.$("#home-tab").tabs('getTabIndex',tab);
 closeTab(index);
}
//绑定标签页点击事件
function bindTabEvent()
{
 /*双击关闭TAB选项卡*/
	top.$(".tabs-inner").dblclick(function(){
     var subtitle = $(this).children("span").text();
     closeTab(subtitle);
//     $('#tabs').tabs('close',subtitle);
 });

 top.$(".tabs-inner").bind('contextmenu',function(e){
 	top.$('#home-tab-menu').menu('show', {
         left: e.pageX,
         top: e.pageY
     });

     var subtitle =$(this).children("span").text();
     $('#home-tab-menu').data("currtab",subtitle);

     return false;
 });
}

//绑定右键菜单事件
function bindCtxMenuEvent()
{
 //关闭当前
 $('#htm-tabclose').click(function(){
     var currtab_title = $('#home-tab-menu').data("currtab");
     closeTab(currtab_title);
//     if($('#tabs').getTab(currtab_title).closable)
//         $('#tabs').tabs('close',currtab_title);
 });
 //全部关闭
 $('#htm-tabcloseall').click(function(){
     $('.tabs-inner span').each(function(i,n){
         var t = $(n).text();
         closeTab(t);
//         if($('#tabs').getTab(t).closable)
//             $('#tabs').tabs('close',t);
     });
 });
 //关闭除当前之外的TAB
 $('#htm-tabcloseother').click(function(){
     var currtab_title = $('#home-tab-menu').data("currtab");
     $('.tabs-inner span').each(function(i,n){
         var t = $(n).text();
         if(t!=currtab_title)
             closeTab(t);
//             $('#tabs').tabs('close',t);
     });
 });
 //关闭当前右侧的TAB
 $('#htm-tabcloseright').click(function(){
     var nextall = $('.tabs-selected').nextAll();
     if(nextall.length==0){
         //msgShow('系统提示','后边没有啦~~','error');
         alert('后边没有啦~~');
         return false;
     }
     nextall.each(function(i,n){
         var t=$('a:eq(0) span',$(n)).text();
         closeTab(t);
//         $('#tabs').tabs('close',t);
     });
     return false;
 });
 //关闭当前左侧的TAB
 $('#htm-tabcloseleft').click(function(){
     var prevall = $('.tabs-selected').prevAll();
     if(prevall.length==0){
         alert('到头了，前边没有啦~~');
         return false;
     }
     prevall.each(function(i,n){
         var t=$('a:eq(0) span',$(n)).text();
         closeTab(t);
//         $('#tabs').tabs('close',t);
     });
     return false;
 });
 //刷新
 $("#htm-refresh").click(function(){
     //获取选中的标签项
     var currTab = $('#home-tab').tabs('getSelected');

     //获取该选项卡中内容标签（iframe）的 src 属性
     var url = $(currTab.panel('options').content).attr('src');
     var title = $(currTab.panel('options').content).attr('name');
     /* 重新设置该标签 */
     $('#home-tab').tabs('update',{
         tab:currTab,
         options:{
             content: createTabContent(url,title)
         }
     });
 });
}

/**
* 使元素自适应浏览器窗口高度，即设置元素的高度为从当前obj的位置开始到窗口底部的高度。 注：如果元素是隐藏的，则不改变元素的高度。
* 
* @param id
*            DOM元素ID
* @param adjust
*            元素底部与窗口底部的偏离像素值，
*            R1: 不是数字时默认设为0表示没有偏离；
*            R2: 负数表示与窗口底部的间隔；
*            R3: 正数表示超过窗口底部的距离。
*            注：以上规则只有当元素的高度大于minHeight并小于maxHeight时适用。
* @param minHeight
*            元素最小高度，不是大于0的数字时默认设为0
* @param maxHeight
*            元素最大高度，不是数字时默认设为null表示没有最大高度限制，小于minHeight则设为minHeight
* @param fn
*            调整元素高度后的回调函数
*/
function autoFitWindowRestHeight(id, adjust, minHeight, maxHeight, fn) {
	var timer = 200;
	var $e = $("#" + id);
	if ($e.length && $e.offset() && $e.offset().top > 0) {
		if (adjust == null || isNaN(adjust)) {
			adjust = 0;
		}
		if (minHeight == null || isNaN(minHeight) || minHeight < 0) {
			minHeight = 0;
		}
		if (maxHeight == null || isNaN(maxHeight)) {
			maxHeight = null;
		} else if (maxHeight < minHeight) {
			maxHeight = minHeight;
		}
		var scrollTop = window.pageYOffset
				|| (document.documentElement && document.documentElement.scrollTop)
				|| document.body.scrollTop;
		var targetHeight = scrollTop + $(window).height() - $e.offset().top - 20
				+ adjust;
		var lastWidth = $e.attr("__lastWidth") || 0;
		var lastTargetHeight = $e.attr("__lastTargetHeight") || 0;
		if (lastTargetHeight != targetHeight || lastWidth != $e.width()) {
//			alert("\nwindow scrollTop: "
//					 + scrollTop + ", " + $(window).scrollTop)
			// alert("top: " + $('#autoHeight').offset().top + "\nleft: "
			// + $('#autoHeight').offset().left + "\nwindow scrollTop: "
			// + scrollTop + "\nwindow height: " + $(window).height());
			timer = 200;
			var trueHeight = targetHeight < minHeight ? minHeight
					: targetHeight;
			trueHeight = maxHeight != null && trueHeight > maxHeight ? maxHeight : trueHeight;
			$e.height(trueHeight);
			$e.attr("__lastWidth", $e.width());
			$e.attr("__lastTargetHeight", targetHeight);
			$e.attr("__isResizeDone", "y");
//			alert("targetHeight: " + targetHeight + "\nlastTargetHeight: "
//					+ lastTargetHeight + "\nadjust: " + adjust
//					+ "\nminHeight: " + minHeight + "\nmaxHeight: " + maxHeight
//					+ "\ntrueHeight: " + trueHeight);
		} else {
			timer = 500; // 降低频率
			if ($e.attr("__isResizeDone") == "y") {
				try { // 没变化就不调用，减少占用CPU资源。
					// alert('call' + fn);
					fn.call(this);
				} catch (e) {
					// not a function
				}
				$e.attr("__isResizeDone", "n");
			}
		}
	}
	setTimeout(function() {
		autoFitWindowRestHeight(id, adjust, minHeight, maxHeight, fn);
	}, timer);
}

function back() {
 window.history.back();
}
function href(url) {
 window.location.href = url;
}

/*! qwest 1.7.0 (https://github.com/pyrsmk/qwest) */

;(function(context,name,definition){
	if(typeof module!='undefined' && module.exports){
		module.exports=definition;
	}
	else if(typeof define=='function' && define.amd){
		define(definition);
	}
	else{
		context[name]=definition;
	}
}(this,'qwest',function(){

	var win=window,
		doc=document,
		before,
		// Default response type for XDR in auto mode
		defaultXdrResponseType='json',
		// Variables for limit mechanism
		limit=null,
		requests=0,
		request_stack=[],
		// Get XMLHttpRequest object
		getXHR=function(){
				return win.XMLHttpRequest?
						new XMLHttpRequest():
						new ActiveXObject('Microsoft.XMLHTTP');
			},
		// Guess XHR version
		xhr2=(getXHR().responseType===''),

	// Core function
	qwest=function(method,url,data,options,before){

		// Format
		method=method.toUpperCase();
		data=data || null;
		options=options || {};

		// Define variables
		var nativeResponseParsing=false,
			crossOrigin,
			xhr,
			xdr=false,
			timeoutInterval,
			aborted=false,
			attempts=0,
			headers={},
			mimeTypes={
				text: '*/*',
				xml: 'text/xml',
				json: 'application/json',
				post: 'application/x-www-form-urlencoded'
			},
			accept={
				text: '*/*',
				xml: 'application/xml; q=1.0, text/xml; q=0.8, */*; q=0.1',
				json: 'application/json; q=1.0, text/*; q=0.8, */*; q=0.1'
			},
			contentType='Content-Type',
			vars='',
			i,j,
			serialized,
			then_stack=[],
			catch_stack=[],
			complete_stack=[],
			response,
			success,
			error,
			func,

		// Define promises
		promises={
			then:function(func){
				if(options.async){
					then_stack.push(func);
				}
				else if(success){
					func.call(xhr,response);
				}
				return promises;
			},
			'catch':function(func){
				if(options.async){
					catch_stack.push(func);
				}
				else if(error){
					func.call(xhr,response);
				}
				return promises;
			},
			complete:function(func){
				if(options.async){
					complete_stack.push(func);
				}
				else{
					func.call(xhr);
				}
				return promises;
			}
		},
		promises_limit={
			then:function(func){
				request_stack[request_stack.length-1].then.push(func);
				return promises_limit;
			},
			'catch':function(func){
				request_stack[request_stack.length-1]['catch'].push(func);
				return promises_limit;
			},
			complete:function(func){
				request_stack[request_stack.length-1].complete.push(func);
				return promises_limit;
			}
		},

		// Handle the response
		handleResponse=function(){
			// Verify request's state
			// --- https://stackoverflow.com/questions/7287706/ie-9-javascript-error-c00c023f
			if(aborted){
				return;
			}
			// Prepare
			var i,req,p,responseType;
			--requests;
			// Clear the timeout
			clearInterval(timeoutInterval);
			// Launch next stacked request
			if(request_stack.length){
				req=request_stack.shift();
				p=qwest(req.method,req.url,req.data,req.options,req.before);
				for(i=0;func=req.then[i];++i){
					p.then(func);
				}
				for(i=0;func=req['catch'][i];++i){
					p['catch'](func);
				}
				for(i=0;func=req.complete[i];++i){
					p.complete(func);
				}
			}
			// Handle response
			try{
				// Init
				var responseText='responseText',
					responseXML='responseXML',
					parseError='parseError';
				// Process response
				if(nativeResponseParsing && 'response' in xhr && xhr.response!==null){
					response=xhr.response;
				}
				else if(options.responseType=='document'){
					var frame=doc.createElement('iframe');
					frame.style.display='none';
					doc.body.appendChild(frame);
					frame.contentDocument.open();
					frame.contentDocument.write(xhr.response);
					frame.contentDocument.close();
					response=frame.contentDocument;
					doc.body.removeChild(frame);
				}
				else{
					// Guess response type
					responseType=options.responseType;
					if(responseType=='auto'){
						if(xdr){
							responseType=defaultXdrResponseType;
						}
						else{
							var ct=xhr.getResponseHeader(contentType) || '';
							if(ct.indexOf(mimeTypes.json)>-1){
								responseType='json';
							}
							else if(ct.indexOf(mimeTypes.xml)>-1){
								responseType='xml';
							}
							else{
								responseType='text';
							}
						}
					}
					// Handle response type
					switch(responseType){
						case 'json':
							try{
								if('JSON' in win){
									response=JSON.parse(xhr[responseText]);
								}
								else{
									response=eval('('+xhr[responseText]+')');
								}
							}
							catch(e){
								throw "Error while parsing JSON body : "+e;
							}
							break;
						case 'xml':
							// Based on jQuery's parseXML() function
							try{
								// Standard
								if(win.DOMParser){
									response=(new DOMParser()).parseFromString(xhr[responseText],'text/xml');
								}
								// IE<9
								else{
									response=new ActiveXObject('Microsoft.XMLDOM');
									response.async='false';
									response.loadXML(xhr[responseText]);
								}
							}
							catch(e){
								response=undefined;
							}
							if(!response || !response.documentElement || response.getElementsByTagName('parsererror').length){
								throw 'Invalid XML';
							}
							break;
						default:
							response=xhr[responseText];
					}
				}
				// Late status code verification to allow data when, per example, a 409 is returned
				// --- https://stackoverflow.com/questions/10046972/msie-returns-status-code-of-1223-for-ajax-request
				if('status' in xhr && !/^2|1223/.test(xhr.status)){
					throw xhr.status+' ('+xhr.statusText+')';
				}
				// Execute 'then' stack
				success=true;
				p=response;
				if(options.async){
					for(i=0;func=then_stack[i];++i){
						p=func.call(xhr, p);
					}
				}
			}
			catch(e){
				error=true;
				// Execute 'catch' stack
				if(options.async){
					for(i=0;func=catch_stack[i];++i){
						func.call(xhr, e, response);
					}
				}
			}
			// Execute complete stack
			if(options.async){
				for(i=0;func=complete_stack[i];++i){
					func.call(xhr, response);
				}
			}
		},

		// Handle errors
		handleError= function(e){
			error=true;
			--requests;
			// Clear the timeout
			clearInterval(timeoutInterval);
			// Execute 'catch' stack
			if(options.async){
				for(i=0;func=catch_stack[i];++i){
					func.call(xhr, e, null);
				}
			}
		},

		// Recursively build the query string
		buildData=function(data,key){
//			var res=[],
//				enc=encodeURIComponent,
//				p;
//			if(typeof data==='object' && data!=null) {
//				for(p in data) {
//					if(data.hasOwnProperty(p)) {
//						var built=buildData(data[p],key?key+'['+p+']':p);
//						if(built!==''){
//							res=res.concat(built);
//						}
//					}
//				}
//			}
//			else if(data!=null && key!=null){
//				res.push(enc(key)+'='+enc(data));
//			}
//			return res.join('&');
			//参数data是一个js对象，默认使用$.param来转换js对象
			data = (data==null || data=="" || typeof(data)=="undefined")? {"date": new Date().getTime()} : $.extend(data, {"date": new Date().getTime()});
			return $.param(data);
		};

		// New request
		++requests;

		if ('retries' in options) {
			if (win.console && console.warn) {
				console.warn('[Qwest] The retries option is deprecated. It indicates total number of requests to attempt. Please use the "attempts" option.');
			}
			options.attempts = options.retries;
		}

		// Normalize options
		options.async='async' in options?!!options.async:true;
		options.cache=false;
//		options.cache='cache' in options?!!options.cache:(method!='GET');
		options.dataType='dataType' in options?options.dataType.toLowerCase():'post';
		options.responseType='responseType' in options?options.responseType.toLowerCase():'auto';
		options.user=options.user || '';
		options.password=options.password || '';
		options.withCredentials=!!options.withCredentials;
		options.timeout='timeout' in options?parseInt(options.timeout,10):30000;
		options.attempts='attempts' in options?parseInt(options.attempts,10):1;

		// Guess if we're dealing with a cross-origin request
		i=url.match(/\/\/(.+?)\//);
		crossOrigin=i && i[1]?i[1]!=location.host:false;

		// Prepare data
		if('ArrayBuffer' in win && data instanceof ArrayBuffer){
			options.dataType='arraybuffer';
		}
		else if('Blob' in win && data instanceof Blob){
			options.dataType='blob';
		}
		else if('Document' in win && data instanceof Document){
			options.dataType='document';
		}
		else if('FormData' in win && data instanceof FormData){
			options.dataType='formdata';
		}
		switch(options.dataType){
			case 'json':
				data=JSON.stringify(data);
				break;
			case 'post':
				data=buildData(data);
		}

		// Prepare headers
		if(options.headers){
			var format=function(match,p1,p2){
				return p1+p2.toUpperCase();
			};
			for(i in options.headers){
				headers[i.replace(/(^|-)([^-])/g,format)]=options.headers[i];
			}
		}
		if(!headers[contentType] && method!='GET'){
			if(options.dataType in mimeTypes){
				if(mimeTypes[options.dataType]){
					headers[contentType]=mimeTypes[options.dataType];
				}
			}
		}
		if(!headers.Accept){
			headers.Accept=(options.responseType in accept)?accept[options.responseType]:'*/*';
		}
		if(!crossOrigin && !headers['X-Requested-With']){ // because that header breaks in legacy browsers with CORS
			headers['X-Requested-With']='XMLHttpRequest';
		}

		// Prepare URL
		if(method=='GET' && data){
			vars+=data;
		}
		if(!options.cache){
			if(vars){
				vars+='&';
			}
			vars+='_t='+(+new Date());
		}
		if(vars){
			url+=(/\?/.test(url)?'&':'?')+vars;
		}

		// The limit has been reached, stock the request
		if(limit && requests==limit){
			request_stack.push({
				method	: method,
				url		: url,
				data	: data,
				options	: options,
				before	: before,
				then	: [],
				'catch'	: [],
				complete: []
			});
			return promises_limit;
		}

		// Send the request
		var send=function(){
			// Get XHR object
			xhr=getXHR();
			if(crossOrigin){
				if(!('withCredentials' in xhr) && win.XDomainRequest){
					xhr=new XDomainRequest(); // CORS with IE8/9
					xdr=true;
					if(method!='GET' && method!='POST'){
						method='POST';
					}
				}
			}
			// Open connection
			if(xdr){
				xhr.open(method,url);
			}
			else{
				xhr.open(method,url,options.async,options.user,options.password);
				if(xhr2 && options.async){
					xhr.withCredentials=options.withCredentials;
				}
			}
			// Set headers
			if(!xdr){
				for(var i in headers){
					xhr.setRequestHeader(i,headers[i]);
				}
			}
			// Verify if the response type is supported by the current browser
			if(xhr2 && options.responseType!='document' && options.responseType!='auto'){ // Don't verify for 'document' since we're using an internal routine
				try{
					xhr.responseType=options.responseType;
					nativeResponseParsing=(xhr.responseType==options.responseType);
				}
				catch(e){}
			}
			// Plug response handler
			if(xhr2 || xdr){
				xhr.onload=handleResponse;
				xhr.onerror=handleError;
			}
			else{
				xhr.onreadystatechange=function(){
					if(xhr.readyState==4){
						handleResponse();
					}
				};
			}
			// Override mime type to ensure the response is well parsed
			if(options.responseType!='auto' && 'overrideMimeType' in xhr){
				xhr.overrideMimeType(mimeTypes[options.responseType]);
			}
			// Run 'before' callback
			if(before){
				before.call(xhr);
			}
			// Send request
			if(xdr){
				setTimeout(function(){ // https://developer.mozilla.org/en-US/docs/Web/API/XDomainRequest
					xhr.send(method!='GET'?data:null);
				},0);
			}
			else{
				xhr.send(method!='GET'?data:null);
			}
		};

		// Timeout/attempts
		var timeout=function(){
			timeoutInterval=setTimeout(function(){
				aborted=true;
				xhr.abort();
				if(!options.attempts || ++attempts!=options.attempts){
					aborted=false;
					timeout();
					send();
				}
				else{
					aborted=false;
					error=true;
					response='Timeout ('+url+')';
					if(options.async){
						for(i=0;func=catch_stack[i];++i){
							func.call(xhr,response);
						}
					}
				}
			},options.timeout);
		};

		// Start the request
		timeout();
		send();

		// Return promises
		return promises;

	};

	// Return external qwest object
	var create=function(method){
			return function(url,data,options){
				var b=before;
				before=null;
				return qwest(method,this.base+url,data,options,b);
			};
		},
		obj={
         base: '',
			before: function(callback){
				before=callback;
				return obj;
			},
			get: create('GET'),
			post: create('POST'),
			put: create('PUT'),
			'delete': create('DELETE'),
			xhr2: xhr2,
			limit: function(by){
				limit=by;
			},
			setDefaultXdrResponseType: function(type){
				defaultXdrResponseType=type.toLowerCase();
			}
		};
	return obj;

}()));


/**
* 通过请求获取数据
* @param url 请求URL
* @param data 请求数据，必须是js对象
* @param options
* @param successfn 成功的回调函数，返回值是一个对象
* @param errorfn 失败的回调函数，如果不设置，则默认弹框提示请求异常
* 
*/
function http(url,data,successfn, errorfn) {
	qwest
	.before(function(){
		//加载蒙版
		loading();
	})
	.post(url,{"___p":JSON.stringify(data)})
	.then(function(resp){
		var data = JSON.parse(resp);
		if(!data.retMsg) {
			if (errorfn)
				errorfn(data);
			else
				parent.$.messager.alert('返回信息', '数据请求异常', 'warning');
		}else if(data.retMsg.code==2) {
			if (errorfn)
				errorfn(data);
			else
				//仅提示失败的操作提示信息
	            parent.$.messager.alert('返回信息', '【' + data.retMsg.msg + '】', 'warning');
		} else {
			successfn(data);
		}
	})
	['catch'](function(e,resp){
		unloading();
		alert("数据处理异常");
//		//console.debug(e);
		if(errorfn !=null)
			errorfn(e);
	})
	.complete(function(){
		unloading();
	});
}

$.extend({
 getUrlVars: function(){
     var vars = [], hash;
	//url中可能出现#
     var hashes = window.location.search.slice(window.location.search.indexOf('?') + 1).split('&');
     for(var i = 0; i < hashes.length; i++)
     {
         hash = hashes[i].split('=');
         vars.push(hash[0]);
         vars[hash[0]] = hash[1];
     }
     return vars;
 },
 getUrlVar: function(name){
     return $.getUrlVars()[name];
 },
 myAjax:function(url, data, successfn, errorfn) {
 	//获取时间戳
 	var timestamp=(new Date()).valueOf();
 	   //将时间戳附加到url上
 	if(url.indexOf("?")>=0) {
	       url=url+"&_t="+timestamp;
		} else {
	       url=url+"?_t="+timestamp;
		}
     async = "true";
     type = "post";
     dataType = "json";
     //增加日期参数，保证每次的请求都不一样
     data = (data==null || data=="" || typeof(data)=="undefined")? {"date": new Date().getTime()} : $.extend(data, {"date": new Date().getTime()});
		//加载蒙版
		loading();
     $.ajax({
         type: type,
         async: async,
         data: {"___p":JSON.stringify(data)},
         url: url,
         dataType:"json",
         success: function(d){
//             if(d.readyState==4 && d.status==200) {
//                 data = d.responseText
         	unloading();
             successfn(d);
//             }
         },
         error: function(e){
         	unloading();
             errorfn(e);
         }
     });
 }
});
$.extend($.fn.form.methods, {
 myLoad : function (jq, param) {
     return jq.each(function () {
         load(this, param);
     });

     function load(target, param) {
         if (!$.data(target, "form")) {
             $.data(target, "form", {
                 options : $.extend({}, $.fn.form.defaults)
             });
         }
         var options = $.data(target, "form").options;
         if (typeof param == "string") {
             var params = {};
             if (options.onBeforeLoad.call(target, params) == false) {
                 return;
             }
             $.ajax({
                 url : param,
                 data : params,
                 dataType : "json",
                 success : function (rsp) {
                     loadData(rsp);
                 },
                 error : function () {
                     options.onLoadError.apply(target, arguments);
                 }
             });
         } else {
             loadData(param);
         }
         function loadData(dd) {
             var form = $(target);
             var formFields = form.find("input[name],select[name],textarea[name]");
             formFields.each(function(){
                 var name = this.name;
                 var value = jQuery.proxy(function(){try{return eval('this.'+name);}catch(e){return "";}},dd)();
                 var rr = setNormalVal(name,value);
                 if (!rr.length) {
//                     var f = form.find("input[numberboxName=\"" + name + "\"]");
//                     if (f.length) {
//                         f.numberbox("setValue", value);
//                     }
                     //新版本的easyui已经统一使用textboxname作为统一标志，numberboxName依旧有保留
                     var t = form.find("input[textboxname=\""+name+"\"]");
                     if(t.length) {
                         t.textbox("setValue",value);
                     }
                         $("input[name=\"" + name + "\"]", form).val(value);
                         $("textarea[name=\"" + name + "\"]", form).val(value);
                         $("select[name=\"" + name + "\"]", form).val(value);
                 }
                 setPlugsVal(name,value);
             });
             $('.easyui-textbox').each(function () {
             	var text = $(this).textbox('getText');
             	var value = $(this).textbox('getValue');
             	if (text != value) {
             		$(this).textbox('setText', value);
             	}
             });
             
             options.onLoadSuccess.call(target, dd);
             $(target).form("validate");
         };
         function setNormalVal(key, val) {
             var rr = $(target).find("input[name=\"" + key + "\"][type=radio], input[name=\"" + key + "\"][type=checkbox]");
             rr._propAttr("checked", false);
             rr.each(function () {
                 var f = $(this);
                 if (f.val() == String(val) || $.inArray(f.val(), val) >= 0) {
                     f._propAttr("checked", true);
                 }
             });
             return rr;
         };
         function setPlugsVal(key, val) {
         	try {
                 var form = $(target);
                 var cc = ["combobox", "combotree", "combogrid", "datetimebox", "datebox", "combo"];
                 var c = form.find("[comboName=\"" + key + "\"]");
                 if (c.length) {
                     for (var i = 0; i < cc.length; i++) {
                         var combo = cc[i];
                         if (c.hasClass(combo + "-f")) {
                             if (c[combo]("options").multiple) {
                                 c[combo]("setValues", val);
                             } else {
                                 c[combo]("setValue", val);
                             }
                             return;
                         }
                     }
                 }
         	} catch (e) {
         	}
         };
     };
 }
});

//增加日期格式化函数
Date.prototype.format = function(format) {
	var o = {
		"M+" : this.getMonth() + 1, // month
		"d+" : this.getDate(), // day
		"h+" : this.getHours(), // hour
		"m+" : this.getMinutes(), // minute
		"s+" : this.getSeconds(), // second
		"q+" : Math.floor((this.getMonth() + 3) / 3), // quarter
		"S" : this.getMilliseconds()
	// millisecond
	};
	if (/(y+)/.test(format))
		format = format.replace(RegExp.$1, (this.getFullYear() + "")
				.substr(4 - RegExp.$1.length));
	for ( var k in o)
		if (new RegExp("(" + k + ")").test(format))
			format = format.replace(RegExp.$1, RegExp.$1.length == 1 ? o[k]
					: ("00" + o[k]).substr(("" + o[k]).length));
	return format;
};

/**
* 增加数据加载的遮罩层
*/
function loading() {
	y = document.body.scrollTop + ($(window).height() - 45) / 2 ;
 $("<div class=\"datagrid-mask\"></div>").css({"z-index":10000, display: "block", width: "100%", height: $(document).height() }).appendTo("body");
 $("<div class=\"datagrid-mask-msg\"></div>").html("正在处理，请稍候。。。").appendTo("body").css({"z-index":10000,  height:"40px", display: "block", left: ($(document.body).outerWidth(true) - 190) / 2, top: y });
}


/**
* 去除遮罩层
*/
function unloading() {
 $(".datagrid-mask").remove();
 $(".datagrid-mask-msg").remove();
}
function alert(msg){	
	$.messager.alert("警告",msg,"warning");
}
function info(msg){	
	$.messager.alert("信息",msg,"info");
}
function error(msg){	
	$.messager.alert("错误",msg,"error");
}
function myAjaxError(msg){	
//	console.debug(msg);
	$.messager.alert('返回信息', '访问服务器出现异常，请联系管理员。异常信息：' + msg, 'warning', null);
}

function isJson(obj){
 var isjson = typeof(obj) == "object" && Object.prototype.toString.call(obj).toLowerCase() == "[object object]" 
 	&& !obj.length;
 return isjson;
}

function ajaxResponse(data, successFn, errorfn) {
	try {
		var jsondata = null;
		if (!isJson(data))  {
			jsondata = JSON.parse(data);
		} else {
			jsondata = data;
		}
		var retMsg = jsondata.retMsg;
		if (retMsg.code == 1) {
			successFn(jsondata);
		} else {
			$.messager.alert('返回信息', '处理出现异常，请联系管理员。异常信息：' + retMsg.msg,
					'warning', function() {
						if (errorfn) errorfn();
						return;
					});
		}
	} catch (ex) {
		$.messager.alert('错误信息', '信息出现异常，请联系管理员。异常信息：' + ex, 'warning',
				function() {
					if (errorfn) errorfn();
					return;
				});
		return;
	}
}

//radio - jQuery EasyUI
(function ($) {
	var STYLE = {
		radio : {
			cursor : "pointer",
			background : "transparent url('data:image/gif;base64,R0lGODlhDwAmANUAAP////z8/Pj4+Ovr6/v7++7u7uPj493d3ff39/Ly8vT09ICAgPX19a+vr+Li4urq6vn5+fr6+v39/dXV1efn5+bm5uTk5ODg4N7e3v7+/vHx8fDw8O3t7e/v74eHh+Hh4c3NzdfX1+np6eXl5cDAwNra2t/f38/Pz/Pz8/b29sbGxsHBwc7OzsLCwujo6NHR0by8vL29vcXFxb+/v7m5udPT09jY2MPDw7u7u7i4uNLS0uzs7AAAAAAAAAAAAAAAACH5BAAAAAAALAAAAAAPACYAAAb/QIBwSCwaj0VGSIbLzUAXQfFDap1KjktJVysMHTHQ4WKgPAqaymQDYJBYh4/FNSgkGIjBgRC6YRwjIjsddwIRAQ4cKi8GFSIcGygphgEBBRYwB2ZoCggQBJUBCBg0FHV3nqChBAcrFYQMlKGVAgYnJpKyswEJDwYTqbuhAwoQEw+qwgoDEgAbNhzCAQoiUkIaGAYdCAQCCQMD1kMEBSMmBxbEzUjs7e7v8EJKTE5Q4kJUVlhaXF5CYGLIbEqzps2bOHNO4dHDxw+gAgIyREBAKdGiRgUMNPDQwICqS5nMQGiwoGSDDJVGlaqTwUPJBR4AVGLlihABkiZRBqh1S1IELY0cDUio1OtXKgkZAGQYWomYMWTSpjFzBk0aNXHYtHHzBu4eAHLm0KmLR5ZIEAA7') no-repeat center top",
			verticalAlign : "middle",
			height : "19px",
			width : "18px",
			display : "block"
		},
		span : {
			"float" : "left",
			display : "block",
			marginTop : "3px",
			lineHeight: "24px"
		},
		label : {
			marginTop : "0px",
			marginRight : "5px",
			marginLeft : "2px",
			display : "block",
			"float" : "left",
			fontSize : "12px",
			cursor : "pointer",
			marginBottom: "0px",
			fontWeight: "normal"
				
		}
	};
	
	function rander(target) {
		var jqObj = $(target);
		jqObj.css('display', 'inline-block');
		jqObj.css('vertical-align','middle');
		jqObj.css('line-height','24px');
		var radios = jqObj.children('input[type=radio]');
		var checked = null;
		
		radios.each(function () {
			var jqRadio = $(this);
			var jqWrap = $('<span/>').css(STYLE.span);
			var jqLabel = $('<label/>').css(STYLE.label);
			var jqRadioA = $('<a/>').data('lable', jqLabel).addClass("RadioA").css(STYLE.radio).text(' ');
			var labelText = jqRadio.data('lable', jqLabel).attr('label');
			jqRadio.hide();
			jqRadio.after(jqLabel.text(labelText));
			jqRadio.wrap(jqWrap);
			jqRadio.before(jqRadioA);
			if (jqRadio.prop('checked')) {
				checked = jqRadioA;
			}
			
			jqLabel.click(function () {
				(function (rdo) {
					rdo.prop('checked', true);
					radios.each(function () {
						var rd = $(this);
						var y = 'top';
						if (rd.prop('checked')) {
							y = 'bottom';
						}
						rd.prev().css('background-position', 'center ' + y);
					});
				})(jqRadio);
			});
			
			jqRadioA.click(function () {
				$(this).data('lable').click();
			});
		});
		if(checked)
			checked.css('background-position', 'center bottom');
	}
	
	$.fn.radio = function (options, param) {
		if (typeof options == 'string') {
			return $.fn.radio.methods[options](this, param);
		}
		
		options = options || {};
		return this.each(function () {
			if (!$.data(this, 'radio')) {
				$.data(this, 'radio', {
					options : $.extend({}, $.fn.radio.defaults, options)
				});
				rander(this);
			} else {
				var opt = $.data(this, 'radio').options;
				$.data(this, 'radio', {
					options : $.extend({}, opt, options)
				});
			}
		});
	};
	
	$.fn.radio.methods = {
		getValue : function (jq) {
			var checked = jq.find('input:checked');
			var val = {};
			if (checked.length)
				val[checked[0].name] = checked[0].value;
			
			return val;
		},
		check : function (jq, val) {
			if (val && typeof val != 'object') {
				var ipt = jq.find('input[value=' + val + ']');
				ipt.prop('checked', false).data('lable').click();
			}
		}
	};
	
	$.fn.radio.defaults = {
		style : STYLE
	};
	
	if ($.parser && $.parser.plugins) {
		$.parser.plugins.push('radio');
	}
	
})(jQuery);

//checkbox - jQuery EasyUI
(function ($) {
	
	var STYLE = {
		checkbox : {
			cursor : "pointer",
			background : "transparent url('data:image/gif;base64,R0lGODlhDwAmAKIAAPr6+v///+vr68rKyvT09Pj4+ICAgAAAACH5BAAAAAAALAAAAAAPACYAAANuGLrc/mvISWcYJOutBS5gKIIeUQBoqgLlua7tC3+yGtfojes1L/sv4MyEywUEyKQyCWk6n1BoZSq5cK6Z1mgrtNFkhtx3ZQizxqkyIHAmqtTsdkENgKdiZfv9w9bviXFxXm4KP2g/R0uKAlGNDAkAOw==') no-repeat center top",
			verticalAlign : "middle",
			height : "19px",
			width : "18px",
			display : "block"
		},
		span : {
			"float" : "left",
			display : "block",
//			margin : "0px 4px",
			marginTop : "3px",
			lineHeight: "24px"
		},
		label : {
			marginTop : "0px",
			marginRight : "5px",
			marginLeft : "2px",
			display : "block",
			"float" : "left",
			fontSize : "12px",
			cursor : "pointer",
			marginBottom: "0px",
			fontWeight: "normal"
		}
	};
	
	function rander(target) {
		var jqObj = $(target);
		jqObj.css('display', 'inline-block');
		jqObj.css('vertical-align','middle');
		jqObj.css('line-height','24px');
		var Checkboxs = jqObj.children('input[type=checkbox]');
		Checkboxs.each(function () {
			var jqCheckbox = $(this);
			var jqWrap = $('<span/>').css(STYLE.span);
			var jqLabel = $('<label/>').css(STYLE.label);
			var jqCheckboxA = $('<a/>').data('lable', jqLabel).css(STYLE.checkbox).text(' ');
			var labelText = jqCheckbox.data('lable', jqLabel).attr('label');
			jqCheckbox.hide();
			jqCheckbox.after(jqLabel.text(labelText));
			jqCheckbox.wrap(jqWrap);
			jqCheckbox.before(jqCheckboxA);
			if (jqCheckbox.prop('checked')) {
				jqCheckboxA.css('background-position', 'center bottom');
			}
			
			jqLabel.click(function () {
				(function (ck, cka) {
					ck.prop('checked', !ck.prop('checked'));
					var y = 'top';
					if (ck.prop('checked')) {
						y = 'bottom';
					}
					cka.css('background-position', 'center ' + y);
				})(jqCheckbox, jqCheckboxA);
			});
			
			jqCheckboxA.click(function () {
				$(this).data('lable').click();
			});
		});
	}
	
	$.fn.checkbox = function (options, param) {
		if (typeof options == 'string') {
			return $.fn.checkbox.methods[options](this, param);
		}
		
		options = options || {};
		return this.each(function () {
			if (!$.data(this, 'checkbox')) {
				$.data(this, 'checkbox', {
					options : $.extend({}, $.fn.checkbox.defaults, options)
				});
				rander(this);
			} else {
				var opt = $.data(this, 'checkbox').options;
				$.data(this, 'checkbox', {
					options : $.extend({}, opt, options)
				});
			}
		});
	};
	
	function check(jq, val, check) {
		var ipt = jq.find('input[value=' + val + ']');
		if (ipt.length) {
			ipt.prop('checked', check).each(function () {
				$(this).data('lable').click();
			});
		}
	}
	
	$.fn.checkbox.methods = {
		getValue : function (jq) {
			var checked = jq.find('input:checked');
			var val = {};
			checked.each(function () {
				var kv = val[this.name];
				if (!kv) {
					val[this.name] = this.value;
					return;
				}
				
				if (!kv.sort) {
					val[this.name] = [kv];
				}
				val[this.name].push(this.value);
			});
			return val;
		},
		check : function (jq, vals) {
			if (vals && typeof vals != 'object') {
				check(jq, vals);
			} else if (vals.sort) {
				$.each(vals, function () {
					check(jq, this);
				});
			}
		},
		unCheck : function (jq, vals) {
			if (vals && typeof vals != 'object') {
				check(jq, vals, true);
			} else if (vals.sort) {
				$.each(vals, function () {
					check(jq, this, true);
				});
			}
		},
		checkAll : function (jq) {
			jq.find('input').prop('checked', false).each(function () {
				$(this).data('lable').click();
			});
		},
		unCheckAll : function (jq) {
			jq.find('input').prop('checked', true).each(function () {
				$(this).data('lable').click();
			});
		}
	};
	
	$.fn.checkbox.defaults = {
		style:STYLE
	};
	
	if ($.parser && $.parser.plugins) {
		$.parser.plugins.push('checkbox');
	}
})(jQuery);


/**
* jQuery serializeObject
* @copyright 2014, macek <paulmacek@gmail.com>
* @link https://github.com/macek/jquery-serialize-object
* @license BSD
* @version 2.4.5
*/
(function(root, factory) {

// AMD
if (typeof define === "function" && define.amd) {
 define(["exports", "jquery"], function(exports, $) {
   return factory(exports, $);
 });
}

// CommonJS
else if (typeof exports !== "undefined") {
 var $ = require("jquery");
 factory(exports, $);
}

// Browser
else {
 factory(root, (root.jQuery || root.Zepto || root.ender || root.$));
}

}(this, function(exports, $) {

var patterns = {
 push:     /^$/,
 fixed:    /^\d+$/,

 // validate: /^[a-z_][a-z0-9_]*(?:\[(?:\d*|[a-z0-9_]+)\])*$/i,
 key:      /[a-z0-9_]+|(?=\[\])/gi,
 named:    /^[a-z0-9_]+$/i,

 //use . to nest keys
 validate: /^[a-z][a-z0-9_]*(?:\.[a-z0-9_]+)*(?:\[\])?$/i,
 
 // key:      /[a-z0-9_-]+|(?=\[\])/gi,
 // named:    /^[a-z0-9_-]+$/i
};

function FormSerializer(helper, $form) {

 // private variables
 var data     = {},
     pushes   = {};

 // private API
 function build(base, key, value) {
   base[key] = value;
   return base;
 }

 function makeObject(root, value) {

   var keys = root.match(patterns.key), k;

   // nest, nest, ..., nest
   while ((k = keys.pop()) !== undefined) {
     // foo[]
     if (patterns.push.test(k)) {
       var idx = incrementPush(root.replace(/\[\]$/, ''));
       //不增加下标
       value = build([], idx, value);
//       value = build([], , value);
//       value = build({}, k, value);
     }

     // foo[n]
     else if (patterns.fixed.test(k)) {
       value = build([], k, value);
     }

     // foo; foo[bar]
     else if (patterns.named.test(k)) {
       value = build({}, k, value);
     }
   }

   return value;
 }

 function incrementPush(key) {
   if (pushes[key] === undefined) {
     pushes[key] = 0;
   }
   return pushes[key]++;
 }

 function encode(pair) {
   switch ($('[name="' + pair.name + '"]', $form).attr("type")) {
     case "checkbox":
       return pair.value === "on" ? true : pair.value;
     default:
       return $.trim(pair.value);
   }
 }

 function addPair(pair) {
   if (!patterns.validate.test(pair.name)) return this;
   var obj = makeObject(pair.name, encode(pair));
   data = helper.extend(true, data, obj);
   return this;
 }

 function addPairs(pairs) {
   if (!helper.isArray(pairs)) {
     throw new Error("formSerializer.addPairs expects an Array");
   }
   for (var i=0, len=pairs.length; i<len; i++) {
     this.addPair(pairs[i]);
   }
   return this;
 }

 function serialize() {
   return data;
 }

 function serializeJSON() {
   return JSON.stringify(serialize());
 }

 // public API
 this.addPair = addPair;
 this.addPairs = addPairs;
 this.serialize = serialize;
 this.serializeJSON = serializeJSON;
}

FormSerializer.patterns = patterns;

FormSerializer.serializeObject = function serializeObject() {
 if (this.length > 1) {
   return new Error("jquery-serialize-object can only serialize one form at a time");
 }
 return new FormSerializer($, this).
   addPairs(this.serializeArray()).
   serialize();
};

FormSerializer.serializeJSON = function serializeJSON() {
 if (this.length > 1) {
   return new Error("jquery-serialize-object can only serialize one form at a time");
 }
 return new FormSerializer($, this).
   addPairs(this.serializeArray()).
   serializeJSON();
};

if (typeof $.fn !== "undefined") {
 $.fn.serializeObject = FormSerializer.serializeObject;
 $.fn.serializeJSON   = FormSerializer.serializeJSON;
}

exports.FormSerializer = FormSerializer;

return FormSerializer;
}));

(function() {
	  'use strict';

	  if (self.fetch) {
	    return
	  }

	  function normalizeName(name) {
	    if (typeof name !== 'string') {
	      name = name.toString();
	    }
	    if (/[^a-z0-9\-#$%&'*+.\^_`|~]/i.test(name)) {
	      throw new TypeError('Invalid character in header field name')
	    }
	    return name.toLowerCase()
	  }

	  function normalizeValue(value) {
	    if (typeof value !== 'string') {
	      value = value.toString();
	    }
	    return value
	  }

	  function Headers(headers) {
	    this.map = {}

	    if (headers instanceof Headers) {
	      headers.forEach(function(value, name) {
	        this.append(name, value)
	      }, this)

	    } else if (headers) {
	      Object.getOwnPropertyNames(headers).forEach(function(name) {
	        this.append(name, headers[name])
	      }, this)
	    }
	  }

	  Headers.prototype.append = function(name, value) {
	    name = normalizeName(name)
	    value = normalizeValue(value)
	    var list = this.map[name]
	    if (!list) {
	      list = []
	      this.map[name] = list
	    }
	    list.push(value)
	  }

	  Headers.prototype['delete'] = function(name) {
	    delete this.map[normalizeName(name)]
	  }

	  Headers.prototype.get = function(name) {
	    var values = this.map[normalizeName(name)]
	    return values ? values[0] : null
	  }

	  Headers.prototype.getAll = function(name) {
	    return this.map[normalizeName(name)] || []
	  }

	  Headers.prototype.has = function(name) {
	    return this.map.hasOwnProperty(normalizeName(name))
	  }

	  Headers.prototype.set = function(name, value) {
	    this.map[normalizeName(name)] = [normalizeValue(value)]
	  }

	  Headers.prototype.forEach = function(callback, thisArg) {
	    Object.getOwnPropertyNames(this.map).forEach(function(name) {
	      this.map[name].forEach(function(value) {
	        callback.call(thisArg, value, name, this)
	      }, this)
	    }, this)
	  }

	  function consumed(body) {
	    if (body.bodyUsed) {
	      return Promise.reject(new TypeError('Already read'))
	    }
	    body.bodyUsed = true
	  }

	  function fileReaderReady(reader) {
	    return new Promise(function(resolve, reject) {
	      reader.onload = function() {
	        resolve(reader.result)
	      }
	      reader.onerror = function() {
	        reject(reader.error)
	      }
	    })
	  }

	  function readBlobAsArrayBuffer(blob) {
	    var reader = new FileReader()
	    reader.readAsArrayBuffer(blob)
	    return fileReaderReady(reader)
	  }

	  function readBlobAsText(blob) {
	    var reader = new FileReader()
	    reader.readAsText(blob)
	    return fileReaderReady(reader)
	  }

	  var support = {
	    blob: 'FileReader' in self && 'Blob' in self && (function() {
	      try {
	        new Blob();
	        return true
	      } catch(e) {
	        return false
	      }
	    })(),
	    formData: 'FormData' in self
	  }

	  function Body() {
	    this.bodyUsed = false


	    this._initBody = function(body) {
	      this._bodyInit = body
	      if (typeof body === 'string') {
	        this._bodyText = body
	      } else if (support.blob && Blob.prototype.isPrototypeOf(body)) {
	        this._bodyBlob = body
	      } else if (support.formData && FormData.prototype.isPrototypeOf(body)) {
	        this._bodyFormData = body
	      } else if (!body) {
	        this._bodyText = ''
	      } else {
	        throw new Error('unsupported BodyInit type')
	      }
	    }

	    if (support.blob) {
	      this.blob = function() {
	        var rejected = consumed(this)
	        if (rejected) {
	          return rejected
	        }

	        if (this._bodyBlob) {
	          return Promise.resolve(this._bodyBlob)
	        } else if (this._bodyFormData) {
	          throw new Error('could not read FormData body as blob')
	        } else {
	          return Promise.resolve(new Blob([this._bodyText]))
	        }
	      }

	      this.arrayBuffer = function() {
	        return this.blob().then(readBlobAsArrayBuffer)
	      }

	      this.text = function() {
	        var rejected = consumed(this)
	        if (rejected) {
	          return rejected
	        }

	        if (this._bodyBlob) {
	          return readBlobAsText(this._bodyBlob)
	        } else if (this._bodyFormData) {
	          throw new Error('could not read FormData body as text')
	        } else {
	          return Promise.resolve(this._bodyText)
	        }
	      }
	    } else {
	      this.text = function() {
	        var rejected = consumed(this)
	        return rejected ? rejected : Promise.resolve(this._bodyText)
	      }
	    }

	    if (support.formData) {
	      this.formData = function() {
	        return this.text().then(decode)
	      }
	    }

	    this.json = function() {
	      return this.text().then(JSON.parse)
	    }

	    return this
	  }

	  // HTTP methods whose capitalization should be normalized
	  var methods = ['DELETE', 'GET', 'HEAD', 'OPTIONS', 'POST', 'PUT']

	  function normalizeMethod(method) {
	    var upcased = method.toUpperCase()
	    return (methods.indexOf(upcased) > -1) ? upcased : method
	  }

	  function Request(url, options) {
	    options = options || {}
	    this.url = url

	    this.credentials = options.credentials || 'omit'
	    this.headers = new Headers(options.headers)
	    this.method = normalizeMethod(options.method || 'GET')
	    this.mode = options.mode || null
	    this.referrer = null

	    if ((this.method === 'GET' || this.method === 'HEAD') && options.body) {
	      throw new TypeError('Body not allowed for GET or HEAD requests')
	    }
	    this._initBody(options.body)
	  }

	  function decode(body) {
	    var form = new FormData()
	    body.trim().split('&').forEach(function(bytes) {
	      if (bytes) {
	        var split = bytes.split('=')
	        var name = split.shift().replace(/\+/g, ' ')
	        var value = split.join('=').replace(/\+/g, ' ')
	        form.append(decodeURIComponent(name), decodeURIComponent(value))
	      }
	    })
	    return form
	  }

	  function headers(xhr) {
	    var head = new Headers()
	    var pairs = xhr.getAllResponseHeaders().trim().split('\n')
	    pairs.forEach(function(header) {
	      var split = header.trim().split(':')
	      var key = split.shift().trim()
	      var value = split.join(':').trim()
	      head.append(key, value)
	    })
	    return head
	  }

	  Body.call(Request.prototype)

	  function Response(bodyInit, options) {
	    if (!options) {
	      options = {}
	    }

	    this._initBody(bodyInit)
	    this.type = 'default'
	    this.url = null
	    this.status = options.status
	    this.ok = this.status >= 200 && this.status < 300
	    this.statusText = options.statusText
	    this.headers = options.headers instanceof Headers ? options.headers : new Headers(options.headers)
	    this.url = options.url || ''
	  }

	  Body.call(Response.prototype)

	  self.Headers = Headers;
	  self.Request = Request;
	  self.Response = Response;

	  self.fetch = function(input, init) {
	    var request
	    if (Request.prototype.isPrototypeOf(input) && !init) {
	      request = input
	    } else {
	      request = new Request(input, init)
	    }

	    return new Promise(function(resolve, reject) {
	      var xhr = new XMLHttpRequest()

	      function responseURL() {
	        if ('responseURL' in xhr) {
	          return xhr.responseURL
	        }

	        // Avoid security warnings on getResponseHeader when not allowed by CORS
	        if (/^X-Request-URL:/m.test(xhr.getAllResponseHeaders())) {
	          return xhr.getResponseHeader('X-Request-URL')
	        }

	        return;
	      }

	      xhr.onload = function() {
	        var status = (xhr.status === 1223) ? 204 : xhr.status
	        if (status < 100 || status > 599) {
	          reject(new TypeError('Network request failed'))
	          return
	        }
	        var options = {
	          status: status,
	          statusText: xhr.statusText,
	          headers: headers(xhr),
	          url: responseURL()
	        }
	        var body = 'response' in xhr ? xhr.response : xhr.responseText;
	        resolve(new Response(body, options))
	      }

	      xhr.onerror = function() {
	        reject(new TypeError('Network request failed'))
	      }

	      xhr.open(request.method, request.url, true)

	      if (request.credentials === 'include') {
	        xhr.withCredentials = true
	      }

	      if ('responseType' in xhr && support.blob) {
	        xhr.responseType = 'blob'
	      }

	      request.headers.forEach(function(value, name) {
	        xhr.setRequestHeader(name, value)
	      })

	      xhr.send(typeof request._bodyInit === 'undefined' ? null : request._bodyInit)
	    })
	  }
	  self.fetch.polyfill = true
	})();

/**
* 在iframe加载完成之后调用，根据iframe的内容在iframe框架中的宽度和高度设置iframe框架的宽度和高度。
* 执行后iframe框架的宽度为iframe内容的宽度（由iframe的初始宽度和iframe中最宽的不换内容决定），高度为iframe内容的高度（由iframe的宽度决定）。
* 说明：最初的iframe内容宽度与内容中最宽元素和最初iframe框架的宽度有关。
* 
* @param iframeObj  iframe元素
*            
*/
function embedIframe(iframeObj) {
//	console.debug("i'm here");
	var delay = 0;
	if (navigator.userAgent.search("Chrome") >= 0) {
		delay = 500;
	}
	setTimeout(function() {
		if (iframeObj && iframeObj.tagName
				&& iframeObj.tagName.toLowerCase() == "iframe") {
			iframeObj.height = 1; // 为确保后面得到真正的内容高度，一些浏览器中body.scrollHeight的值不小于窗口高度。
			var doc = (iframeObj.contentWindow || iframeObj.contentDocument);
			if (doc.document) {
				doc = doc.document;
			}
			iframeObj.width = doc.body.scrollWidth;
			if (iframeObj.height != doc.body.scrollHeight) {
				iframeObj.height = doc.body.scrollHeight;
			}
		}
	}, delay);
}


//jquery.datagrid 扩展
(function() {
	$.extend($.fn.datagrid.methods, {
		// 显示遮罩
		loading : function(jq) {
			return jq.each(function() {
				loading();
			});
		},
		// 隐藏遮罩
		loaded : function(jq) {
			return jq.each(function() {
				unloading();
			});
		}
	});
})(jQuery);
