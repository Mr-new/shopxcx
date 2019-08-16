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
    orderArr: "",
  },
  
  onLoad: function (options) {
    if(options){
      this.setData({
        orderArr: options.orderArr,
      })
    }
    
    
  },
  onShow: function(){
    this.getMyCouponList();  //获取当前可领取优惠券列表
  },
  //获取优惠券列表
  getMyCouponList: function () {
    let _this = this;
    wx.showLoading({
      title: '加载中',
    })
    wx.request({
      url: app.globalData.shopRequestUrl + "Coupon/getIsUseCouponList",
      data: {
        userid: wx.getStorageSync('userid'),
        orderArr: _this.data.orderArr,
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
      url: '/pages/couponDetails/couponDetails?item='+item+ '&isHideBtn=1',
    })
  },
  //返回上一页面
  goBack:function(e){
    let couponid=e.currentTarget.dataset.couponid;
    var pages = getCurrentPages();   //当前页面
    var prevPage = pages[pages.length - 2];   //上一页面
    prevPage.setData({
      //直接给上一个页面赋值
      couponid: couponid,
    });
    wx.navigateBack({
      delta: 1
    })
  },
  //不使用优惠券
  NoChoice:function(){
    var pages = getCurrentPages();   //当前页面
    var prevPage = pages[pages.length - 2];   //上一页面
    prevPage.setData({
      //直接给上一个页面赋值
      couponid: 0,
    });
    wx.navigateBack({
      delta: 1
    })
  }
})
