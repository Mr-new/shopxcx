//index.js
//获取应用实例
const app = getApp()

Page({
  data: {
    motto: 'Hello World',
    userInfo: {},
    hasUserInfo: false,
    canIUse: wx.canIUse('button.open-type.getUserInfo'),
    list:[],  //获奖记录
    isAlert:false,
    showCode:"",  //兑换码
  },
  //事件处理函数
  bindViewTap: function() {
    wx.navigateTo({
      url: '../logs/logs'
    })
  },
  onLoad: function () {
    this.getPrizeRecord();
    if (app.globalData.userInfo) {
      this.setData({
        userInfo: app.globalData.userInfo,
        hasUserInfo: true
      })
    } else if (this.data.canIUse){
      // 由于 getUserInfo 是网络请求，可能会在 Page.onLoad 之后才返回
      // 所以此处加入 callback 以防止这种情况
      app.userInfoReadyCallback = res => {
        this.setData({
          userInfo: res.userInfo,
          hasUserInfo: true
        })
      }
    } else {
      // 在没有 open-type=getUserInfo 版本的兼容处理
      wx.getUserInfo({
        success: res => {
          app.globalData.userInfo = res.userInfo
          this.setData({
            userInfo: res.userInfo,
            hasUserInfo: true
          })
        }
      })
    }
  },
  getUserInfo: function(e) {
    console.log(e)
    app.globalData.userInfo = e.detail.userInfo
    this.setData({
      userInfo: e.detail.userInfo,
      hasUserInfo: true
    })
  },
  //获取中奖记录
  getPrizeRecord: function () {
    let _this = this;
    let userId = wx.getStorageSync('userId');
    wx.request({
      url: app.globalData.testRequestUrl + "Index/getUserPrizeRecord",
      data: {
        'userId': userId
      },
      header: {
        "Content-Type": "application/x-www-form-urlencoded"
      },
      method: 'POST',
      success: function (result) {
        console.log(result.data);
        _this.setData({
          list: result.data.data
        })
      },
      complete: function () {

      }
    })
  },
  //弹出提示框
  showModel: function (e) {
    let _this=this;
    let recordId = e.currentTarget.dataset.id;
    wx.request({
      url: app.globalData.testRequestUrl + "Index/receivePrizes",
      data: {
        'recordId': recordId
      },
      header: {
        "Content-Type": "application/x-www-form-urlencoded"
      },
      method: 'POST',
      success: function (result) {
        console.log(result.data);
        wx.showModal({
          title: '恭喜您',
          content: '恭喜您领取成功，稍后我们的客服会电话联系您确认兑换信息',
          showCancel: false
        })
        _this.getPrizeRecord();

      },
      fail: function () {
        wx.showModal({
          title: '提示',
          content: '网络似乎走丢了哟',
          showCancel: false
        })
      },
      complete: function () {

      }
    })
  },
  //显示兑换码弹框
  showCode:function(e){
    let code=e.currentTarget.dataset.code;
    this.setData({
      isAlert:true,
      showCode:code
    })
  },
  //隐藏兑换码弹框
  hideAlert:function(){
    this.setData({
      isAlert:false,
      showCode:""
    })
  }
})
