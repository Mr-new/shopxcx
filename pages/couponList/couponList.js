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
    couponList: [],  //优惠券列表
  },
  
  onLoad: function () {
  
  },
  onShow: function(){
    
    this.getCouponList();  //获取当前可领取优惠券列表
  },
  //获取当前可领取优惠券列表
  getCouponList: function () {
    let _this = this;
    wx.showLoading({
      title: '加载中',
    })
    wx.request({
      url: app.globalData.shopRequestUrl + "Coupon/getCouponList",
      data: {

      },
      header: {
        "Content-Type": "application/x-www-form-urlencoded"
      },
      method: 'POST',
      success: function (result) {
        let results = result.data;
        if (results.success == true) {
          //将float类型转为int类型
          for(let i=0;i<results.data.length;i++){
            results.data[i]['reduce']=parseInt(results.data[i]['reduce']);
            results.data[i]['full'] = parseInt(results.data[i]['full'])
          }
          _this.setData({
            couponList: results.data
          })
        } else {
          _this.setData({
            couponList: []
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
  //跳转到优惠券详情页面
  goCouponDetails:function(e){
    let item = JSON.stringify(e.currentTarget.dataset.item);
    wx.navigateTo({
      url: '/pages/couponDetails/couponDetails?item='+item,
    })
  },
  //领取优惠券
  ReceiveCoupon:function(e){
    //判断用户是否授权登陆
    if (!wx.getStorageSync('userid')) {
      app.NoLogin("请先登陆授权后在来领取优惠券哟！");
      return;
    }
    let _this = this;
    let couponid = e.currentTarget.dataset.couponid;
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
          setTimeout(function(){
            _this.onShow();
          },800)
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
  //分享
  onShareAppMessage(res) {
    let _this = this;
    return {
      title: "优惠券列表",
      path: '/pages/couponList/couponList'
    }
  },
})
