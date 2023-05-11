---
title: XHR的基本认识
author: Re_Star
avatar: https://gitee.com/trueLoving/cdn/raw/master/img/avatar.jpg
authorAbout: 一个十分骚气的宅男
authorDesc: 一个十分骚气的宅男
categories: 笔记
tags:
 - 笔记
keywords: 笔记
date: 2020-05-25
comments: false
description: XHR的基本认识
photos: https://gitee.com/trueLoving/cdn/raw/master/img/XHR的基本认识_bg.jpg
---

## 文章的思维导图


![文章思维导图](https://gitee.com/trueLoving/cdn/raw/master/img/XHR的基本认识 01.jpg)



## what

xhr，全称XMLHttpRequest，是一种创建ajax的JavaScript API。该对象的方法提供了在浏览器和服务器之间发送请求的能力

我们通过xhr可以在不刷新页面的情况下请求特定的url,获取数据。这允许网页在不影响用户操作的情况下，更新页面的局部内容

## how

一般我们使用xhr要通过浏览器内置的XMLHttpRequest构造函数来生成一个xhr实例对象，然后我们通过调用该实例对象的属性和方法来完成ajax请求

### 构造函数

- XMLHttpRequest()

  该构造函数用于初始化一个XMLHttpRequest实例对象

### 实例属性

- status | 只读

  请求的响应状态码

- statusText | 只读

  请求的响应状态描述文本

- readyState

  请求的状态码

- onreadystatechange

  当请求状态发送变化时会触发的回调函数
  该属性名的值为一个函数

- responseType

  一个用于定义响应类型的枚举值

- response | 只读

  返回请求后的响应数据，可以是二进制文本，字符串或者文本等....
  具体类型由responseType决定

- timeout

  设置请求的最大时间

- ontimeout

  若请求超时，所会触发的回调函数

- onerror

  若请求出现异常，所会触发的回调函数

### 实例方法

- open(method,url,[async])

  初始化一个请求
  参数类型为(string,string,boolean)
  参数含义为(请求方式,请求路径,是否为异步)

- send(data)

  发送请求
  参数为请求实体中的参数
  
  若请求实体的数据为json格式,那么需要手动将参数从对象转换为json
  
  方法:JSON.stringify(data)

- abort()

  中断请求

- getResponseHeader(name)

  根据name获取响应头对应的值

- getAllResponseHeaders()

  以字符串的形式返回所有用 CRLF 分隔的响应头，如果没有收到响应，则返回 null

- setRequestHeaders(name,value)

  设置 HTTP 请求头的值。必须在 open() 之后、send() 之前调用 setRequestHeader() 方法

## xhr的简单封装

要求:
1. 封装一个函数，函数的返回值为promise,成功的结果为response,异常的结果为error
2. 能处理多种类型的请求:GEI/POST/PUT/DELETE
3. 函数的参数为一个配置对象


代码

```js
function axios({
    url,
    method = 'GET',
    params = {},
    data = {}
}) {
    return new Promise((resolve, reject) => {
        // 处理method
        method = method.toUpperCase();
        
        // 处理query参数(拼接到url上)
        let queryString = '';
        Object.keys(params).forEach(key => {
            queryString += `${key}=${params[key]}&`;
        })
        if (queryString) {
            // 去除最后的&
            queryString = queryString.substring(0, queryString.length - 1);
            // 接到url
            url += '?' + queryString;
        }


        // 1. 执行异步任务,进行ajax请求
        // 创建xhr对象
        const request = new XMLHttpRequest();
        // 打开连接(初始化请求)
        request.open(method, url, true);
        // 发送请求
        if (method === 'GET'||method==='DELETE') {
            request.send(null);
        } else if(method==='POST'||method==='PUT'){
            // 告诉服务器请求数据的格式为json格式
            request.setRequestHeader('Content-Type', 'application/json;charset=UTF-8');
            request.send(JSON.stringify(data));
        }

        // 绑定状态改变的监听
        request.onreadystatechange = function () {
            // 如果请求没有完成，直接结束
            if (request.readyState !== 4) {
                return
            }
            // 如果响应状态码在[200,300)之间代表成功。否则失败
            const { status, statusText } = request;
            // 2.1 如果请求成功，调用resolve
            if (status >= 200 && status < 299) {
                // 准备结果数据对象response
                const response = {
                    data: JSON.parse(request.response),
                    status,
                    statusText
                }
                resolve(response)
            } else {  // 2.2 如果请求失败，调用reject
                reject(new Error(`request error status is ${status}`))
            }
        }
    })

}
```