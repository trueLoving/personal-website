---
title: Reflect对象
author: Re_Star
avatar: https://gitee.com/trueLoving/cdn/raw/master/img/avatar.jpg
authorAbout: 一个十分骚气的宅男
authorDesc: 一个十分骚气的宅男
categories: 前端
tags:
 - ES6
keywords: ES6
date: 2019-11-30
comments: false
description: Reflect对象
photos: https://gitee.com/trueLoving/cdn/raw/master/img/Reflect_bg.jpg
---
## 基本认识

​	**Reflect** 是一个内置的对象，它提供拦截 JavaScript 操作的方法。这些方法与[proxy handlers](https://wiki.developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Proxy/handler)的方法相同。`Reflect`不是一个函数对象，因此它是不可构造的。

​	与大多数全局对象不同，`Reflect`不是一个构造函数。你不能将其与一个[new运算符](https://developer.mozilla.org/zh-CN/docs/Web/JavaScript/Reference/Operators/new)一起使用，或者将`Reflect`对象作为一个函数来调用。`Reflect`的所有属性和方法都是静态的（就像[`Math`](https://developer.mozilla.org/zh-CN/docs/Web/JavaScript/Reference/Global_Objects/Math)对象）。

​	**Reflect**对象的出现，并不是增强了代码的功能，而是在我们编写代码的时候更具有**函数式编程**的风格。平常我们的对对象的操作，例如对象属性的读取和修改，函数的调用，都可以通过使用Reflect中的相关方法来达到同样的效果。我们的所有操作，通过使用Reflect对象，都可以通过**函数调用**来完成。

## 基本用法

Reflect的方法很多，在这里就说一个我个人感觉比较常用的方法

#### 1. Reflect.get(target,propertyKey,_receiver)

该静态方法是返回被操作对象所对应属性名的属性值

**参数解释**

1. target：需要取值的目标对象
2. propertyKey：需要获取的值的键值
3. receiver(可省略)：如果`target`对象中指定了`getter`，`receiver`则为`getter`调用时的`this`值

**返回值**

被操作对象属性名所对应的值

```js
// 定义测试对象 obj
var obj = { a: 1, }
// 1
console.log(Reflect.get(obj, "a"));
```

#### 2. Reflect.set(target,propertyKey,value,_received)

该静态方法是在被操作对象设置属性

**参数解释**

1. target：设置属性的目标对象
2. propertyKey：设置的属性的名称
3. value：设置的值
4. receiver(可省略)：如果`target`对象中指定了`setter`，`receiver`则为`setter`调用时的`this`值

**返回值**

返回一个Boolean表明是否在被操作对象成功设置该属性

```js
// 定义测试对象 obj
var obj = { a: 1, }
// 使用Reflect.set函数
Reflect.set(obj, "b", 2);
// {a: 1, b: 2}
console.log(obj);
```

#### 3. Relfect.apply(target,thisArguments,argumentsList)

该静态方法是通过指定的参数列发起对目标函数的调用

**参数解释**

1. target：目标函数
2. thisArgument：target函数调用时绑定的this对象
3. argumentsList：target函数调用时传入的实参列表，该参数应该是一个类数组的对象

**返回值**

是调用完带着指定参数和this值的给定的函数后执行所返回的结果

```js
// 创建测试函数
function f() {
    // 打印当前调用该函数的对象
    console.log(this);
    // 循环打印调用该函数时所传入的参数
    for (let i = 0; i < arguments.length; i++) {
        console.log(arguments[i]);
    }
    // 函数返回值
    return "hello f";
}
// 使用Reflect.apply函数
// 打印f执行中当前this的值：{a: 1, b: 2}
// 循环打印处f在执行时传入的参数
// 1
// 2
// 3
// 4
// 5
// 最终打印使用Reflect.apply所返回的结果：即执行f时所返回的结果：hello f
console.log(Reflect.apply(f, { a: 1, b: 2 }, [1, 2, 3, 4, 5]));
```

## 高级用法

#### 与proxy对象一起使用

```js
// 创建测试样例
var o = {
    a:1
}
// 创建Proxy对象 op
let op = new Proxy(o,{
    set:function(target,prop,value,_proxy){
        // 使用Reflect对象的set方法
        Reflect.set(target,prop,value);
    },
    get:function(target,prop,_proxy){
        // 使用Reflect对象的get方法
        return Reflect.get(target,prop);
    }
})
// 修改对象op的a的值，会触发set方法
op.a = 2;
// 输出对象op,Proxy {a: 2}
console.log(op);
// 读取对象op的属性a的值，会触发get方法
// 2
console.log(op.a);
```

