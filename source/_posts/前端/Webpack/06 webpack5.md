---
title: Webpack webpack5
author: Re_Star
avatar: https://gitee.com/trueLoving/cdn/raw/master/img/avatar.jpg
authorAbout: 一个十分骚气的宅男
authorDesc: 一个十分骚气的宅男
categories: 前端
tags:
 - webpack
keywords: webpack
date: 2020-02-21
comments: false
description: Webpack webpack5
photos: https://gitee.com/trueLoving/cdn/raw/master/img/daily.jpg
---

#### 安装 

npm i webpack@next webpack-cli -D

#### 关注点

1. 通过持久缓存提高构建性能
2. 使用更好的算法和默认值来改善长期缓存
3. 通过更好的树摇和代码生成来改善捆绑包
4. 清除处于怪异状态的内部结构，同时在v4中实现功能二不引入重大改变
5. 通过引入重大更改来为将来的功能做准备，以使我们能够尽可能长时间使用v5

#### 自动删除Node.js Polyfills

在webpack5中，会自动停止Node的核心模块的提供，并专注于前端兼容的模块

迁移

1. 尽可能尝试使用与前端兼容的模块
2. 可以为nodejs核心模块手动添加一个polyfill。错误信息会提示如何实现该目标

#### Chunk 和 模块ID

添加了用于长期缓存的新算法。在生产模式默认启动

```js
chunkId:'deterministic',moduleIds:'deterministic'
```

#### Chunk ID

我们可以不用使用`import(/*webpackChunkName:'name'*/'module')`在开发环境来为chunk命名

webpack内部有chunk的命名规则，不再是以id(0,1,2)命名

#### Tree Shaking

1. webpack5能够处理嵌套模块的tree shaking

```js
// index.js
export const a = 1;
export const b = 2;

// module.js
import * as inner from './inner';
export { inner }

// user.js
import * as module from './module';
console.log(module.inner.a);
```

在生产环境中，inner模块的b会被删除

2. webpack5能够处理多个模块之前的关系

```js
import { something } from './something';

function usingSomething(){
    return something;
}

export function test(){
    return usingSomething();
}
```

当设置`'sideEffects':false`时，一旦发现`test`方法没有使用，不但会删除test，还会删除`./something` 

3. webpack5能够处理Commonjs的tree shaking

#### output

webpack4 默认输出ES5代码

webpack5 开始新增一个属性output.ecmaVersion,可以生成ES5和ES6代码

#### Caching

```js
cache:{
    // 缓存类型
    type:'filesystem',
    buildDependencies:{
        // 当配置修改时，缓存失效
        config:[__filename]
    }
}
```

缓存将存储到node_modules/.cache/webpack

#### 更多内容 https://github.com/webpack/changelog-v5