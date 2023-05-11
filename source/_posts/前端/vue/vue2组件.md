---
title: vue2组件
author: Re_Star
avatar: https://gitee.com/trueLoving/cdn/raw/master/img/avatar.jpg
authorAbout: 一个十分骚气的宅男
authorDesc: 一个十分骚气的宅男
categories: 前端
tags:
 - vue
keywords: vue
date: 2020-01-31
comments: false
description: vue2组件
photos: https://gitee.com/trueLoving/cdn/raw/master/img/类数组转换为数组的方法_bg.jpg
---


## 组件化编码 & 模块化编码
1. 模块 --> 具有特定功能的js文件
2. 组件 --> 用来实现特定(局部)功能效果的代码集合(html/css/js)

而在我们开发中，我们是通过组件化思想来分割页面成一个个组件，最后拼接成一个页面

如果要使用组件化思想，一般可以按照以下步骤来进行思考
1. 搞清要被划分页面所涉及的数据(搞起数据的来源，数据的类型)，以及该页面所涉及到的用户操作
2. 划分页面成一块块组件，并且搞清每一个组件所涉及到的相关数据和用户操作
3. 根据页面先完成页面的静态显示
4. 然后完成页面的动态显示(`先初始化`，`再动态化`)  


## 组件的基本认识

组件的视图显示一般是由两部分组成:静态视图+数据视图

静态视图就是静态页面，一般也就是由html+css组成

而数据视图则是由html+css+js组成.其中js是负责获取数据并将数据显示到视图上

对组件来说，其数据一般是由两部分组成
1. `内部数据`
2. `外部数据`

内部数据一般是组件自身所携带的，外部数据则是由外部传入的


## 组件的基本使用

#### 使用全局组件

```html
<!DOCTYPE html>
<html lang="en">

<head>
  <title>Vue Component</title>
</head>

<body>
  <div id="app">
    <button-counter></button-counter>
  </div>
  <script src="https://cdn.jsdelivr.net/npm/vue/dist/vue.js"></script>
  <script>
    // Vue.Component('component-name',options);
    Vue.component('button-counter',{
      data:function(){
        return {
          count:0
        }
      },
      template:`<button @click='count++'>you click {{count}} times</button>`
    })

    new Vue({
      el:'#app'
    })
  </script>
</body>

</html>

```
#### 使用局部组件
1. 创建一个普通对象来定义组件
2. 然后在创建vue实例对象的配置参数中指定components对象

```html
<!DOCTYPE html>
<html lang="en">

<head>
  <title>Vue Component</title>
</head>

<body>
  <div id="app">
    <button-counter></button-counter>
  </div>
  <script src="https://cdn.jsdelivr.net/npm/vue/dist/vue.js"></script>
  <script>
    
    var ButtonCounter = {
      template:`<button @click="count++">{{count}}</button>`,
      data:function(){
        return{
          count:0
        }
      }
    }

    new Vue({
      el:'#app',
      components:{
        ButtonCounter
      }
    })

  </script>
</body>

</html>
```

## 组件的通信

组件通信基本原则
1. 不要在子组件中直接修改父组件的状态数据
2. 数据在哪里，更新数据的行为(函数)就应该定义在哪里

#### props
props属性是在定义一个组件常用的属性，用于在我们使用该组件时应该传入什么样的数据，如果我们没有按照其要求传入相关数据，该组件在创建期间就会发生warning!

props属性是一个对象，该对象的每一个属性名是该组件所要传入的属性名，而属性名所对应的属性值可以是一个对象。该对象是用于描述该属性的类型，默认值，是否必需等

在父子组件之间通信时，我们可以在父组件定义改变数据的方法，然后将该方法作为一个prop传入给子组件。当子组件需要修改父组件数据时调用该方法即可(跟react父子之间通信道理一样)

`demo`
```html
<!DOCTYPE html>
<html lang="en">

<head>
  <title>Vue props</title>
</head>

<body>
  <div id="app">
    <parent-component/>
  </div>
  <script src="https://cdn.jsdelivr.net/npm/vue/dist/vue.js"></script>
  <script>


    Vue.component('child-component',{
      template:`<button @click='changeParentData'>change parent component data</button>`,
      props:{
        changeParentData:{
          type:Function,
          required:true
        }
      }
    });

    Vue.component('parent-component',{
      template:`
        <div>
          <h1>{{msg}}</h1>
          <child-component :changeParentData="changeParentData"/>
        </div>
      `,
      data:function(){
        return{
          msg:'parent data'
        }
      },
      methods:{
        changeParentData:function(){
          this.msg += ' change';
        }
      }
    })


    new Vue({
      el: '#app'
    })

  </script>
</body>

</html>
```

注意，该方式的数据流是单向的，即`父组件 --> 子组件`。也就是说我们无法通过该方式来实现通过父组件来修改子组件数据


#### $emit
此方式是通过监听事件然后触发回调函数来实现组件通信，且该方法只能用于子组件向父组件传递数据
方式 `子组件 --> 父组件` 


`demo`
```html
<!DOCTYPE html>
<html lang="en">

<head>
  <title>Vue props</title>
</head>

<body>
  <div id="app">
    <parent-component />
  </div>
  <script src="https://cdn.jsdelivr.net/npm/vue/dist/vue.js"></script>
  <script>

    Vue.component('child-component', {
      template: `<button @click="postDataToParent">post data to parent component</button>`,
      data:function(){
        return{
          msg:"hello child component"
        }
      },
      methods:{
        postDataToParent:function(){
          alert('post data to parent!');
          this.$emit('receive',this.msg);
        }
      }
    });

    Vue.component('parent-component', {
      template: `
        <div>
          <h1>{{msg}}</h1>
          <child-component @receive="receive"/>
        </div>
      `,
      data: function () {
        return {
          msg: 'parent data'
        }
      },
      methods: {
        receive: function (data) {
          alert('receive data from child!');
          this.msg = data;
        }
      }
    })

    new Vue({
      el: '#app'
    })

  </script>
</body>

</html>
```

#### 消息订阅发布机制(PubSubJS)

PubSubJS地址: https://www.npmjs.com/package/pubsubjs

我们可以使用PubSubJS来完成组件的通信,模式为订阅者 -- 发布者模式。当一个组件A想要向另一个组件B通信时,首先组件B要订阅A发布的消息,然后当A要向B通信时就直接发布相应消息

订阅消息  

PubSub.subscribe('msg',function(msg,data){})

发布消息  

PubSub.publish('msg',data)


