//index.js
//获取应用实例
const app = getApp()

Page({
  data: {
    motto: 'Hello World',
    userInfo: {},
    hasUserInfo: false,
    canIUse: wx.canIUse('button.open-type.getUserInfo'),
    lng: 121.6471612268,
    lat: 31.0964714403,
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
  //导航到院
  goMap: function (e) {
    let lng = this.data.lng;
    let lat = this.data.lat;
    console.log(lng);
    console.log(lat);
    wx.openLocation({//​使用微信内置地图查看位置。
      latitude: lat,//要去的纬度-地址
      longitude: lng,//要去的经度-地址
      name: "西安艺星整形医院",
      address: '西安艺星整形医院'
    })
  },

  //跳转到支付页面
  goPay:function(){
    wx.navigateTo({
      url: '/pages/paySuccess/paySuccess',
    })
  }
})
