export interface CropperProps {
  title: string
  /**
   * 裁剪窗口高度
   */
  windowWidth: number
  /**
   * 裁剪窗口高度
   */
  windowHeight: number
  // 默认裁剪宽度
  cropperWidth: number
  // 默认裁剪高度
  cropperHeight: number
  /**
   * 裁剪框宽高比
   */
  ratio: number[] | string
  /**
   * 是否为原图裁剪
   */
  originalGraph: boolean
  /**
   * 能否调整裁剪区域位置
   */
  moveAble: boolean
  /**
   * 能否调整裁剪尺寸
   */
  isSize: boolean
  /**
   * 是否允许缩放图片
   */
  scaleAble: boolean
  /**
   * 是否允许裁剪框超出图片
   */
  toolBoxOverflow: boolean
  /**
   * 裁剪后的图片质量
   */
  quality: number
  /**
   * 能否拖动图片
   */
  imgMove: boolean
}
