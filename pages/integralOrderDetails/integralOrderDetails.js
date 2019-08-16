//index.js
//获取应用实例
const app = getApp()

Page({
  data: {
    userInfo: {},
    hasUserInfo: false,
    canIUse: wx.canIUse('button.open-type.getUserInfo'),
    HospitalMsg: null,  //医院基本配置信息
    id:null,  //订单id
    orderDetails:null,  //订单数据
  },
  
  onLoad: function (options) {
    //获取医院基本配置信息
    this.setData({
      HospitalMsg: app.globalData.HospitalMsg
    })
    //设置订单id
    if(options){
      this.setData({
        id: options.id
      })
    }
    //获取订单详情数据
    this.getOrderDetails();
  },
  //获取订单详情数据
  getOrderDetails: function () {
    let _this = this;
    wx.showLoading({
      title: '加载中',
    })
    wx.request({
      url: app.globalData.shopRequestUrl + "Integral/getIntegralOrderDetails",
      data: {
        'id': _this.data.id,
      },
      header: {
        "Content-Type": "application/x-www-form-urlencoded"
      },
      method: 'POST',
      success: function (result) {
        let results = result.data;
        // console.log(results);
        // return;
        if (results.success == true) {
          _this.setData({
            orderDetails: results.data
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
  },
  //拨打电话
  goTel: function () {
    let tel = this.data.HospitalMsg.tel;
    wx.makePhoneCall({
      phoneNumber: tel
    })
  },
  //导航到院
  goMap: function () {
    let _this = this;
    let lng = this.data.HospitalMsg.lng;
    let lat = this.data.HospitalMsg.lat;
    wx.openLocation({//​使用微信内置地图查看位置。
      latitude: parseFloat(lat),//要去的纬度-地址
      longitude: parseFloat(lng),//要去的经度-地址
      name: _this.data.HospitalMsg.hospitalname,
      address: _this.data.HospitalMsg.address
    })
  },
  
})
