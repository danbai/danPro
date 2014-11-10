(function() {
	/*
	构造函数:fnClass(sSel),传入选择器,return出this,this继承构造函数的prototype属性,this.elems即选中的元素
	调用时$("p")即调用了fnClass("p"),return的this具有各种方法,可以调用this.hasClass(),this即指代调用方法的this
	所以要用this.elems在方法中表示选中的元素
	*/
	function fnClass(sSel) {
		if (sSel == document || sSel == window) {
			this.elems = sSel;
		} 
		else if (sSel == "body") {
			this.elems = document.body;
		} 
		else {
			this.elems = document.querySelector(sSel);
		}
	}
	function getStyle(obj, sStyle) {
		if (obj.currentStyle) {
			return obj.currentStyle[sStyle];
		} 
		else {
			return getComputedStyle(obj, false)[sStyle];
		}
	}
	fnClass.prototype = {
		//jquery事件
		on: function(type, callback) {
			if (this.elems.addEventListener) {
				this.elems.addEventListener(type, callback, false);
			} else {
				this.elems.attachEvent('on' + type, function(event) {
					return callback.call(this.elems, event);
				});
			}
			return this;
		},
		ready: function(callback) {
			this.elems.onload = callback;
		},
		css: function(param) {
			if (typeof param === "object") {
				for (var i in param) {
					this.elems.style[i] = param[i];
				}
			} else {
				this.elems.style[arguments[0]] = arguments[1];
			}
			return this;
		},
		val: function(param) {
			if (param) {
				this.elems.value = param;
				return this;
			} else {
				return this.elems.value;
			}
		},
		//jquery效果
		animate: function(o, time, callback) {
			
			var self = this;
			for (var i in o) {
				(function(i) {
					var nTarget = parseFloat(o[i]);
					var nStart = parseFloat(getStyle(self.elems, i));
					var speed=time ? (nTarget - nStart) / (time / 30) : 10;
					if(speed>0){
						var timer = setInterval(function() {
							var nCurrent = parseFloat(getStyle(self.elems, i));
							if (nCurrent < nTarget) {
								if (i == "opacity") {
									self.elems.style.opacity = nCurrent + speed;
									self.elems.style.filter = 'alpha(opacity: ('+(nCurrent + speend)+')';
								} 
								else{
									self.elems.style[i] = nCurrent + speed + "px";
								}
							} 
							else {
								self.elems.style[i] = o[i];
								clearInterval(timer);
								if(callback){
									callback();
								}
							}
						}, 30);
					}
					else if(speed<0){
						var timer = setInterval(function() {
							var nCurrent = parseFloat(getStyle(self.elems, i));
							if (nCurrent > nTarget) {
								if (i == "opacity") {
									self.elems.style.opacity = nCurrent + speed;
									self.elems.style.filter = 'alpha(opacity: ('+(nCurrent + speend)+')';
								} 
								else{
									self.elems.style[i] = ((nCurrent + speed)>0? (nCurrent + speed):0) + "px";
								}
							} 
							else {
								self.elems.style[i] = o[i];
								clearInterval(timer);
								if(callback){
									callback();
								}
							}
						}, 30);
					}
				}(i));
			}
			return this;
		},
		hide:function(){
			this.elems.style.display="none";
			return this;
		},
		show:function(){
			this.elems.style.display="block";
			return this;
		},
		toggle:function(){
			if(getStyle(this.elems,"display")=="block"){
				this.hide();
			}
			else{
				this.show();
			}
			return this;
		},
		delay:function(callback,time){
			setTimeout(callback,time);
			return this;
		},
		fadeIn:function(time){
			var self=this.elems;
			this.show();
			var nStart=getStyle(this.elems,"opacity")*100;
			var speed=time ? (100-nStart)/(time/30) : 10
			var timer=setInterval(function(){
				var nCurrent=getStyle(self,"opacity")*100;
				if(nCurrent<100){
					self.style.opacity=(nCurrent+speed)/100;
					self.style.filter='alpha(opacity:'+(nCurrent+speed)+')';
				}
				else{
					clearInterval(timer);
					self.style.opacity=1;
					self.style.filter='alpha(opacity:100)';
				}
			},30);
			return this;
		},
		fadeOut:function(time){
			var self=this.elems;
			var nStart=getStyle(this.elems,"opacity")*100;
			var speed=time ? (nStart-0)/(time/30) : 10;
			var timer=setInterval(function(){
				var nCurrent=getStyle(self,"opacity")*100;
				if(nCurrent>0){
					self.style.opacity=(nCurrent-speed)/100;
					self.style.filter='alpha(opacity:'+(nCurrent-speed)+')';
				}
				else{
					clearInterval(timer);
					self.style.opacity=0;
					self.style.filter='alpha(opacity:0)';
					self.style.display="none";
				}
			},30);
			return this;
		},
		fadeTo:function(time,nTarget){
			this.show();
			var self=this.elems;
			var nStart=getStyle(this.elems,"opacity")*100;
			nTarget=nTarget*100;
			var speed=(nTarget-nStart)/(time/30);
			if(speed>0){
				var timer=setInterval(function(){
					var nCurrent=getStyle(self,"opacity")*100;
					if(nCurrent<nTarget){
						self.style.opacity=(nCurrent+speed)/100;
						self.style.filter='alpha(opacity:'+(nCurrent+speed)+')';
					}
					else{
						clearInterval(timer);
						self.style.opacity=nTarget/100;
						self.style.filter='alpha(opacity:'+nTarget+')';
					}
				},30);
			}
			else if(speed<0){
				var timer=setInterval(function(){
					var nCurrent=getStyle(self,"opacity")*100;
					if(nCurrent>nTarget){
						self.style.opacity=(nCurrent+speed)/100;
						self.style.filter='alpha(opacity:'+(nCurrent+speed)+')';
					}
					else{
						clearInterval(timer);
						self.style.opacity=nTarget/100;
						self.style.filter='alpha(opacity:'+nTarget+')';
					}
				},30);
			}
			return this;
		},
		slideDown:function(time){
			this.show();
			var nOldHeight=this.height();
			this.height(0);
			this.animate({"height":nOldHeight+"px"},time);
			return this;
		},
		slideUp:function(time){
			var self=this;
			var nOldHeight=this.height();
			this.animate({"height":0+"px"},time,function(){
				self.hide().height(nOldHeight);
			});
			return this;
		},
		slideToggle:function(time){
			if(getStyle(this.elems,"display")=="none"){
				this.slideDown(time);
			}
			else{
				this.slideUp(time);
			}
			return this;
		},
		//jquery文档操作
		hasClass: function(sClassName) {
			var sClassList = this.elems.className;
			if (!sClassList) {
				return false;
			}
			var rHasClass = new RegExp('\\b' + sClassName + '\\b');
			if (rHasClass.test(sClassList)) {
				return true;
			}
			return false;
		},
		addClass: function(sClassName) {
			var sClassList = this.elems.className;
			if (this.hasClass(sClassName)) {
				return this;
			}
			sClassName = sClassList.length ? (" " + sClassName) : sClassName;
			this.elems.className += sClassName;
			return this;
		},
		removeClass: function(sClassName) {
			var sClassList = this.elems.className;
			if (!this.hasClass(className)) {
				return this;
			}
			var rRemoveClass = new RegExp('\\b\\s*' + sClassName + '\\b', "g");
			this.elems.className = sClassList.replace(rRemoveClass, "");
			return this;
		},
		toggleClass: function(sClassName) {
			if (this.hasClass(sClassName)) {
				this.removeClass(sClassName);
			} else {
				this.addClass(sClassName);
			}
			return this;
		},
		append:function(node){
			if(typeof node==="string"){
				if(node.indexOf("<")>-1){
					var re1=/<(\w+)>/;
					var re2=/<\/?(\w+)>/g;
					var aResult=node.match(re1);	//["<h1>",h1]
					var sNodeText=node.replace(re2,"");	//"333"
					node=document.createElement(aResult[1]);
					node.innerHTML=sNodeText;
				}
				else{
					node=document.createTextNode(node);
				}
			}
			else if("elems" in node){
				node=node.elems;
			}
			this.elems.appendChild(node);
			return this;
		},
		prepend:function(node){
			if(typeof node==="string"){
				if(node.indexOf("<")>-1){
					var re1=/<(\w+)>/;
					var re2=/<\/?(\w+)>/g;
					var aResult=node.match(re1);	//["<h1>",h1]
					var sNodeText=node.replace(re2,"");	//"333"
					node=document.createElement(aResult[1]);
					node.innerHTML=sNodeText;
				}
				else{
					node=document.createTextNode(node);
				}
			}
			else if("elems" in node){
				node=node.elems;
			}
			this.elems.insertBefore(node,this.elems.firstChild);
			return this;
		},
		before:function(node){
			if(typeof node==="string"){
				if(node.indexOf("<")>-1){
					var re1=/<(\w+)>/;
					var re2=/<\/?(\w+)>/g;
					var aResult=node.match(re1);	//["<h1>",h1]
					var sNodeText=node.replace(re2,"");	//"333"
					node=document.createElement(aResult[1]);
					node.innerHTML=sNodeText;
				}
				else{
					node=document.createTextNode(node);
				}
			}
			else if("elems" in node){
				node=node.elems;
			}
			this.elems.parentNode.insertBefore(node,this.elems);
			return this;
		},
		after:function(node){
			if(typeof node==="string"){
				if(node.indexOf("<")>-1){
					var re1=/<(\w+)>/;
					var re2=/<\/?(\w+)>/g;
					var aResult=node.match(re1);	//["<h1>",h1]
					var sNodeText=node.replace(re2,"");	//"333"
					node=document.createElement(aResult[1]);
					node.innerHTML=sNodeText;
				}
				else{
					node=document.createTextNode(node);
				}
			}
			else if("elems" in node){
				node=node.elems;
			}
			this.elems.parentNode.insertBefore(node,this.elems.nextSibling);
			return this;
		},
		replaceWith:function(node){
			if(typeof node==="string"){
				if(node.indexOf("<")>-1){
					var re1=/<(\w+)>/;
					var re2=/<\/?(\w+)>/g;
					var aResult=node.match(re1);	//["<h1>",h1]
					var sNodeText=node.replace(re2,"");	//"333"
					node=document.createElement(aResult[1]);
					node.innerHTML=sNodeText;
				}
				else{
					node=document.createTextNode(node);
				}
			}
			else if("elems" in node){
				node=node.elems;
			}
			this.elems.parentNode.replaceChild(node,this.elems);
			return this;
		},
		appendTo:function(node){
			if(typeof node==="string"){
					node=$(node).elems;
			}
			else{
				node=node.elems;
			}
			node.appendChild(this.elems);
		},
		prependTo:function(node){
			if(typeof node==="string"){
					node=$(node).elems;
			}
			else{
				node=node.elems;
			}
			node.insertBefore(this.elems,node.firstChild);
		},
		insertBefore:function(node){
			if(typeof node==="string"){
					node=$(node).elems;
			}
			else{
				node=node.elems;
			}
			node.parentNode.insertBefore(this.elems,node);
		},
		insertAfter:function(node){
			if(typeof node==="string"){
					node=$(node).elems;
			}
			else{
				node=node.elems;
			}
			node.parentNode.insertBefore(this.elems,node.nextSibling);
		},
		replaceAll:function(node){
			if(typeof node==="string"){
					node=$(node).elems;
			}
			else{
				node=node.elems;
			}
			node.parentNode.replaceChild(this.elems,node);
		},
		attr:function(attr,value){
			if(arguments.length==2){
				this.elems.setAttribute(attr,value);
			}
			else if(arguments.length==1){
				if(typeof attr==="string"){
					return this.elems.getAttribute(attr);
				}
				else if(typeof attr==="object"){
					for(var i in attr){
						this.elems.setAttribute(i,attr[i]);
					}
				}
			}
			return this;
		},
		removeAttr: function(attr) {
			this.elems.removeAttribute(attr);
			return this;
		},
		clone: function() {
			return this.elems.cloneNode(true);
		},
		detach: function() {
			this.elems.parentNode.removeChild(this.elems);
			return this;
		},
		remove: function() {
			this.elems.parentNode.removeChild(this.elems);
		},
		empty: function() {
			this.elems.innerHTML = "";
		},
		html: function(para) {
			if (arguments.length == 0) {
				return this.elems.innerHTML;
			}
			else {
				this.elems.innerHTML = para;
				return this;
			}
		},
		text: function(para) {
			var content = this.elems.textContent;
			if (para === undefined) {
				return content || this.elems.innerText;
			}
			else {
				if (content) {
					this.elems.textContent = para;
				}
				else {
					this.elems.innerText = para;
				}
				return this;
			}
		},
		val: function(para) {
			if (arguments.length == 0) {
				return this.elems.value;
			}
			else {
				this.elems.value = para;
			}
			return this;
		},
		unwrap: function() {
			this.elems.parentNode.outerHTML = this.elems.parentNode.innerHTML;
			return this;
		},
		wrap: function(para) {
			if (typeof para === "string") {
				var re = /<(\w+)>/;
				var sTag = para.match(re)[1];
				this.elems.outerHTML = '<' + sTag+ '>' + this.elems.outerHTML + '</' + sTag + '>';
			}
			if (typeof para === "object") {
				if ("elems" in para) {
					para.append(this.elems);
				}
				else {
					this.before(para);
					para.appendChild(this.elems);
				}
			}
			return this;
		},
		wrapInner: function(para) {
			if (typeof para === "string") {
				var re = /<(\w+)>/;
				var sTag = para.match(re)[1];
				this.elems.innerHTML = '<' + sTag+ '>' + this.elems.innerHTML + '</' + sTag + '>';
			}
			if (typeof para === "object") {
				if ("elems" in para) {
					para.elems.innerHTML = this.elems.innerHTML;
					this.elems.innerHTML = para.elems.outerHTML;
				}
				else {
					para.innerHTML = this.elems.innerHTML;
					this.elems.innerHTML = para.outerHTML;
				}
			}
			return this;
		},
		//jquery css操作
		css: function(style,value) {
			if (arguments.length == 1) {
				if (typeof style === "string") {
					return getStyle(this.elems, style);
				}
				else {
					for (var i in style){
						this.elems.style[i] = style[i];
					}
				}
			}
			else if (arguments.length == 2) {
				this.elems.style[style] = value;
			}
		},
		height: function(param) {
			if (param) {
				this.elems.style.height = param + "px";
				return this;
			}
			else {
				if (this.elems === window) {
					return document.documentElement.clientHeight;
				}
				else if (this.elems === document.body){
					return document.body.clientHeight
				}
				else {
					return parseFloat(getStyle(this.elems, "height"));
				}
			}
		},
		width: function(param) {
			if (param) {
				this.elems.style.width = param + "px";
				return this;
			}
			else {
				if (this.elems === window) {
					return document.documentElement.clientWidth;
				}
				else if (this.elems === document.body){
					return document.body.clientWidth
				}
				else {
					return parseFloat(getStyle(this.elems, "width"));
				}
			}
		},
		innerHeight: function(param) {
			if (param || param == 0) {
				this.elems.style.height = param - (parseFloat(getStyle(this.elems, "padding-top")) + parseFloat(getStyle(this.elems, "padding-bottom"))) + "px";
				return this;
			}
			return this.elems.clientHeight;
		},
		innerWidth: function(param) {
			if (param || param == 0) {
				this.elems.style.width = param - (parseFloat(getStyle(this.elems, "padding-left")) + parseFloat(getStyle(this.elems, "padding-right"))) + "px";
			}
		},
		outerHeight: function(param) {
			if (param === true || param === undefined) {
				if (param) {
					return this.innerHeight() + parseFloat(getStyle(this.elems, "border-top")) + parseFloat(getStyle(this.elems, "border-bottom")) + parseFloat(getStyle(this.elems, "margin-top")) + parseFloat(getStyle(this.elems, "margin-bottom")); 
				}
				else {
					return this.innerHeight() + parseFloat(getStyle(this.elems, "border-top")) + parseFloat(getStyle(this.elems, "border-bottom"));
				}
			}
			else {
				this.elems.style.height = param - (parseFloat(getStyle(this.elems, "padding-top")) + parseFloat(getStyle(this.elems, "padding-bottom")) + parseFloat(getStyle(this.elems, "border-top")) + parseFloat(getStyle(this.elems, "border-bottom"))) + "px"; 
			}
		},
		offsetParent: function() {
			var oParent = this.elems.parentNode;
			while (oParent != document.body && !getStyle(oParent, "position").match(/absolute|relative|fixed/)){	//==="static"
				oParent = oParent.parentNode;
			}
			return oParent;
		},
		offset: function(o) {
			if (arguments.length == 0) {
				var x = this.elems.offsetLeft, y = this.elems.offsetTop, oParent = this.elems.parentNode;
				while (oParent != document.body){
					x += oParent.offsetLeft;
					y += oParent.offsetTop;
					oParent = oParent.parentNode;
				} 
				return {
					left: x,
					top: y
				}
			}
			else if(arguments.length == 1) {
				var sPosition = getStyle(this.elems, "position");
				if (sPosition == "static") {
					this.elems.style.position = "relative";
				}
				var x = o.left, y = o.top, oParent = this.elems.parentNode;
				while (oParent != document.body) {
					x -= oParent.offsetLeft;
					y -= oParent.offsetTop;
					oParent = oParent.parentNode;
				}
				this.elems.style.left = x + "px";
				this.elems.style.top = y + "px";
			}
		},
		position: function() {
			return {
				left: this.elems.offsetLeft,
				top: this.elems.offsetTop
			}
		},
		scrollLeft: function() {
			if (arguments.length == 0) {
				if (this.elems == document.body) {
					return document.body.scrollLeft || document.documentElement.scrollLeft;
				}
				else {
					return this.elems.scrollLeft;
				}
			}
			else if(arguments.length == 1) {
				if (this.elems == document.body){
					document.body.scrollLeft = param;
					document.documentElement.scrollLeft = param;
				}
				else {
					this.elems.scrollLeft = param;
				}
			}
		},
		scrollTop: function(param) {
			if (arguments.length == 0) {
				if (this.elems == document.body) {
					return document.body.scrollTop || document.documentElement.scrollTop;
				}
				else {
					return this.elems.scrollTop;
				}
			}
			else if(arguments.length == 1) {
				if (this.elems == document.body){
					document.body.scrollTop = param;
					document.documentElement.scrollTop = param;
				}
				else {
					this.elems.scrollTop = param;
				}
			}
		},
		//jquery遍历
		children: function(param) {
			if (arguments.length == 0) {
				return this.elems.children;
			}
			else {
				var aChild = this.elems.children;
				for (var i = 0; i < aChild.length; i++) {
					if (aChild[i].tagName.toLowerCase() == param) {
						return aChild[i];
					}
				}
			}
			return null;
		},
		contents: function(param) {
			if (arguments.length == 0) {
				return this.elems.childNodes;
			}
			else {
				var aChild = this.elems.childNodes;
				for (var i = 0; i < aChild.length; i++) {
					if (aChild[i].nodeType == 1) {
						if (aChild[i].tagName.toLowerCase() == param) {
							return aChild[i];
						}
					}
					else if (aChild[i].nodeType == 3) {
						if (aChild[i].nodeValue.replace(/\s*/g,"") == param) {
							return aChild[i];
						}
					}
				}
			}
			return null;
		},
		find: function(param) {
			var aRes = [];
			var aChild = this.elems.children;	//["p","h1","h2","span"]
			function findNode(a) {	//递归,一层一层去寻找合适的子元素,直到没有子元素
				for (var i = 0; i < a.length; i++) {	//["p","h1","h2","span"]   ["span"],["span","em","span"]
					if (a[i].tagName.toLowerCase() == param) {
						aRes.push(a[i]);	//["span"]
					}
					if (a[i].children.length) {	//["span"],["span","em","span"]
						findNode(a[i].children);	
					}
				}
			}
			findNode(aChild);
			return aRes;
		},
		closest: function(param) {
			var oParent = this.elems.parentNode;
			while (oParent.tagName.toLowerCase() != param && oParent != document.body) {
				oParent = oParent.parentNode;
			}
			return oParent;
		},
		parent: function(param) {
			return this.elems.parentNode;
		},
		parents: function(param) {
			var oParent = this.elems.parentNode;
			var a = [oParent];
			while (oParent.tagName.toLowerCase() != "html") {
				oParent = oParent.parentNode;
				a.push(oParent);
			}	
			if (arguments.length == 0) {
				return a;
			}
			else {
				for (var i = 0; i < a.length; i++) {
					if (a[i].tagName.toLowerCase() == param){
						return a[i];
					}
				}
			}
		},
		parentsUntil: function(selector, filter) {
			var oParent = this.elems.parentNode;
			var a = [oParent];
			while (oParent.tagName.toLowerCase() != selector && oParent.tagName.toLowerCase != "html") {
				oParent = oParent.parentNode;
				a.push(oParent);
			}
			if (arguments.length == 1) {
				return a;
			}
			else {
				for (var i = 0; i < a.length; i++) {
					if (a[i].tagName.toLowerCase() == filter){
						return a[i];
					}
				}
			}
		},
		next: function() {

		},
		nextAll: function() {

		},
		nextUntil: function() {

		},
		prev: function() {

		},
		prevAll: function() {

		},
		prevUntil: function() {

		},
		siblings: function() {

		},
		each: function() {

		},
		end: function() {

		},
		eq: function() {

		},
		filter: function() {

		},
		first: function() {

		},
		has: function() {

		},
		is: function() {

		},
		last: function() {

		},
		map :function() {

		},
		not: function() {

		},
		slice: function() {

		}
	}
	window.$ = function() {
		return new fnClass(arguments[0]);
	}
	$.ajax = function(o) {
		var xmlHttp = new XMLHttpRequest();
		var type = o.type;
		var url = o.url;
		var data = o.data;
		var str = "";
		if (type.toLowerCase() == "get") {	//get方式将data数据加到url中
			if (data) {
				for (var i in data) {
					str += i + '=' + data[i] + '&';
				}
				str = str.slice(0, -1);
				if (url.indexOf("?") == -1) {
					str = "?" + str;
				}
				else {
					str = "&" + str;
				}
				url += str;
			}
		}
		xmlHttp.open(type, url, o.async === false ? false : true);
		if (type.toLowerCase() == "post") {	//post方式将数据发送
			xmlHttp.send(JSON.stringify(data));
		}
		else {
			xmlHttp.send();
		}
		xmlHttp.onreadystatechange = function() {
			if (xmlHttp.readyState == 4) {
				if (xmlHttp.status == 200) {
					o.success(JSON.parse(xmlHttp.responseText));
				}
				else {
					o.error(xmlHttp.status);
				}
			}
		}
	}
}());