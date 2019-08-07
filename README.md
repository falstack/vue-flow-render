# vue-flow-render

一个 vue 的列表惰性渲染容器组件

## How it works

#### 单列定高
<img src="https://github.com/falstack/vue-flow-render/raw/master/demo/single-height.gif" />

#### 单列不定高
<img src="https://github.com/falstack/vue-flow-render/raw/master/demo/single.gif" />

#### 多列不定高（waterfall）
<img src="https://github.com/falstack/vue-flow-render/raw/master/demo/multiple.gif" />

## Download
```shell
yarn add vue-flow-render
or
npm install vue-flow-render
```

## Usage
```javascript
import VueFlowRender from 'vue-flow-render'
```

## Props
| key | value | description | required | validator |
| ------ | ------ | ------ | ------ | --- |
| remain | Number | 列表里保留的 item 的 DOM 个数 | Y | >= 0 |
| total | Number | item 的总数 | Y | >= 0 | 
| column | Number | 列表的列数，默认是1列，多列为瀑布流 | N | >= 1 |
| height | Number | 每个 item 的高度，如果为不定高度的组件，则不填 | N | >= 0 |
| item | VueComponent | 如果 item 为单一固定高度的，则可以把 item 组件传过来 | N | - |
| getter | Function | 如果传了 item 的组件，则 getter 方法用来获取 item 的属性，调用 getter 方法的传参是 index | N | - |


> PS：如果 item 的高度为不固定的，必须在 item 的 style 上设置高度，单位为 px，如：

1. 普通用法
```Vue
<vue-flow-render
  ref="render"
  :total="1000"
  :remain="10"
>
  <item
    v-for="(item, index) in items"
    :key="index"
    :style="{ height: `${item.height}px` }"
  />
</vue-flow-render>
```

2. item 用法
```vue
<template>
    <vue-flow-render
      ref="render"
      :total="1000"
      :remain="10"
      :height="100"
      :item="item"
      :getter="getProps"
    />
</template>

<script>
import Item from './components/Item.vue'

export default {
  data() {
    return {
      items: [],
      item: Item
    }
  },
  methods: {
    getProps(index) {
      return {
        props: {
          item: this.items[index],
          index
        }
      }
    }
  }
}
</script>
```

## Public methods
> 通过 ref 来拿到组件，然后调用组件的方法
1. `scroll(scrollEvt.target.offsetTop)`
组件不会自己滚动，需要在外层容器滚动的时候将`evt.target.offsetTop`传递到 scroll 函数里的第二个参数是 isUp（是否向上滑动，默认可不传）

2. `setOffset()`
如果容器的上面存在动态高度的元素，那么当其高度变化后，调用`setOffset`函数

3. `setWrap(el)`
如果使用`better-scroll`，那么你要把 render 的 wrap 设置为`better-scroll`的父容器。默认为组件外层 overflow：hidden 的第一个元素

4. `getRect(index)`
使用这个组件后，浏览器自带的`Ctrl + F`搜索就无法正常使用，请自行实现搜索功能，然后通过该方法获取到指定元素的 rect，再让容器滚动到指定位置

5. `clear()`
刷新页面的时候，调用该方法清空缓存

## Contributions
Welcome to improve this vue component with any issue, pull request or code review!

## License
[MIT](https://github.com/falstack/vue-flow-render/blob/master/LICENSE)
