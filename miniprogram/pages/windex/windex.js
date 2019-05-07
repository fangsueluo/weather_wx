// miniprogram/pages/windex/windex.js
const amapFile = require('../../libs/amap-wx.js')
Page({

  /**
   * 页面的初始数据
   */
  data: {
    city: {},
    liveData: {},
    humidity: {},
    temperature: {},
    weather: {},
    winddirection: {},
    windpower: {}
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    this.getWeatherInfo()
    this.getWeatherInfo('forecast')
  },

  /**
   * 生命周期函数--监听页面初次渲染完成
   */
  onReady: function () {

  },

  /**
   * 生命周期函数--监听页面显示
   */
  onShow: function () {

  },

  /**
   * 生命周期函数--监听页面隐藏
   */
  onHide: function () {

  },

  /**
   * 生命周期函数--监听页面卸载
   */
  onUnload: function () {

  },

  /**
   * 页面相关事件处理函数--监听用户下拉动作
   */
  onPullDownRefresh: function () {

  },

  /**
   * 页面上拉触底事件的处理函数
   */
  onReachBottom: function () {

  },

  /**
   * 用户点击右上角分享
   */
  onShareAppMessage: function () {

  },

  getWeatherInfo(type = '', city = '') {
    const amap = new amapFile.AMapWX({key:'f40d1fc29bbfe2e1a1d6369cb88cf361'})
    amap.getWeather({
      city,
      type,
      success: (data) => {
        if(!type || type === 'live') {
          const {city, humidity, liveData, temperature, weather, winddirection, windpower} = data
          this.setData({
            city,
            humidity,
            liveData,
            temperature,
            weather,
            winddirection,
            windpower
          })
        } else {

        }
        console.log(data)
      },
      fail: (info) => {

      }
    })
  }
})