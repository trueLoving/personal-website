---
title: vue2 vuex
author: Re_Star
avatar: https://gitee.com/trueLoving/cdn/raw/master/img/avatar.jpg
authorAbout: 一个十分骚气的宅男
authorDesc: 一个十分骚气的宅男
categories: 前端
tags:
 - vue
keywords: vue
date: 2020-02-18
comments: false
description: vue2 vuex
photos: https://gitee.com/trueLoving/cdn/raw/master/img/类数组转换为数组的方法_bg.jpg
---

## 前言

vuex是一个专门为vue应用程序开发的状态管理模式。它的出现是为了处理多个组件共同使用一个数据源渲染视图的问题

当我们通过调用vuex的方法来改变数据时,跟数据相关的组件们视图就会同时发生变化

vuex可以帮我们集中管理数据,存储多个组件共享的数据状态

vuex的工作流程如下图所示

<img src="https://vuex.vuejs.org/vuex.png">

`描述`

1. 当组件调用dispatch方法时会触发vuex的action方法,在action方法中我们可以执行异步操作(api的请求...)
2. 在action方法中我们可以通过调用mutation方法来更新state中的数据
3. 一旦state中的数据发生变化,那么用state数据渲染的相关组件视图就会发生变化
4. 当然,在实际开发中,不一定要按照这个流程来,可以根据实际情况来修改流程


## vuex的基本使用

vuex共有以下5部分组成
1. getter(计算)
2. state(数据源)
3. mutation(修改数据源的方法)
4. action(组件修改state的方法)
5. module(模块化)

#### getter
我们可以使用getter进行一些数据源的派生计算,例如我想要获取数据源并且进行过滤,这时候我们就可以使用getter

在组件中,我们可以使用mapGetter方法来获取数据源,该方法来自vuex实例对象

语法:`mapGetters(namespace?: string, map: Array<string> | Object<string>): Object`

#### state

数据源,用于存储数据

在组件中,我们可以使用mapState方法来获取数据源,该方法来自vuex实例对象

语法:`mapState(namespace?: string, map: Array<string> | Object<string | function>): Object`

#### mutations

我们可以调用mutation来修改state中数据的值

语法:`store.commit(mutation,...args)`

#### actions

我们可以在action中进行异步操作和修改数据源数据的操作

语法:`store.dispatch(action,...args)`

#### modules

由于我们在实际开发过程中,vuex维护的数据源会越来越庞大,因此对vuex进行拆分是十分有必要的

每一个module可以看作成一个小型的vuex


#### demo

```js
// 引入相关库


// 模块A
const moduleA = {
    state:{
        a:1
    },
    mutations:{
        SET_A(state,a){
            state.a = a;
        }
    },
    actions:{
        changeA({commit},a){
            commit('SET_A',a)
        }
    },
    namespaced:true
}


// 模块B
const moduleB = {
    state:{
        b:1
    },
    mutations:{
        SET_A(state,b){
            state.b = b;
        }
    },
    actions:{
        changeA({commit},b){
            commit('SET_A',b)
        }
    },
    namespaced:true
}

// getter定义

const getters = {
    a:state.moduleA.a,
    b:state.moduleB.b,
    sumAB:state.moduleA.a+state.moduleB.b
}

export default Vuex.Store({
    getters,
    modules:{
        moduleA,
        moduleB
    }
})
```

## 简单状态管理(store模式)

在一些简单的应用中,我们使用vuex会给我们带来比较大的负担。

我们可以根据vuex的工作思路自己实现一个简单的数据共享对象


`store模式简单`
```js
const store = {
    state:{
        a:1
    },
    actions:{
        changeA(a){
            this.state.a = a;
        }
    }
}
```

`组件一`
```vue
<template>
    <h1>state.a</h1>
</template>
<script>
import { state } from 'store';

export default{
    data(){
        return{
            state
        }
    }
}
</script>
```

`组件二`
```vue
<template>
    <h1>state.a+1</h1>
    <button @click="click">click</button>
</template>
<script>
import { state,action } from 'store';

export default{
    data(){
        return{
            state
        }
    },
    methods:{
        click(){
            action.changeA(10);
        }
    }
}
</script>
```

描述

1. 当我们点击组件2的按钮时,会触发action.changeA方法,并向其传递参数10
2. 此时组件2的视图就会发生变化,且store.state.a的值也会发生变化
3. 组件1的视图也会发生变化,因为组件1渲染时所使用的数据来自store.state.a,因为store.state.a发生变化,组件1的视图就发生了变化
4. 此时组件1的a和组件2的a都来自store.state.a。就实现了组件们的数据共享
