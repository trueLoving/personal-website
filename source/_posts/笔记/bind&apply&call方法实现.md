---
title: bind/apply/call实现
author: Re_Star
avatar: https://gitee.com/trueLoving/cdn/raw/master/img/avatar.jpg
authorAbout: 一个十分骚气的宅男
authorDesc: 一个十分骚气的宅男
categories: 笔记
tags:
 - 笔记
keywords: 笔记
date: 2020-06-06
comments: false
description: bind/apply/call实现
photos: https://gitee.com/trueLoving/cdn/raw/master/img/Generator_bg.jpg
---

## Function.prototype.bind

1. 该方法会创建一个新的函数,在bind()被调用时,这个新函数的this被指定为bind()的第一个参数,而其余参数将作为新函数的参数,供调用时使用

<!-- ... -->

2. 语法

```js
/**
 * 
 * 1. thisAge 新函数被调用时所指定的this值
 * 2. arg1,arg2... 新函数执行所被传入的参数
 * 
 */
function.bind(thisArg,arg1,arg2....)
```

3. 实现代码

```js
Function.prototype.myBind = function(thisArg,...args){

    var thisArg = thisArg || window

    let self = this;

    let result = function(){
        self.apply(
            this instanceof self
            ?this:thisArg
            ,args.concat(Array.prototype.slice.call(arguments))
        )
    }

    return result;

}
// 测试样例
function f(){
    console.log(this);
}

var p1 = f.myBind({a:1});

console.log(f===p1); // false
f(); // window对象
p1(); // {a:1}
```

## Function.prototype.apply

1. 该方法调用一个具有指定this值的函数,以及作为一个`数组`提供的参数

<!-- ... -->

2. 语法

```js
/**
 * 
 * 1. thisAge 函数被调用时所指定的this值
 * 2. argsArray 传递给函数时的参数数组
 * 
 */
function.apply(thisArg,argsArray)
```

3. 实现代码

```js
Function.prototype.myApply = function(thisArg,args){

    let thisArg = thisArg || window;

    thisArg.fn = this;

    let result = eval('thisArg.fn(args)');

    delete thisArg.fn;

    return result;

}
// 测试样例
function f(){
    console.log(this);
}

f(); // window对象
f.myApply({a:1}); // {a:1}
```

## Function.prototype.call

1. 该方法使用一个指定的 this 值和单独给出的一个或多个参数来调用一个函数

<!-- ... -->

2. 语法

```js
/**
 * 
 * 1. thisAge 函数被调用时所指定的this值
 * 2. arg1,arg2,arg3... 传递给函数时的参数列表
 *  
 */
function.apply(thisArg,arg1,arg2,arg3...)
```

3. 实现代码

```js
Function.prototype.myApply = function(thisArg,...args){

    let thisArg = thisArg || window;

    thisArg.fn = this;

    let result = eval('thisArg.fn(args)');

    delete thisArg.fn;

    return result;

}
// 测试样例
function f(){
    console.log(this);
}

f(); // window对象
f.myApply({a:1}); // {a:1}
```
