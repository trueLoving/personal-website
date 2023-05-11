---
title: vue3的基本认识和使用
author: Re_Star
avatar: https://gitee.com/trueLoving/cdn/raw/master/img/avatar.jpg
authorAbout: 一个十分骚气的宅男
authorDesc: 一个十分骚气的宅男
categories: 前端
tags:
 - vue
keywords: vue
date: 2020-07-20 18:00:00
comments: false
description: vue3的基本认识和使用
photos: https://gitee.com/trueLoving/cdn/raw/master/img/vue3的基本认识_bg.jpg
---

## 基本认识

`vue3` 是 `vue2` 的下一个版本，至于为什么会出现 `vue3` 主要是因为在使用 `vue2` 的过程中出现了一些改善框架所根本或者需要花费很大代价才能解决的问题。大致说可以归为以下两种
1. `vue2`中缺少简介且低成本的机制来提取和重用多个组件之间的逻辑
2. 随着功能的增长，组件越来越复杂，组件的代码越来越让人难以理解，而且我们只能根据 `Vue` 现有的API来尽量使得代码变得令人简单理解，但是这最终还是无法从根本上解决组件代码越来越复杂的问题。

而这是因为以上原因，`vue3` 就重新设计了组件的相关api，原本编写一个 `vue` 组件需要提供 `data` 和 `method`，在 `vue3` 中只需要指定 `setup` 入口函数就可以完成一个组件的渲染工作，`setup` 函数返回的值将会合并到 `vue` 的渲染上下文中，所返回的值都可以用于模板的渲染。

而且，由于最近几年 [typescript](https://www.tslang.cn/)的兴起，现大部分项目都使用了 `typescript`，而在 `vue2` 中对于 `typescript` 的支持需要引入相关的支持包，并且对 `typescript` 的支持度也是有限的。也正是因为这样，vue3所有的源代码都是由 `typescript` 所编写的，最大程度上支持了 `typescript`。

总的来说，vue3的优势如下
1. 组件化编写组件变为 `composition` 编写组件
2. 将 `vue` 框架源码按API分包编写然后组合，这样就可以按只需功能打包，减少打包体积
3. 对 `typescript` 有了更好的支持


#### 资料连接
1. [Github](https://github.com/vuejs/vue-next)
2. [Composition_API](https://composition-api.vuejs.org/zh/)


## 基本使用

我们只需要按照以下步骤就可以完成 `vue3` 的尝鲜使用
1. 在Github上克隆该项目 [vue-next-webpack-preview](https://github.com/vuejs/vue-next-webpack-preview.git)
2. 运行 `npm i` 安装相关依赖
3. 运行 `npm run dev` 运行项目

现在，我们关注代码，其实使用 `vue3` 语法的也就只有 `main.js` 和 `App.vue`文件

`main.js`
```js
// 项目运行的入口文件
import { createApp } from 'vue' // 引入创建vue-component方法
import App from './App.vue' // 导入vue组件

createApp(App).mount('#app') // 创建vue实例并挂载到dom上
```

`App.vue`
```vue
<template>
  <img src="./logo.png">
  <h1>Hello Vue 3!</h1>
  <button @click="inc">Clicked {{ count }} times.</button>
</template>

<script>
import { ref } from 'vue' // 引入ref方法

export default {
  // 组件创建的入口方法
  setup() {
    const count = ref(0) // 定义响应式数据
    const inc = () => {
      count.value++
    } // 定义方法

    // 返回的数据会注册到渲染上下文(context)，模板渲染所需要的数据可以从这上下文(context)中获取
    return {
      count,
      inc
    }
  }
}
</script>

<style scoped>
img {
  width: 200px;
}
h1 {
  font-family: Arial, Helvetica, sans-serif;
}
</style>
```

`思路`
1. 从 `vue` 导入创建组件的方法 `createApp`
2. 导入 `App.vue`
3. 创建好并挂载到 DOM 上

## 思维导图

![vue3](https://gitee.com/trueLoving/cdn/raw/master/img/vue3的基本认识 01.jpg)