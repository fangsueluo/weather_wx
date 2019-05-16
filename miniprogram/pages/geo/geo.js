// miniprogram/pages/geo/geo.js
const util = require('../../libs/util.js');
console.log(util)
const globalData = getApp().globalData;
Page({

    /**
     * 页面的初始数据
     */
    data: {
      searchInput: '',
      searchResData: [],
      hotCities: [],
      searchHistroy: [],
      isShowNone: true,
      maxHistroies: 4
    },

    /**
     * 生命周期函数--监听页面加载
     */
    onLoad: function (options) {
      this.getHotCities();
      const histroyCity = wx.getStorageSync('histroyCity')
      if(histroyCity) {
        const arr = JSON.parse(histroyCity);
        this.data.searchHistroy = arr.map((item, key) => {
          return Object.values(item)
        })
      }
      console.log(this.data.searchHistroy)
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
    handleNavigator(e) {
      console.log(e)
      const geo = e.currentTarget.dataset.geo;
      let url = `/pages/windex/windex?location=${geo.lat},${geo.lon}`
      this.handleSearchHistroy(geo)
      // wx.redirectTo({
      //   url,
      //   success: () => {
      //     this.handleSearchHistroy(geo)
      //     console.log('跳转成功')
      //   },
      //   fail: () => {
      //     console.log('跳转失败')
      //   }
      // })
    },
    handleSearchHistroy(data) {
      let histroies = wx.getStorageSync('histroyCity') || "[]";
      histroies = JSON.parse(histroies)
      const index = histroies.findIndex((item) => {
        return data.cid === item.cid
      })
      
      if (index >= 0) {
        histroies.splice(index, 1);
      }
      histroies.unshift({ [data.cid]: data })
      console.log('a: ',histroies)
      const len = histroies.length - this.data.maxHistroies
      if (len > 0) {
        histroies.splice(this.data.maxHistroies-1, 1)
      }
      console.log('b:',JSON.stringify(histroies))
      wx.setStorageSync('histroyCity', JSON.stringify(this.data.searchHistroy))
    },
    bindSearchInput(e){
      const input = e.detail.value;
      if(!input) {
        this.showNoneBlock(true);
      }
      this.setData({
        searchInput: input
      })
    },
    trimInput(input) {
      if (!util.trim(input)) {
        wx.showToast({
          title: '请输入搜索内容',
        })
        this.setData({
          searchInput: ''
        })
        return false;
      }
      return true;
    },
    searchCities() {
      const input = this.data.searchInput;
      if (this.trimInput(input)) {
        wx.request({
          url: 'https://search.heweather.net/find',
          data: {
            key: globalData.weatherKey,
            location: input
          },
          success: (res) => {
            const rdata = res.data;
            if (rdata) {
              let sdata = rdata.HeWeather6;
              if (sdata && sdata.length) {
                sdata = sdata[0];
                if (sdata.status === 'ok') {
                  this.setData({
                    searchResData: sdata.basic || []
                  })
                  this.showNoneBlock(true);
                } else {
                  this.setData({
                    searchResData: []
                  })
                  this.showNoneBlock(false);
                }
              } else {
                this.showNoneBlock(false);
              }
            }
          },
          fail: () => {
            this.showNoneBlock(false);
          }
        })
      }
    },
    showNoneBlock(flag) {
      this.setData({
        isShowNone: flag
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