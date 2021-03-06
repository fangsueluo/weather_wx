// miniprogram/pages/geo/geo.js
const util = require('../../libs/util.js');
const config = require('../../libs/config.js').default;
Page({

    /**
     * 页面的初始数据
     */
    data: {
      searchInput: '',
      searchResData: [],
      hotCities: [],
      hostScenic: [],
      searchHistroy: [],
      isShowNone: true,
      maxHistroies: 4,
      curArea: wx.getStorageSync('curArea')
    },

    /**
     * 生命周期函数--监听页面加载
     */
    onLoad: function (options) {
      this.getHotCities();
      const histroyCity = wx.getStorageSync('histroyCity')
      let newArr = []
      if(histroyCity) {
        let arr = JSON.parse(histroyCity);
        
        arr = new Map(arr)
        
        for(let [key, value] of arr) {
          newArr.push(value)
        }
      }
      this.setData({
        searchHistroy: newArr
      })
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
      const geo = e.currentTarget.dataset.geo;
      let url = `/pages/windex/windex?location=${geo.lat},${geo.lon}`
      wx.redirectTo({
        url,
        success: () => {
          this.handleSearchHistroy(geo)
          console.log('跳转成功')
        },
        fail: () => {
          console.log('跳转失败')
        }
      })
    },
    handleSearchHistroy(data) {
      let histroies = wx.getStorageSync('histroyCity') || "[]";
      histroies = JSON.parse(histroies)
      const index = histroies.findIndex((item) => {
        return data.cid === item[0]
      })
      
      if (index >= 0) {
        histroies.splice(index, 1);
      }
      histroies.unshift([data.cid, data ])
      const len = histroies.length - this.data.maxHistroies
      if (len > 0) {
        histroies.splice(this.data.maxHistroies, 1)
      }
      wx.setStorageSync('histroyCity', JSON.stringify(histroies))
    },
    bindSearchInput(e){
      const input = e.detail.value;
      if(!input) {
        this.showNoneBlock(true);
      }
      this.setData({
        searchInput: input
      })
      util.debounce(this.searchCities)()
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
            key: config.weatherKey,
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
    backToPage() {
      const location = wx.getStorageSync('userLocation')
      if (location) {
        const geo = location.split(',')
        wx.redirectTo({
          url: `/pages/windex/windex?location=${geo[0]},${geo[1]}`,
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
          key: config.weatherKey,
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