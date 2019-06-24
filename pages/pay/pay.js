//index.js
//获取应用实例
const app = getApp()

Page({
  data: {
    motto: 'Hello World',
    userInfo: {},
    hasUserInfo: false,
    canIUse: wx.canIUse('button.open-type.getUserInfo'),
   
  },
  //事件处理函数
  bindViewTap: function() {
    wx.navigateTo({
      url: '../logs/logs'
    })
  },
  onLoad: function () {
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
  //发起支付
  goPay:function(){
    console.log(wx.getStorageSync('userid'));
    wx.request({
      url: app.globalData.shopRequestUrl + "Pay/pay",
      data: {
        'userid': wx.getStorageSync('userid')
      },
      header: {
        "Content-Type": "application/x-www-form-urlencoded"
      },
      method: 'POST',
      success: function (result) {
        let results = result.data;
        console.log(results);
        if (results.state==200){
          wx.requestPayment({
            timeStamp: results['timeStamp'],
            nonceStr: results['nonceStr'],
            package: results['package'],
            signType: results['signType'],
            paySign: results['paySign'],
            success: function (res) {
              wx.showModal({
                title: '支付成功',
                content: '支付成功',
              }) 
            },
            fail: function (res) {
              console.log(res);
            }
          })
        }else{
          wx.showToast({
            icon: 'none',
            title: '出错了哟',
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
