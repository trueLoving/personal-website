---
title: Symbol对象
author: Re_Star
avatar: https://gitee.com/trueLoving/cdn/raw/master/img/avatar.jpg 
authorAbout: 一个十分骚气的宅男
authorDesc: 一个十分骚气的宅男
categories: 前端
tags:
 - ES6
keywords: ES6
date: 2019-12-30
comments: false
description: Symbol对象
photos: http://p2.qhimg.com/bdm/960_593_0/t014817280afeb31136.jpg
---
---
## 基本使用

​	Symbol是es6新增的一个基本的数据类型。增加该类型的主要目的是为了能够实现对象的属性名能够唯一化。

```
最新的ECMAScript标准定义了8中数据类型
7种基本数据类型
- 布尔值(Boolean):true/false
- null:一个表示null的特殊关键字
- undefined,和null一样特殊的关键字，undefined表示变量未定义时的属性
- 数字(Number)，整数或者浮点数
- 任意精度的整数(BigInt),可以安全地存储和操作大整数，甚至可以超过数字的安全整数限制。
- 字符串(String),字符串是一串表示文本值的字符序列，例如"helloworld"
- 代表(Symbol,在Es6新添加的基本数据类型)，一种实例是唯一且不可改变的数据类型
以及对象(Object)
```

​																																											来自[MDM](https://developer.mozilla.org/zh-CN/docs/Web/JavaScript/Guide/Grammar_and_Types)

也正式因为Symbol对象的存在，在es6种m对象的属性名现在可以分为两种

1. 字符串
2. Symbol实例

而接下来就是演示Symbol的基本使用（以代码为主）

```js
// 注意,Symbol不能与关键字new使用
let s = Symbol("对于该属性的一些文字描述，用英文");
// 定义对象
var o = {
    a:1,
    // 在为一个对象添加Symbol属性时，要用[]包裹Symbol实例对象
    [s]:"hello world"
}
// 输出结果
console.log(o);
```

但是Symbol属性名是无法被for...in等方法调用，所有我们需要知道如何去获取对象的Symbol属性。下面有一些方法可以获取一个对象的Symbol属性

```js
1. Object.getOwnPropertySymbols(obj) // 获取obj对象上的所有Symbol属性
2. Reflect.ownKeys(obj) // 获取obj对象上的所有属性，包括Symbol 
```



## 高级使用(该部分来自阮一峰老师的[es6](http://es6.ruanyifeng.com/#docs/symbol))

#### 1. 魔术字符串的消除

​	魔术字符串：是指在代码之中多次出现，与代码形成强耦合的某一个具体的字符串或者数组

​	而为了后期修改那些常值的方便，我们应该使用变量来代替代码中经常出现的常值。这样，如果以后要修改这些常常值，我们只需要修改变量的值就能达到修改那些常值的效果

​	而因为Symbol实例的唯一性，它就非常适合充当魔术字符串的变量

```js
const shapeType = {
  triangle: Symbol()
};

function getArea(shape, options) {
  let area = 0;
  switch (shape) {
    case shapeType.triangle:
      area = .5 * options.width * options.height;
      break;
  }
  return area;
}

getArea(shapeType.triangle, { width: 100, height: 100 });
```

#### 2. 模块的Singleton模式

​	Singleton模式指的是调用一个类，在任何时候返回的都是一个实例

​	个人理解就是在引入调用一个类时，应该返回的都是同一个实例，而不是再基于该类重新创建新的对象。

​	那么如何使用Symbol来实现Singleton

​	具体内容：http://es6.ruanyifeng.com/#docs/symbol

## Symbol常用属性的使用

​		Symbol原型上有一些属性，可以方便我们使用。在这里，我提几个我个人认为非常实用的一些属性

#### 1. Symbol.iterator(Object)

```
该属性为每一个对象定义一个默认的迭代器。该迭代器可以被for...of循环使用。
我们可以使用该属性为该对象设置默认的迭代器
```

```js
var o = {
    // 定义对象o的默认迭代器
    // 其属性值是一个Generator函数
    [Symbol.iterator]: function* () {
        yield 1;
        yield 2;
        yield 3;
    }
};
// [1,2,3]
console.log([...o]);
```

#### 2. Symbol.toPrimitive（Object）

```
该属性是一个内置的Symbol值，它是作为对象的函数值属性存在的，当对象转换为对应的原始值时，会调用此函数
控制该对象被强制转换成其他数据类型时的处理方法
```

```js
var o = {
    // hint为当将该对象强制转换时所要被强制转换的类型，string
    [Symbol.toPrimitive]:function(hint){
        // 可自行输出看看hint的内容
        // console.log(hint);
        
        // 如果是number类型
        if(hint=="number"){
            return 42;
        }
        // 如果是string类型
        if(hint=="string"){
            return "hello world";
        }
        // 其他类型
        return true;
    }
};
// Number{42}
console.log(new Number(o));
// String{"hello world"}
console.log(new String(o));
// Boolean{true}
console.log(new Boolean(o));
```

#### 3.Symbol.toStringTag(Class)


该属性是一个内置属性，它通常作为对象的属性键使用，对应的属性名应该为字符串类型，这个字符串用来表示该对象的自定义类型标签，只有内置的Object.prototype.toString()方法会去读取这个标签并把它包含在自己的返回值里


```js
class A{
    // Symbol.toStringTag是定义在对象的类上
    // 我们可以通过该属性可以自定义类添加一个自己定义的标签
    get [Symbol.toStringTag](){
        return "This is A class"
    }
}
// [object This is A class]
console.log(Object.prototype.toString.call(new A()));
```

#### 4. **Symbol.spcies**


该属性是一个函数值属性，其被构造函数用于创建派生对象
该属性可以允许子类覆盖对象的默认构造函数


```js
// 来自https://developer.mozilla.org/zh-CN/docs/Web/JavaScript/Reference/Global_Objects/Symbol/species
class MyArray extends Array {
    // 覆盖 species 到父级的 Array 构造函数上
    static get [Symbol.species]() {
        return Array;
    }
}

var a = new MyArray(1,2,3);
var mapped = a.map(x=>x*x);

console.log(mapped instanceof MyArray); // false
console.log(mapped instanceof Array);  // true
```

## Symbol常用方法的使用

#### 1. **Symbol.for()**


该方法会根据给定的键 key，来从运行时的 symbol 注册表中找到对应的 symbol，如果找到了，则返回它，否则，新建一个与该键关联的 symbol，并放入全局 symbol 注册表中。


```js
// 创建一个 symbol 并放入 symbol 注册表中，键为 "demo.A"
Symbol.for("demo.A");
// 从 symbol 注册表中读取键为"demo.A"的 symbol
Symbol.for("demo.A"); 


// true，证明了上面说的
Symbol.for("demo.B") === Symbol.for("demo.B"); 
// false，Symbol() 函数每次都会返回新的一个 symbol
Symbol("demo.B") === Symbol("demo.B");
```

#### 2. **Symbol.keyFor()**


该方法用来获取 symbol 注册表中与某个 symbol 关联的键。


```js
// 创建一个 symbol 并放入 Symbol 注册表，key 为 "demo.A"
var globalSym = Symbol.for("demo.A");
// demo.A
console.log(Symbol.keyFor(globalSym));

// 创建一个 symbol，但不放入 symbol 注册表中
var localSym = Symbol();
// undefined
console.log(Symbol.keyFor(localSym));

// undefined
console.log(Symbol.keyFor(Symbol.iterator));
```
