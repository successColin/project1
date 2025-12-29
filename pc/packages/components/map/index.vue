<script lang="ts" setup>
import { reactive, ref, watch } from 'vue'
import { BaiduMap, BMapInstance } from 'vue-baidu-map-3x'

import { useResetReactive } from 'dsrz/hooks/useReset'

import type {
  CurrentPlace,
  GeocoderResult,
  LocalResult,
  PlaceSuggestion,
  Point,
} from './types'
import { isArray } from 'dsrz/utils'

defineOptions({
  name: 'CurrencyMap',
})

const props = defineProps({
  modelValue: {
    type: [Array, Object],
    default: () => [],
  },
  'onUpdate:modelValue': {
    type: Function,
    default: undefined,
  },
  props: {
    type: Object,
    default: () => ({
      location: 'location',
      longitude: 'longitude',
      latitude: 'latitude',
    }),
  },
})

const {
  params,
  exposes: { reset },
} = useResetReactive({
  visible: false,
  title: '请选择地址',
})

// 响应式状态
const searchQuery = ref<string>('')
const mapCenter = reactive<Point>({ lng: 116.404, lat: 39.915 })
const markerPosition = reactive<Point>({ lng: 116.404, lat: 39.915 })
const zoom = ref<number>(15)
const showInfoWindow = ref<boolean>(false)
const animation = ref<string>('2')
const currentPlace = reactive<CurrentPlace>({ title: '', address: '' })
const BMapRef = ref<typeof BaiduMap | null>(null)
const mapInstance = ref<typeof BMapInstance | null>(null)
const mapValue = reactive(
  isArray(props.modelValue)
    ? props.modelValue.reduce((acc, key, index) => {
        acc[Object.keys(props.props)[index]] = key
        return acc
      }, {})
    : props.modelValue,
)

// 地图初始化完成
const mapReady = (e: { BMap: typeof BaiduMap; map: typeof BMapInstance }) => {
  BMapRef.value = e.BMap
  mapInstance.value = e.map
}

// 异步查询建议
const querySearchAsync = (
  queryString: string,
  callback: (suggestions: PlaceSuggestion[]) => void,
) => {
  if (!queryString || !BMapRef.value || !mapInstance.value) {
    callback([])
    return
  }

  const options = {
    renderOptions: {
      map: mapInstance.value,
      panel: null,
      autoViewport: true,
    },
    onSearchComplete: (results: LocalResult) => {
      const suggestions = []
      const count = Math.min(results.getNumPois(), 5)

      for (let i = 0; i < count; i++) {
        const poi = results.getPoi(i)
        suggestions.push({
          title: poi.title,
          address: poi.address,
          point: poi.point,
          value: `${poi.title} - ${poi.address}`,
        })
      }
      callback(suggestions)
    },
  }

  const localSearch = new BMapRef.value.LocalSearch(mapInstance.value, options)
  localSearch.search(queryString)
}

// 处理选择建议项
const handleSelect = <T,>(item: T) => {
  const { point, title, address } = item as PlaceSuggestion
  updateMapPosition(point, title, address)
}

// 更新地图位置
const updateMapPosition = (point: Point, title: string, address: string) => {
  mapCenter.lng = point.lng
  mapCenter.lat = point.lat
  markerPosition.lng = point.lng
  markerPosition.lat = point.lat
  currentPlace.title = title
  currentPlace.address = address
  showInfoWindow.value = true
}

// 搜索完成处理
const handleSearchComplete = (results: LocalResult) => {
  console.log(results)
  if (results && results.getNumPois() > 0) {
    const firstResult = results.getPoi(0)
    updateMapPosition(firstResult.point, firstResult.title, firstResult.address)
  }
}

// 地图点击事件
const handleMapClick = (e: { point: Point }) => {
  if (!BMapRef.value) return

  markerPosition.lng = e.point.lng
  markerPosition.lat = e.point.lat

  // 反向地理编码
  const geocoder = new BMapRef.value.Geocoder()
  geocoder.getLocation(e.point, (result: GeocoderResult) => {
    if (result) {
      currentPlace.title = '选择的位置'
      currentPlace.address = result.address
      showInfoWindow.value = true
    }
  })
}

