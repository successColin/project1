<template>
  <view class="poster-container">
    <canvas
      canvas-id="myCanvasId"
      class="poster-canvas"
      :style="{ width: `${width}px`, height: `${height}px` }"
    />
  </view>
</template>

<script lang="ts" setup>
import { computed, getCurrentInstance, onMounted, ref, watch } from 'vue';

interface CanvasElement {
  type: 'image' | 'text' | 'textarea';
  index?: number;
  x: number;
  y: number;
  width?: number;
  height?: number;
  path?: string;
  text?: string;
  color?: string;
  size?: number;
  textBaseline?: string;
  lineSpace?: number;
  area?: {
    x: number;
    y: number;
    width: number;
    height: number;
  };
  shape?: string;
  rotate?: number;
  success?: boolean;
}

interface PosterEmits {
  (e: 'onSuccess', url: string): void;
  (e: 'onError', error: any): void;
}

const props = defineProps({
  backgroundColor: {
    type: String,
    default: '#fff',
  },
  list: {
    type: Array as () => CanvasElement[],
    default: () => [],
  },
  width: {
    type: Number,
    default: 300,
  },
  height: {
    type: Number,
    default: 500,
  },
});

const emit = defineEmits<PosterEmits>();

const posterUrl = ref('');
const ctx = ref<UniApp.CanvasContext | null>(null);
const counter = ref(-1);
const drawPathQueue = ref<CanvasElement[]>([]);

const imgCount = computed(
  () => props.list.filter(item => item.type === 'image').length,
);

const successImageCount = computed(
  () =>
    drawPathQueue.value.filter(item => item.type === 'image' && item.success)
      .length,
);

const pageProxy = getCurrentInstance()?.proxy;

// 初始化画布
onMounted(() => {
  ctx.value = uni.createCanvasContext('myCanvasId', pageProxy);
});

// 绘制单行文字
const fillText = (textOptions: CanvasElement) => {
  if (!ctx.value) return;

  ctx.value.setFillStyle(textOptions.color || '#000000');
  ctx.value.setFontSize(textOptions.size || 16);
  ctx.value.setTextBaseline(
    (textOptions.textBaseline as 'top' | 'bottom' | 'middle' | 'normal')
    || 'top',
  );
  ctx.value.fillText(textOptions.text || '', textOptions.x, textOptions.y);
};

// 绘制段落
const fillParagraph = (textOptions: CanvasElement) => {
  if (!ctx.value) return;

  ctx.value.setFontSize(textOptions.size || 16);
  const tempOptions = { ...textOptions };
  tempOptions.lineSpace = tempOptions.lineSpace || 10;

  const str = textOptions.text || '';
  const lineCount = Math.floor(
    (tempOptions.height || props.height + tempOptions.lineSpace)
    / (tempOptions.size! + tempOptions.lineSpace),
  );

  // 文本分割逻辑
  const strArr = str.split('');
  const drawArr: string[] = [];
  let text = '';

  while (strArr.length) {
    const word = strArr.shift()!;
    text += word;
    const textWidth = ctx.value.measureText(text).width;

    if (textWidth > (textOptions.width || props.width)) {
      text = text.substr(0, text.length - 1);
      drawArr.push(text);
      text = '';
      strArr.unshift(word);
    }
    else if (!strArr.length) {
      drawArr.push(text);
    }
  }

  // 处理超出最大行数
  if (drawArr.length > lineCount) {
    drawArr.length = lineCount;
    const pointWidth = ctx.value.measureText('...').width;
    let wordWidth = 0;
    const wordArr = drawArr[drawArr.length - 1].split('');
    let words = '';

    while (pointWidth > wordWidth) {
      words += wordArr.pop();
      wordWidth = ctx.value.measureText(words).width;
    }

    drawArr[drawArr.length - 1] = `${wordArr.join('')}...`;
  }

  // 实际绘制
  const y = tempOptions.y;
  for (let i = 0; i < drawArr.length; i++) {
    tempOptions.y = y + tempOptions.size! * i + tempOptions.lineSpace * i;
    tempOptions.text = drawArr[i];
    fillText(tempOptions);
  }
};

