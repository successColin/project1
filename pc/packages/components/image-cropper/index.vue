<script lang="ts" setup>
import { computed, nextTick, reactive, ref, type PropType } from 'vue'

import {
  createRef,
  isArray,
  isEmpty,
  isFunction,
  isString,
  refs,
  urlToFile,
} from 'dsrz/utils'
import type { UploadRawFile } from 'element-plus'

defineOptions({
  name: 'CurrencyImageCropper',
})

const props = defineProps({
  title: {
    type: String,
    default: '图片裁剪',
  },
  /**
   * 裁剪窗口高度
   */
  windowWidth: {
    type: Number,
    default: 1200,
  },
  /**
   * 裁剪窗口高度
   */
  windowHeight: {
    type: Number,
    default: 600,
  },
  // 默认裁剪宽度
  cropperWidth: {
    type: Number,
    default: 200,
  },
  // 默认裁剪高度
  cropperHeight: {
    type: Number,
    default: 200,
  },
  /**
   * 裁剪框宽高比
   */
  ratio: {
    type: [Array, String] as PropType<number[] | string>,
    default: '',
  },
  /**
   * 是否为原图裁剪
   */
  originalGraph: {
    type: Boolean,
    default: false,
  },
  /**
   * 能否调整裁剪区域位置
   */
  moveAble: {
    type: Boolean,
    default: true,
  },
  /**
   * 能否调整裁剪尺寸
   */
  isSize: {
    type: Boolean,
    default: true,
  },
  /**
   * 是否允许缩放图片
   */
  scaleAble: {
    type: Boolean,
    default: true,
  },
  /**
   * 是否允许裁剪框超出图片
   */
  toolBoxOverflow: {
    type: Boolean,
    default: true,
  },
  /**
   * 裁剪后的图片质量
   */
  quality: {
    type: Number,
    default: 1,
  },
  saveCutPosition: {
    type: Boolean,
    default: false,
  },
  /**
   * 能否拖动图片
   */
  imgMove: {
    type: Boolean,
    default: true,
  },
})

const emit = defineEmits(['confirm'])

const visible = ref(false)

const cropper = reactive<{ uid: number; name: string; type: string }>({
  uid: 0,
  name: '',
  type: '',
})

const drawImg = reactive({
  img: null as HTMLImageElement | null, //规定要使用的图像、画布或视频
  sx: 0, //开始剪切的 x 坐标位置
  sy: 0, //开始剪切的 y 坐标位置
  swidth: 0, //被剪切图像的宽度
  sheight: 0, //被剪切图像的高度
  x: 0, //在画布上放置图像的 x 坐标位置
  y: 0, //在画布上放置图像的 y 坐标位置
  width: 0, //要使用的图像的宽度
  height: 0, //要使用的图像的高度
})

const toolBox = reactive({
  disable: true,
  width: props.windowWidth / 2,
  height: props.windowHeight / 2,
  x: 0,
  y: 0,
  boxMove: { start: { x: 0, y: 0 }, moveTo: { x: 0, y: 0 } },
})

const toolBoxPosition = reactive({ x: 0, y: 0 })

const scaleImg = reactive({ ratio: 0, params: {} })

const rotateImg = reactive({ angle: 0 })

const controlBox = reactive({
  disable: true,
  btnName: '',
  start: { x: 0, y: 0, width: 0, height: 0 },
})

const rotateControl = reactive({
  active: false,
  start: { x: 0, y: 0 },
  position: 100,
})

const dropImg = reactive({
  active: false,
  pageX: 0,
  pageY: 0,
  params: { x: 0, y: 0 },
})

const showToolBoxWidth = computed(() => {
  let result
  if (!props.originalGraph) {
    result = toolBox.width
  } else {
    result = toolBox.width / (drawImg.width / drawImg.swidth)
  }
  console.log(result, toolBox.width)
  return Number(result).toFixed(0)
})

const showToolBoxHeight = computed(() => {
  let result
  if (!props.originalGraph) {
    result = toolBox.height
  } else {
    result = toolBox.height / (drawImg.width / drawImg.swidth)
  }
  return Number(result).toFixed(0)
})

const showToolBoxX = computed(() => Number(toolBoxPosition.x).toFixed(0))

const showToolBoxY = computed(() => Number(toolBoxPosition.y).toFixed(0))

const getRatio = () => {
  const { ratio } = props
  if (isArray(ratio)) {
    return ratio
  } else if (isString(ratio) && !isEmpty(ratio)) {
    return ratio.split(':').map(Number)
  }
}

const open = (image: HTMLImageElement, rawFile: UploadRawFile) => {
  Object.assign(cropper, rawFile)
  const init = (callback?: () => void) => {
    if (refs.toolBox) {
      refs.toolBox.onmousewheel = scaleImgWheel
      refs.toolBox.addEventListener('DOMMouseScroll', scaleImgWheel)
    }
    if (isFunction(callback)) {
      callback()
    }
  }
  visible.value = true
  nextTick(() => init(() => importImgToCanv(image)))
}

const scaleImgWheel = (e: {
  wheelDelta: number
  detail: number
  preventDefault: () => void
}) => {
  if (drawImg.img && props.scaleAble === true) {
    let scale: number = 0
    // e是FF的事件。window.event是chrome/ie/opera的事件
    const event = e || window.event

    if (event.wheelDelta) {
      //IE/Opera/Chrome
      scale = -(event.wheelDelta / 40)
    } else if (event.detail) {
      //Firefox
      scale = event.detail
    }

    const widthLimit = 50
    drawImg.x =
      drawImg.width - scale * 9 > widthLimit ? drawImg.x + scale * 3 : drawImg.x
    drawImg.y =
      drawImg.width - scale * 9 > widthLimit ? drawImg.y + scale * 3 : drawImg.y
    drawImg.width =
      drawImg.width - scale * 9 > widthLimit
        ? drawImg.width - scale * 9
        : widthLimit
    drawImg.height = drawImg.width / scaleImg.ratio

    checkToolBoxOverflow().then(() => {
      printImg()
      const onPrintImgTimmer = setTimeout(() => {
        cropPicture(true)
      }, 100)
      if (onPrintImgTimmer) {
        clearTimeout(onPrintImgTimmer)
      }
    })
  }
  e.preventDefault()
  return false
}

