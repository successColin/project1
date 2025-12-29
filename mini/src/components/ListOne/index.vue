<template>
  <div class="listOne" :style="[{ width: imgWh[0] }]" @click="emit('click')">
    <div class="listOne__img" :style="`height: ${imgWh[1]}`">
      <a-image :src="imageUrl(item)" :height="imgWh[1]" width="100%" />
      <div v-if="isShowTagOne" class="listOne__img--tag">
        {{ item[newProps.tag] }}
      </div>
    </div>
    <div class="listOne__title" :style="titleStyle">
      {{ item[newProps.title] }}
    </div>
    <div class="listOne__user flex" :style="itemAlign">
      <template v-if="type === 1">
        <div>
          <div class="flex">
            <div style="width: 24rpx; height: 24rpx">
              <a-image
                :src="item[newProps.userImg]"
                height="24rpx"
                width="24rpx"
                shape="circle"
              />
            </div>
            <div class="m-l-6rpx">
              {{ item[newProps.userName] }}
            </div>
          </div>
          <div class="color999 m-t-20rpx">
            {{ item[newProps.videoCreateTime]?.split(" ")[0] || "" }}
          </div>
        </div>
      </template>
      <template v-else-if="type === 2">
        <div>￥</div>
        <div class="m-l-4rpx" style="font-size: 32rpx; font-weight: 500">
          {{ item[newProps.price] === 0 ? "免费" : item[newProps.price] }}
        </div>
        <div
          v-if="item[newProps.price] > 0"
          class="m-l-7rpx line-through"
          style="color: #999"
        >
          ￥{{ item[newProps.marketPrice] }}
        </div>
      </template>
      <template v-else-if="type === 3">
        <div style="font-size: 32rpx; color: #ff4d4f">
          <span style="font-weight: 500;color: #222222;">{{ item[newProps.price] }}</span>
          <span class="m-l-4rpx" style="color: #222222;">{{ unit }}</span>
        </div>
      </template>
    </div>
  </div>
</template>

<script setup lang="ts">
const props = defineProps({
  imgWh: {
    type: Array,
    default: () => ['360rpx', '360rpx'],
  },
  titleLine: {
    type: Number,
    default: 1,
  },
  type: {
    type: Number,
    default: 1,
  },
  propsVal: {
    type: Object,
    default: () => {},
  },
  item: {
    type: Object,
    default: () => {},
  },
  isShowTagOne: {
    type: Boolean,
    default: false,
  },
  unit: {
    type: String,
    default: '积分',
  },
});
const emit = defineEmits(['click']);
const titleStyle = computed(() => {
  return {
    'overflow': 'hidden',
    'text-overflow': 'ellipsis',
    'display': '-webkit-box',
    '-webkit-line-clamp': props.titleLine,
    '-webkit-box-orient': 'vertical',
  };
});

const itemAlign = computed(() => {
  return {
    'align-items': props.type === 1 ? 'center' : 'baseline',
  };
});

const initProps = {
  imgUrl: 'imgUrl',
  title: 'title',
  userImg: 'userImg',
  userName: 'userName',
  price: 'price',
  marketPrice: 'marketPrice',
  tag: 'tag',
  videoCreateTime: 'createTime',
};

const newProps = computed(() => {
  return Object.assign(initProps, props.propsVal);
}) as any;
const imageUrl = computed(() => {
  return (item: any) => {
    let url
      = item[newProps.value.imgUrl] || item[newProps.value?.baseImgUrl] || '';
    const arr = newProps.value.imgUrl.split('|');
    arr.forEach((v: string) => {
      if (!url) {
        url = item[v];
      }
    });
    return url;
  };
});
</script>

<style lang="scss" scoped>
.listOne {
  width: 360rpx;
  margin-bottom: 20rpx;
  border-radius: 20rpx 20rpx 0rpx 0rpx;
  font-weight: 500;
  color: #222222;
  overflow: hidden;
  &__img {
    position: relative;
    &--tag {
      position: absolute;
      bottom: 10rpx;
      left: 10rpx;
      background: rgba(34, 34, 34, 0.8);
      padding: 12rpx 24rpx;

      font-weight: 500;
      font-size: 24rpx;
      color: #ebecf1;
    }
  }
  &__title {
    margin-top: 20rpx;
    font-size: 28rpx;
  }
  &__user {
    margin-top: 20rpx;
    font-size: 24rpx;
  }
}
</style>
