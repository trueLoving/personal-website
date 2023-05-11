---
title: Generator对象
author: Re_Star
avatar: https://gitee.com/trueLoving/cdn/raw/master/img/avatar.jpg
authorAbout: 一个十分骚气的宅男
authorDesc: 一个十分骚气的宅男
categories: 前端
tags:
 - ES6
keywords: ES6
date: 2019-12-11
comments: false
description: Generator
photos: https://gitee.com/trueLoving/cdn/raw/master/img/Generator_bg.jpg
---
## Generator原型

方法
1. [Generator.prototype.next()](https://developer.mozilla.org/zh-CN/docs/Web/JavaScript/Reference/Global_Objects/Generator/next)
2. [Generator.prototype.return()](https://developer.mozilla.org/zh-CN/docs/Web/JavaScript/Reference/Global_Objects/Generator/return)
3. [Generator.prototype.throw()](https://developer.mozilla.org/zh-CN/docs/Web/JavaScript/Reference/Global_Objects/Generator/throw)

## 基本使用
1. Generator对象与一种函数密切相关 Generator函数。我们在执行Generator函数，该函数不会立刻执行，而是会返回一个Generator对象。我们通过操作Generator对象来控制Generator函数的运行
2. Generator函数的函数体中，通过yield关键字将函数的执行过程分成了好几个阶段。
3. 当我们调用Generator对象的next方法时，Generator函数会向下执行，直至遇到关键字yield就停止，并且返回关键字yield后面的表达式的值。

```js
/**
* Generator函数定义
*/
function* gen() {
    yield 1;
    yield 2;
    yield 3;
}
// 执行Generator函数，返回一个Generator对象
var g = gen();
// [object GeneratorFunction] 查看gen类型
console.log(Object.prototype.toString.call(gen));
// [object Generator] 查看g类型
console.log(Object.prototype.toString.call(g));
// 1
console.log(g.next().value);
// 2
console.log(g.next().value);
// 3
console.log(g.next().value);
// undefined 
console.log(g.next().value);
```

4. 我们可以为Generator对象在执行next方法执行时传入参数，作为函数下一个阶段运行的输入

```js
// 定义Generator函数
function *gen(){
    yield 1;
    let i = yield 2;
    yield i;
}
// 执行函数，该函数返回Generator对象
var g = gen();
// 1
console.log(g.next().value);
// 2
console.log(g.next().value);
// 12
console.log(g.next(12).value);
```

5. 而当生成器函数显示return时，该函数立即变为完成状态。且return返回的值是此次调用iterator.next()返回对象的属性名为value的值。

```js
// 定义Generator函数
function *gen(){
    yield 1;
    yield 2;
    return 14;
    yield 3;
}
// 执行函数，该函数返回Generator对象
var g = gen();
// 1
console.log(g.next().value);
// 2
console.log(g.next().value);
// 14
console.log(g.next().value);
```

## 高级用法

1. 函数执行权转移

我们可以通过Generator函数来实现函数执行时执行函数主体的转移

```js
// 定义Generator函数 gen1
function *gen1(){
    yield "gen1 1";
    yield "gen1 2";
    yield "gen1 3";
}
// 定义Generator函数 gen2
function *gen2(){
    yield "gen2 1";
    yield* gen1();
    yield "gen2 3";
}
// 执行gen2函数返回一个Generator对象
var g = gen2();
// gen2 1
console.log(g.next().value);
// gen1 1 
console.log(g.next().value);
// gen1 2
console.log(g.next().value);
// gen1 3
console.log(g.next().value);
// gen2 3
console.log(g.next().value);
// undefined
console.log(g.next().value);
```

2. 将嵌套数组转化为扁平一维数组，[来自MDN](https://developer.mozilla.org/zh-CN/docs/Web/JavaScript/Reference/Statements/function*)

```js
function* iterArr(arr){
    if(Array.isArray(arr)){
        for(let i=0;i<arr.length;i++){
            yield* iterArr(arr[i]);
        }   
    }else{
        yield arr;
    }
}
   
var arr = ['a', ['b', 'c'], ['d', 'e']];
var gen = iterArr(arr);
arr = [...gen];
```

3. 遍历二叉树，来自阮一峰老师的[es6](http://es6.ruanyifeng.com/#docs/generator#Generator-prototype-throw)

```js
// 下面是二叉树的构造函数，
// 三个参数分别是左树、当前节点和右树
function Tree(left, label, right) {
    this.left = left;
    this.right = right;
    this.label = label;
}
// 下面是中序（inorder）遍历函数。
// 由于返回的是一个遍历器，所以要用generator函数。
// 函数体内采用递归算法，所以左树和右树要用yield*遍历
function* inorder(t) {
    if (t) {
        yield* inorder(t.left);
        yield t.label;
        yield* inorder(t.right);
    }
}
// 下面生成二叉树
function make(array) {
    // 判断是否为叶节点
    if (array.length == 1) return new Tree(null, array[0], null);
    return new Tree(make(array[0]), array[1], make(array[2]));
}
let tree = make([[['a'], 'b', ['c']], 'd', [['e'], 'f', ['g']]]);
   
var result = [];
for (let node of inorder(tree)) {
    result.push(node);
}
   
console.log(result);
```

4. 使用Generator构建构造函数，来控制实例对象的实例化过程

```js
// Generator函数
function *gen(){
    yield this.a = 1;
    yield this.b = 2;
    yield this.c = 3;
}
// 构造函数F
function F(){
    // 在当前对象挂载一个属性next,用于控制gen函数的运行
    this.next = gen.call(this);
}
// 使用构造函数F
var f = new F();
// F {next: gen}
console.log(f);
// 运行gen函数
f.next.next();
// F {next: gen, a: 1}
console.log(f);
// 运行gen函数
f.next.next();
// F {next: gen, a: 1, b: 2}
console.log(f);
// 运行gen函数
f.next.next();
// F {next: gen, a: 1, b: 2, c: 3}
console.log(f);
```
   
5. 使用Generator来实现异步编程

我们可以使用Generator函数来控制异步操作的工作流程

```js
// 异步操作函数f1
function f1() {
    return new Promise((resolve, reject) => {
        setTimeout(() => {
            console.log("f1")
            resolve("第一阶段异步工作完成")
        }, 3000);
    });
}
// 异步操作函数f2
function f2() {
    return new Promise((resolve, reject) => {
        setTimeout(() => {
            console.log("f2")
            resolve("第二阶段异步工作完成")
        }, 3000);
    });
}
// 异步操作函数f3
function f3() {
    return new Promise((resolve, reject) => {
        setTimeout(() => {
            console.log("f3")
            resolve("第三阶段异步工作完成")
        }, 3000);
    });
}
// 操控一系列异步操作流程的Generator函数
function *gen(){
    yield f1();
    yield f2();
    yield f3();
}
// 执行Generator函数，返回Generator对象
var g = gen();
// 开始异步第一阶段操作
g.next().value.then((res)=>{
    console.log(res);
    // 异步第一阶段操作完成，开始异步第二阶段操作
    return g.next().value
}).then((res)=>{
    console.log(res);
    // 异步第二阶段操作完成，开始异步第三阶段操作
    return g.next().value;
}).then((res)=>{
    console.log(res);
}).catch((err)=>{
    console.log(err);
})
// 同步执行
console.log("hello world");
```

## Generator对象和Generator函数

```js
// Generator函数
function* gen() {
    yield 1;
    yield 2;
    yield 3;
}
// 执行Generator函数，返回Generator对象
var g = gen();
// [object Generator]
console.log(Object.prototype.toString.call(g));
// [object GeneratorFunction]
console.log(Object.prototype.toString.call(gen));
// true
/**
 * 这个结果说明g的__proto__属性指向函数gen的原型
 * 可以与构造函数与由构造函数创建的实例对象进行比较
 */
console.log(g.__proto__ == gen.prototype);
// 构造函数A
function A(){
    this.a = 1;
    this.b = 2;
}
// 实例对象a
var a = new A();
// true
console.log(a.__proto__ == A.prototype);
```



​上面的输出结果结果说明，generator实例对象是指向generator函数的原型，而generator函数的原型就是对象Generator