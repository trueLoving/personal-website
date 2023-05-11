---
title: Virtual DOM
author: Re_Star
avatar: https://gitee.com/trueLoving/cdn/raw/master/img/avatar.jpg
authorAbout: 一个十分骚气的宅男
authorDesc: 一个十分骚气的宅男
categories: 笔记
tags:
 - 笔记
keywords: 笔记
date: 2020-06-26
comments: false
description: Virtual DOM
photos: https://gitee.com/trueLoving/cdn/raw/master/img/Virtual_DOM_bg.jpg
---


## 前言

Virtual DOM,虚拟DOM,其实是对页面真实DOM的一种简单描述对象,我们可以通过这个虚拟DOM,使用浏览器提供的API(document.createElement()...等)来创建出与其对应的真实DOM。

这样,我们就可以通过操作虚拟DOM,来间接操作DOM,而由于虚拟DOM的对象比真实DOM的对象要小得多,这样我们就可以降低在操作DOM对象上的一些开销,以此来提升页面的性能。

像目前的React,Vue框架都借助了虚拟DOM来完成对真实DOM的操作,将DOM树写到内存中,然后在内存中完成对DOM树的操作(插入,修改,删除,添加.....),最后当完成了对DOM树的所有操作后,一次性将DOM树插回到页面中,这样就大大减少了浏览器页面的重绘工作量,提升了网页性能。

我们其实可以使用js来创建自己的虚拟DOM,`虚拟DOM的本质其实就是一个JS对象`。

所以,定义一个属于自己的虚拟DOM,可以分为以下几步
1. 创建vNode
2. 渲染vNode
3. 挂载vNode
4. 更新vNode

下面就是将如何通过使用JS代码来实现自己的虚拟DOM

## 确定虚拟DOM对象

首先,我们要确定虚拟DOM对象的属性名和属性值,在这里,虚拟DOM对象的属性名和属性值如下
```js
class VDOM{
    tagName='tagName', // 类型:字符串   含义:VDOM对应DOM的标签名称
    attrs:{},          // 类型:对象     含义:VDOM对于DOM的属性节点
    children:[]        // 类型:数组     含义:该VDOM下的子VDOM对象
}
```

## 创建虚拟DOM对象

我们需要一个函数,只要我们传入相关参数,就会帮我们生成相对应的VDOM对象
```js
/**
 * 
 *  @tagName    {String} VDOM的标签名称
 *  @attrs      {Object} VDOM的属性节点
 *  @childrem   {Array}  VDOM的后代VDOM
 */
function createElement(tagName,{attrs={},children=[]}={}){
    return{
        tagName,
        attrs,
        children
    }
}
```

## 渲染虚拟DOM对象

当我们手中有一个虚拟DOM时,我们需要一个函数来帮助我们将该虚拟DOM转换为真实DOM
```js
// 如果VDOM为
function renderElement({tagName,attrs,children}){

    const $el = document.createElement(tagName);

    // set attribute
    for(const [k,v] of attrs){
        $el.setAttribute(k,v);
    }

    // render child
    // 当存在子VDOM时,递归调用render方法,然后将render方法的返回值添加到$el的后代中
    for(const child of children){
        const $child = render(child);
        $el.appendChild($child);
    }

    return $el;
}

function render(VDOM){
    // 如果VDOM是字符串,说明此VDOM为文本节点
    if(typeof VDOM === "string"){
        return document.createTextContent(VDOM);
    }
    return renderElement(VDOM);
}

```

## 挂载虚拟DOM对象

现在,我们手中有真实DOM,然后就需要将其挂载在我们指定的DOM后面
```js
/**
 * @$node   {DOM} 由VDOM得到的DOM
 * @target  {DOM} 要被插入$node的父元素DOM
 */
function mount($node,$target){
    $target.replaceWith($node);
    return $node;
}
```

## 更新虚拟DOM对象
当我们去更新，插入或者删除一个VDOM时,我们需要一个方法来帮助我们以最小的代价来更新VDOM树对应的DOM树,这个方法就是diff算法

diff算法的可以分为以下三个部分
1. 比较传入的节点(diff函数)
2. 比较传入节点的属性(diffAttrs函数)
3. 比较节点的子节点(diffChildren函数)


#### diff函数实现

对于diff函数,需要考虑四种情况
1. 传入的新节点为undefined,是因为该节点是要被删除的节点，所以回传的回调函数patch要调用Node.remove()方法
2. 传入的旧节点或者新节点可以是字符串,此时可以直接比较新旧两个节点,如果不一样,则用新节点取代旧节点
3. 旧节点与新节点的标签不一样,则用新节点去取代旧节点
4. 旧节点与新节点的标签一样，则继续往下比较标签上的属性节点以及其子节点

