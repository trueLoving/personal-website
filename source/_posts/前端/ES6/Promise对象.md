---
title: Promise对象
author: Re_Star
avatar: https://gitee.com/trueLoving/cdn/raw/master/img/avatar.jpg  
authorAbout: 一个十分骚气的宅男
authorDesc: 一个十分骚气的宅男
categories: 前端
tags:
 - Promise
keywords: Promise
date: 2020-03-11
comments: false
description: Promise对象
photos: https://gitee.com/trueLoving/cdn/raw/master/img/Promise_bg.jpg
---

## 前言
Promise对象，是ES6新出的对象，主要目的是为了处理异步操作

异步操作：通常来讲是指当我们去执行一种操作时，我们无法立即得到函数所执行后的结果，需要等待一段时间才能得到函数执行后的结果
常见的异步操作如下:
1. 定时器
2. 网络请求(例如ajax)
3. 事件函数
4. 文件读写
5. 数据库连接
6. 图片异步加载
7. ......


## 什么是Promise对象 

​在我们学习Promise对象时，我们必须要清楚它是什么东西

​Promise对象，其实本质上是一个**函数**，那么它是可以执行Function上的一些方法（call,apply,bind...）。从另外一个方面来讲，Promise对象其实是一个容器，在这个容器中我们可以去完成一些任务，里面保存着某个未来才会结束的事件（通常是一个异步操作）的结果。

```js
Object.prototype.toString.call(Promise) // "[object Function]"
```

​那么，Promise对象究竟是什么东西，这里有两个定义


1. 所谓Promise，简单说就是一个容器，里面保存着某个未来才会结束的事件（通常是一个异步操作）的结果。从语法上说，Promise 是一个对象，从它可以获取异步操作的消息。
Promise 提供统一的 API，各种异步操作都可以用同样的方法进行处理。（网址：http://es6.ruanyifeng.com/#docs/promise）
2. Promise对象用于表示一个异步操作的最终完成 (或失败), 及其结果值。（网址：https://developer.mozilla.org/zh-CN/docs/Web/JavaScript/Reference/Global_Objects/Promise）


​在我看来，Promise对象其实就是用于处于异步操作的函数。我们可以通过使用Promise对象来完成异步。至于如何使用Promise对象，后面会有提到。

## 为什么会出现Promise对象

​Promise对象的出现其实是为了解决回调函数的“回调地狱”问题  
（关于回调地狱的相关问题可以阅读这篇文章：https://www.cnblogs.com/suihang/p/9595548.html）。

​主要原因是如果我们使用回调函数的方法来进行异步操作，我们书写的代码的阅读性会变得非常的糟糕，而使用Promise对象就可以使我们编写的代码更加方便开发人员阅读（主要是因为Promise的链式调用）


## Promise对象的基本认识

​接下来，就是来说说Promise对象的一些基本概念。


注意：我们要搞清楚我们应该什么时候使用Promise对象（一般只要我们需要异步操作的时候都可以使用Promise对象）。不要因为去使用Promise对象而去使用Promise对象




Promise对象在执行开始到执行完成有以下几种状态
1. *pending*: 初始状态，既不是成功，也不是失败状态。
2. *fulfilled*: 意味着操作成功完成。
3. *rejected*: 意味着操作失败。

​pending 状态的 Promise 对象可能会变为fulfilled 状态并传递一个值给相应的状态处理方法，也可能变为失败状态（rejected）并传递失败信息。

​当其中任一种情况出现时，Promise 对象的 `then` 方法绑定的处理方法（handlers ）就会被调用（then方法包含两个参数：onfulfilled 和 onrejected，它们都是 Function 类型。

1. 当Promise状态为*fulfilled*时，调用 then 的 onfulfilled 方法
2. 当Promise状态为*rejected*时，调用 then 的 onrejected 方法


​而为什么Promise可以被链式调用主要是因为 Promise.prototype.then和Promise.prototype.catch方法返回promise 对象， 所以它们可以被链式调用

## Promise对象的基本使用
**Promise对象所具有的属性**
1. Promise.length  构造器参数的数目（其值总是为1）
2. Promise.prototype Promise构造器的原型  

**Promise对象所具有的方法**
1. Promise.all 			并行运行异步操作
2. Promise.race         并行运行异步操作
3. Promise.reject       手动创建一个已经 resolve的Promise 快捷方法
4. Promise.resolve    手动创建一个已经 reject 的Promise 快捷方法  

**Promise原型**
1. Promise.prototype.catch   抓取Promise执行过程中出现的异常和reject抛出的异常
2. Promise.prototype.then    异步操作完成后所要执行的函数
3. Promise.prototype.finally  无论promise状态最终都会执行的函数

**Promise对象的简单用法（基本异步使用）**

