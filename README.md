# vue-picflow

一个简单的 vue 的瀑布流组件

## feature
```markdown
1. 支持百分比宽度，vw
2. 支持瀑布流的惰性填充
3. 暂不支持 resize
4. 暂不支持重排序
```

## download
```shell
yarn add vue-picflow
```
or
```shell
npm install vue-picflow
```

## usage
```javascript
import { Waterfall, WaterfallSlot } from 'vue-picflow'
```
```vue
components: {
  Waterfall,
  WaterfallSlot
}
```
```html
<template>
  <waterfall
    line-width="50%"
    :line-count="2"
    :margin-bottom="10"
    :margin-right="10"
    :extra-height="40"
    :vw-viewport="375"
    :max-height="300"
  >
    <waterfall-slot
      v-for="item in items"
      :key="item.index"
      :index="item.index"
      :width="item.width"
      :height="item.height"
      transition="fade"
    >
      <div class="demo">
        <div
          :style="{
            backgroundColor: item.style.color,
            backgroundImage: `url(${item.style.image})`,
            paddingTop: `${(item.height / item.width) * 100}%`
          }"
          class="image"
        />
        <div class="panel">{{ item.index }}</div>
      </div>
    </waterfall-slot>
  </waterfall>
</template>
```
## waterfall args
| key | value | meaning | required |
| ------ | ------ | ------ | ------ |
| line-width | Number, px, %, vw | 每行的宽度 | Y |
| line-count | Number, >= 2 | 瀑布流的行数 | Y |
| margin-bottom | Number, >= 0 | 每个块的上下间距 | N |
| margin-right | Number, >= 0 | 每行的间距 | N | 
| extra-height | Number, >= 0 | 出去图片外的 DOM 的高度 | N |
| vw-viewport | Number, >= 0 | vw 模式下的视口宽度 | N |
| max-height | Number, >= 0 | 每个块的最大高度 | N | 
| lazy-scale | Number, >= 1 | 懒加载的比率 | N |

## waterfall-slot args
| key | value | meaning | required |
| ------ | ------ | ------ | ------ |
| width | Number, >= 0 | 图片的宽度 | Y |
| height | Number, >= 0 | 图片的高度 | Y |
| index | Number, >=0 | 图片的 index | Y |
| transition | String | 每个块的渐变动画 | N |

## Project setup
```
yarn install
```

### Compiles and hot-reloads for development
```
yarn run dev
```

### Compiles and minifies for production
```
yarn run build
```

### Lints and fixes files
```
yarn run lint
```

### Run your unit tests（nothing）
```
yarn run test:unit
```

### Customize configuration
See [Configuration Reference](https://cli.vuejs.org/config/).