// 判断裁剪框是否超出图片
const checkToolBoxOverflow = () => {
  return new Promise<void>(resolve => {
    if (!props.toolBoxOverflow) {
      // 如果裁剪框不能超出图片 则先判断图片尺寸
      // 如果图片尺寸长宽都超过裁剪框 不做处理
      // 如果图片尺寸小于裁剪框 将图片缩放至合适尺寸
      if (drawImg.width < toolBox.width || drawImg.height < toolBox.height) {
        const p = drawImg.width / drawImg.height
        if (drawImg.width < toolBox.width) {
          drawImg.width = toolBox.width
          drawImg.height = drawImg.width / p
        }
        if (drawImg.height < toolBox.height) {
          drawImg.height = toolBox.height
          drawImg.width = drawImg.height * p
        }
        // 根据图片缩放重新调整位置
        drawImg.x = (props.windowWidth - drawImg.width) / 2
        drawImg.y = (props.windowHeight - drawImg.height) / 2
      }
      // 判断左右边界
      if (drawImg.x > toolBox.x) {
        drawImg.x = toolBox.x
      }
      if (drawImg.x + drawImg.width < toolBox.x + toolBox.width) {
        drawImg.x = toolBox.x + toolBox.width - drawImg.width
      }
      // 判断上下边界
      if (drawImg.y > toolBox.y) {
        drawImg.y = toolBox.y
      }
      if (drawImg.y + drawImg.height < toolBox.y + toolBox.height) {
        drawImg.y = toolBox.y + toolBox.height - drawImg.height
      }
    }
    resolve()
  })
}

// 绘制图片
const printImg = () => {
  if (drawImg.img) {
    const canv = refs.canvas

    const ctx = canv.getContext('2d')

    // 文字水印
    ctx.font = '18px bold 黑体'
    ctx.fillStyle = '#ff0'
    ctx.textAlign = 'center'
    ctx.textBaseline = 'middle'
    ctx.save()
    ctx.clearRect(0, 0, canv.width, canv.height)
    ctx.translate(drawImg.x + drawImg.width / 2, drawImg.y + drawImg.height / 2)
    ctx.rotate((rotateImg.angle * Math.PI) / 180)
    ctx.translate(
      -(drawImg.x + drawImg.width / 2),
      -(drawImg.y + drawImg.height / 2),
    )
    ctx.translate(drawImg.x, drawImg.y)
    ctx.scale(1, 1)

    const onPrintImgTimmer = setTimeout(() => {
      cropPicture(true)
    }, 100)
    try {
      ctx.drawImage(
        drawImg.img,
        drawImg.sx,
        drawImg.sy,
        drawImg.swidth,
        drawImg.sheight,
        0,
        0,
        drawImg.width,
        drawImg.height,
      )
    } catch (err) {
      console.error(err)
      if (onPrintImgTimmer) {
        clearTimeout(onPrintImgTimmer)
      }
      return
    }
    ctx.translate(-drawImg.x, drawImg.y)

    ctx.restore()
    if (onPrintImgTimmer) {
      clearTimeout(onPrintImgTimmer)
    }
  }
}

