//index.js
//获取应用实例
const app = getApp()

Page({
  data: {
    motto: 'Hello World',
    userInfo: {},
    hasUserInfo: false,
    canIUse: wx.canIUse('button.open-type.getUserInfo'),
    askId: null,  //问答id
    askDetails: null,  //问答详情
    HospitalMsg: null,
  },
  
  onLoad: function (options) {
    let _this=this;
    //当app.js中的getHospitalMsg方法执行完后设置医院基本配置信息
    app.getHospitalMsg().then(function (res) {
      //获取医院基本配置信息
      _this.setData({
        HospitalMsg: app.globalData.HospitalMsg
      })
    })
    
    if(options){
      this.setData({
        askId: options.id
      })
    }
    //获取问答详情内容
    this.getAskDetails();
  },
  //获取问答详情内容
  getAskDetails:function(){
    let _this = this;
    wx.showLoading({
      title: '加载中',
    })
    wx.request({
      url: app.globalData.shopRequestUrl + "Yanzhi/getAskDetails",
      data: {
        'id': _this.data.askId,
      },
      header: {
        "Content-Type": "application/x-www-form-urlencoded"
      },
      method: 'POST',
      success: function (result) {
        let results = result.data;
        console.log(results);
        if (results.success == true) {
          _this.setData({
            askDetails: results.data,
          })
        } else {
          _this.setData({
            askDetails: []
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
      title: _this.data.askDetails.ask,
      path: '/pages/askDetails/askDetails?id=' + _this.data.askDetails.id
    }
  },
  
})
