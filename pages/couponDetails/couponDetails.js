//index.js
//获取应用实例
const app = getApp()

Page({
  data: {
    motto: 'Hello World',
    userInfo: {},
    hasUserInfo: false,
    canIUse: wx.canIUse('button.open-type.getUserInfo'),
    publicImgUrl: app.globalData.publicImgUrl,  //公共图片路径
    couponDetails:{},  //优惠券详情
    hideBtn: 0,  //隐藏领取按钮
  },
  
  onLoad: function (options) {
    if(options){
      if (options.isHideBtn==1){
        this.setData({
          hideBtn: options.isHideBtn
        })
      }
      this.setData({
        couponDetails:JSON.parse(options.item)
      })
    }
  },
  //领取优惠券
  ReceiveCoupon: function (e) {
    let _this = this;
    let couponid = _this.data.couponDetails.id;
    wx.showLoading({
      title: '加载中',
    })
    wx.request({
      url: app.globalData.shopRequestUrl + "Coupon/ReceiveCoupon",
      data: {
        'userid': wx.getStorageSync('userid'),
        'couponid': couponid
      },
      header: {
        "Content-Type": "application/x-www-form-urlencoded"
      },
      method: 'POST',
      success: function (result) {
        let results = result.data;
        if (results.success == true) {
          wx.showToast({
            icon: 'success',
            title: results.msg,
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
  }
  
})