`函数实现`
```js
const diff = (vOldNode,vNewNode) =>{
    if(vNewNode===undefined){
        return ($node)=>{
            $node.remove();
            return undefined;
        }
    }
    if(typeof vOldNode === "string" || typeof vNewNode === "string"){
        if(vNewNode!==vOldNode){
            return ($node)=>{
                const $newNode = render(vNewNode);
                return mount($newNode,$node);
            }
        }
    }
    if(vOldNode.tagName!==vNewNode.tagName){
        return ($node)=>{
            const $newNode = render(vNewNode);
            return mount($newNode,$node);
        };
    }
    
    // 比较属性节点,diffAttrs后面会实现
    const patchAttrs = diffAttrs(vOldNode.attrs.vNewNode.attrs);
    // 比较其子节点,diffChildren后面会实现
    const pathChildren = diffChildren(vOldNode.children,vNewOlde,children);
    return ($node)=>{
        patchAttrs($node);
        patchChildren($node.children);
        return $node;
    }
}
```

#### diffAttrs函数实现

diffAttrs函数主要是在标签上设置属性和删除属性

函数patches用于存储属性变动的patch函数

比较完所有的属性节点后,会在diff函数呼叫patchAttrs($node),将节点传进来并批量更新标签上的属性

`函数实现`
```js
const diffAttrs = (oldAttrs,newAttrs)=>{

    // 更新节点的回调函数
    const patches = [];

    // 遍历新的节点属性
    for(const [k,v] of Object.entries(newAttrs)){
        patches.push($node=>{
            $node.setAttribute(k,v);
            return $node;
        })
    }

    // 遍历旧的节点属性
    for(const key of oldAttrs){
        // 如果一个新的属性节点，在旧的存在，但是在新的不存在，则$node需要移除该属性节点
        if(!(key in newAttrs)){
            patches.push($node=>{
                $node.removeAttribute(key);
                return $node;
            })
        }
    }

    // 返回可调用用于更新属性节点的回调函数
    return ($node)=>{
        patches.forEach(patch=>{
            patch($node);
        })
    }

}
```

#### diffChildren函数实现

diffChildren的任务就是更新变得的子节点/删除子节点/插入新的子节点/.....


`函数实现`
```js


const zip = (xs,ys) =>{
    cosnt zipped = [];
    for(let i=0;i<Math.min(xs.length,ys.length);i++){
        zipped.push([xs[i],ys[i]]);
    }
    return zipped;
}

const diffChildren = (oldVChildren,newVChildren) =>{

    const childPatches = [];
    

    for(const [oldChild,newChild] of zip(oldVChildren,newVChildren)){
        childPatches.push(diff(oldChild,newChild));
    }


    const additionalPatches = [];
    newVChildren.slice(oldVChildren.length).forEach(additionalVChild=>{
        additionalPatches.push(($node)=>{
            $node.appendChild(render(additionalVChild));
            return $node;
        });
    });

    return ($node)=>{
        for(let i=childPatches.length-1;i>=0;i--){
            const $child = $node.children[i];
            const patch = childPatches[i];
            patch($child);
        }
        additionalPatches.forEach(patch=>{
            patch($node);
        })
        return $node;
    }

}

```

## 测试虚拟DOM对象

`main.js`
```js
// 引入相关函数
import createElement from "./vdom/createElement";
import render from "./vdom/render";
import mount from "./vdom/mount";
import diff from './vdom/diff';

const createApp = (count) => createElement(
    'div',
    {
        attrs: {
            dataCount: count
        },
        children: [
            createElement('input'),
            String(`Current count:${count}`),
            ...Array.from({ length: count }, () => {
                return createElement('img', {
                    attrs: {
                        src: 'https://media.giphy.com/media/4Zo41lhzKt6iZ8xff9/giphy.gif'
                    }
                })
            })
        ]
    }
)


let count = 1;
// 创建VDOM
let vApp = createApp(count);
// 渲染VDOM
const $app = render(vApp);
// 挂载VDOM
let $rootEl = mount($app, document.getElementById('app'));

setInterval(() => {
    count++; //数据发生变化
    const vNewApp = createApp(count); // 重新创建一个新的VDOM
    const patch = diff(vApp, vNewApp); // 比较新旧VDOM之间的差别,并返回更新DOM的函数
    patch($rootEl); //  更新DOM
    vApp = vNewApp; // 重新替换
}, 1000);

```


![效果动态](https://gitee.com/trueLoving/cdn/raw/master/img/Virtual DOM.gif)
