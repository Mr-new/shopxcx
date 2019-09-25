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
    details: null,  //详情
  },
  onLoad: function (options) {
    this.getDetails();
  },
  //获取详情内容
  getDetails: function () {
    let _this = this;
    wx.showLoading({
      title: '加载中',
    })
    wx.request({
      url: app.globalData.shopRequestUrl + "Yestar/getDetails",
      data: {
        
      },
      header: {
        "Content-Type": "application/x-www-form-urlencoded"
      },
      method: 'POST',
      success: function (result) {
        let results = result.data;
        if (results.success == true) {
          _this.setData({
            details: results.data
          })
          var article = results.data;
          WxParse.wxParse('article', 'html', article, _this, 0);
        } else {
          // wx.showToast({
          //   icon: 'none',
          //   title: results.msg,
          // })
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
  //分享
  onShareAppMessage(res) {
    let _this = this;
    return {
      title: "Yestar艺星",
      path: '/pages/yestarDetails/yestarDetails'
    }
  },

})
