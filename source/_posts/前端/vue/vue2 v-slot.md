---
title: vue2 v-slot
author: Re_Star
avatar: https://gitee.com/trueLoving/cdn/raw/master/img/avatar.jpg
authorAbout: 一个十分骚气的宅男
authorDesc: 一个十分骚气的宅男
categories: 前端
tags:
 - vue
keywords: vue
date: 2020-02-06
comments: false
description: vue2 v-slot
photos: https://gitee.com/trueLoving/cdn/raw/master/img/类数组转换为数组的方法_bg.jpg
---

## 前言

vue的插槽灵感来自于Web Component,将 `<slot>` 元素作为承载分发内容的出口。

slot标签也是我们UI组件化的一个方法,我们可以通过slot标签向组件传递标签数据(意思就是我们可以将组件作为数据传递给另一个组件)

## 插槽的基本使用
先来一个最简单的使用Demo
1. 定义

```vue
<template>
  <div>
    <slot>Hello Slot</slot>
  </div>
</template>
```
这里,定义了一个带有slot标签的组件,我们可以使用特定的方法在使用该组件时向该组件传递组件标签数据

2. 使用

```vue
<template>
  <div>
    <!----使用组件----> 
    <SlotComponent>
      <!----传递标签数据----> 
      <template>
        <h1>Hello Template</h1>
      </template>
    </SlotComponent>
  </div>
</template>

<script>
// 引入组件
import SlotComponent from "componentPath";

export default {
  // 注册组件
  components: {
    SlotComponent
  }
};
</script>
```
这里,我们首先使用定义了一个组件,然后引用了该组件，注册并使用了它

在使用该组件的使用,我们使用`<template>`标签,然后通过该标签将标签数据(也就是`<h1>Hello Template</h1>`)传递给了SlotComponent组件,然后接收到标签数据的组件会将该标签分发到slot标签里。

效果如下

![v-slot1](https://gitee.com/trueLoving/cdn/raw/master/img/v-slot指令01.png)

假如我们没有向SlotComponent组件传递参数,那么slot那区域所显示的内容就是SlotComponent组件slot标签原本的内容。  

在这里是`Hello Slot`

效果如下

![v-slot2](https://gitee.com/trueLoving/cdn/raw/master/img/v-slot指令02.png)


## 插槽命名

然而,在我们的实际应用中,我们的一个组件会多出使用到slot标签,那么这是我们就需要为slot命名 --> 插槽命名

1. 定义组件

```vue
<template>
  <div>
    <slot name="header">
      <h1>header</h1>
    </slot>
    <slot>
      <h1>default</h1>
    </slot>
    <slot name="footer">
      <h1>footer</h1>
    </slot>
  </div>
</template>
```

在这里,我们定义了三个插槽,并分别为这三个插槽命名,不取名默认为'default'。

在这里这三个插槽的名称分别为`header`,`default`,`footer`

然后,接下来就是使用该组件

2. 使用组件

```vue
<template>
  <div id="app">
    <SlotComponent>
      <template v-slot:header>Hello header</template>
      <template>Hello default</template>
      <template v-slot:footer>Hello footer</template>
    </SlotComponent>
  </div>
</template>

<script>
import SlotComponent from "./components/SlotComponent";

export default {
  components: {
    SlotComponent
  },
  data() {}
};
</script>
```

这里,我们首先使用定义了一个组件,然后引用了该组件，注册并使用了它

然后,在这里,我们不仅使用了`template`标签,还使用了v-slot指令,该指令指定template所包含的标签数据应该传给那个slot

v-slot后面的值为slot插槽的名称。并且该指令只能使用在template标签上

这样,vue就会帮我们把template所包含的标签数据传递给相应的slot中

效果如下图

![v-slot3](https://gitee.com/trueLoving/cdn/raw/master/img/v-slot指令03.png
)
## 插槽的作用域

有时候,我们需要使用组件的外部组件访问到组件内部数据,我们需要访问其slot所绑定的数据

那么，我们可以按照以下步骤

1. 定义组件

```vue
<template>
  <div>
    <slot v-bind:user="user">
      <!-- default slot value -->
      {{user.firstName}}
    </slot>
  </div>
</template>
<script>
export default {
  data() {
    return {
      user: {
        firstName: "Jack",
        lastName: "Black"
      }
    };
  }
};
</script>
```
在这里,我们定义了一个对象user，并且我们将user.firstName作为插槽的默认值

然后我们在slot标签上绑定一个属性名为user,属性值为user

这样,就完成了组件的定义

2. 使用组件

```vue
<template>
  <div id="app">
    <SlotComponent>
      <template v-slot:default="slotProp">{{slotProp.user.lastName}}</template>
    </SlotComponent>
  </div>
</template>

<script>
import SlotComponent from "./components/SlotComponent";

export default {
  components: {
    SlotComponent
  },
};
</script>
```

在这里,我们首先使用定义了一个组件,然后引用了该组件，注册并使用了它

然后我们在template标签上使用v-slot获取slot所绑定的所有属性,格式为`v-slot:slotName="props"`。

slotName为插槽的名称,props为该插槽所绑定的所有属性,在这里是`{user}`

然后我们就可以通过props来获取slot所绑定的值

最后效果如下

![v-slot4](https://gitee.com/trueLoving/cdn/raw/master/img/v-slot指令04.png)