---
title: Widgets生命周期
author: Re_Star
avatar: https://gitee.com/trueLoving/cdn/raw/master/img/avatar.jpg
authorAbout: 一个十分骚气的宅男
authorDesc: 一个十分骚气的宅男
categories: 笔记
tags:
 - 笔记
keywords: 笔记
date: 2020-06-10
comments: false
description: Widgets生命周期
photos: https://gitee.com/trueLoving/cdn/raw/master/img/Promise认识_bg.jpg
---


## 前言 Widget & Element

Flutter许多设计思路都是借鉴于React的,因此我们可以通过两者的对比来学习Flutter

Widget:用于描述一个UI元素的配置数据,类似于React的VNode

Element:真正显示在设备屏幕上的元素,类似于DOM

Flutter通过控制Widget数来控制屏幕显示的元素树,当Widget树发生变化时,Flutter会以最小的代价来更新元素树,这样就使得性能得到很高的提升(参考React的DOM diff算法)。Widget树和Element树之间有对应关系。

一般来说，一个Widget对象可以对应多个Element元素对象


## StatefulWidget


在Flutter中,我们最常用的两个类就是继承于Widget的`StatelessWidge`t和`StatefulWidget`

至于什么时候使用哪个类,其实最关键的点就是要考虑当前的Widget是否需要维护数据,如果需要就是使用StatefulWidget类,否则就使用StatelessWidge

至于怎么判断当前Widget是否需要维护数据,其实就是看我们需要当前组件实现怎样的功能,如果就单纯的UI显示,那么毫无疑问就使用StatelessWidge类。

如果我们在该组件中需要数据进行某些操作，

例如常见的用户登录中,我们需要用户输入账号密码向我们后端发送请求,那么我们的表单组件就去需要维护一份用户输入的账号密码数据,就需要跟踪用户的数据情况,在这里一般都是使用onchange事件进行回调监听。当用户的输入发生变化时,重新获取用户的输入，并赋值到当前组件所绑定的状态上。

而这种情况,组件就需要继承StatefulWidget类,来保存状态。

在使用StatefulWidget类时候,我们要搞清楚,哪些数据是从外部来的,哪些数据是需要组件自己去维护的, 这就是使用好StatefulWidget类最关键的一步(类似于React的"状态机"概念)

## StatefulWidget的生命周期


StatefulWidget的生命周期如下图所示


![Widget生命周期](https://gitee.com/trueLoving/cdn/raw/master/img/Widget生命周期 01.jpg)



StatefulWidget的生命周期和React的组件生命周期其实是差不多的,主要可以分为以下三个阶段
1. 初始化：初始化组件状态,并插入Widget树中
2. 状态变化:当状态发生变化时,重新渲染组件
3. 移除:将组件从Widget树中移除


其中每一个阶段所涉及到的具体生命周期函数和在当前生命周期函数应该做什么事情如下

#### 初始化

1. initState

当Widget第一次插入到Widget树时被调用,对于每一个State对象,Flutter Framework只会调用一次该回调函数,所以通常在该回调函数做一些一次性的操作,如状态初始化,订阅子树的事件通知等.

2. didChangeDependencies

当State对象的依赖发生变化时调用.典型的场景是当下图语言Locale或应用主题发生改变时,Flutter Framework就会通知widge调用此回调

3. build

该函数用于构建Widget子树
一般会在如下场景被调用
1. 在调用initState()之后
2. 在调用didUpdateWidget()之后
3. 在调用setState()之后
4. 在调用didChangeDependencies()之后
5. 在State对象从树中的一个位置移除之后(会调用deactivate)又重新插入到树的其它位置之后


#### 更新

1. reassumble

此回调是专门为了开发调试而提供的，在热重载 (hot reload) 时会被调用，此回调在 Release 模式下永远不会被调用

2. didUpdateWidget

在widget重新构建时,Flutter framenwork会调用Widget.canupdate来检测Widget树中的同一位置的新旧节点，然后决定是否需要更新，
如果Widget.canUpdate返回true,则会调用此回调。
正如之前所述,Widget.canUpdate会在新旧widget的key和runtimeType同时相等时返回true,
也就是说在在新旧 widget 的 key 和 runtimeType 同时相等时didUpdateWidget()就会被调用


#### 移除销毁
1. deactivate

当 State 对象从树中被移除时，会调用此回调。在一些场景下，Flutter framework 会将 State 对象重新插到树中，如包含此 State 对象的子树在树的一个位置移动到另一个位置时（可以通过 GlobalKey 来实现）。如果移除后没有重新插入到树中则紧接着会调用dispose()方法

2. dispose

当 State 对象从树中被永久移除时调用；通常在此回调中释放资源
