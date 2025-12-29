import QQMapWX from 'qqmap-wx-jssdk';
import { wgs84ToGcj02 } from '../coordinateTransform';

export const qqmapsdk = new QQMapWX({ key: 'SE7BZ-NGS63-R5A3H-OZGVY-GI57Z-D5FDV' });

export const getCurrentLocation = (): Promise<any> => {
  console.log(1111111);
  return new Promise((resolve, reject) => {
    uni.getLocation({
      // type: 'wgs84',
      success: (res) => {
        const txObj = wgs84ToGcj02(res.longitude, res.latitude);
        qqmapsdk.reverseGeocoder({
          location: {
            latitude: txObj.lat,
            longitude: txObj.lng,
          },
          complete(val: any) {
            resolve({
              address: val.result.address,
              lng: val.result.location.lng,
              lat: val.result.location.lat,
            });
          },
        });
      },
      fail: reject,
    });
  });
};
