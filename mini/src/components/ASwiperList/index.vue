<template>
  <swiper class="swiper" :current="current" @change="handleChange">
    <swiper-item v-for="(v, i) in list" :key="i">
      <slot v-if="isVisible(i)" :name="v.key" />
    </swiper-item>
  </swiper>
</template>

<script setup lang="ts">
const props = defineProps({
  list: {
    default: Array,
    type: () => [] as any,
  },
  current: {
    default: 0,
    type: Number,
  },
});

const emit = defineEmits(['update:current']);
const handleChange = ({ detail }: any) => {
  emit('update:current', detail.current);
};

const isVisible = (i: number) => {
  const prevIndex = props.current - 1;
  const nextIndex = props.current + 1;
  return i === props.current || i === prevIndex || i === nextIndex;
};
</script>

<style lang="scss" scoped>
.swiper {
  height: 100%;
}
</style>