const cropPicture = (doNotReset: boolean = false) => {
  if (drawImg.img) {
    const canvas = refs.canvas

    const { quality } = props

    const tempImg = new Image()
    tempImg.src = canvas.toDataURL(cropper.type, quality)

    if (!HTMLCanvasElement.prototype.toBlob) {
      Object.defineProperty(HTMLCanvasElement.prototype, 'toBlob', {
        value: (
          callback: (blob: Blob) => void,
          type: string,
          quality: number,
        ) => {
          setTimeout(() => {
            const binStr = atob(canvas.toDataURL(type, quality).split(',')[1])

            const len = binStr.length,
              arr = new Uint8Array(len)

            let NewBlob

            for (let i = 0; i < len; i++) {
              arr[i] = binStr.charCodeAt(i)
            }
            try {
              NewBlob = new Blob([arr], {
                type: cropper.type,
              })
            } catch (e) {
              console.log('e', e)
              // if (e.name == 'TypeError') {

              //   const bb = new window.BlobBuilder()

              //   bb.append(arr.buffer)
              //   NewBlob = bb.getBlob(cropper.type)
              // }
              // if (e.name == 'InvalidStateError') {
              //   NewBlob = new Blob([arr.buffer], {
              //     type: cropper.type,
              //   })
              // }
            }
            callback(NewBlob!)
          }, 200)
        },
      })
    }
    canvas.toBlob(
      (blob: Blob) => {
        if (blob) {
          const reader = new FileReader()
          reader.readAsDataURL(blob)
          reader.onload = () => {
            const timmer = setInterval(() => {
              if (reader.readyState == 2) {
                clearInterval(timmer)
                const newCanv = document.createElement('canvas')

                const ctx = newCanv.getContext('2d')

                // 原图裁剪 originalGraph
                if (props.originalGraph === true) {
                  const scale = drawImg.width / drawImg.swidth

                  // 计算实际图像大小
                  const transWidth = toolBox.width / scale

                  const transHeight = toolBox.height / scale

                  newCanv.width = transWidth
                  newCanv.height = transHeight
                  // 重新计算裁剪坐标
                  const sx = (toolBox.x - drawImg.x) / scale

                  const sy = (toolBox.y - drawImg.y) / scale

                  const swidth = drawImg.swidth

                  const sheight = drawImg.sheight

                  ctx!.translate(-sx, -sy)
                  ctx!.drawImage(drawImg.img!, 0, 0, swidth, sheight)
                } else {
                  newCanv.width = toolBox.width
                  newCanv.height = toolBox.height
                  const params = toolBox

                  const ratio = getRatio()
                  console.log('ratio3', ratio)

                  if (ratio) {
                    const p = ratio[0] / ratio[1]

                    const m = ratio[0]

                    const n = ratio[1]

                    console.log('m', m, 'n', n, p, params)

                    if (m >= n) {
                      console.log(params.width * p)
                      ctx!.drawImage(
                        tempImg,
                        params.x,
                        params.y,
                        params.width,
                        params.width * p,
                        0,
                        0,
                        params.width,
                        params.width * p,
                      )
                    } else {
                      console.log(params.width / p)
                      ctx!.drawImage(
                        tempImg,
                        params.x,
                        params.y,
                        params.width,
                        params.width / p,
                        0,
                        0,
                        params.width,
                        params.width / p,
                      )
                    }
                  } else {
                    ctx!.drawImage(
                      tempImg,
                      params.x,
                      params.y,
                      params.width,
                      params.height,
                      0,
                      0,
                      params.width,
                      params.height,
                    )
                  }
                }
                newCanv.toBlob(
                  () => {
                    if (!doNotReset) {
                      emit(
                        'confirm',
                        urlToFile(
                          newCanv.toDataURL(cropper.type, quality),
                          cropper.name,
                        ),
                      )
                    }
                  },
                  cropper.type,
                  quality,
                )
              }
            }, 200)
          }
        } else {
          // IE9及以下
          const newCanv = document.createElement('canvas')

          newCanv.width = toolBox.width
          newCanv.height = toolBox.height
          const ctx = newCanv.getContext('2d')

          const params = toolBox
          const ratio = getRatio()
          console.log('ratio4', ratio)

          if (ratio) {
            const p = ratio[0] / ratio[1]

            ctx!.drawImage(
              tempImg,
              params.x,
              params.y,
              params.width,
              params.width * p,
              0,
              0,
              params.width,
              params.width * p,
            )
          } else {
            ctx!.drawImage(
              tempImg,
              params.x,
              params.y,
              params.width,
              params.height,
              0,
              0,
              params.width,
              params.height,
            )
          }
          if (!doNotReset) {
            emit(
              'confirm',
              urlToFile(newCanv.toDataURL(cropper.type, quality), cropper.name),
            )
          }
        }
      },
      cropper.type,
      quality,
    )
  }
}

const putToolBox = () => {
  const {
    windowWidth,
    windowHeight,
    saveCutPosition,
    cropperWidth,
    cropperHeight,
  } = props
  if (
    toolBox.width === windowWidth / 2 ||
    toolBox.height === windowHeight / 2 ||
    saveCutPosition === false
  ) {
    toolBox.width = cropperWidth > windowWidth ? windowWidth : cropperWidth
    toolBox.height = cropperHeight > windowHeight ? windowHeight : cropperHeight
  }
  if ((toolBox.x === 0 && toolBox.y === 0) || saveCutPosition === false) {
    toolBox.x = windowWidth / 2 - toolBox.width / 2
    toolBox.y = windowHeight / 2 - toolBox.height / 2
  }
  checkToolBoxOverflow().then(() => {
    printImg()
  })

  drawControlBox(toolBox.width, toolBox.height, toolBox.x, toolBox.y)
}

const drawControlBox = (
  width: number,
  height: number,
  x: number,
  y: number,
) => {
  const { toolBoxOverflow, windowWidth, windowHeight } = props
  // 裁剪框是否能够超出图片
  if (!toolBoxOverflow) {
    // 如果不允许超出图片范围 则也不允许反选
    if (width < 1) {
      width = 1
    }
    if (height < 1) {
      height = 1
    }
    if (width > drawImg.width) {
      width = drawImg.width
    }
    if (height > drawImg.height) {
      height = drawImg.height
    }
    if (x < drawImg.x) {
      x = drawImg.x
    }
    if (y < drawImg.y) {
      y = drawImg.y
    }

    if (x > drawImg.x + drawImg.width - width) {
      x = drawImg.x + drawImg.width - width
    }
    if (y > drawImg.y + drawImg.height - height) {
      y = drawImg.y + drawImg.height - height
    }
  }
  // 阻止超出裁剪控件边界
  if (width > windowWidth) {
    width = windowWidth
  }
  if (height > windowHeight) {
    height = windowHeight
  }
  if (x < 0) {
    x = 0
  }
  if (y < 0) {
    y = 0
  }
  const $toolBoxControl = refs.toolBoxControl

  const c = refs.canvasSelectBox

  const ctx = c.getContext('2d')

  ctx.fillStyle = 'rgba(0,0,0,0.6)'
  ctx.clearRect(0, 0, c.width, c.height)
  ctx.fillRect(0, 0, c.width, c.height)

  let toolBoxControlWidth, toolBoxControlHeight

  const ratio = getRatio()
  console.log('ratio1', ratio)

  if (ratio) {
    const p = ratio[0] / ratio[1]

    if (p >= 1) {
      toolBoxControlWidth = width
      toolBoxControlHeight = width / p
      if (toolBoxControlHeight + y > drawImg.y + drawImg.height) {
        toolBoxControlHeight = drawImg.y + drawImg.height - y
        toolBoxControlWidth = toolBoxControlHeight * p
      }
    } else {
      toolBoxControlWidth = height * p
      toolBoxControlHeight = height
    }
  } else {
    toolBoxControlWidth = width
    toolBoxControlHeight = height
  }
  toolBox.width = Math.abs(toolBoxControlWidth)
  toolBox.height = Math.abs(toolBoxControlHeight)

  $toolBoxControl.style.width = Math.abs(toolBoxControlWidth) + 'px'
  $toolBoxControl.style.height = Math.abs(toolBoxControlHeight) + 'px'

  toolBox.boxMove.moveTo.x = x
  toolBox.boxMove.moveTo.y = y
  if (toolBoxControlWidth < 0) {
    x = x + toolBoxControlWidth
  }
  if (toolBoxControlHeight < 0) {
    y = y + toolBoxControlHeight
  }

  if (x + toolBox.width > windowWidth) {
    x = windowWidth - toolBox.width
  }
  if (x < 0) {
    x = 0
  }
  if (y + toolBox.height > windowHeight) {
    y = windowHeight - toolBox.height
  }
  if (y < 0) {
    y = 0
  }

  toolBoxPosition.x = x
  toolBoxPosition.y = y

  $toolBoxControl.style.left = x + 'px'
  $toolBoxControl.style.top = y + 'px'

  ctx.clearRect(
    x,
    y,
    Math.abs(toolBoxControlWidth),
    Math.abs(toolBoxControlHeight),
  )
  const onPrintImgTimmer = setTimeout(() => {
    cropPicture(true)
  }, 100)
  if (onPrintImgTimmer) {
    clearTimeout(onPrintImgTimmer)
  }
}

