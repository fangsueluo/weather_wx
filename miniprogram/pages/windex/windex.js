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
    cWidth: 200,
    cHeight: 100
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    // this.getWeatherInfo()
    // this.getWeatherInfo('forecast')
    // this.getWeatherInfo('lifestyle')
    // this.getWeatherInfo('hourly')
    // this.getAirInfo()
    this.createCanvas('tmpMax', 'tmp_max', "#e78f44");
    this.createCanvas('tmpMin', 'tmp_min', '#5db8e3', 0);
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
                this.createCanvas('tmpMax', 'tmp_max', "#e78f44");
                // this.createCanvas('tmpMin', 'tmp_min', '#5db8e3', 0);
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
  createCanvas(canvas, key, color, textUp=1) {
    const ctx = wx.createCanvasContext(canvas);
    const cWidth = this.data.cWidth;
    const cHeight = this.data.cHeight;
    const data = [
      {
        tmp_max: 15,
        tmp_min: 13
      },
      {
        tmp_max: 40,
        tmp_min: 9
      }, 
      {
        tmp_max: 28,
        tmp_min: 18
      },
    ];

    const maxX = Math.max.apply(Math, data.map(function (o) { return o.tmp_max}));
    const maxY = Math.max.apply(Math, data.map(function (o) { return o.tmp_min }));

    const pd = 20;
    const padding = {
      top: pd,
      right: pd,
      bottom: pd,
      left: pd
    };
    const origin = {
      x: padding.left,
      y: cHeight - padding.bottom
    }
    const axiosY = {
      x: padding.left,
      y: padding.top
    }
    const axiosX = {
      x: cWidth - padding.right,
      y: cHeight - padding.bottom
    }
    const step = pd * 3;
    const textY = textUp ? -10 : 20;
    let points = [];

    ctx.setStrokeStyle(color);
    ctx.setLineWidth(2);
    ctx.setFillStyle(color);
    ctx.setFontSize(14);

    ctx.beginPath();
    for(let i = 0; i < data.length; i++) {
      const item = data[i];
      const x = origin.x;
      const y = origin.y - item[key];
      if(i === 0) {
        ctx.moveTo(x, y);
      } else {
        ctx.lineTo(x, y);
      }
      ctx.fillText(`${item[key]}°`, x - 8, y + textY);
      points.push([x, y])
      origin.x += step;
    }
    ctx.stroke();

    const r = 4;
    ctx.setStrokeStyle('#fff');
    ctx.setFillStyle(color);
    ctx.setLineWidth(3);
    for(let i = 0; i < points.length; i++) {
      const item = points[i];
      ctx.beginPath();
      ctx.arc(item[0], item[1], r, 0, Math.PI * 2);
      ctx.stroke();
      ctx.fill();
    }

    const lastPoint = points[points.length - 1];
    const axiosXMax = lastPoint[0] + padding.right;
    let axiosYMax = 0;
    for(let i = 0; i < points.length; i++) {
      if (points[i][1] > axiosYMax) {
        axiosYMax = points[i][1];
      }
    }
    axiosYMax += padding.bottom *2;
    // ctx.beginPath();
    // ctx.rect(padding.left, origin.y, 100, 60);
    // ctx.clip();

    ctx.draw();
    console.log(axiosXMax)
    console.log(axiosYMax)
  }
})