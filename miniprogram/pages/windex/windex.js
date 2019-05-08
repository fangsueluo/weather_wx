// miniprogram/pages/windex/windex.js
Page({

  /**
   * 页面的初始数据
   */
  data: {
    city: '',
    location: '',
    province: '',
    humidity: '',
    curTemperature: '',
    condTxt: '',
    windDirection: '',
    windPower: '',
    airQualityIndex: '',
    airQuality: '',
    lifeIndexArr: [],
    forecastData: [],
    hourlyData: [],
    cWidth: 100,
    cHeight: 50
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    this.getWeatherInfo()
    this.getWeatherInfo('forecast')
    this.getWeatherInfo('lifestyle')
    this.getWeatherInfo('hourly')
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
              return;
            case 'lifestyle':
              this.setData({
                lifeIndexArr: weather.lifestyle
              })
              return;
            case 'hourly':
              this.setData({
                hourlyData: []
              })
              return;
            case 'forecast':
              this.setData({
                forecastData: weather.daily_forecast
              });
              this.createCanvas('tmpMax', 'tmp_max', "#e78f44");
              this.createCanvas('tmpMin', 'tmp_min', '#5db8e3', 0);
              return;
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
  },
  createCanvas(canvas, key, color, textUp=1) {
    const ctx = wx.createCanvasContext(canvas);
    const data = this.data.forecastData;
    const r = 3;
    const t = 50;
    const step = 80;
    let curX = 20;
    const dY = textUp ? 10 : 0;
    const points = [];
    const textY = textUp ? -10 : 20

    // 绘制线
    ctx.setStrokeStyle(color);
    ctx.beginPath();
    for (let i = 0; i < data.length; i++) {
      const y = +data[i][key] + dY;
      if(i === 0) {
        ctx.moveTo(curX, y);
      } else {
        ctx.lineTo(curX, y);
      }
      points.push([curX, y]);
      curX += step;
    }
    ctx.stroke();
    console.log(points)

    // 绘制点
    ctx.setFillStyle(color);
    ctx.setLineWidth(5);
    ctx.setStrokeStyle('#fff');
    curX = 20;
    for(let i = 0; i < points.length; i++) {
      ctx.beginPath();
      const item = points[i];
      ctx.arc(item[0], item[1], r, 0, Math.PI * 2);
      ctx.setFontSize(14);
      ctx.fillText(`${item[1] - dY}°`, curX - 8, item[1] + textY);
      ctx.stroke();
      ctx.fill();
      curX += step;
    }

    const canvasW = points[points.length-1][0] - points[0][0];
    // const canvasH = points[points.length - 1][1] - points[0][1];
    this.setData({
      cWidth: canvasW + 40,
      cHeight: 50
    })
    // console.log(canvasW, canvasH)
    ctx.draw();
  }
})