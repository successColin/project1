<template>
  <!-- name="cate_name"
  count="count" -->
  <div class="tabs">
    <up-tabs
      custom-style="margin-bottom: -5rpx;"
      :current="current"
      :line-width="lineWidth"
      :line-height="lineHeight"
      :list="list"
      :scrollable="move"
      :item-style="itemStyle"
      :inactive-style="inactiveStyle"
      :line-color="lineColor"
      :active-style="activeStyle"
      @change="change"
    />
  </div>
</template>

<script setup lang="ts">
const props = defineProps({
  current: {
    type: Number,
    default: 0,
  },
  move: {
    type: Boolean,
    default: true,
  },
  list: {
    type: Array,
    default: () => [
      {
        name: '待收货',
        count: 5,
      },
      {
        name: '待付款',
      },
    ],
  },
  height: {
    type: Number,
    default: 33,
  },
  inactiveS: {
    type: Object,
    default: () => {},
  },
  activeS: {
    type: Object,
    default: () => {},
  },
  itemS: {
    type: Object,
    default: () => {},
  },
  lineColor: {
    type: String,
    default: 'linear-gradient(0deg, #D91B1B 0%, #FFDBDB 100%);',
  },
  lineWidth: {
    type: Number,
    default: 16,
  },
  lineHeight: {
    type: Number,
    default: 2,
  },
  bgColor: {
    type: String,
    default: '#ffffff',
  },
});

const emit = defineEmits(['update:current', 'change']);

const change = ({ index }: any) => {
  emit('update:current', index);
  emit('change', index);
};

const inactiveStyle = computed(() => {
  return {
    fontFamily: 'opposans',
    fontWeight: 500,
    fontSize: '24rpx',
    color: '#222222',
    ...props.inactiveS,
  };
});

const itemStyle = computed(() => {
  return {
    height: `${props.height}px`,
    ...props.itemS,
  };
});

const activeStyle = computed(() => {
  return {
    fontFamily: 'opposans',
    fontWeight: 500,
    fontSize: '24rpx',
    color: '#D91B1B',
    ...props.activeS,
  };
});
</script>

<style lang="scss" scoped>
.tabs {
  width: 100%;
  background: v-bind(bgColor);
}

::v-deep(.u-tabs__wrapper__nav__line) {
  bottom: 0;
}
</style>
