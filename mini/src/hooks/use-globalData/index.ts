/**
 * loading 全局存储
 * @example
 * const {setGlobalData, getGlobalData, setListRefesh, getListRefesh} = useGlobalData('a')
 * // 设置全局存储
 * setGlobalData()
 * // 获取全局存储
 * getGlobalData()
 * // 设置列表刷新
 * setListRefesh()
 * // 获取列表刷新
 * getListRefesh()
 */
export default function useGlobalData(key?: string) {
  const app = getApp() as any;
  const setGlobalData = (data: any, otherKey?: string) => {
    const dataKey = otherKey || key;
    if (dataKey) {
      app.globalData[dataKey] = data;
    }
  };
  const getGlobalData = (isDel: boolean = true, otherKey?: string) => {
    const dataKey = otherKey || key;
    if (dataKey) {
      const data = app.globalData[dataKey];
      if (isDel) {
        delete app.globalData[dataKey];
      }
      return data;
    }
  };
  const setListRefesh = () => {
    setGlobalData(true, 'isListRefesh');
  };
  const getListRefesh = () => {
    return getGlobalData(true, 'isListRefesh');
  };
  return {
    setGlobalData,
    getGlobalData,
    setListRefesh,
    getListRefesh,
  };
}
