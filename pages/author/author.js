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
  //获取用户信息
  getUserInfo: function(e) {
    let _this = this;
    app.globalData.userInfo = e.detail.userInfo;
    let encryptedData = e.detail.encryptedData;
    if(encryptedData){
      wx.showLoading({
        title: '授权中',
      })
      wx.login({
        success: res => {
          wx.request({
            url: app.globalData.shopRequestUrl + "Login/doLogin",
            data: {
              'code': res.code,
              'iv': e.detail.iv,
              'encryptedData': encryptedData,
            },
            header: {
              "Content-Type": "application/x-www-form-urlencoded"
            },
            method: 'POST',
            success: function (result) {
              console.log(result.data);
              let results=result.data;
              if(results.success){
                wx.setStorage({
                  key: 'userid',
                  data: results.data.userId,
                })
                wx.navigateBack({
                  delta: 1
                })
              }else{
                wx.showToast({
                  icon: 'none',
                  title: results.msg,
                })
              }
            },
            fail: function () {
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
    }else{
      wx.showModal({
        title: '提示',
        content: '请允许用户信息授权才可以使用小程序哟',
        showCancel: false,
      })
    }
  },
  //返回上一页
  goBack:function(){
    wx.navigateBack({
      delta: 1
    })
  }
})
