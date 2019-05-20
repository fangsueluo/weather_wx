//app.js
const amapFile = require('./libs/amap-wx.js');
const config = require('./libs/config.js').default
App({
  onLaunch: function () {
    
    if (!wx.cloud) {
      console.error('请使用 2.2.3 或以上的基础库以使用云能力')
    } else {
      wx.cloud.init({
        traceUser: true,
      })
    }

    this.getGeo();
  },
  getGeo() {
    const myAmapFun = new amapFile.AMapWX({ key: config.geoKey });
    myAmapFun.getRegeo({
      success: function (data) {
        //成功回调
        if(data && data.length) {
          const addressComponent = data[0].regeocodeData.addressComponent;
          const curArea = addressComponent.city.length ? addressComponent.city : addressComponent.district;
          const adcode = addressComponent.adcode;
          wx.setStorageSync('curArea', curArea);
        }
      },
      fail: function (info) {
        //失败回调
        console.log(info)
      }
    })
  },
})