const importImgToCanv = (image: HTMLImageElement) => {
  const imgHeight = image.height

  const imgWidth = image.width

  const { windowWidth, windowHeight } = props

  let ratio

  drawImg.img = image
  scaleImg.ratio = imgWidth / imgHeight // 缩放时用到此参数
  if (imgHeight < windowHeight && imgWidth < windowWidth) {
    ratio = 1
    drawImg.x = (windowWidth - imgWidth) / 2
    drawImg.y = (windowHeight - imgHeight) / 2
  } else {
    if (imgWidth / imgHeight <= windowWidth / windowHeight) {
      // 计算宽高比
      ratio = windowHeight / imgHeight
      drawImg.x = (windowWidth - imgWidth * ratio) / 2
    } else {
      ratio = windowWidth / imgWidth
      drawImg.y = (windowHeight - imgHeight * ratio) / 2
    }
  }
  drawImg.swidth = imgWidth
  drawImg.sheight = imgHeight
  drawImg.width = imgWidth * ratio
  drawImg.height = imgHeight * ratio
  drawImg.x = (windowWidth - drawImg.width) / 2
  drawImg.y = (windowHeight - drawImg.height) / 2
  Object.assign(drawImg, drawImg)
  printImg()
  putToolBox()
}

const controlBtnMouseMove = (e: MouseEvent) => {
  if (controlBox.disable === false) {
    const offsetX = e.clientX - controlBox.start.x
    const offsetY = e.clientY - controlBox.start.y

    let x, y

    const ratio = getRatio()
    console.log('ratio2', ratio)
    if (controlBox.btnName == 'leftUp') {
      if (!ratio) {
        x = toolBox.x + offsetX
        y = toolBox.y + offsetY
      } else {
        const p = ratio[0] / ratio[1]

        if (p >= 1) {
          x = toolBox.x + offsetX
          y = toolBox.y + offsetX / p
        } else {
          x = toolBox.x + offsetY * p
          y = toolBox.y + offsetY
        }
      }
      toolBox.width = controlBox.start.width - offsetX
      toolBox.height = controlBox.start.height - offsetY
    }
    if (controlBox.btnName == 'rightUp') {
      if (!ratio) {
        x = toolBox.x
        y = toolBox.y + offsetY
      } else {
        const p = ratio[0] / ratio[1]

        if (p >= 1) {
          x = toolBox.x
          y = toolBox.y - offsetX / p
        } else {
          x = toolBox.x
          y = toolBox.y + offsetY
        }
      }
      toolBox.width = controlBox.start.width + offsetX
      toolBox.height = controlBox.start.height - offsetY
    }
    if (controlBox.btnName == 'rightDown') {
      x = toolBox.x
      y = toolBox.y
      toolBox.width = controlBox.start.width + offsetX
      toolBox.height = controlBox.start.height + offsetY
    }
    if (controlBox.btnName == 'leftDown') {
      if (!ratio) {
        x = toolBox.x + offsetX
        y = toolBox.y
      } else {
        const p = ratio[0] / ratio[1]

        if (p >= 1) {
          x = toolBox.x + offsetX
          y = toolBox.y
        } else {
          x = toolBox.x + -offsetY * p
          y = toolBox.y
        }
      }
      toolBox.width = controlBox.start.width - offsetX
      toolBox.height = controlBox.start.height + offsetY
    }
    if (controlBox.btnName == 'topCenter') {
      x = toolBox.x
      y = toolBox.y + offsetY
      toolBox.width = controlBox.start.width
      toolBox.height = controlBox.start.height - offsetY
    }
    if (controlBox.btnName == 'downCenter') {
      x = toolBox.x
      y = toolBox.y
      toolBox.width = controlBox.start.width
      toolBox.height = controlBox.start.height + offsetY
    }
    if (controlBox.btnName == 'leftCenter') {
      x = toolBox.x + offsetX
      y = toolBox.y
      toolBox.width = controlBox.start.width - offsetX
      toolBox.height = controlBox.start.height
    }
    if (controlBox.btnName == 'rightCenter') {
      x = toolBox.x
      y = toolBox.y
      toolBox.width = controlBox.start.width + offsetX
      toolBox.height = controlBox.start.height
    }
    drawControlBox(toolBox.width, toolBox.height, x!, y!)
  }
  // 旋转
  if (rotateControl.active) {
    scrollBarControlMove(e)
  }
  e.stopPropagation()
}

const scrollBarControlMove = (e: MouseEvent) => {
  if (rotateControl.active) {
    const offsetX = e.pageX - rotateControl.start.x

    let position = rotateControl.position + offsetX

    if (position <= 0) {
      position = 0
    }
    if (position >= 200) {
      position = 200
    }
    rotateControl.position = position
    rotateImg.angle = ((position - 100) / 100) * 180
    printImg()
  }
}

