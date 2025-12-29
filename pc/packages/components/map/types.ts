// 基本点坐标类型
export interface Point {
  lng: number
  lat: number
}

// 地点建议类型
export interface PlaceSuggestion {
  title: string
  address: string
  point: Point
  value: string // 用于显示的完整值
}

// 当前地点信息
export interface CurrentPlace {
  title: string
  address: string
}

export interface LocalResult {
  getNumPois(): number
  getPoi(index: number): LocalResultPoi
}

export interface LocalResultPoi {
  title: string
  address: string
  point: Point
  city: string
}

export interface GeocoderResult {
  address: string
  point: Point
}
