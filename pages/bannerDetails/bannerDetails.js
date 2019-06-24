//index.js
//获取应用实例
const app = getApp()
var WxParse = require('../../wxParse/wxParse.js');
Page({
  data: {
    motto: 'Hello World',
    userInfo: {},
    hasUserInfo: false,
    canIUse: wx.canIUse('button.open-type.getUserInfo'),
    id: null, //轮播图id
    details: null,  //轮播图详情
  },
  onLoad: function (options) {
    if(options){
      this.setData({
        id: options.id
      })
    }
    console.log(this.data.id);
    this.getBannerDetails();
  },
  //根据轮播图id获取轮播图详情内容
  getBannerDetails: function () {
    let _this = this;
    wx.showLoading({
      title: '加载中',
    })
    wx.request({
      url: app.globalData.shopRequestUrl + "Banner/getBannerDetails",
      data: {
        id: _this.data.id
      },
      header: {
        "Content-Type": "application/x-www-form-urlencoded"
      },
      method: 'POST',
      success: function (result) {
        let results = result.data;
        if (results.success == true) {
          _this.setData({
            details: results.data.details
          })
          var article = results.data.details;
          WxParse.wxParse('article', 'html', article, _this, 0);
          //设置页面标题为商品名称
          wx.setNavigationBarTitle({
            title: results.data.title
          })
        } else {
          wx.showToast({
            icon: 'none',
            title: results.msg,
          })
        }
      },
      fail: function (err) {
        wx.showToast({
          icon: 'none',
          title: '网络似乎走丢了哟',
        })
      },
      complete: function () {
        wx.hideLoading();
      }
    })
  },

})
