---
title: Promise 认识
author: Re_Star
avatar: https://gitee.com/trueLoving/cdn/raw/master/img/avatar.jpg  
authorAbout: 一个十分骚气的宅男
authorDesc: 一个十分骚气的宅男
categories: 前端
tags:
 - Promise
keywords: Promise
date: 2020-05-11
comments: false
description: Promise 认识
photos: https://gitee.com/trueLoving/cdn/raw/master/img/Promise认识_bg.jpg
---

# Promise

## What

### 宏观

一种异步编程的解决方案

### 微观

Promise是构造函数,用于创建Promise实例,其构造参数为一个包含异步操作的函数

而Promise实例则可以用于获取异步操作后所返回的数据

### 状态

promise共有三中状态
1. pending 正在执行中
2. resolved 已成功
3. rejected 已失败

一开始的promsie的状态为pending,异步函数可以通过回调函数中传来的参数resolve,reject方法来改变该promise对象的状态

调用resolve方法,promise的状态由pending-> resolved,意味着异步操作已成功

调用reject方法,promise的状态由pending-> rejected,意味着异步操作已失败

而且,promise的状态一旦改变就不可以再次恢复

## Why

### 纯函数,回调地狱

当我们执行串行的异步操作时,如果采用纯回调函数的方式来处理的化,代码的阅读会变得非常糟糕

例如
```js
doSomething(function(result){
  doSomethingElse(result,function(newResult){
​    doSomethingFinally(newResult,function(finallyResult){
​      console.log(`finallyResult: ${finallyResult}`)
​    },failureCallback
  }.failureCallback)
},failureCallback)
```

而使用promise我们就可以通过链式来操作串行的异步操作,简化代码,方便阅读

### 统一异常处理

使用之前纯函数来处理串行异步操作,如果某一个环节出现了异常,我们需要为每一个执行异步操作的代码指定异常处理函数,异常的捕获会十分的困难

而使用promise,因为promise的异常穿透,我们只需要最后使用catch函数抓捕异常就可以了

### 指定回调函数灵活

之前执行异步函数时,在执行异步操作时必须先指定回调函数

而Promise可以等待异步操作执行完成后再指定相应的回调韩函数

## How

### API

1. new Promise(executor)

创建一个promise的实例对象

传入的参数类型为函数

当执行构造函数时,参数函数也会同步进行

2. Promise.then(onResolved,onRejected)

当promise的状态变为resolved/rejected会触发then中传递的回调函数,成功调用onResolved函数,失败调用onRejected韩素华

3. Promise.catch(onRejected)

当promise的状态变为rejected,我们可以使用onRejected函数来对rejected返回过来的结果进行处理

4. Promise.prototype.resolve(value)

简洁语法 手动创建一个指定value的promise,状态为resolved

5. Promise.prototype.reject(reason)

简洁语法 手动创建一个指定reason的promise,状态为rejected

6. Promise.prototype.all(promises)

返回一个prmise,其状态由参数数组中的所有promise决定,只有参数数组中的所有promise执行成功,则返回的promise才会成功,且value值为promise执行成功返回的值

若其中一个promise执行失败,则返回的promise状态为rejected,且reason值为异常抛出的值

7. Promise.prototype.race(promises)

返回一个promise,.该promise的状态由参数数组中执行最快的promise决定,该promise为resolved状态,则返回的promise状态为resolved,promise为rejected状态,则返回的promise状态为rejected,

### 注意点

1. Promise的状态改变

Promise的状态只能从pending-->resolved或者从pending-->rejected。
一旦状态确定,就不能再次改变改promise的状态

2. 指定多个回调函数

当我们为promise指定多个成功/失败的回调函数,只要当前的promise处于pending状态,那么回调函数会放入回调队列中,当promise的状态变为resolved/rejected时,才会调用与之对应的回调队列的所有回调函数

3. 同步执行执行器函数,同步指定回调函数,异步执行回调函数

<!-- .... -->

4. Promise.then()返回Promise

<!-- .... -->

5. promise.then()返回的promise状态由then()指定的回调函数的执行结果决定
  
若执行结果返回一个非promise对象,则then()返回promise的对象状态为resolved,value为返回值

若执行过程中,异常抛出,则then()返回promise的对象状态为rejected,reason为error

若执行结果返回一个promise对象,则then()返回promise的对象状态为执行函数返回的promise状态决定,resolved为resolved,rejected为rejected


6. 执行多个串联的同步/异步任务

<!-- .... -->

7. Promise的异常穿透/中断链式调用链

异常穿透实现的原因是因为当我们没有为then指定onRejected函数时,该值默认为reason=>{throw reason}

中断链式调用链只要返回pending状态的promise即可

### 代码实现

```js
class Promise {

  constructor(executor) {

      const self = this;
      self.status = PENDING;
      self.callbacks = [];

      function resolve(value) {
          if (self.status !== PENDING) {
              return
          }
          self.status = RESOLVED;
          self.data = value;
          if (self.callbacks.length > 0) {
              setTimeout(() => {
                  self.callbacks.forEach((callbackObj) => {
                      callbackObj.onResolved(value);
                  })
              })
          }
      }

      function reject(reason) {
          if (self.status !== PENDING) {
              return
          }
          self.status = REJECTED;
          self.data = reason;
          if (self.callbacks.length > 0) {
              setTimeout(() => {
                  self.callbacks.forEach((callbackObj) => {
                      callbackObj.onRejected(reason);
                  })
              })
          }
      }

      try {
          executor(resolve, reject)
      } catch (error) {
          reject(error);
      }

  }

  then(onResolved, onRejected) {

      onResolved = typeof onResolved === "function" ? onResolved : value => value;
      onRejected = typeof onRejected === "function" ? onRejected : reason => { throw reason };

      const self = this;

      return new Promise((resolve, reject) => {
          function handle(callback) {
              try {
                  const result = callback(self.data);
                  result instanceof Promise ? result.then(resolve, reject) : resolve(result);
              } catch (error) {
                  reject(error)
              }
          }
          switch (this.status) {
              case PENDING:
                  self.callbacks.push({
                      onResolved(value) {
                          handle(onResolved);
                      },
                      onRejected(reason) {
                          handle(onRejected);
                      }
                  });
                  break;
              case RESOLVED:
                  setTimeout(() => { handle(onResolved) });
                  break;
              case REJECTED:
                  setTimeout(() => { handle(onRejected) });
                  break;
          }
      })
  }

  catch(onRejected) {
      return this.then(undefined, onRejected);
  }

  static resolve(value) {
      return new Promise((resolve, reject) => {
          value instanceof Promise ? value.then(resolve, reject) : resolve(value);
      })
  }

  static reject(reason) {
      return new Promise((resolve, reject) => {
          reject(reason);
      })
  }

  static all(promises) {

      const values = new Array(promises.length);
      let resolveCount = 0;

      return new Promise((resolve, reject) => {
          promises.forEach((p, index) => {
              Promise.resolve(p).then(
                  value => {
                      values[index] = value;
                      resolveCount++;
                      if (resolveCount === promises.length) {
                          resolve(values);
                      }
                  },
                  reason => {
                      reject(reason);
                  }
              )
          })
      })

  }

  static race(promises) {
      return new Promise((resolve, reject) => {
          promises.forEach((p) => {
              Promise.resolve(p).then(resolve, reject);
          })
      })
  }

}
```

## 图片

![Promise思维导图](https://gitee.com/trueLoving/cdn/raw/master/img/Promise认识 01.jpg)
