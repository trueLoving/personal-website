---
title: vue2的基本认识和使用
author: Re_Star
avatar: https://gitee.com/trueLoving/cdn/raw/master/img/avatar.jpg
authorAbout: 一个十分骚气的宅男
authorDesc: 一个十分骚气的宅男
categories: 前端
tags:
 - vue
keywords: vue
date: 2020-01-21
comments: false
description: vue2的基本认识和使用
photos: https://gitee.com/trueLoving/cdn/raw/master/img/类数组转换为数组的方法_bg.jpg
---

## 参考资料

1. 官方文档: https://vuejs.org/
2. github仓库: https://github.com/vuejs/vue

## 基本认识
1. 是一套用于构建用户界面的渐进式框架，只关注视图层
2. 遵循MVVM模式
3. 可以轻松引入vue相关插件或者结合第三方开发项目进行开发
4. 借鉴angular的模板和数据绑定
5. 借鉴react的组件化和虚拟DOM技术

## 相关生态
1. [vue-cli](https://cli.vuejs.org/zh/):vue脚手架
2. [axios](https://github.com/axios/axios):ajax请求
3. [vue-router](https://router.vuejs.org/zh/):SPA路由控制
4. [vuex](https://vuex.vuejs.org/zh/):状态管理
5. [element-ui](https://element.eleme.cn/#/zh-CN):基于vue的UI组件库(PC端)
6. [mint-ui](http://mint-ui.github.io/#!/zh-cn):基于vue的UI组件库(移动端)
7. [vue-element-admin](https://panjiachen.gitee.io/vue-element-admin-site/zh/):基于vue,element-ui等相关库所开发的后台管理模板

## 安装

#### 1. CDN引入
直接使用script标签引入

```js
// 开发环境下使用，在开发中会给出友好的提示
<script src="https://cdn.jsdelivr.net/npm/vue/dist/vue.js"></script>
// 开发环境下使用，会压缩代码，减少代码体积
<script src="https://cdn.jsdelivr.net/npm/vue/dist/vue.min.js"></script>
```

#### 2. NPM引入
前提要安装nodejs(网址:https://nodejs.org/en/)

安装:`npm i vue --save`

`使用`

```js
import Vue from 'vue';

new Vue({
    // ...option
})
```

## 简单使用(Hello World)

#### vue的简单使用总共分为以下几步
1. 获取一个DOM容器
2. new 一个vue的实例对象
3. 传递创建该实例对象所需要的参数配置

#### demo
```html
<html>
    <head>
        <title>vue demo</title>
        <script src="https://cdn.jsdelivr.net/npm/vue/dist/vue.js"></script>
    </head>
    <body>
        <div id="app">
            {{msg}}
        </div>
        <script>
            // 创建Vue的实例对象，并传入配置对象
            var vm = new Vue({
                // 获取容器
                el:"#app",
                data(){
                    msg:"hello world"
                }
            });
            /**
             *  
             * 最后,页面会显示hello world
             * 
             * /
        </script>
    </body>
</html>
```

## 基本语法

#### 声明式渲染
1. 双大括号:将实例对象中的data数据渲染到页面中
2. v-html:用于输出HTML代码
3. v-text:用于输出文本

```html
<html>
    <head>
        <title>vue demo</title>
        <script src="https://cdn.jsdelivr.net/npm/vue/dist/vue.js"></script>
    </head>
    <body>
        <div id="app">
            {{msg}}
            <div v-html="innerHTML"></div>
            <div v-text="textContent"></div>
        </div>
        <script>     
            var vm = new Vue({
                el:"#app",
                data(){
                    msg:"hello world",
                    innerHTML:"<h1>innerHTML</h1>"
                    textContent:"textContent"
                }
            });
        </script>
    </body>
</html>
```

#### 条件渲染
1. v-if:用于条件性地渲染一块内容
2. v-show:用于控制display的值
3. v-if vs v-show  

```js
// v-show只是简单的基于CSS进行切换
// v-if会控制该元素是否参与DOM树,如果false就从DOM树中删除销毁
// 如果需要非常频繁地切换，则使用v-show较好;如何在运行时条件很少改变,则使用v-if较好
```

#### 循环渲染(v-for)
1. 遍历数组(item in items)  

我们可以使用v-for基于一个数组来渲染一个列表，语法为item in items,其中items是data中是源数据，而item则是被迭代的数组元素的别名

```html
<html>
    <head>
        <title>vue demo</title>
        <script src="https://cdn.jsdelivr.net/npm/vue/dist/vue.js"></script>
    </head>
    <body>
        <div id="app">
            <ul>
                <li v-for="(item,index) in items" :key="index">{{item}}</li>
            </ul>
        </div>
        <script>
            var vm = new Vue({
                el:"#app",
                data(){
                    items: [
                        { message: 'Foo' },
                        { message: 'Bar' }
                    ];
                }
            });
        </script>
    </body>
</html>
```

2. 遍历对象 

我们可以使用v-for来遍历一个对象的属性
```html
<html>
    <head>
        <title>vue demo</title>
        <script src="https://cdn.jsdelivr.net/npm/vue/dist/vue.js"></script>
    </head>
    <body>
        <div id="app">
            <ul>
                <li v-for="(value,name,index) in obj" :key="index">
                    {{name}}:{{value}}
                </li>
            </ul>
        </div>
        <script>
            var vm = new Vue({
                el:"#app",
                data(){
                    obj:{
                        name:"zhangsan",
                        age:24
                    }
                }
            });
        </script>
    </body>
</html>
```

3. 数组更新检测

Vue对一个数组的变异方法进行包裹，所以调用以下方法会触发视图更新
```js
push()
pop()
shift()
unshift()
splice()
sort()
reverse()
```

#### 计算属性和监听器(computed&watch)
##### computed  
1. 在computed属性对象中定义计算属性的方法
2. 在页面中使用{{方法名}}来显示计算的结果

##### 监视属性
1. 通过vm对象的$watch或watch配置来监视指定的属性
2. 当属性变化时,回调函数自动调用,在函数内部进行计算

##### 计算属性高级
1. 通过getter/setter实现对属性数据的显示个监视
2. 计算属性存在缓存,多次读取只执行一个getter计算

#### Style&Class
##### class绑定
1. :class='xxx'
2. 表达式是字符串:'classA'
3. 表达式是对象:{classA:isA,classB:isB}
4. 表达式是数组:['classA','classB']

##### style绑定
1. :style="{color:activeColor,fontSize:fontSize+'px'}"
2. 其中activeColor/fontSize是data属性

##### demo
```vue
<style>
    .classA{
        color:red;
    }
    .classB{
        background:blue;
    }
    .classC{
        font-size:20px;
    }   
</style>

<template>
<div id="demo">
    <h2>1.class绑定::class='xxx'</h2>
    <p class="classB" :class="a">表达式是字符串:'classA'</p>
    <p :class="{classA:isA,classB:isB}">表达式是对象:{classA:isA,classB:isB}</p>
    <p :class="['classA','classC']">表达式是数组:['classA','classB']</p>

    <h2>2.style绑定</h2>
    <p :style="{color,fontSize}">
        style="{color:activeColor,fontSize:fontSize+'px'}"
    </p>

    <button @click="update">更新</button>

</div>
</template>

<script src="https://cdn.jsdelivr.net/npm/vue/dist/vue.js"></script>
<script>
new Vue({
    el:'#demo',
    data:{
        a:'classA',
        isA:true,
        isB:false,
        color:'red',
        fontSize:'20px'
    },
    methods:{
        update(){
            this.a='classC'
            this.isA=falsethis.isB=truethis.color='blue'
            this.fontSize='30px'
        }
    }
})
</script>
```

#### 事件监听
##### 绑定监听
1. v-on:eventName="fun"
2. @eventName="fun"
3. @eventName="fun(参数)"
4. 默认事件形参:event
5. 隐含属性对象:$event

##### 事件修饰符
1. .prevent:阻止事件的默认行为 event.preventDefault()
2. .stop:停止事件冒泡 event.stopPropagation()

##### 按键修饰符
1. .keycode:操作的是某个keycode值的键
2. .keyName:操作的是某个按键名的键(少部分)

##### demo
```vue
<template>
    <div id="example">
        <h2>1.绑定监听</h2>
        <button v-on:click="test1">Greet</button>
        <button @click="test1">Greet2</button>
        <button @click="test2($event,'hello')">Greet3</button>
        <h2>2.事件修饰符</h2>
        <!--阻止事件默认行为-->
        <a href="http://www.baidu.com"@click.prevent="test3">百度一下</a>
        <br/><br/>
        <!--停止事件冒泡-->
        <div style="width:200px;height:200px;background:red" @click="test4">
            <div style="width:100px;height:100px;background:green" @click.stop="test5"></div>
        </div>
        <h2>3.按键修饰符</h2>
        <input @keyup.8="test6">
        <input @keyup.enter="test6">
    </div>
</template>
<script src="https://cdn.jsdelivr.net/npm/vue/dist/vue.js"></script>
<script>
    newVue({
        el:'#example',
        data:{
            name:'Vue.js'
        },
        methods:{
            test1(event){
                //方法内`this`指向vm
                //alert('Hello'+this.name+'!')
                //`event`是原生DOM事件
                alert(event.target.innerHTML)
            },
            test2(event,msg){
                alert(event.target.innerHTML+'---'+msg)
            },
            test3(){
                alert('阻止事件的默认行为')
            },
            test4(){
                alert('out')
            },
            test5(){
                alert('inner')
            },
            test6(event){
                alert(event.keyCode+'---'+event.target.value)
            }
        }
    })
</script>
```

#### 事件处理/表单输入绑定
1. text/textarea
2. checkbox
3. radio
4. select

`demo`
```vue
<template>
<div id="demo">
    <form @submit.prevent="handleSubmit">
        <span>用户名:</span>
        <input type="text"v-model="user.username"><br>
        <span>密码:</span>
        <input type="password" v-model="user.pwd"><br>
        <span>性别:</span>
        <input type="radio" id="female" value="female" v-model="user.sex">
        <label for="female">女</label>
        <input type="radio" id="male" value="male" v-model="user.sex">
        <label for="male">男</label><br>
        <span>爱好:</span>
        <input type="checkbox" id="basket" value="basketball" v-model="user.likes">
        <label for="basket">篮球</label>
        <input type="checkbox"id="foot"value="football"v-model="user.likes">
        <label for="foot">足球</label>
        <input type="checkbox"id="pingpang"value="pingpang"v-model="user.likes">
        <label for="pingpang">乒乓</label><br>
        <span>城市:</span>
        <select v-model="user.cityId">
            <option value="">未选择</option>
            <option v-for="cityinallCitys" :value="city.id">
                {{city.name}}
            </option>
        </select>
        <br/>
        <span>介绍:</span>
        <textarea v-model="user.desc"rows="10"></textarea><br><br>
        <input type="submit"value="注册">
    </form>
</div>
</template>
<script src="https://cdn.jsdelivr.net/npm/vue/dist/vue.js"></script>
<script>
var vm = new Vue({
    el:"#demo",
    data:{
        user:{
            username:'',
            pwd:'',
            sex:'female',
            likes:[],
            cityId:'',
            desc:''
        }
        allCitys:[{id:1,name:'BJ'},{id:2,name:'SZ'},{id:4,name:'SH'}],
    },
    methods:{
        handleSubmit(event){
            alert(JSON.stringify(this.user);
        }
    }
})
</script>
```

## 指令

#### 内置指令
指令名  | 用处                                 | 其他  
-|-|-
v-text | 向页面输出文本                         | 相当于textContent |
v-html | 向页面输出文本                         | 相当于innerHTML |
v-if   | 通过控制元素是否在DOM树中来控制元素的显示  | 该属性会对DOM树产生影响 |
v-else | 与v-if搭配使用,v-if后面的表达式为false才会执行该段代码        | 无 |
v-show | 通过控制元素css来控制元素的显示            | 该属性不会对DOM树产生影响 |
v-for  | 循环渲染元素                           | 一般需要为循环的元素指定key值 |
v-model| 表单组件输入绑定监听                    | 主要常见表单组件:textare/checkbox/radio/input/select |
v-on   | 事件绑定                             | 可简写为@事件名.事件修饰符 |
v-bind | 属性绑定,后面的值会看作js代码运行        | 可简写为:attribute=value |
v-clock | 防止闪现,与css配合:[v-cloak]{display:none}        | 可简写为:attribute=value |
#### 自定义指令
在Vue实例对象注册的指令为全局指令，在组件内部定义的指令为局部指令
##### 注册全局指令
```js
Vue.directive('my-directive',function(el,binding){
    // todo something
})
```
##### 注册局部指令
```js
directives:{
    'my-directive':{
        bind(el,binding){
            // todo something
        }
    }
}
```
##### 使用demo

v-my-directive = 'xxx'

需求:自定义2个指令
1. 功能类型于v-text,但转换为全大写
2. 功能类型于v-text,但转换为全小写

```vue
<template>
    <div id="demo1">
       <p v-upper-text="msg"></p>
       <p v-lower-text="msg"></p>
    </div>
    <div id="demo2">
       <p v-upper-text="msg2"></p>
       <p v-lower-text="msg2"></p><!--局部指令,此处不能使用-->
    </div>
</template>
<script src="https://cdn.jsdelivr.net/npm/vue/dist/vue.js"></script>
<script>
    //注册全局指令
    Vue.directive('upper-text',function(el,binding){
        el.innerHTML=binding.value.toUpperCase()
    });

    new Vue({
        el:'#demo1',
        data:{
            msg2:'NBA love this game!'
        },
        directives:{
            'lower-text':{
                bind(el,binding){
                    el.innerHTML = binding.value.toLowerCase();
                }
            }
        }
    })

    new Vue({
        el:'#demo2',
        data:{
            msg2:'ILikeYou'
        }
    })

</script>
```

## 插件
1. Vue插件是一个包含install方法的对象
2. 通过install方法给vue或vue实例添加方法，定义全局z指令等

#### 定义使用
```js
// vue-myPlugin.js
// 定义Vue一个插件
(function MyPlugin(){

    const MyPlugin = {};

    MyPlugin.install = function(Vue,options){

        Vue.GlobalMethod = function(){
            console.log('Vue函数对象方法执行');
        };

        Vue.directive('my-directive',function(el,binding){
            el.innerHTML = 'MyPlugin my-directive'+binding.value
        });

        Vue.prototype.$method = function(){
            console.log('vue'实例对象)
        }
    }

    window.MyPlugin = MyPlugin;

})();
```
在页面中使用

```html
<div id="demo">
    <p v-my-directive="msg">
</div>
<script src="https://cdn.jsdelivr.net/npm/vue/dist/vue.js"></script>
<script src="vue-myPlugin.js"></script>
<script>

    Vue.use(MyPlugin);

    var vm = new Vue({
        el:"#demo",
        data:{
            msg:'atguigu'
        }
    })

    Vue.myGlobalMethod();

    vm.$myMethod();

</script>
```