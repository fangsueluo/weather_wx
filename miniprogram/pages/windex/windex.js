// miniprogram/pages/windex/windex.js
Page({

  /**
   * 页面的初始数据
   */
  data: {
    city: '',
    location: '',
    province: '',
    liveData: {},
    humidity: {},
    curTemperature: '',
    condTxt: '',
    windDirection: '',
    windPower: '',
    airQualityIndex: '',
    airQuality: '',
    lifeIndexArr: []
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    this.getWeatherInfo()
    this.getWeatherInfo('forecast')
    this.getWeatherInfo('lifestyle')
    this.getAirInfo()
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
  setNowWeather(weather) {
    this.setData({
      location: weather.basic.location,
      city: weather.basic.parent_city,
      province: weather.basic.admin_area,
      curTemperature: weather.now.tmp,
      condTxt: weather.now.cond_txt,
      humidity: weather.now.hum,
      windDirection: weather.now.wind_dir,
      windPower: weather.now.wind_sc
    })
  },
  
  getWeatherInfo(type = 'now', city = '') {
    wx.request({
      url: `https://free-api.heweather.net/s6/weather/${type}`,
      data: this.formateParams(),
      success: (res) => {
        const data = res && res.data;
        if(data) {
          const weather = data.HeWeather6 && data.HeWeather6[0]
          switch(type) {
            case 'now':
              this.setNowWeather(weather);
              return
            case 'lifestyle':
              this.setData({
                lifeIndexArr: weather.lifestyle
              })
              return
          }
        }
      },
      fail: () => {

      }
    })
  },
  formateParams(location = 'auto_ip') {
    return {
      key: 'f7f0e3c5bdbb47b8b3c92c9d7ef8dd68',
      location
    }
  },
  getAirInfo(type='now') {
    wx.request({
      url: `https://free-api.heweather.net/s6/air/${type}`,
      data: this.formateParams(),
      success: (res) => {
        const data = res && res.data
        if(data) {
          const air = data.HeWeather6 && data.HeWeather6[0];
          this.setData({
            airQualityIndex: air.air_now_city.aqi,
            airQuality: air.air_now_city.qlty
          })
        }
      }
    })
  }
})