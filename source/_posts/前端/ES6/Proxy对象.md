---
title: Proxy对象
author: Re_Star
avatar: https://gitee.com/trueLoving/cdn/raw/master/img/avatar.jpg 
authorAbout: 一个十分骚气的宅男
authorDesc: 一个十分骚气的宅男
categories: 前端
tags:
 - ES6
keywords: ES6
date: 2019-11-16
comments: false
description: Proxy对象
photos: https://gitee.com/trueLoving/cdn/raw/master/img/Proxy_bg.jpg
---
## 基础认识

​	Proxy是ES6新提出来的内置对象，主要目的是实现在对象进行操作时能够对对象的行为进行拦截，然后拦截者可以根据自己的意愿重新定义该对象的此次操作行为。

​	Proxy对象用于定义基本操作的自定义行为（例如属性查找，赋值，枚举，函数调用等）

​	当对象或者函数进行一些行为时我们可以通过proxy对象对其行为进行拦截，而对象本身的行为就无效了

​	而跟Proxy对象息息相关的就是一个handler对象

## 基础使用

​	下面的代码创建一个Proxy对象p，关联对象是o,并对p的读取属性的操作进行拦截

````js
// 创建测试对象
var o = {
    a:1
}
// 创建一个proxy对象(被关联的对象,handler对象)
var p = new Proxy(o,{
    // target 关联对象
    // 被读取的属性名
    // 当前的proxy对象
    get:function(target,prop,proxy){
        console.log(target,prop,proxy);
        return target[prop];
    }
})
// 打印 1
// 读取p的a属性行为会触发刚刚定义该proxy中handler对象的get方法，而之前对象的读取属性的行为将会被取消
// 还会打印对象o,"a",p(当前触发该行为的proxy对象)
console.log(p.a)
// 而target对象的读取行为则不会触发handler对象中的get方法
console.log(o.a)
````

## handler对象

​	handler对象是proxy对象功能实现的核心模块，主要是定义当进行拦截操作后应该去做什么。handler对象可拦截的操作很多，在这里主要讲几种常见的。

#### 1. 拦截对象读取属性的行为 handler.get

​	handler.set，该方法用于拦截对象的读取属性操作,刚刚上面已有演示，这里就不演示了。

#### 2. 拦截对象设置设置属性的行为 handler.set

​	handler.set，该方法用于拦截设置属性值的操作

```js
// 创建测试对象o
var o = {
    a:1
}
// 创建代理对象p
let p = new Proxy(o,{
    set:function(target,prop,value,proxy){
        console.log(target,prop,value,proxy);
        target[prop] = value;
    }
})
// 为对象添加属性b
// 该行为会触发hander.set方法
// 会打印当前p关联的对象，此时添加的属性名，属性值和对象p
// {a: 1} "b" 2 Proxy {a: 1}
p.b = 2;
// Proxy {a: 1, b: 2}
console.log(p);
// {a: 1, b: 2}
console.log(o);
```

#### 3. 拦截函数调用的行为 handler.apply

​	handler.apply，该用于拦截函数的调用。而之前的函数行为就不会发生，需要在拦截处理中手动调用该函数

```js
// 创建测试函数
function f(){
    console.log("hello world");
}
// 创建测试Proxy对象p
let p = new Proxy(f,{
    // 该函数会返回三个回调参数
    // target 关联的函数
    // thisArg 当前执行p的this值
    // args 当前执行p所传来的参数
    apply:function(f,thisArg,args){
        // 输出
        console.log(f.prototype,thisArg,args);
        // 在这里执行原函数
        f();
    }
})
// 执行
// {constructor: ƒ} "thisArgs" (5) [1, 2, 3, 4, 5]
// hello world
p.apply("thisArgs",[1,2,3,4,5]);
```

## 高级使用

#### 1. 验证（函数调用时的参数类型校验，对象属性赋值校验）

```js
/**
 * 
 * @param {Number} a 
 * @param {Number} b 
 * 
 * 测试函数f
 */
function f(a, b) {
    console.log(a,b);
}
// 测试对象o
var o = {
    a: 1// Number
}
// 创建对象o的代理对象op
var op = new Proxy(o, {
    set: function (target, prop, value, _proxy) {
        if (typeof value != "number") {
            throw new TypeError("属性值必须为Number类型");
        }
        target[prop] = value;
    }
})
// 创建函数f的代理对象fp
var fp = new Proxy(f, {
    apply: function (f, _thisArgs, args) {
        for (let i = 0; i < args.length; i++) {
            if (typeof args[i] != "number") {
                throw new TypeError("参数必须为Number类型");
            }
        }
        f(...args);
    }
})
// throw error(必须为Number类型)
// op.a = "string";
// ok
op.a = 2;
// throw error(必须为Number类型)
// fp("a","b");
// ok
// 打印1,2
fp(1,2);
```

