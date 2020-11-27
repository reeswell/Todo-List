(function(_) {
    var template = 
    `<li> 
        <div class="category cg"> 
            <i class="icon-folder-open"></i> 
            <span class="name">默认分类</span> 
            <span class="number">(<i>0</i>)</span> 
            <i class="icon-cross1 delete-i"></i> 
        </div> 
        <div class="subclass"> 
        </div> 
      </li>`;
    var template2 = 
    `<div class="sub-category cg"><i class="icon-folder-o"></i></span><span class="name">task1</span><span class="number">(<i>0</i>)</span><i class="icon-cross1 delete-i"></i></div>`;
    
    function Category(options) {
        this.options = options || {};
        this.canDelete = true;
        // li节点
        // console.log(this.layout);
        this.container = this.layout.cloneNode(true);
        // this.container = this.layout?
        this.category = this.container.querySelector('.category');
        // 在category节点上定义一个widget属性指向this
        this.category.widget = this;
        // 获取任务标题的名称
        this.cgName = this.container.querySelector('.category .name');
        // 获取任务数量
        this.number = this.container.querySelector('.number i');
        // 获取删除字体的元素
        this.cgDelete = this.container.querySelector('.category .delete-i')
        // 获取subClass子节点用于插入子节点
        this.cgSubclass = this.container.querySelector('.subclass');
        // 将 options复制到实例对象上
        _.mixin(this, options);
        this.renderUI();
        return this;
        }

    _.mixin(Category.prototype, {
        // 生成 Html片段
        layout: _.htmlTranslate(template),
        
        setContent: function(obj) {
            this.cgName.innerText = obj.name;
            this.number.innerText = obj.number;
        },
        // 分类数量
        countNumber: function() {
            var subs = this.cgSubclass.querySelectorAll('.subclass .number i');
            var num = 0;
            if(subs.length > 0) {
                for(var i = 0, len = subs.length; i < len ; i++) {
                    num += Number(subs[i].innerText)
                }
                this.number.innerText = num;
            }
        },
        // 添加子节点
        addSubClass: function(obj) {
            this.cgSubclass.appendChild(new SubCategory(obj).container);
        },
        // 移除Html片段
        deleteSc: function() {
            this.container.parentNode.removeChild(this.container);
        },
        // 添加delete事件
        cgDelete: function() {
            this.emit('delete');
        },
        // 获取对象基本信息 name number
        renderUI: function() {
            this.name && this.setContent(this.options);
            if(this.options.canDelete === false) {
                this.category.removeChild(this.cgDelete);
            }
        }
    });

    // 子节点的构造函数
    function SubCategory(options) {
        this.options = options || {};
        // sub-category节点
        this.container = this.layout.cloneNode(true);
        // this.subCategory = this.container.querySelector('sub-category');
        // 在sub-category节点上定义一个widget属性指向this
        this.container.widget = this;
        // 获取子任务名字
        this.scName = this.container.querySelector('.name');
        // 获取子任务数量
        this.scNumber = this.container.querySelector('.number i');
        // 获取删除字体所在的节点
        this.scgDelete = this.container.querySelector('.delete-i');
        // 将 options复制到实例对象中
        _.mixin(this, options);
        this.renderUI();
        return this;

    }
    // 添加对象原型方法
    _.mixin(SubCategory.prototype,{
        layout: _.htmlTranslate(template2),
        setContent: function(obj) {
            this.scName.innerText = obj.name;
            this.scNumber.innerText = obj.number;
        },
        // 添加兄弟任务
        addBrother: function() {
            this.container.parentNode.insertBefore(new SubCategory({name:name}).container, this.container.nextElementSibling);
        },
        // 删除任务
        deleteSc: function() {
            this.container.parentNode.removeChild(this.container);
        },
        // 获取对象的基本信息 name number
        renderUI: function() {
            this.name && this.setContent(this.options);
        },
        // 删除事件
        onDelete: function() {
            this.emit('delete');
        }

    });
    // 使用混入Mixin的方式使得Category具有事件发射器功能
    _.mixin(Category.prototype, _.emitter);
    _.mixin(SubCategory.prototype, _.emitter);

    window.Category = Category;
    window.SubCategory = SubCategory;
})(util);