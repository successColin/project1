<template>
  <up-navbar
    :title="title"
    :safe-area-inset-top="safeAreaInsetTop"
    :placeholder="placeholder"
    :left-icon="leftIcon"
    :bg-color="bgColor"
    :left-icon-color="leftIconColor"
    :title-style="titleStyle"
    @left-click="leftClick"
  >
    <!-- <template v-slot:left>
      <view class="uv-nav-slot">
        <uv-icon name="arrow-left" size="19"></uv-icon>
        <uv-line
          direction="column"
          :hairline="false"
          length="16"
          margin="0 8px"
        ></uv-line>
        <uv-icon name="home" size="20"></uv-icon>
      </view>
    </template> -->
  </up-navbar>
</template>

<script setup lang="ts">
defineProps({
  title: {
    type: String,
    default: '',
  },
  safeAreaInsetTop: {
    type: Boolean,
    default: true,
  },
  placeholder: {
    type: Boolean,
    default: false,
  },
  leftIcon: {
    type: String,
    default: 'arrow-left',
  },
  bgColor: {
    type: String,
    default: '#fff',
  },
  leftIconColor: {
    type: String,
    default: '#303133',
  },
  titleStyle: {
    type: String,
  },
});

const leftClick = () => {
  if (getCurrentPages().length > 1) {
    uni.navigateBack();
  }
  else {
    uni.reLaunch({
      url: '/pages/tab/home/index',
    });
  }
};
</script>

<style lang="scss" scoped></style>