#### 2. 扩展构造函数

```js
function extend(sup, base) {
    // 获取base原型上的属性描述符
    var descriptor = Object.getOwnPropertyDescriptor(
        base.prototype, "constructor"
    );
    // 再将base的原型指向基于sup的原型的新的对象
    base.prototype = Object.create(sup.prototype);
    // 设置handler
    var handler = {
        // 该属性用于当进行new操作的操作拦截
        construct: function (target, args) {
           	// 基于base.prototype创建新的对象
            var obj = Object.create(base.prototype);
            // 将当前对象和base原型对象进行关联
            this.apply(target, obj, args);
            // 返回创建好的对象
            return obj;
        },
        apply: function (_target, that, args) {
            sup.apply(that, args);
            base.apply(that, args);
        }
    };
    var proxy = new Proxy(base, handler);
    descriptor.value = proxy;
    Object.defineProperty(base.prototype, "constructor", descriptor);
    return proxy;
}

var Person = function (name) {
    this.name = name
};

var Boy = extend(Person, function (name, age) {
    this.age = age;
});

Boy.prototype.sex = "M";

var Peter = new Boy("Peter", 13);
console.log(Peter.sex);  // "M"
console.log(Peter.name); // "Peter"
console.log(Peter.age);  // 13
```

#### 3. 通过属性查找数组中特定的对象

```js
// 创建测试数组 personLists
let personLists = [
    { name: "张三", age: 24 },
    { name: "李四", age: 22 },
    { name: "王五", age: 25 },
]

let pp = new Proxy(personLists, {

    get: function (target, prop, _proxy) {
        // 如果prop是target对象的一个属性，直接target上prop属性名对应的属性值
        if (prop in target) {
            return target[prop];
        }
        // 如果prop的值为“number”，则直接返回数组的长度
        if (prop === "number") {
            return target.length;
        }

        let result, ages = {};

        for (let person of target) {

            if (person.name === prop) {
                result = person;
            }
            if (ages[person.age]) {
                ages[person.age].push(person);
            } else {
                ages[person.age] = [person];
            }
        }

        if (result) {
            return result;
        }

        if (prop in ages) {
            return ages[prop];
        }

        if (prop === "ages") {
            return Object.keys(ages);
        }
        // 返回未定义
        return undefined;
    }

})
// {name: "张三", age: 24}
console.log(pp[0]);
// {name: "张三", age: 24}
console.log(pp["张三"]);
// [{name: "张三", age: 24}]
console.log(pp[24]);
// ["22", "24", "25"]
console.log(pp.ages);
// 3
console.log(pp.number);
```

#### 4. 实现观察者模式

```js
// 创建实例对象
let o = {
    a: 1,
    b: 2,
    c: 3
}
/**
 * 在这里对对象o的属性c实现监控
 * c = a + b; 当a,b发生变化,c也要做出相应变化
 */
let p = new Proxy(o, {
    set: function (target, prop, value, _proxy) {
        target[prop] = value;
        if (prop != "c") {
            target.c = target.a + target.b;
        }
    }
})
// 输出原本p,{a: 1, b: 2, c: 3}
console.log(p);
// 修改p.a的值
p.a = 2;
// 再次输出p, {a: 2, b: 2, c: 4}
console.log(p);
// 修改p.b的值
p.b = 3;
// 输出p,{a: 2, b: 3, c: 5}
console.log(p);
```

#### 5. 低层封装，只允许上层访问特定接口(这里用属性举例)

```js
var Stack = (function () {
    // 原始对象定义
    var stack = [];
    // 可被允许访问的属性名
    var allowed = ["push", "pop", "length"];
    // 返回代理对象
    return new Proxy(stack, {
        get: function (target, prop, _proxy) {
            // 如果是可以被访问的属性，就允许它指向
            if (allowed.indexOf(prop) > -1) {
                return target[prop];
            }
            // 否则就抛出异常
            throw new ReferenceError(`无权访问 ${prop} 属性`)
        }
    });
})
// 创建Stack实例对象,s
var s = new Stack();
// 可以执行push方法
s.push("1");
// 可以访问length属性，1
console.log(s.length);
// ReferenceError: 无权访问 __proto__ 属性
console.log(s.__proto__);
```



