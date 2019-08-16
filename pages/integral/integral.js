//index.js
//获取应用实例
const app = getApp()

Page({
  data: {
    motto: 'Hello World',
    userInfo: {},
    hasUserInfo: false,
    canIUse: wx.canIUse('button.open-type.getUserInfo'),
    list:[],
    pageIndex: 1, //当前第几页
    number: 6,  //每页显示数量
    sumPage: 1,  //总页数
    isBottom: false,  //是否到底
  },
  onLoad: function () {
    this.getIntegralGoodsList();
  },
  //获取积分商品列表
  getIntegralGoodsList: function () {
    let _this = this;
    wx.showLoading({
      title: '加载中',
    })
    wx.request({
      url: app.globalData.shopRequestUrl + "Integral/getIntegralGoodsList",
      data: {
        'pageIndex': _this.data.pageIndex,
        'number': _this.data.number,
      },
      header: {
        "Content-Type": "application/x-www-form-urlencoded"
      },
      method: 'POST',
      success: function (result) {
        let results = result.data;
        if (results.success == true) {
          _this.setData({
            list: _this.data.list.concat(results.data.list),
            sumPage: results.data.sumPage
          })
        } else {
          _this.setData({
            list: []
          })
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
  //滑动到底
  onReachBottom: function () {
    if (this.data.pageIndex == this.data.sumPage) {
      this.setData({
        isBottom: true
      })
    } else {
      this.setData({
        pageIndex: this.data.pageIndex + 1
      })
      this.getIntegralGoodsList();
    }
  },
  //跳转到积分商品详情页面
  goDetails:function(e){
    let shopId = e.currentTarget.dataset.shopid;
    wx.navigateTo({
      url: '/pages/integralDetails/integralDetails?shopId=' + shopId,
    })
  }
})