// 标记拖动结束事件
const handleMarkerDragEnd = (e: { point: Point }) => {
  if (!BMapRef.value) return

  markerPosition.lng = e.point.lng
  markerPosition.lat = e.point.lat

  // 反向地理编码
  const geocoder = new BMapRef.value.Geocoder()
  geocoder.getLocation(e.point, (result: GeocoderResult) => {
    if (result) {
      currentPlace.title = '拖动的位置'
      currentPlace.address = result.address
      showInfoWindow.value = true
    }
  })
}

// 清除搜索
const handleClear = () => {
  showInfoWindow.value = false
}

// 关闭信息窗口
const closeInfoWindow = () => {
  showInfoWindow.value = false
}

const handleConfirm = () => {
  if (currentPlace.address)
    Object.assign(mapValue, {
      location: currentPlace.address,
      longitude: ['选择的位置', '拖动的位置'].includes(currentPlace.title)
        ? markerPosition.lng
        : mapCenter.lng,
      latitude: ['选择的位置', '拖动的位置'].includes(currentPlace.title)
        ? markerPosition.lat
        : mapCenter.lat,
    })
  props['onUpdate:modelValue']?.(
    isArray(props.modelValue)
      ? [mapValue.location, mapValue.longitude, mapValue.latitude]
      : mapValue,
  )
  reset()
}

watch(
  () => props.modelValue,
  () => {
    const modelValue = isArray(props.modelValue)
      ? props.modelValue.reduce((acc, key, index) => {
          acc[Object.keys(props.props)[index]] = key
          return acc
        }, {})
      : props.modelValue
    if (JSON.stringify(modelValue) === JSON.stringify(mapValue)) return
    Object.assign(mapValue, modelValue)
  },
)
</script>
<template>
  <div class="dsrz-map">
    <el-input
      v-if="mapValue.location"
      class="dsrz-map-location"
      v-model="mapValue.location"
      placeholder="请输入详细地址"
    />
    <el-input
      v-if="mapValue.longitude"
      class="dsrz-map-input"
      v-model="mapValue.longitude"
      placeholder="请输入经度"
    />
    <el-input
      v-if="mapValue.latitude"
      class="dsrz-map-input"
      v-model="mapValue.latitude"
      placeholder="请输入纬度"
    />
    <CurrencyButton
      class="dsrz-map-button"
      :title="mapValue.location ? '重新选择地址' : '选择地址'"
      type="primary"
      @click="Object.assign(params, { visible: true })"
    />
    <CurrencyDialog
      v-model="params.visible"
      :title="params.title"
      size="large"
      @cancel="reset"
      @confirm="handleConfirm"
    >
      <div class="dsrz-map-dialog">
        <el-autocomplete
          v-model="searchQuery"
          :fetch-suggestions="querySearchAsync"
          placeholder="请输入地点名称"
          @select="handleSelect"
          clearable
          @clear="handleClear"
        >
          <template #default="{ item }">
            <div class="dsrz-map-dialog-item">
              <span class="dsrz-map-dialog-item-title">{{ item.title }}</span>
              <span class="dsrz-map-dialog-item-address">{{
                item.address
              }}</span>
            </div>
          </template>
        </el-autocomplete>

        <baidu-map
          class="dsrz-map-dialog-baidu-map"
          :center="mapCenter"
          :zoom="zoom"
          :scroll-wheel-zoom="true"
          @ready="mapReady"
          @click="handleMapClick"
        >
          <bm-marker
            :position="markerPosition"
            :dragging="true"
            :animation="animation"
            @dragend="handleMarkerDragEnd"
          />

          <bm-info-window
            :position="markerPosition"
            :show="showInfoWindow"
            @close="closeInfoWindow"
          >
            <div class="dsrz-map-dialog-baidu-map-info-window">
              <h4>{{ currentPlace.title }}</h4>
              <p>{{ currentPlace.address }}</p>
            </div>
          </bm-info-window>

          <bm-local-search
            :keyword="searchQuery"
            :auto-viewport="true"
            :panel="false"
            @searchcomplete="handleSearchComplete"
            style="display: none"
          />

          <bm-geolocation
            anchor="BMAP_ANCHOR_BOTTOM_RIGHT"
            :showAddressBar="true"
            :autoLocation="true"
          />
        </baidu-map>
      </div>
    </CurrencyDialog>
  </div>
</template>
<style lang="scss" scoped></style>