// 绘制图片
const drawImage = (current: CanvasElement) => {
  if (!ctx.value || !current.path) return;

  if (current.area) {
    ctx.value.save();
    ctx.value.beginPath();
    ctx.value.rect(
      current.area.x,
      current.area.y,
      current.area.width,
      current.area.height,
    );
    ctx.value.clip();

    const offsetX = current.x + Number(current.width) / 2;
    const offsetY = current.y + Number(current.height) / 2;
    ctx.value.translate(offsetX, offsetY);

    const degrees = current.rotate ? Number(current.rotate) % 360 : 0;
    ctx.value.rotate((degrees * Math.PI) / 180);
    ctx.value.drawImage(
      current.path,
      current.x - offsetX,
      current.y - offsetY,
      current.width || 0,
      current.height || 0,
    );

    ctx.value.closePath();
    ctx.value.restore();
  }
  else if (current.shape === 'circle') {
    ctx.value.save();
    ctx.value.beginPath();

    const width = current.width! / 2 + current.x;
    const height = current.height! / 2 + current.y;
    const r = current.width! / 2;

    ctx.value.arc(width, height, r, 0, Math.PI * 2);
    ctx.value.clip();

    const offsetX = current.x + Number(current.width) / 2;
    const offsetY = current.y + Number(current.height) / 2;
    ctx.value.translate(offsetX, offsetY);

    const degrees = current.rotate ? Number(current.rotate) % 360 : 0;
    ctx.value.rotate((degrees * Math.PI) / 180);
    ctx.value.drawImage(
      current.path,
      current.x - offsetX,
      current.y - offsetY,
      current.width || 0,
      current.height || 0,
    );

    ctx.value.closePath();
    ctx.value.restore();
  }
  else {
    ctx.value.drawImage(
      current.path,
      current.x,
      current.y,
      current.width || 0,
      current.height || 0,
    );
  }
};

// 监听绘制队列变化
watch(
  () => drawPathQueue.value,
  (newVal) => {
    if (!ctx.value) return;

    // 有图片且未全部加载完成时不绘制
    if (imgCount.value > 0 && successImageCount.value !== imgCount.value) {
      return;
    }

    // 绘制背景
    ctx.value.setFillStyle(props.backgroundColor);
    ctx.value.fillRect(0, 0, props.width, props.height);

    // 所有元素入队则开始绘制
    if (newVal.length === props.list.length) {
      try {
        // 按index排序确保绘制顺序正确
        const sortedItems = [...newVal].sort(
          (a, b) => (a.index || 0) - (b.index || 0),
        );

        sortedItems.forEach((item) => {
          if (item.type === 'text') {
            fillText(item);
            counter.value--;
          }
          else if (item.type === 'textarea') {
            fillParagraph(item);
            counter.value--;
          }
          else if (item.type === 'image') {
            drawImage(item);
            counter.value--;
          }
        });
      }
      catch (err) {
        emit('onError', err);
      }
    }
  },
  { deep: true },
);

// 监听计数器
watch(
  () => counter.value,
  (newVal) => {
    if (newVal === 0 && ctx.value) {
      ctx.value.draw(false, () => {
        console.log('成功了');
        nextTick(() => {
          setTimeout(async () => {
            uni.canvasToTempFilePath(
              {
                canvasId: 'myCanvasId',
                success: (res) => {
                  console.log(res, 111111111);
                  posterUrl.value = res.tempFilePath;
                  emit('onSuccess', res.tempFilePath);
                },
                fail: (err) => {
                  emit('onError', err);
                },
                complete: (v) => {
                  console.log('执行了吗', v);
                },
              },
              pageProxy,
            );
          }, 200);
        });
      });
    }
  },
);

// 生成海报
const generateImg = () => {
  counter.value = props.list.length;
  drawPathQueue.value = [];

  props.list.forEach((item, index) => {
    const current = { ...item, index };

    if (current.type === 'text' || current.type === 'textarea') {
      drawPathQueue.value.push(current);
      return;
    }

    console.log(current.path);

    uni.getImageInfo({
      src: current.path || '',
      success: (res) => {
        current.path = res.path;
        current.success = true;
        drawPathQueue.value.push(current);
      },
      fail: (err) => {
        emit('onError', err);
      },
    });
  });
};
const saveImg = () => {
  uni.canvasToTempFilePath({
    canvasId: 'myCanvas',
    success: (res) => {
      // 在H5平台下，tempFilePath 为 base64
      uni.saveImageToPhotosAlbum({
        filePath: res.tempFilePath,
        success: () => {
          console.log('save success');
        },
      });
    },
  });
};
// 暴露组件方法
defineExpose({
  create: generateImg,
  getPosterUrl: () => posterUrl.value,
  saveImg,
});
</script>

<style scoped>
.poster-container {
  /* position: relative;
  display: flex;
  justify-content: center;
  align-items: center;
  width: 100%;
  height: 100%; */
  position: fixed;
  top: 100rpx;
  left: 750rpx;
}

.poster-canvas {
  /* display: block;
  margin: 0 auto;
  box-shadow: 0 2px 12px rgba(0, 0, 0, 0.1); */
}
</style>