const controlBtnMouseUp = (e: MouseEvent) => {
  controlBox.disable = true
  dropImgOff()
  resetToolBox()
  toolBoxMouseUp()
  scrollBarControlOff()
  e.stopPropagation()
}

const resetToolBox = () => {
  if (toolBox.width < 0) {
    toolBox.boxMove.moveTo.x = toolBox.x - toolBox.width
  }
  if (toolBox.height < 0) {
    toolBox.boxMove.moveTo.y = toolBox.y - toolBox.height
  }
  toolBox.width = Math.abs(toolBox.width)
  toolBox.height = Math.abs(toolBox.height)
}

const scrollBarControlOff = () => {
  rotateControl.active = false
}

const dropImgMove = (e: MouseEvent) => {
  if (dropImg.active && drawImg.img) {
    drawImg.x = dropImg.params.x - (dropImg.pageX - e.pageX)
    drawImg.y = dropImg.params.y - (dropImg.pageY - e.pageY)
    // 裁剪框是否能够超出图片
    if (!props.toolBoxOverflow) {
      if (drawImg.x > toolBox.x) {
        drawImg.x = toolBox.x
      }
      if (drawImg.x < toolBox.x + toolBox.width - drawImg.width) {
        drawImg.x = toolBox.x + toolBox.width - drawImg.width
      }

      if (drawImg.y > toolBox.y) {
        drawImg.y = toolBox.y
      }
      if (drawImg.y < toolBox.y + toolBox.height - drawImg.height) {
        drawImg.y = toolBox.y + toolBox.height - drawImg.height
      }
    }
    printImg()
    e.stopPropagation()
  }
}

const dropImgOn = (e: MouseEvent) => {
  if (props.imgMove === true) {
    dropImg.active = true
    dropImg.params = { ...drawImg }
    dropImg.pageX = e.pageX
    dropImg.pageY = e.pageY
  }
}

const dropImgOff = () => {
  dropImg.active = false
  const onPrintImgTimmer = setTimeout(() => {
    cropPicture(true)
  }, 100)
  if (onPrintImgTimmer) {
    clearTimeout(onPrintImgTimmer)
  }
}

const toolBoxMouseDown = (e: MouseEvent) => {
  const $toolBox = refs.toolBoxControl

  toolBox.x = parseInt($toolBox.style.left.split('px')[0])

  toolBox.y = parseInt($toolBox.style.top.split('px')[0])

  toolBox.disable = false
  dropImg.active = false
  toolBox.boxMove.start = {
    x: e.pageX,
    y: e.pageY,
  }
}

const toolBoxMouseUp = () => {
  toolBox.x = parseInt(toolBoxPosition.x.toString())
  toolBox.y = parseInt(toolBoxPosition.y.toString())
  toolBox.disable = true
  dropImg.active = false
  resetToolBox()
}

const toolBoxMouseMove = (e: MouseEvent) => {
  if (dropImg.active) {
    dropImgMove(e)
  }
  if (toolBox.disable === false && props.moveAble === true) {
    const offsetX = e.pageX - toolBox.boxMove.start.x
    const offsetY = e.pageY - toolBox.boxMove.start.y
    const x = toolBox.x + offsetX
    const y = toolBox.y + offsetY
    drawControlBox(toolBox.width, toolBox.height, x, y)
  }
}

const toolBoxMouseLeave = () => {
  toolBox.disable = true
  const onPrintImgTimmer = setTimeout(() => {
    cropPicture(true)
  }, 100)
  if (onPrintImgTimmer) {
    clearTimeout(onPrintImgTimmer)
  }
  resetToolBox()
}

const controlBtnMouseDown = (e: MouseEvent, btnName: string) => {
  controlBox.disable = false
  controlBox.btnName = btnName
  controlBox.start.x = e.clientX
  controlBox.start.y = e.clientY
  controlBox.start.width = toolBox.width
  controlBox.start.height = toolBox.height
  e.stopPropagation()
}

const handleCancel = () => {
  visible.value = false
}

const handleConfirm = () => {
  cropPicture(false)
  visible.value = false
}

