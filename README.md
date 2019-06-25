# vue-flow-render

一个 vue 的列表惰性渲染容器组件

## download
```shell
yarn add vue-flow-render
```
or
```shell
npm install vue-flow-render
```

## usage
```javascript
import VueFlowRender from 'vue-flow-render'
```

## 参数
| key | value | description | required | validator |
| ------ | ------ | ------ | ------ | --- |
| remain | Number | 列表里保留的 item 的 DOM 个数 | Y | >= 0 |
| total | Number | item 的总数 | Y | >= 0 | 
| column | Number | 列表的列数，默认是1列，多列为瀑布流 | N | >= 1 |
| height | Number | 每个 item 的高度，如果为不定高度的组件，则不填 | N | >= 0 |
| item | VueComponent | 如果 item 为单一固定高度的，则可以把 item 组件传过来 | N | - |
| getter | Function | 如果传了 item 的组件，则 getter 方法用来获取 item 的属性，调用 getter 方法的传参是 index | N | - |


> PS：如果 item 的高度为不固定的，必须在 item 的 style 上设置高度，单位为 px，如：
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

## 方法
> 通过 ref 来拿到组件，然后调用组件的方法
1. `this.$refs.render.scroll(scrollEvt.target.offsetTop)`
组件不会自己滚动，需要在外层容器滚动的时候将`evt.target.offsetTop`传递到 scroll 函数里
scroll 函数的第二个参数是 isUp（是否向上滑动，默认可不传）

2. `this.$refs.render.setOffset()`
如果容器的上面存在动态高度的元素，那么当其高度变化后，调用`setOffset`函数

3. `this.$refs.render.setWrap(el)`
如果使用`better-scroll`，那么你要把 render 的 wrap 设置为`better-scroll`的父容器
