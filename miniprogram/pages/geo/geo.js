// miniprogram/pages/geo/geo.js
const globalData = getApp().globalData;
Page({

    /**
     * 页面的初始数据
     */
    data: {
      searchInput: '',
      searchResData: [],
      hotCities: []
    },

    /**
     * 生命周期函数--监听页面加载
     */
    onLoad: function (options) {
      this.searchCities();
      console.log(this.data.searchInput && !this.data.searchResData.length)
      this.getHotCities();
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
    bindSearchInput(e){
      this.setData({
        searchInput: e.detail.value
      })
    },
    searchCities() {
      wx.request({
        url: 'https://search.heweather.net/find',
        data: {
          key: globalData.weatherKey,
          location: this.data.searchInput
        },
        success: (res) => {
          const rdata = res.data;
          if (rdata) {
            let sdata = rdata.HeWeather6;
            if (sdata && sdata.length) {
              sdata = sdata[0];
              if(sdata.status === 'ok') {
                this.setData({
                  searchResData: sdata.basic || []
                })
                console.log(this.data.searchResData)
              } else {
                this.setData({
                  searchResData: []
                })
              }
            }
          }
        },
        fail: () => {

        }
      })
    },
    getHotCities() {
      wx.request({
        url: 'https://search.heweather.net/top',
        data: {
          key: globalData.weatherKey,
          group: 'cn'
        },
        success: (res) => {
          const rdata = res.data;
          if(rdata) {
            let data = rdata.HeWeather6;
            if(data && data.length) {
                data = data[0]
                if(data.status === 'ok') {
                  this.setData({
                    hotCities: data.basic || []
                  })
                }
            }
          }
        },
        fail: (err) => {

        }
      })
    }
})