defineExpose({ open })
</script>
<template>
  <CurrencyDialog
    class="dsrz-image-cropper"
    v-model="visible"
    :title="title"
    size="large"
    @cancel="handleCancel"
    @confirm="handleConfirm"
  >
    <transition
      name="fade"
      enter-class="fade-in-enter"
      enter-active-class="fade-in-active"
      leave-class="fade-out-enter"
      leave-active-class="fade-out-active"
    >
      <div v-if="visible" :ref="(e: any) => createRef(e, 'dialogMainModalRef')">
        <div
          :ref="(e: any) => createRef(e, 'toolBox')"
          :style="'height:' + windowHeight + 'px;width:' + windowWidth + 'px'"
          @mousemove="controlBtnMouseMove"
          @mouseup="controlBtnMouseUp"
          @mouseleave="controlBtnMouseUp"
          class="toolBox"
        >
          <!--裁剪区域-->
          <div
            v-show="drawImg.img != null"
            :ref="(e: any) => createRef(e, 'toolBoxControl')"
            @mousedown="toolBoxMouseDown"
            @mouseup="toolBoxMouseUp"
            @mousemove="toolBoxMouseMove"
            @mouseleave="toolBoxMouseLeave"
            class="toolBoxControl"
            :style="{
              pointerEvents: moveAble ? 'auto' : 'none',
            }"
          >
            <div class="toolBoxControlBox">
              <div class="controlBox">
                <!--蚂蚁线-->
                <div class="controlBoxInnerLine controlBoxInnerLineTop" />
                <div class="controlBoxInnerLine controlBoxInnerLineBottom" />
                <div class="controlBoxInnerLine controlBoxInnerLineLeft" />
                <div class="controlBoxInnerLine controlBoxInnerLineRight" />
                <!--工具栏提示-->
                <div class="selectArea">
                  宽:{{ showToolBoxWidth }} 高:{{ showToolBoxHeight }} (x:{{
                    showToolBoxX
                  }},y:{{ showToolBoxY }})
                </div>
                <!--操作杆-->
                <div
                  v-if="isSize === true"
                  class="leftUp controlBtn"
                  data-name="leftUp"
                  @mousedown="controlBtnMouseDown($event, 'leftUp')"
                />
                <div
                  v-if="isSize === true"
                  class="leftDown controlBtn"
                  data-name="leftDown"
                  @mousedown="controlBtnMouseDown($event, 'leftDown')"
                />
                <div
                  v-if="isSize === true"
                  class="rightUp controlBtn"
                  data-name="rightUp"
                  @mousedown="controlBtnMouseDown($event, 'rightUp')"
                />
                <div
                  v-if="isSize === true"
                  class="rightDown controlBtn"
                  data-name="rightDown"
                  @mousedown="controlBtnMouseDown($event, 'rightDown')"
                />
                <div
                  v-if="isSize === true && !ratio && toolBox.width > 20"
                  class="topCenter controlBtn"
                  data-name="topCenter"
                  @mousedown="controlBtnMouseDown($event, 'topCenter')"
                />
                <div
                  v-if="isSize === true && !ratio && toolBox.width > 20"
                  class="downCenter controlBtn"
                  data-name="downCenter"
                  @mousedown="controlBtnMouseDown($event, 'downCenter')"
                />
                <div
                  v-if="isSize === true && !ratio && toolBox.height > 20"
                  class="leftCenter controlBtn"
                  data-name="leftCenter"
                  @mousedown="controlBtnMouseDown($event, 'leftCenter')"
                />
                <div
                  v-if="isSize === true && !ratio && toolBox.height > 20"
                  class="rightCenter controlBtn"
                  data-name="rightCenter"
                  @mousedown="controlBtnMouseDown($event, 'rightCenter')"
                />
              </div>
              <div class="toolBoxControlLine toolBoxControlLineItem-1" />
              <div class="toolBoxControlLine toolBoxControlLineItem-2" />
              <div class="toolBoxControlLine toolBoxControlLineItem-3" />
              <div class="toolBoxControlLine toolBoxControlLineItem-4" />
            </div>
          </div>
          <!--画布-->
          <canvas
            class="canvasSelectBox"
            :ref="e => createRef(e, 'canvasSelectBox')"
            :width="windowWidth"
            :height="windowHeight"
            @mousedown="dropImgOn"
            @mouseup="dropImgOff"
            @mousemove="dropImgMove"
          />
          <canvas
            class="canvas"
            :ref="e => createRef(e, 'canvas')"
            :width="windowWidth"
            :height="windowHeight"
          />
        </div>
      </div>
    </transition>
  </CurrencyDialog>
</template>
<style lang="scss" scoped>
.vue-img-cutter {
  font-size: 12px;
  line-height: 130%;
}

.fl {
  float: left;
}

.fr {
  float: right;
}

.i-dialog-footer {
  display: block;
  width: 100%;
  margin-top: 15px;
  margin-bottom: 15px;
  text-align: left;
}

.mask {
  position: fixed;
  overflow-y: scroll;
  overflow-x: hidden;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  z-index: 999;
}

.dialogBoxModal {
  position: relative;
  padding-top: 100px;
  padding-bottom: 100px;
  clear: both;
}

.dialogMainModal {
  line-height: 125%;
  font-size: 16px;
  position: absolute;
  top: 100px;
  left: 50%;
  margin-bottom: 100px;
  transform: translateX(-50%);
  border: 1px solid rgba(0, 0, 0, 0.8);
  border-radius: 3px;
  box-sizing: border-box;
  padding: 15px 15px 0 15px;
  background: #fff;
  z-index: 1000;
  -webkit-touch-callout: none;
  /* iOS Safari */
  -webkit-user-select: none;
  /* Chrome/Safari/Opera */
  -khtml-user-select: none;
  /* Konqueror */
  -moz-user-select: none;
  /* Firefox */
  -ms-user-select: none;
  /* Internet Explorer/Edge */
  user-select: none;
  /* Non-prefixed version, currently*/
  animation: dialogShow 0.3s;
}

.dialogMain {
  line-height: 125%;
  font-size: 16px;
  box-sizing: border-box;
  background: #fff;
  z-index: 1000;
  -webkit-touch-callout: none;
  /* iOS Safari */
  -webkit-user-select: none;
  /* Chrome/Safari/Opera */
  -khtml-user-select: none;
  /* Konqueror */
  -moz-user-select: none;
  /* Firefox */
  -ms-user-select: none;
  /* Internet Explorer/Edge */
  user-select: none;
  /* Non-prefixed version, currently*/
}

@keyframes dialogShow {
  from {
    margin-top: -50px;
    opacity: 0;
  }

  to {
    margin-top: 0;
    opacity: 1;
  }
}

.toolMain {
  box-sizing: border-box;
}

.toolBox {
  background-image:
    linear-gradient(
      45deg,
      rgba(0, 0, 0, 0.25) 25%,
      transparent 0,
      transparent 75%,
      rgba(0, 0, 0, 0.25) 0
    ),
    linear-gradient(
      45deg,
      rgba(0, 0, 0, 0.25) 25%,
      transparent 0,
      transparent 75%,
      rgba(0, 0, 0, 0.25) 0
    );
  background-color: #eee;
  background-size: 30px 30px;
  background-position:
    0 0,
    15px 15px;
  position: relative;
}

.canvas {
  position: absolute;
  top: 0;
  left: 0;
  z-index: 98;
}

.canvasSelectBox {
  position: absolute;
  top: 0;
  left: 0;
  z-index: 99;
}

