(function(_) {
    function $(selector) {
        return document.querySelector(selector)
    }
    function $$(selectors) {
        return document.querySelectorAll(selectors)
    }
    _.mixin($, {
        on: function(element, event, listener) {
            if(element.addEventListener) {
                return element.addEventListener(event, listener, false);
            } else {
                return element.attachEvent('on' + event, listener);
            }
        },
        un: function(element, event, listener) {
            if(element.removeEventListener) {
                return element.removeEventListener(event, listener, false)
            } else {
                return element.detachEvent('on' + event, listener)
            }
        },
        click: function(element, listener) {
            return $.on(element, 'click', listener);
        },
        enter: function(element, listener) {
            return $.on(element, 'keydown', function(e) {
                var event = e || window.event;
                var keyCode = event.which || event.keyCode;
                if (keyCode === 13) {
                    listener.call(element, event);
                }
                });
        },
        delegate: function(element, selector, event, listener,except) {
            $.on(element, event, function(e) {
                var oEvent = e || window.event;
                var target = oEvent.target || oEvent.srcElement;
             
                var arr = [];
                var eles = element.querySelectorAll(selector);
                for(var i=0;i<eles.length;i++) {
                    arr.push(eles[i]);
                };
                var arr2 = [];
                var eles2 = null;
                if(typeof except != 'undefined') {
                    eles2 = element.querySelectorAll(except);
                    for(var i=0;i<eles2.length;i++) {
                        arr2.push(eles2[i]);
                    }
                    if(arr2.indexOf(target) != -1) return;
                }

                while(target != element) {
                    if(arr.indexOf(target) != -1) {
                        listener.call(target,e);
                        break;
                    }
                    target = target.parentNode;
                }
            });
        }
    });
    function addZero(number) {
        return number < 10 ? '0' + number : '' + number;
    }
    function format(date) {
        return date.getFullYear() + '-' + addZero(date.getMonth() + 1) + '-' + addZero(date.getDate());
    }
    var data = _.fetch() || {totalNumber: 12, category:[
        {name: '百度IFE项目', number:10, todos:[], subCategory:[
            {name:'task1',number:6, todos:[
            {name:'to-do 1', date: '2020-05-08', isFinished: false, content:'完成任务1'},
            {name:'to-do 2', date: '2020-05-18', isFinished: false, content:'完成任务2'},
            {name:'to-do 3', date: '2020-05-28', isFinished: true, content:'完成任务3'},
            {name:'to-do 4', date: '2020-05-18', isFinished: false, content:'完成任务4'},
            {name:'to-do 5', date: '2020-05-08', isFinished: true, content:'完成任务5'},
            {name:'to-do 6', date: '2020-05-08', isFinished: false, content:'完成任务6'},
            {name:'to-do 7', date: '2020-05-11', isFinished: true, content:'完成任务7'}
        ]},
        {name:'task2',number:4, todos:[
            {name:'to-do 1',date:'2015-04-28',isFinished:false,content:'完成任务1'},
            {name:'to-do 2',date:'2015-04-29',isFinished:false,content:'完成任务2'},
            {name:'to-do 3',date:'2015-04-30',isFinished:true,content:'完成任务3'}
        ]}
        ]},
        {name: '毕业设计', number:1, todos:[], subCategory: []},
        {name: '社团活动', number:0, todos:[{name:'to-do 1', date: '2020-04-28', isFinished: true, content:'完成模块一'},{name:'to-do 2', date: '2020-04-08', isFinished: false, content:'完成模块二'}], subCategory: []},
        {name: '家庭生活', number:0, todos:[{name:'to-do 1', date: '2020-04-18', isFinished: true, content:'打篮球'},{name:'to-do 2', date: '2020-04-18', isFinished: false, content:'吃饭'}], subCategory: []},
        {name: '默认分类', number:1, todos:[{name:'to-do 1', date: '2015-04-08', isFinished: false, content:'学习'}], subCategory: []},
    ]};
    // 获取任务总数
    var totalNumbers = $('#total i');
    // console.log(totalNumbers);
    
    // 获取任务列表
    var cgList = $('.category-list');
    // 获取选中的任务元素标签
    var selectCG = null;
    // 获取任务时间列表
    var taskList = $('.task-list');
    // 获取TAB标签
    var tabList = $('.list-menu');
    // 获取选中具体任务
    var selectTask = null;
    // 获取添加事件按钮
    var addCG = $('.addCG');
    // 用于插入任务详情和add任务
    var gBody = $('.container');
    // 用于获取代理所有完成和未完成点击事件
    var addTask = $('.addTask')
    // console.log(addTask);
    
    var eleTab = $('.list-menu');
    // 用于获取具体的eleTab选项卡节点
    var tabs = eleTab.querySelectorAll('li');
    var containerDetail = $(".container-detail");
    var selectTab = null;
    updateDataNumber(data);
    // updateTotalDataNumber(data);
      //初始选择第一个tabs 所有
      toSelectTab(tabs[0]);

    // 按日期从小到大排序
    function byDate(a, b) {
        return new Date(a.date) - new Date(b.date);
    }
    // 初始化任务详情
    var initDetail = new Detail()
                        .on('finish', function() {
                            if(selectTab.id == 'finished') {
                                this.hideBtn();
                            }
                            var todos = [];
                            if(selectCG.index.indexOf('-') == -1) {
                                todos = data.category[selectCG.index].todos;
                            } else {
                                var arr = selectCG.index.split('-');
                                todos = data.category[arr[0]].subCategory[arr[1]].todos;
                            }
                            todos[selectTask.index].isFinished = true;
                            updateDataNumber(data);

                            updateCGList(data.category, selectCG.index, selectTab.id == 'all' ? selectTask.index : undefined);
                            _.save(data);
                        }).on('edit', function() {
                            containerDetail.appendChild(new Edit(this.getData()).on('confirm', function() {
                                var todos = [];
                                var index = '';
                                var obj = this.getData();
                                if(selectCG.index.indexOf('-') == -1) {
                                    todos = data.category[selectCG.index].todos;
                                } else {
                                    var arr = selectCG.index.split('-');
                                    todos = data.category[arr[0]].subCategory[arr[1]].todos;
                                }
                                var isFinished = todos[selectTask.index].isFinished;
                                todos[selectTask.index] = obj;
                                todos[selectTask.index].isFinished = isFinished;
                                todos.sort(byDate);
                                index = todos.indexOf(obj);
                                updateTaskList(todos, index);
                                _.save(data);
                            }).container);
                        });
    containerDetail.appendChild(initDetail.container);
    var containerRight = $(".container-right");
    // containerRight.style.display = "block";
    // 更新任务总数
    function updateDataNumber(data) {
        var totalNumber = 0;
        var arr = data.category;
        for(var i = 0; i < arr.length; i++) {
            var number = 0;
            var arrSub = arr[i].subCategory;
            if(arrSub.length > 0) {
                for(var j = 0; j < arrSub.length; j++) {
                    arrSub[j].number = arrSub[j].todos.length;
                    number += arrSub[j].number;
                }
                arr[i].number = number + arr[i].todos.length;
                totalNumber += arr[i].number
            } else {
                arr[i].number = arr[i].todos.length;
                totalNumber += arr[i].number;
            }
        }
        data.totalNumber = totalNumber;
        totalNumbers.innerHTML = data.totalNumber;
    }
 
    // 初始化任务列表 渲染任务列表
    cgList.replaceChild(renderCGList(data.category), cgList.children[1]);

    // taskList.replaceChild(renderTaskList(data.category[4].todos), taskList.children[0]);
    // 初始选中默认列表
    var deFault = document.getElementById('default');
    toSelectCG(deFault);
    // toSelectTask();
  

    /**
     *
     *
     * @param {*} arr   [{name:'百度IFE项目',number:10,subCategory:[{name:'task1',number:6}]}]
     * @param {*} index index '1' or '1-1' 根据索引来选中某一项
     * @param {*} taskIndex 1,2 
     */
    function updateCGList(arr, index, taskIndex) {
        cgList.replaceChild(renderCGList(arr), cgList.children[1]);
        if(typeof index == 'undefined') {
            toSelectCG(document.getElementById('deFault'));
        } else {
            var lis = cgList.querySelectorAll('li');
            if(index.indexOf('-') < 0) {
                toSelectCG(lis[index].querySelector('.category'), taskIndex);
            } else {
                var array = index.split('-');
                toSelectCG(lis[array[0]].querySelectorAll('.sub-category')[array[1]], taskIndex);
            }
        }
    }
    // 更新任务时间列表

    /**
     *
     *
     * @param {*} arr [{name:'百度IFE项目',number:10,subCategory:[{name:'task1',number:6}]}]
     * @param {*} index index '1' or '1-1' 根据索引来选中某一项
     */
    function updateTaskList(arr, index) {
        taskList.replaceChild(renderTaskList(arr), taskList.children[0]);
        var todos = taskList.querySelectorAll('.todo');
        // console.log(index);
        
        if(todos.length > 0) {
            if(index != undefined) {
                toSelectTask(index);
            } else {
                toSelectTask(todos[0].index);
           
            }
        } else {
                 // 如果没有todos， 将任务详情置为空
                 initDetail.reset();
        }
    };
    /**
     *
     *
     * @param {*} arr
     * @returns
     */
    function renderTaskList(arr) {
        arr = filterTodo(arr);
        var ul = document.createElement('ul');
        // var all = null;
        var task= null;
        var todo = null;
        // console.log(arr);
        for(var i = 0;i < arr.length;i++) {
            var oldTask = ul.querySelector('#id' + arr[i].date);
            if(oldTask !== null) {
                todo = new Todo(arr[i]).container;
                todo.index = '' + arr[i].index;
                oldTask.widget.taskWrap.appendChild(todo);
            }else {
                task = new Task(arr[i]);
                task.todo.index = '' + arr[i].index;
                ul.appendChild(task.container);
            }
        }
        return ul;
        
    }

    // 包裹任务列表到标签中 @parm {data.category } [{name: '毕业设计', number:1, todos:[{name:'to-do 1', data: '2020-05-08', isFinished: false, content:'完成前言'}], subCategory: []}],
    /**
     *
     *
     * @param {*} arr  [{name:'to-do 4', date: '2015-04-08', isFinished: false, content:'学习'}, {name:'to-do 2',date:'2015-05-11',isFinished:false,content:'打豆豆'}]
     * @returns node
     */
    // 渲染列表添加索引
    function renderCGList(arr) {
        var ul = document.createElement('ul');
        var obj = null;
        var subObj = null;
        for(var i = 0; i < arr.length; i++) {
            if(arr[i].name === '默认分类') {
                obj = new Category({name: arr[i].name, number: arr[i].number, canDelete: false});
                obj.category.id = 'default';
            }
            else{
                obj = new Category({name: arr[i].name, number: arr[i].number});
            }
            obj.category.index = '' + i;
            var subArr =  arr[i].subCategory
            if(subArr.length > 0) {
                for(var j = 0;j < subArr.length; j++) {
                   subObj = new SubCategory({name: subArr[j].name, number: subArr[j].number});
                   // 在sub-category节点上添加index
                   subObj.container.index = i+'-'+ j;
                   obj.cgSubclass.appendChild(subObj.container);
                }
            }
            ul.appendChild(obj.container)
        }
        return ul;
    };
   
    // 选中任务列表标签记录
    function toSelectCG(node, index) {
        var lisCG = cgList.querySelectorAll('.cg');
        // console.log(lisCG);
        
        for(var i = 0; i < lisCG.length; i++) {
            _.removeClass(lisCG[i], 'select')
        }
        _.addClass(node, 'select');
        selectCG = node;
        if(node.index.indexOf('-') < 0) {
            updateTaskList(data.category[node.index].todos, index);
        } else {
            var arr = node.index.split('-');
            updateTaskList(data.category[arr[0]].subCategory[arr[1]].todos, index);
        }
        
    }
    // 分类列表节点上代理分类或者子类点击事件
    $.delegate(cgList, '.cg', 'click', function() {
        toSelectCG(this);
        // console.log(this.index);
    },".delete-i");
    //tabs标签的代理事件
    $.delegate(eleTab,'li', 'click', function() {
        toSelectTab(this);
        updateCGList(data.category,selectCG.index);
    });
        //任务列表节点上代理任务的点击事件
     $.delegate(taskList,'.todo','click',function() {
         toSelectTask(this.index);
    });
    // 分类列表节点上代理删除按钮的点击事件
    $.delegate(cgList, '.delete-i', 'click', function() {
        var index = this.parentNode.index;
        var selectIndex = '';
        new Modal({hasFlag: true,text:'是否确定删除？'})
            .on('confirm', function() {
                if(index.indexOf('-') < 0) {
                    data.category.splice(index, 1);
                    selectIndex = '' + Math.min(index,data.category.length - 1)
                } else {
                    var arr = index.split('-');
                    data.category[arr[0]].subCategory.splice(arr[1], 1);
                    if(data.category[arr[0]].subCategory.length === 0) {
                        selectIndex = arr[0];
                    } else {
                        selectIndex = arr[0] + '-' + Math.min(arr[1], data.category[arr[0]].subCategory.length - 1);
                    }
                }
                updateDataNumber(data);
                updateCGList(data.category, selectIndex);
                _.save(data);
            })
            .appendTo(document.body);
    });
    // 给新增分类的按钮添加点击事件
    $.click(addCG, function() {
        new Modal()
            .on('confirm', function() {
                if(this.input.value.trim() != '') {
                    var index = '';
                    if(selectCG.className.indexOf('sub-category') != -1) {
                        index = '' + (data.category.push({name: this.input.value, number: 0, todos: [], subCategory: []}) - 1);
                    } else {
                        index = selectCG.index + '-' + (data.category[selectCG.index].subCategory.push({name: this.input.value, number: 0, todos:[]}) - 1);  
                    }
                }
                // 更新分类列表
                updateCGList(data.category, index);
                _.save(data);
            })
            .appendTo(document.body);
    });
    // 2-5.给新增任务的按钮注册点击事件
    $.click(addTask,function() {
        // containerRight.parentNode.removeChild(containerRight);
        // initDetail.reset();
        // gBody.appendChild(initDetail.container);
        // containerRight.style.display = "none";
        // initDetail.destroy();
        containerDetail.appendChild(new Edit({name:'',date:format(new Date()),content:''}).on('confirm',function() {
            var index = '';
            var todos = [];
            var obj = this.getData();     
            if(selectCG.index.indexOf('-') == -1) {
                todos = data.category[selectCG.index].todos;
            } else {
                var arr = selectCG.index.split('-');
                todos = data.category[arr[0]].subCategory[arr[1]].todos;
            }
            // gBody.appendChild(initDetail.container);
            todos.push(obj);
            todos.sort(byDate);
            index = todos.indexOf(obj);
            // console.log(index);

            updateDataNumber(data);
            // updateTotalTaskNums();
            updateCGList(data.category,selectCG.index,index);
            _.save(data);
        }).container);
        // var containerEdit = $(".container-edit")
        // gBody.appendChild(initDetail.container);
    });
    // 选中任务列表标签 渲染任务详情
    function toSelectTask(taskIndex) {
        var  todos = taskList.querySelectorAll('.todo');
        for(var i = 0; i < todos.length; i++) {
            if(todos[i].index == taskIndex) {
                _.addClass(todos[i], 'select');
                selectTask = todos[i];
            } else {
                _.removeClass(todos[i], 'select')
            }
        }
        var arrTodo = [];
        if(selectCG.index.indexOf('-') < 0) {
            arrTodo = data.category[selectCG.index].todos;
        } else {
            var arr = selectCG.index.split('-');
            arrTodo = data.category[arr[0]].subCategory[arr[1]].todos;
        }
        initDetail.setContent(arrTodo[taskIndex]);
    };
   
    // 选择tabs标签
    function toSelectTab(node) {
        var lisT = tabList.querySelectorAll('li');
        for(var i = 0; i < lisT.length; i++) {
            _.removeClass(lisT[i], 'select')
        }
        _.addClass(node, 'select');
        selectTab = node;
    }
    // 根据Tab标签现实对应的todos
    function filterTodo(todos) {
        var arr = [];
        if(selectTab.id === 'all') {
            for(var i = 0; i < todos.length; i++) {
                todos[i].index = i;
                arr.push(todos[i]);
            }
        }
        else if(selectTab.id == 'unfinished') {
            for(var i = 0; i < todos.length; i++) {
                if(todos[i].isFinished === false) {
                    todos[i].index = i;
                    arr.push(todos[i]);
                }
            }
        }
        else {
            for(var i = 0; i < todos.length; i++) {
                if(todos[i].isFinished === true) {
                    todos[i].index = i;
                    arr.push(todos[i]);
                }
            }
        }
        return arr;
    }

    
})(util);