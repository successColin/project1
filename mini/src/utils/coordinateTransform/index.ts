/**
 * WGS84转GCJ02（火星坐标系）
 * @param wgsLat 纬度
 * @param wgsLng 经度
 * @returns { lat: number, lng: number } 转换后的经纬度
 */
export function wgs84ToGcj02(wgsLng: number, wgsLat: number) {
  const outOfChina = (lat: number, lng: number) => {
    if (lng < 72.004 || lng > 137.8347) {
      return true;
    }
    if (lat < 0.8293 || lat > 55.8271) {
      return true;
    }
    return false;
  };

  const transformLat = (x: number, y: number) => {
    let ret = -100.0 + 2.0 * x + 3.0 * y + 0.2 * y * y + 0.1 * x * y + 0.2 * Math.sqrt(Math.abs(x));
    ret += (20.0 * Math.sin(6.0 * x * Math.PI) + 20.0 * Math.sin(2.0 * x * Math.PI)) * 2.0 / 3.0;
    ret += (20.0 * Math.sin(y * Math.PI) + 40.0 * Math.sin(y / 3.0 * Math.PI)) * 2.0 / 3.0;
    ret += (160.0 * Math.sin(y / 12.0 * Math.PI) + 320 * Math.sin(y * Math.PI / 30.0)) * 2.0 / 3.0;
    return ret;
  };

  const transformLng = (x: number, y: number) => {
    let ret = 300.0 + x + 2.0 * y + 0.1 * x * x + 0.1 * x * y + 0.1 * Math.sqrt(Math.abs(x));
    ret += (20.0 * Math.sin(6.0 * x * Math.PI) + 20.0 * Math.sin(2.0 * x * Math.PI)) * 2.0 / 3.0;
    ret += (20.0 * Math.sin(x * Math.PI) + 40.0 * Math.sin(x / 3.0 * Math.PI)) * 2.0 / 3.0;
    ret += (150.0 * Math.sin(x / 12.0 * Math.PI) + 300.0 * Math.sin(x / 30.0 * Math.PI)) * 2.0 / 3.0;
    return ret;
  };

  // 检查是否在国内
  if (outOfChina(wgsLat, wgsLng)) {
    return { lng: wgsLng, lat: wgsLat };
  }
  let dLat = transformLat(wgsLng - 105.0, wgsLat - 35.0);
  let dLng = transformLng(wgsLng - 105.0, wgsLat - 35.0);
  const radLat = (wgsLat / 180.0) * Math.PI;
  let magic = Math.sin(radLat);
  magic = 1 - 0.006693421622965943 * magic * magic;
  const sqrtMagic = Math.sqrt(magic);
  dLat = (dLat * 180.0) / ((6378245.0 * (1 - 0.006693421622965943)) / (magic * sqrtMagic) * Math.PI);
  dLng = (dLng * 180.0) / (6378245.0 / sqrtMagic * Math.cos(radLat) * Math.PI);
  const mgLat = wgsLat + dLat;
  const mgLng = wgsLng + dLng;
  return { lng: mgLng, lat: mgLat };
}

/**
 * GCJ-02 坐标转换为 BD-09 坐标
 * @param {number} lng 经度
 * @param {number} lat 纬度
 * @returns {[number, number]} 转换后的BD-09坐标 [经度, 纬度]
 */
export function gcj02ToBd09(lng: number, lat: number) {
  const x_PI = (Math.PI * 3000.0) / 180.0;
  const z = Math.sqrt(lng * lng + lat * lat) + 0.00002 * Math.sin(lat * x_PI);
  const theta = Math.atan2(lat, lng) + 0.000003 * Math.cos(lng * x_PI);
  const bd_lng = z * Math.cos(theta) + 0.0065;
  const bd_lat = z * Math.sin(theta) + 0.006;
  return { lng: bd_lng, lat: bd_lat };
}
/**
 * BD-09 坐标转换为 GCJ-02 坐标
 * @param {number} bd_lng 百度经度
 * @param {number} bd_lat 百度纬度
 * @returns {[number, number]} 转换后的GCJ-02坐标 [经度, 纬度]
 */
export function bd09ToGcj02(bd_lng: number, bd_lat: number) {
  const x_PI = (Math.PI * 3000.0) / 180.0;
  const x = bd_lng - 0.0065;
  const y = bd_lat - 0.006;
  const z = Math.sqrt(x * x + y * y) - 0.00002 * Math.sin(y * x_PI);
  const theta = Math.atan2(y, x) - 0.000003 * Math.cos(x * x_PI);
  const gg_lng = z * Math.cos(theta);
  const gg_lat = z * Math.sin(theta);
  return { lng: gg_lng, lat: gg_lat };
}