@keyframes zi-antBorder {
  0% {
    background-position: 0px 0px;
  }

  50% {
    background-position: 0px 5px;
  }

  100% {
    background-position: 0px 10px;
  }
}

.toolBoxControl {
  background: rgba(255, 255, 255, 0);
  /*background:#fff;*/
  position: absolute;
  z-index: 101;
  box-sizing: border-box;
  /*border: 1px dotted #409EFF;*/
}

.toolBoxControlBox {
  width: 100%;
  height: 100%;
  position: relative;
  background: transparent;
  z-index: 103;
  pointer-events: none;
}

.controlBoxInnerLine {
  position: absolute;
  z-index: 1;
  background-size: 10px 10px;
  background-image: linear-gradient(
    -45deg,
    rgba(64, 158, 255, 1) 25%,
    rgba(64, 158, 255, 0) 25%,
    rgba(64, 158, 255, 0) 50%,
    rgba(64, 158, 255, 1) 50%,
    rgba(64, 158, 255, 1) 75%,
    rgba(64, 158, 255, 0) 75%,
    rgba(64, 158, 255, 0)
  );
  -ms-animation: zi-antBorder 0.8s linear 0s infinite normal;
  -moz-animation: zi-antBorder 0.8s linear 0s infinite normal;
  -webkit-animation: zi-antBorder 0.8s linear 0s infinite normal;
  animation: zi-antBorder 0.8s linear 0s infinite normal;
  pointer-events: none;
}

.controlBoxInnerLineTop {
  height: 1px;
  width: 100%;
  top: -1px;
}

.controlBoxInnerLineBottom {
  height: 1px;
  width: 100%;
  bottom: -1px;
}

.controlBoxInnerLineLeft {
  height: 100%;
  width: 1px;
  left: -1px;
  top: 0;
}

.controlBoxInnerLineRight {
  height: 100%;
  width: 1px;
  right: -1px;
  top: 0;
}

.toolBoxControlLine {
  position: absolute;
  z-index: 1;
  background: transparent;
}

.toolBoxControlLineItem-1 {
  top: 33%;
  width: 100%;
  height: 1px;
  box-sizing: border-box;
  border-bottom: 1px dashed #409eff;
}

.toolBoxControlLineItem-2 {
  top: 66%;
  width: 100%;
  height: 1px;
  box-sizing: border-box;
  border-bottom: 1px dashed #409eff;
}

.toolBoxControlLineItem-3 {
  left: 33%;
  border-right: 1px dashed #409eff;
  height: 100%;
  width: 1px;
  box-sizing: border-box;
}

.toolBoxControlLineItem-4 {
  left: 66%;
  border-right: 1px dashed #409eff;
  height: 100%;
  width: 1px;
  box-sizing: border-box;
}

.controlBox {
  width: 100%;
  height: 100%;
  position: absolute;
  cursor: move;
  z-index: 1;
  pointer-events: none;
}

.controlBtn {
  border: 1px solid rgba(255, 255, 255, 0.5);
  box-sizing: border-box;
  width: 6px;
  height: 6px;
  background: #409eff;
  position: absolute;
  border-radius: 50%;
  z-index: 999;
  pointer-events: auto !important;
}

.leftUp {
  top: 0;
  left: 0;
  margin-left: -3px;
  margin-top: -3px;
  cursor: se-resize;
}

.leftDown {
  bottom: 0;
  left: 0;
  margin-left: -3px;
  margin-bottom: -3px;
  cursor: sw-resize;
}

.rightUp {
  top: 0;
  right: 0;
  margin-right: -3px;
  margin-top: -3px;
  cursor: sw-resize;
}

.rightDown {
  bottom: 0;
  right: 0;
  margin-right: -3px;
  margin-bottom: -3px;
  cursor: se-resize;
}

.topCenter {
  top: 0;
  right: 50%;
  margin-right: -3px;
  margin-top: -3px;
  cursor: s-resize;
}

.downCenter {
  bottom: 0;
  right: 50%;
  margin-right: -3px;
  margin-bottom: -3px;
  cursor: s-resize;
}

.leftCenter {
  top: 50%;
  left: 0;
  margin-left: -3px;
  margin-top: -3px;
  cursor: e-resize;
}

.rightCenter {
  top: 50%;
  right: 0;
  margin-right: -3px;
  margin-top: -3px;
  cursor: e-resize;
}

.toolBar {
  margin-top: 10px;
}

.selectArea {
  display: block;
  width: 260px;
  text-align: right;
  color: #fff;
  position: absolute;
  top: -20px;
  right: 0;
  font-size: 10px;
  user-select: none;
}

.tips {
  position: absolute;
  top: 50%;
  left: 50%;
  color: red;
  z-index: 101;
  transform: translate(-50%, -50%);
}

.btn {
  display: inline-block;
  text-align: center;
  background: #dedede;
  height: 40px;
  line-height: 40px;
  padding: 0 20px;
  box-sizing: border-box;
  border-radius: 4px;
  cursor: pointer;
  border: 1px solid;
  font-size: 14px;
  transition:
    background 0.3s,
    color 0.3s;
  -webkit-touch-callout: none;
  /* iOS Safari */
  -webkit-user-select: none;
  /* Chrome/Safari/Opera */
  -khtml-user-select: none;
  /* Konqueror */
  -moz-user-select: none;
  /* Firefox */
  -ms-user-select: none;
  /* Internet Explorer/Edge */
  user-select: none;
  /* Non-prefixed version, currently*/
}

.btn[disabled] {
  opacity: 0.6;
  color: #333;
  border-color: #dedede !important;
  background-color: #fff !important;
  cursor: default;
}

.btn[disabled]:hover {
  opacity: 0.6;
  color: #333 !important;
  border-color: #dedede !important;
  background-color: #fff !important;
}

