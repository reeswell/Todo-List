(function(_) {
    var template = 
    `<div class="overlay">
         <div class="box">
            <div class="box-title">
                <h3>消息提醒</h3>
                <div class="box-close icon-cross1"></div>
            </div>
            <div class="box-main">
                <div class="new-title">
                    <h3 class="nameValue">名称：</h3>
                    <input type="text">
                </div>
                <button class="btn2 confirm">确定</button>
                <button class="btn2 cancel">取消</button>
            </div>
        </div> 
    </div>`;
     
    function Modal(options) {
        this.options = options || {}; 
        this.container = this.layout.cloneNode(true);
        
        this.body = this.container.querySelector('.new-title');
        this.bodyContent = this.container.querySelector('.new-title h3');
        this.input = this.body.querySelector('input');
        // 将options复制到组件实例上
        _.mixin(this,options);
        this._renderUI();
        this._initEvent();
        return this;
    }
    // 方法一   将新对象关联到Modal.prototype
    // Modal.prototype = Object.create({
    //     layout: _.htmlTranslate(template),
    //     // 添加节点
    //     appendTo: function(node) {
    //         node.appendChild(this.container);
    //     },
    //     // 显示弹窗
    //     show: function(content) {
    //         this.container.style.display = 'block';
    //     },
    //     // 隐藏弹窗
    //     hide: function() {
    //         this.container.style.display = 'none';
    //     },
    //     // 销毁弹窗
    //     destroy: function() {
    //         this.container.parentNode.removeChild(this.container);
    //     },
    //     _renderUI: function() {
    //         if(this.hasInput) {
    //             this.body.appendChild
    //         }
    //     },
    //     _initEvent: function() {
    //         _.addEvent(this.container.querySelector('.confirm'), 'click', this.onConfirm.bind(this));
    //         _.addEvent(this.container.querySelector('.cancel'), 'click', this.onCancel.bind(this));

    //     },
    //     onConfirm: function() {
    //         this.emit('confirm');
    //         this.destroy();
    //     },
    //     onCancel: function() {
    //         this.emit('cancel');
    //         this.destroy();
    //     }
    // });
    _.mixin(Modal.prototype, {
        layout: _.htmlTranslate(template),
        // 添加节点
        appendTo: function(node) {
            node.appendChild(this.container);
        },
        // 显示弹窗
        show: function(content) {
            this.container.style.display = 'block';
        },
        // 隐藏弹窗
        hide: function() {
            this.container.style.display = 'none';
        },
        // 销毁弹窗
        destroy: function() {
            this.container.parentNode.removeChild(this.container);
        },
      
        _renderUI: function() {
            if(this.hasFlag === true) {
                // this.body.removeChild('hasInput')
                this.input.parentNode.removeChild(this.input);
                this.text && (this.bodyContent.innerText = this.text);
            }
          },
        _initEvent: function() {
            _.addEvent(this.container.querySelector('.confirm'), 'click', this.onConfirm.bind(this));
            _.addEvent(this.container.querySelector('.cancel'), 'click', this.onCancel.bind(this));

        },
        onConfirm: function() {
            this.emit('confirm');
            this.destroy();
        },
        onCancel: function() {
            this.emit('cancel');
            this.destroy();
        }
    })
     // 使用混入Mixin的方式使得Modal具有事件发射器功能
     _.mixin(Modal.prototype, _.emitter);
    //  暴露到全局
    window.Modal = Modal;
})(util)