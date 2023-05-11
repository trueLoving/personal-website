---
title: vue2 computed&watch
author: Re_Star
avatar: https://gitee.com/trueLoving/cdn/raw/master/img/avatar.jpg
authorAbout: 一个十分骚气的宅男
authorDesc: 一个十分骚气的宅男
categories: 前端
tags:
 - vue
keywords: vue
date: 2020-06-08
comments: false
description: vue2 computed&watch
photos: https://gitee.com/trueLoving/cdn/raw/master/img/类数组转换为数组的方法_bg.jpg
---

## computed

1. 特点:

computed是计算属性,依赖于其它属性值,并且computed的值有缓存,只有它依赖的属性值发生变化时,下一次获取computed的值时才会重新计算computed的值
但是如果被依赖的属性值来自外部,那么该属性值发生改变,计算属性


2. 适用场景

当我们需要进行数值计算,并且依赖于其他数据时,应该使用computed,因为可以利用computed的缓存特性,并没每次获取值,都要重新计算


3. 语法

```js
computed:{ [key: string]: Function | { get: Function, set: Function } }
```

4. 使用样例

```js
var vm = new Vue({
  data: { a: 1 },
  computed: {
    // 仅读取
    aDouble: function () {
      return this.a * 2
    },
    // 读取和设置
    aPlus: {
      get: function () {
        return this.a + 1
      },
      set: function (v) {
        this.a = v - 1
      }
    }
  }
})
vm.aPlus   // => 2
vm.aPlus = 3
vm.a       // => 2
vm.aDouble // => 4
```


## watch

1. 特点

没有缓存行,更多的是观察的作用,类似于某些数据的监听回调,每当监听的数据变化时都会执行回调进行后续操作；
当我们需要深度监听对象的属性时,可以打开deep:true选项,这样便会对对象中的每一项进行监听
注意:Vue实例在初始化的时候会调用$watch(),遍历watch对象的每一个属性

如果我们使用箭头函数来定义watch的函数,那么我们就无法在函数内部访问当前实例,因此我们最好避免使用箭头函数来定义watch的函数

2. 适用场景

当我们需要在数据变化时进行异步或开销较大的操作时,应该使用watch,使用watch选项允许我们执行异步操作(访问一个api),限制我们执行该操作的频率,并且在我们得到最终结果前,设置中间状态。
这些都是计算属性无法做到的


3. 语法

```js
watch:{ [key: string]: string | Function | Object | Array }
```

4. 使用样例

```js
var vm = new Vue({
  data: {
    a: 1,
    b: 2,
    c: 3,
    d: 4,
    e: {
      f: {
        g: 5
      }
    }
  },
  watch: {
    a: function (val, oldVal) {
      console.log('new: %s, old: %s', val, oldVal)
    },
    // 方法名
    b: 'someMethod',
    // 该回调会在任何被侦听的对象的 property 改变时被调用，不论其被嵌套多深
    c: {
      handler: function (val, oldVal) { /* ... */ },
      deep: true
    },
    // 该回调将会在侦听开始之后被立即调用
    d: {
      handler: 'someMethod',
      immediate: true
    },
    // 你可以传入回调数组，它们会被逐一调用
    e: [
      'handle1',
      function handle2 (val, oldVal) { /* ... */ },
      {
        handler: function handle3 (val, oldVal) { /* ... */ },
        /* ... */
      }
    ],
    // watch vm.e.f's value: {g: 5}
    'e.f': function (val, oldVal) { /* ... */ }
  }
})
vm.a = 2 // => new: 2, old: 1
```