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