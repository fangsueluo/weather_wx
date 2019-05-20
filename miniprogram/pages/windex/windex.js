// miniprogram/pages/windex/windex.js
const config = require('../../libs/config.js').default
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
    cWidth: 200,
    cHeight: 100
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    console.log('option', options)
    let location = '';
    if(options.location) {
      location = options.location;
    }
    this.getWeatherInfo('now', location)
    this.getWeatherInfo('forecast', location)
    this.getWeatherInfo('lifestyle', location)
    this.getWeatherInfo('hourly', location)
    this.getAirInfo('now', location);
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
  navigatorToSearch() {
    wx.redirectTo({
      url: "/pages/geo/geo",
    })
  },

  setNowWeather(weather) {
    let locacion = '';
    if (weather.basic.parent_city === weather.basic.location) {
      if (weather.basic.parent_city === weather.basic.admin_area) {
        locacion = weather.basic.location;
      } else {
        locacion = weather.basic.admin_area + ' ' + weather.basic.location;
      }
    } else {
      locacion = weather.basic.parent_city + ' ' + weather.basic.location;
    }
    this.setData({
      location: locacion,
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
      data: this.formateParams(city),
      success: (res) => {
        const data = res && res.data;
        if(data) {
          const weather = data.HeWeather6 && data.HeWeather6[0]
          if (weather.status === 'ok') {
            switch (type) {
              case 'now':
                this.setNowWeather(weather);
                return;
              case 'lifestyle':
                this.setData({
                  lifeIndexArr: weather.lifestyle || []
                })
                return;
              case 'hourly':
                this.setData({
                  hourlyData: []
                })
                return;
              case 'forecast':
                this.setData({
                  forecastData: weather.daily_forecast || []
                });
                this.createCanvas('tmpMax');
                return;
            }
          } else {
            wx.showToast({
              title: weather.status,
              icon: 'none'
            })
          }
        } else {
          wx.showToast({
            title: '请求失败',
            icon: 'none'
          })
        }
      },
      fail: (err) => {
        wx.showToast({
          title: err,
        })
      }
    })
  },
  formateParams(location) {
    return {
      key: config.weatherKey,
      location: location || 'auto_ip'
    }
  },
  getAirInfo(type='now', city = '') {
    wx.request({
      url: `https://free-api.heweather.net/s6/air/${type}`,
      data: this.formateParams(city),
      success: (res) => {
        const data = res && res.data
        if(data) {
          const air = data.HeWeather6 && data.HeWeather6[0];
          if (air.status === 'ok') {
            this.setData({
              airQualityIndex: air.air_now_city.aqi,
              airQuality: air.air_now_city.qlty
            })
          } else {
            wx.showToast({
              title: air.status,
              icon: 'none'
            })
          }
        } else {
          wx.showToast({
            title: '请求失败',
            icon: 'none'
          })
        }
      }
    })
  },
  createCanvas(canvas) {
    const ctx = wx.createCanvasContext(canvas);
    const cWidth = this.data.cWidth;
    const cHeight = this.data.cHeight;
    const colors = ["#e78f44", "#5db8e3"];

    const data = this.data.forecastData;
    let key = 'tmp_max';
    let textY = -10;

    const pd = 18;
    const padding = {
      top: pd,
      right: pd,
      bottom: 40,
      left: pd
    };
    const axiosY = {
      x: padding.left,
      y: padding.top
    }
    const axiosX = {
      x: cWidth - padding.right,
      y: cHeight - padding.bottom
    }

    const points = this.drawLineChart(ctx, data, padding, cHeight, colors[0], 'tmp_max');
    this.drawLineChart(ctx, data, padding, cHeight, colors[1], 'tmp_min', 20);
    ctx.draw();
    console.log(points)
    if(points && points.length) {
      const maxY = Math.max.apply(Math, points.map(function (o) { return o[1] }));
      const lastPoint = points[points.length - 1];
      this.setData({
        cWidth: lastPoint[0] + padding.right,
        cHeight: cHeight - maxY + padding.top
      })

    }
  },
  drawLineChart(ctx, data, padding, cHeight, color, key, textY = -10, pd = 20) {
    const origin = {
      x: padding.left,
      y: cHeight - padding.bottom
    }
    const step = pd * 3;
    let points = [];
    const r = 4;

    ctx.setStrokeStyle(color);
    ctx.setLineWidth(2);
    ctx.setFillStyle(color);
    ctx.setFontSize(14);

    // 绘制折线
    ctx.beginPath();
    for (let i = 0; i < data.length; i++) {
      const item = data[i];
      const x = origin.x;
      const y = origin.y - item[key];
      if (i === 0) {
        ctx.moveTo(x, y);
      } else {
        ctx.lineTo(x, y);
      }
      ctx.fillText(`${item[key]}°`, x - 8, y + textY);
      points.push([x, y])
      origin.x += step;
    }
    ctx.stroke();

    // 绘制圆点
    ctx.setStrokeStyle('#fff');
    ctx.setFillStyle(color);
    ctx.setLineWidth(3);
    for (let i = 0; i < points.length; i++) {
      const item = points[i];
      ctx.beginPath();
      ctx.arc(item[0], item[1], r, 0, Math.PI * 2);
      ctx.stroke();
      ctx.fill();
    }
    ctx.save();
    return points;
  }
})