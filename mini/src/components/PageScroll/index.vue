<template>
  <scroll-view
    :scroll-y="true"
    :style="{ height: scrollHeight }"
    :refresher-enabled="isPullRefresh"
    :refresher-triggered="refresherTriggered"
    @scrolltolower="scrollToLower"
    @scroll="scroll"
    @refresherrefresh="refresherrefresh"
  >
    <slot name="content" :list="dataList" />

    <template
      v-if="showEmptyTip && !otherParams.isCanLoading && dataList.length === 0"
    >
      <slot v-if="isCustomEmptyTip" name="empty" />
      <view v-else class="page_scroll-empty flex" style="padding-top: 160rpx">
        <a-image
          src="https://oss.dcqcjlb.com/51che_java_dev/20250630/file_1751279912953.png"
          width="180rpx"
          height="120rpx"
        />
        <view class="page_scroll-empty-desc">
          {{ emptyTipContent }}
        </view>
      </view>
    </template>

    <u-loadmore
      v-if="otherParams.isLoading"
      status="loading"
      loading-text="加载中"
    />
    <u-loadmore
      v-if="
        !otherParams.isCanLoading
          && isShowNoMore
          && dataList.length > 0
          && isPaging
      "
      status="nomore"
      nomore-text="没有更多了"
    />
    <bottom-height
      v-if="!otherParams.isCanLoading && isBottomHeight && !customBottomHeight"
    />
    <view
      v-if="!otherParams.isCanLoading && isBottomHeight && customBottomHeight"
      :style="{ height: customBottomHeight }"
    />
  </scroll-view>
</template>

<script setup lang="ts">
import { isArray } from '@alova/shared';

const props = defineProps({
  showTopVal: {
    type: Number,
    default: 80,
  },
  lowerThreshold: {
    type: Number,
    default: 50,
  },
  scrollHeight: {
    type: String,
    default: '100rpx',
  },
  request: {
    type: Function,
  },
  rows: {
    type: Number,
    default: 10,
  },
  params: {
    type: Object,
    default: () => {
      return {};
    },
  },
  isBottomHeight: {
    type: Boolean,
    default: false,
  },
  customBottomHeight: {
    type: String,
  },
  isShowNoMore: {
    type: Boolean,
    default: true,
  },
  isPaging: {
    type: Boolean,
    default: true,
  },
  showEmptyTip: {
    type: Boolean,
    default: true,
  },
  emptyTipContent: {
    type: String,
    default: '暂无数据',
  },
  isCustomEmptyTip: {
    type: Boolean,
    default: false,
  },
  isPullRefresh: {
    type: Boolean,
    default: false,
  },
});

const emit = defineEmits(['isShowTop']);

const searchField = reactive({
  page: 1, // 当前页数
  rows: props.rows, // 一页数量
});
const dataList = ref([]) as any;
const otherParams = reactive({
  total: 0, // 总数
  isLoading: false, // 是否加载中
  isCanLoading: true, // 能否加载
});
const refresherTriggered = ref(false);

const getList = async () => {
  const params = Object.assign({}, props.params);
  const searchParams = Object.assign({}, searchField);
  if (props.isPaging) {
    Object.assign(params, searchField);
  }

  if (props.request) {
    otherParams.isLoading = true;
    props
      .request(params, searchParams)
      .then((res: any) => {
        let { data, total } = res;
        if (res.total === undefined) {
          data = res || [];
        }
        else {
          data = data || [];
        }
        if (props.isPaging) {
          otherParams.total = total;
          otherParams.isCanLoading
            = Math.ceil(total / params.rows) > params.page;
          if (params.page === 1) {
            dataList.value = data;
          }
          else {
            data.forEach((item: any) => {
              dataList.value.push(item);
            });
          }
        }
        else {
          otherParams.isCanLoading = false;
          dataList.value = isArray(res) ? res : data;
        }
      })
      .finally(() => {
        otherParams.isLoading = false;
        refresherTriggered.value = false;
      });
  }
};

const scrollToLower = () => {
  if (otherParams.isCanLoading && !otherParams.isLoading) {
    searchField.page++;
    getList();
  }
};

const scroll = (event: any) => {
  if (event.detail.scrollTop > props.showTopVal) {
    emit('isShowTop', true);
  }
  else {
    emit('isShowTop', false);
  }
};

const initSearch = (isClear?: boolean) => {
  searchField.page = 1;
  otherParams.total = 0;
  otherParams.isCanLoading = true;
  if (isClear) {
    dataList.value = [];
  }
  getList();
};

const refesh = (isClear?: boolean) => {
  initSearch(isClear);
};

const refresherrefresh = () => {
  refresherTriggered.value = true;
  initSearch(true);
};

watch(
  () => props.params,
  () => {
    initSearch(true);
  },
  { deep: true },
);

onMounted(() => {
  getList();
});

defineExpose({
  refesh,
});
</script>

<style lang="scss" scoped>
.page_scroll-empty {
  display: flex;
  flex-direction: column;
  align-items: center;

  &-desc {
    // font-weight: 500;
    font-size: 22rpx;
    color: #999999;
    margin-top: 30rpx;
  }
}
</style>
