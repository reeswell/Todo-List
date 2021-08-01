项目地址：https://180231.xyz/todo-list/build/index.html



### 启动项目

```
npm install
gulp
```

### 任务描述

参考设计稿实现一个简单的个人任务管理系统：如下图

![设计稿](http://ww1.sinaimg.cn/large/0073y0I6gy1gg3qfe8jqij30zk0gon2k.jpg)

任务需求描述：

* 最左侧为任务分类列表，支持查看所有任务或者查看某个分类下的所有任务
    - 初始时有一个`默认分类`，进入页面时默认选中`默认分类`。
    - 分类支持多层级别。
    - 分类支持**增加**分类、**删除**分类两个操作
        - 在左侧分类最下方有添加操作，点击后弹出浮层让输入新分类的名称，新分类将会被添加到当前选中的分类下。浮层可以为自行设计实现，也可以直接使用`prompt`。
        - 当鼠标`hover`过某一个分类时，右侧会出现**删除按钮**，点击后，弹出确认是否删除的浮层，确认后删除掉该分类。弹出的确认浮层可以自行设计实现，也可以直接使用`confirm`。
        - 不能为`默认分类`添加子分类，也不能删除`默认分类`。
    * 每一个分类名字后显示一个当前分类下的未完成任务总数量。
* 中间列为任务列表，用于显示当前选中分类下的所有未完成任务
    - 任务列表按日期（升序或者降序，自行设定）进行聚类
    - 用不同的字体颜色或者图标来标示任务的状态，任务状态有两张：`已完成`或`未完成`。
    - 下方显示`新增任务`的按钮，点击后，右侧列会变成新增任务编辑界面。
    - 单击某个任务后，会在右侧显示该任务的详细信息。
    - 在任务列表的上方有任务筛选项，可以选择在任务列表中显示所有任务，或者只显示`已完成`或者`未完成`的任务。
* 右侧为任务详细描述部分
    - 第一行显示任务标题，对于未完成的任务，在标题行的右侧会有`完成任务`的操作按钮及`编辑任务`的按钮。
    - 点击`完成任务`按钮时，弹出确认是否确认完成的浮层，确认后该任务完成，更新中间列任务的状态。弹出的确认浮层可以自行设计实现，也可以直接使用`confirm`。
    - 点击`编辑任务`操作后，右侧变更为编辑窗口。
* 新增及编辑任务窗口描述
    - 有3个输入框：分别是标题输入框，完成日期输入框及内容输入框
    - 标题输入框：输入标题，为单行，需要自行设定一个标题输入限制的规则（如字数），并给出良好提示。
    - 日期输入框：单行输入框，按照要求格式输入日期，如yyyy-mm-dd
    - 内容输入框：多行输入框，自行设定一个内容输入的限制（如字数），并给出良好提示。
    - 确认按钮：确认新增或修改。
    - 取消按钮：取消新增或修改。

任务实现要求：

* 整个界面的高度和宽度始终保持和浏览器窗口大小一致。当窗口变化高宽时，界面中的内容自适应变化。
* 左侧列表和中间列表保持一个固定宽度（自行设定），右侧自适应。
* 需要自行设定一个最小宽度和最小高度，当浏览器窗口小于最小值时，界面内容的高度和宽度不再跟随变化，允许浏览器出现滚动条。
* 通过本地存储来作为任务数据的保存方式。
* 不使用任何类库及框架。

**注意**

该设计稿仅为线框原型示意图，所有的视觉设计不需要严格按照示意图。如果有设计能力的同学，欢迎实现得更加美观，如果没有，也可以按照线框图实现。以下内容可以自行发挥：

* 背景颜色

* 字体大小、颜色、行高

* 线框粗细、颜色

* 图标、图片

* 高宽、内外边距

  

###下面是使用gulp4打包的笔记

```
const {src, dest, watch, series, parallel} = require('gulp');
// 压缩css
const cleanCss = require('gulp-clean-css')
// 压缩html
const htmlmin = require('gulp-htmlmin')
// 合并文件
const concat = require('gulp-concat')
// 压缩js
const uglify = require('gulp-uglify-es').default
// const uglify = require('gulp-uglify-es').default;
const babel = require('gulp-babel')
// 文件重命名
const  rename = require('gulp-rename')
// 热加载
const connect = require('gulp-connect')
// 实时自动刷新页面
const livereload = require('gulp-livereload')

// 打包后自动打开浏览器运行
const open = require('open')
// 按顺序导入js文件
const sortJs = ['./src/js/util.js','./src/js/bulletBox.js','./src/js/categories.js','./src/js/taskList.js','./src/js/taskDetail.js','./src/js/main.js']
const del = require('del')
// 打包前先删除build下js、css文件夹下的文件

function clean() {
   return del(['build/css', 'build/js'])
}
// 注册合并压缩压缩js
function js() {
    return	src(sortJs)  // js/**/*.js 遍历文件下所有的js文件
        .pipe(babel())
		.pipe(concat('main.js')) //合并所有js到main.js
		.pipe(uglify()) //执行压缩
        .pipe(uglify().on('error', function(e){
            console.log(e);
         }))
		.pipe(rename({suffix: '.min'})) //压缩后的文件名 
		.pipe(dest('./build/js'))
        .pipe(connect.reload())
}
// 注册合并压缩压缩css

function css() {
    return src('./src/css/*.css') //压缩的文件
    .pipe(concat('style.css'))
    .pipe(cleanCss())
     .pipe(rename({suffix: '.min'}))
    .pipe(dest('./build/css')) //输出文件夹
    .pipe(livereload())
    .pipe(connect.reload())
}
// 注册并监听文件
function watchFile() {
    livereload.listen();
    watch('scr/js/*.js',['js'])
    watch('scr/css/*.css',['css'])
    watch('./src/html/*.html')
}
// 注册并压缩压缩html

function html() {
   return src('./src/*.html') // 要压缩的html文件
		.pipe(htmlmin({
            collapseWhitespace: true, // 移除空格
            removeEmptyAttributes: true, // 移除空属性   <div class=""></div>=><div></div>
            collapseBooleanAttributes: true, // 移除checked类似的布尔值属性  <input type=checkout checked='checked'><input>=><input type=checkout checked><input>
            removeAttributeQuotes: true, // 移除属性的双引号 <input type="checkout"><input> => <input type=checkout><input> 
            removeComments: true //移除注释
        })) //压缩
		.pipe(dest('./build'))
        .pipe(livereload())
        .pipe(connect.reload())
}
// 注册将fonts文件夹复制到build下
function font() {
    return src('./src/fonts/*.*') 
    .pipe(dest('./build/fonts'))
    .pipe(livereload())
    .pipe(connect.reload())
}
// 启动服务
function server() {
    connect.server({
        root: 'build/',
        livereload: true,
        port: 5000
    })
    open('http://localhost:5000/')
}

exports.default = series(parallel(clean,js,font, css, html), server,watchFile);
```