.btn-default {
  color: #333;
  border-color: #dcdfe6;
  background-color: #fff;
  transition:
    background 0.3s,
    color 0.3s;
}

.btn-default:hover {
  color: #409eff;
  border-color: #c6e2ff;
  background-color: #ecf5ff;
}

.btn-primary {
  color: #fff;
  background-color: #409eff;
  border-color: #409eff;
  transition:
    background 0.3s,
    color 0.3s;
}

.btn-primary:hover {
  background: #66b1ff;
  border-color: #66b1ff;
  color: #fff;
}

.btn-warning {
  color: #fff;
  background-color: #e6a23c;
  border-color: #e6a23c;
}

.btn-warning:hover {
  color: #fff;
  background-color: #eeba6c;
  border-color: #e6a23c;
  transition:
    background 0.3s,
    color 0.3s;
}

.btn-primary-plain {
  color: #409eff;
  border-color: #c6e2ff;
  background-color: #ecf5ff;
  transition:
    background 0.3s,
    color 0.3s;
}

.btn-primary-plain:hover {
  background: #66b1ff;
  border-color: #66b1ff;
  color: #fff;
}

.btn-xs {
  height: 26px;
  line-height: 26px;
  padding: 0 10px;
  font-size: 12px;
}

.dialog-footer {
  float: right;
}

.fade-enter-active,
.fade-leave-active {
  transition: opacity 0.3s;
}

.fade-enter,
.fade-leave-to {
  opacity: 0;
}

.fade-in-enter {
  margin-top: -50px;
  opacity: 0;
  transition:
    margin-top 0.2s,
    opacity 0.2s;
}

.fade-out-enter {
  transition:
    margin-top 0.2s,
    opacity 0.2s;
}

.fade-in-active {
  transition:
    margin-top 0.2s,
    opacity 0.2s;
}

.fade-out-active {
  margin-top: -50px;
  opacity: 0;
  transition:
    margin-top 0.2s,
    opacity 0.2s;
}

.file-input {
  height: 40px;
  line-height: 40px;
  padding: 0 10px;
  box-sizing: border-box;
  border-radius: 4px;
  border: 1px solid #dedede;
}

.file-input::placeholder {
  color: #c0c4cc;
}

.toolbar-item {
  display: inline-block;
}

.closeIcon {
  float: right;
  cursor: pointer;
  display: block;
  background: #c6e2ff;
  color: #fff;
  width: 18px;
  height: 18px;
  line-height: 18px;
  text-align: center;
  border-radius: 50%;
  margin: 0;
  padding: 0;
  transition:
    transform 0.3s,
    background 0.3s;
  /*transform: rotate(90deg);*/
}

.closeIcon:hover {
  background: #409eff;
  transform: rotate(180deg);
}

.copyright {
  font-size: 10px !important;
  clear: both !important;
  width: 100% !important;
  text-align: right !important;
  display: block !important;
  opacity: 0.5 !important;
  position: absolute !important;
  bottom: 0 !important;
  right: 0 !important;
  line-height: 100% !important;
  z-index: 100 !important;
}

.copyright a {
  color: #fff !important;
  text-decoration: none !important;
  position: relative !important;
  opacity: 1 !important;
  display: inline-block !important;
  padding: 2px !important;
  background: rgba(0, 0, 0, 0.4);
}

/*工具栏*/
.dockMain {
  position: absolute;
  z-index: 1002;
  bottom: 5px;
  left: 5px;
  /*transform: translateX(-50%);*/
  opacity: 0.5;
  transition: opacity 0.5s;
  /*width: 98%;*/
  box-sizing: border-box;
  padding: 5px 5px;
  border-radius: 5px;
}

.dockMain:hover {
  opacity: 1;
}

.dockBtn {
  font-size: 10px;
  cursor: pointer;
  display: inline-block;
  margin-right: 4px;
  color: #409eff;
  border: 1px solid #c6e2ff;
  background-color: #ecf5ff;
  padding: 1px 4px;
  border-radius: 3px;
  height: 20px;
  line-height: 16px;
  transition:
    background 0.2s,
    color 0.2s;
  -webkit-touch-callout: none;
  /* iOS Safari */
  -webkit-user-select: none;
  /* Chrome/Safari/Opera */
  -khtml-user-select: none;
  /* Konqueror */
  -moz-user-select: none;
  /* Firefox */
  -ms-user-select: none;
  /* Internet Explorer/Edge */
  user-select: none;
  /* Non-prefixed version, currently*/
}

.dockBtn:hover {
  color: #fff;
  background-color: #409eff;
  border-color: #409eff;
}

/* 旋转进度条 */
.dockBtnScrollBar {
  display: inline-block;
  margin-right: 4px;
  margin-left: 10px;
  background: #409eff;
  width: 200px;
  height: 10px;
  border-radius: 5px;
  position: relative;
  -webkit-touch-callout: none;
  /* iOS Safari */
  -webkit-user-select: none;
  /* Chrome/Safari/Opera */
  -khtml-user-select: none;
  /* Konqueror */
  -moz-user-select: none;
  /* Firefox */
  -ms-user-select: none;
  /* Internet Explorer/Edge */
  user-select: none;
  /* Non-prefixed version, currently*/
}

.scrollBarControl {
  position: absolute;
  cursor: pointer;
  background: #fff;
  border: 2px solid #409eff;
  box-sizing: border-box;
  border-radius: 50%;
  width: 20px;
  height: 20px;
  top: 50%;
  transform: translate(-50%, -50%);
  box-shadow: 0 0 3px #1f5184;
}

.scrollBarText {
  position: absolute;
  cursor: pointer;
  background: rgba(0, 0, 0, 0.7);
  color: #fff;
  top: -16px;
  height: 16px;
  line-height: 16px;
  text-align: center;
  font-size: 10px;
  white-space: nowrap;
  min-width: 50px;
  border-radius: 3px;
  transform: translate(-50%, -50%);
}
</style>
