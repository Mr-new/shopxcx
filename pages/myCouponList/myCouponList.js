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
    tabList:[
      { id: 1, title: '未使用' },
      { id: 2, title: '已使用' },
      { id: 3, title: '已过期' }
    ],
    idx: 1,
  },
  
  onLoad: function () {
    
    
    
  },
  onShow: function(){
    this.getMyCouponList();  //获取当前可领取优惠券列表
  },
  //切换tab
  switchTab:function(e){
    let id = e.currentTarget.dataset.id;
    this.setData({
      idx:id,
      couponList: []
    })
    this.getMyCouponList();  //获取当前可领取优惠券列表
  },
  //获取优惠券列表
  getMyCouponList: function () {
    //判断用户是否授权登陆
    if (!wx.getStorageSync('userid')) {
      app.NoLogin("请先登陆授权后在来查看优惠券哟！");
      return;
    }
    let _this = this;
    wx.showLoading({
      title: '加载中',
    })
    wx.request({
      url: app.globalData.shopRequestUrl + "Coupon/getMyCouponList",
      data: {
        userid: wx.getStorageSync('userid'),
        status: _this.data.idx
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
  //跳转到商品列表页面
  goShopList:function(){
    wx.switchTab({
      url: '/pages/shop/shop',
    })
  }
})