```js
// 如果异步操作执行成功，则使用resolve来表示promise对象异步操作成功
// 如果异步操作执行成功，则使用reject来表示promise对象异步操作失败
// 其中，resolve和reject其实是一个回调函数，在执行的时候可以携带参数给异步操作执行完成后要处理的函数
var myPromise = new Promise((resovle, reject) => {

    // 在这里我们执行以下异步操作
    // 例如
    // 1. 向后端接口请求数据,同时更新界面
    // 2. 异步加载图片
    // 3. 文件的读写操作
    // 4. 数据库的相关操作
    // 5. 等等
    setTimeout(() => {
        console.log("hello world");
        reject("execute failed!");
    }, 1000);

});


// 异步操作完成后向对应的处理函数
// then(cb)     若异步操作执行成功就会跳入到该函数执行
// catch(cb)    若异步操作执行失败就会跳入到该函数执行 
// finally(cb)  无论异步操作执行成功还是失败都会跳入到该函数执行
myPromise.then((success) => {
    // 处理异步操作成功的函数
    console.log(`success value is ${success}`);
}).catch((err) => {
    // 处理异步操作失败的函数
    console.log(`error value is ${err}`);
}).finally(() => {
    // 无论成功还是失败都会执行的函数
    console.log("finally")
})

```

**一系列异步操作（系列异步操作）**

```js
// Promise最强大的地方就是可以进行链式调用，来避免以前遇到的回调地狱问题
// 在执行一系列异步操作时，我们只要在最后.catch一下就可以抓获前面异步操作所可能出现的异常
// 在执行异步操作时，如果后面还要进行下一个异步操作，那么需要在这个异步操作返回一个新的Promise供下面的then函数使用
// 在进行一系列异步操作时，如果其中的一个异步操作出现异常，那么后续的异步操作就不会被执行
new Promise((resovle, reject) => {
    
    // 异步1
    setTimeout(() => {
        console.log("洗菜");
        resovle("洗菜完成");
    }, 1000);

}).then((success) => {

    
    console.log(`success value is ${success}`);
    return new Promise((resovle, reject) => {
        // 异步2
        setTimeout(() => {
            console.log("做饭");
            // resovle("做饭完成");
            reject("做饭失败");
        }, 1000);
    });

}).then((success) => {

    console.log(`success value is ${success}`);  
    return new Promise((resovle, reject) => {
        // 异步3
        setTimeout(() => {
            console.log("吃饭");
            resovle("吃饭成功")
            // reject("吃饭失败");
        }, 1000);
    });


}).then((success) => {

    // 异步操作执行成功
    console.log(`success value is ${success}`);

}).catch((err) => {

    // 异步操作链中出现异常错误
    console.log(`error value is ${err}`);

})
```

**可同时进行的异步操作(组合异步操作)**

```js
//在这里共有两组异步操作
// 异步操作1 p1 洗澡
// 异步操作2 p2 洗菜->做饭
var p1 = new Promise((resolve, reject) => {
    setTimeout(() => {
        console.log("洗澡", new Date());
        // resolve("洗澡完成");
        reject("洗澡失败");
    }, 1000);
})

var p2 = new Promise((resolve, reject) => {
    setTimeout(() => {
        console.log("洗菜", new Date());
        resolve("洗菜完成");
        // reject("洗菜失败");
    }, 1000);
}).then((res) => {
    console.log(res, new Date())
    return new Promise((resolve, reject) => {
        setTimeout(() => {
            console.log("做饭", new Date());
            // resolve("做饭完成");
            reject("做饭失败");
        }, 1000);
    })
});

// 通过使用Promise.all来使得异步操作1和异步操作2同时进行
// 然后在then回调函数中同时处理两个异步操作返回回来的结果
// Promise.all在任意一个传入的 promise 失败时返回失败
Promise.all([p1, p2]).then(([r1, r2]) => {
    console.log(r1, r2, new Date());
}).catch((err) => {
    console.log(err.toString());
})



var p4 = new Promise((resolve, reject) => {
    setTimeout(() => {
        console.log("我快一点");
        resolve("我快一点");
    }, 1000);s
});

var p5 = new Promise((resolve, reject) => {
    setTimeout(() => {
        console.log("我慢一点");
        reject("我慢一点");
    }, 2000);
});

// 现在有3系列异步操作 p1,p2,p3
// 如果p1异步操作完成的最快，则fastestValue为p1所返回的值，err也同理
// 注意：即使慢一点的异步操作也不会因为快一点的异步操作而中途停止，只是then中回调函数的参数是快一点异步操作的返回值罢了
// 即Promise.race([p1,p2,p3])返回的是执行快一点的Promise对象
Promise.race([p4, p5]).then(fastestValue => {
    console.log(fastestValue);
}).catch((err) => {
    console.log(err.toString());
});
```
​	