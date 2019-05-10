//app.js
const amapFile = require('./libs/amap-wx.js');
App({
  globalData: {
    weatherKey: 'f7f0e3c5bdbb47b8b3c92c9d7ef8dd68',
    geoKey: 'f40d1fc29bbfe2e1a1d6369cb88cf361'
  },
  onLaunch: function () {
    
    if (!wx.cloud) {
      console.error('请使用 2.2.3 或以上的基础库以使用云能力')
    } else {
      wx.cloud.init({
        traceUser: true,
      })
    }

    // this.getGeo();
  },
  getGeo() {
    const myAmapFun = new amapFile.AMapWX({ key: this.globalData.geoKey });
    myAmapFun.getRegeo({
      success: function (data) {
        //成功回调
        console.log(data)
        if(data && data.length) {
          const addressComponent = data[0].regeocodeData.addressComponent;
          const curArea = addressComponent.city ? addressComponent.city : addressComponent.district;
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
