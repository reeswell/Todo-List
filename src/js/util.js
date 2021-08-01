var util = (function() {
    var GTD_KEY = 'GTD';
    return {
        // 读取localStorage
        fetch: function() {
            return JSON.parse(localStorage.getItem(GTD_KEY));
        },
        //保存localStorage
        save: function(items){
            return localStorage.setItem(GTD_KEY, JSON.stringify(items))
        },
        // 读取localStorage
        read: function() {
            return JSON.parse(localStorage.getItem(GTD_KEY));
        },
        // 复制对象
        mixin: function(targetObj, sourceObj) {
            for(var key in sourceObj) {
                if(!(key in targetObj)) {
                    targetObj[key] = sourceObj[key];
                }
            }
            return targetObj;
        },
        // 将字符串转化为节点并且获得该节点
        htmlTranslate: function(str) {
            var container = document.createElement('div');
            container.innerHTML = str;
            return container.children[0];
        },
        addClass: function(element, newClassName) {
            var current = element.className || "";
            if((current).indexOf(newClassName) === -1) {
                element.className = current ? (current + " " + newClassName) : newClassName;
            }
        },
        removeClass: function(element, oldClassName) {
            var current = element.className;
            if(!current) {
                return false;
            }
            element.className = (" "+current+" ").replace(" " + oldClassName + " ", " ").trim();
        },
        //获取元素的实际样式
        getStyle: function(element, cssName) {
            return window.getComputedStyle ? getComputedStyle(element, '')[cssName] : element.currentStyle[cssName];
        },
        // 添加事件
        addEvent: function(element, event, listener) {
            if (element.addEventListener) {
                element.addEventListener(event, listener, false);
            }else if(element.attachEvent){
                element.attachEvent('on' + event, listener)
            }else{
                element["on"+event] = listener;
            }
        },
        // 移除事件
        removeEvent: function(element, event, listener) {
            if (element.removeEventListener) {
                element.removeEventListener(event, listener);
            }else if(element.detachEvent){
                element.detachEvent('on'+event,listener);
            }else{
                element['on'+event] = null;
            }
        },
        emitter: {
            // 注册事件
            on: function(event, fn) {
                var handles = this._handles || (this._handles = {});
                var calls = handles[event] || (handles[event] = []);
                // 找到对应名字的栈
                calls.push(fn);
                return this;
            },
            // 解绑事件
            off: function(event, fn) {
                if(!event || !this._handles) return;
                var handles = this._handles;
                var calls;
                // 下面的if暂时不太懂，可不要？
                if(calls = handles[event]) {
                    if(!fn) {
                        handles[event] = [];
                        return this;
                    }
                }
                // 找到对应的事件并且移除
                for(var i = 0, len = calls.length; i < len; i++) {
                    if(fn === calls[i]) {
                        calls.splice(i, 1);
                        return this;
                    }
                }
                return this;
            },
            // 触发事件
            emit: function(event) {
                var args = Array.prototype.slice.call(arguments, 1);
                var handles = this._handles;
                var calls;
                if(!handles || !(calls = handles[event])) return this;
                // 触发对应的回调函数
                for(var i = 0, len = calls.length; i < len; i++) {
                    calls[i].apply(this, args)
                }
                return this;
            }
        }
    }
})(); 