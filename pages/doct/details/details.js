// doctinfo.js
var WxParse = require('../../Common/wxParse/wxParse.js');
var app = getApp();
Page({
  data: {
    case_list: {},
    case_type: "all",
    offset: 0,
    imgpath: app.globalData.urlpath + "/images/",
    doctorid: '',
    details:{},  //医生详情
  
  },
  onLoad: function (options) {
    this.setData({
      "doctorid": options.doctorid
    })
    //获取医生详情
    this.getDoctorDetails();
  },
  //获取医生详情
  getDoctorDetails:function(){
    let _this = this;
    wx.showLoading({
      title: '加载中',
    })
    wx.request({
      url: app.globalData.shopRequestUrl + "Doctor/getDoctorDetails",
      data: {
        'userid': wx.getStorageSync('userid'),
        'id': _this.data.doctorid,
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
            details: results.data,
          })
          //设置页面标题为商品名称
          wx.setNavigationBarTitle({
            title: _this.data.details.doctor_name
          })
          WxParse.wxParse('article', 'html', results.data.content, _this, 0);
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

  //转发
  onShareAppMessage: function (res) {
    let _this=this;
    return {
      title: _this.data.details.doctor_name,
      path: '/pages/doct/details/details?doctorid=' + _this.data.doctorid,
      success: function (res) {
        console.log('成功', res)
      }
    }
  },
  //点赞
  goGraise:function(){
    let _this = this;
    wx.showLoading({
      title: '加载中',
    })
    let params = {
      'doctorid': _this.data.doctorid,
      'userid': wx.getStorageSync('userid'),
    }
    wx.request({
      url: app.globalData.shopRequestUrl + "Doctor/addPraise",
      data: params,
      header: {
        "Content-Type": "application/x-www-form-urlencoded"
      },
      method: 'POST',
      success: function (result) {
        let results = result.data;
        if (results.success == true) {
          var praiseNumber = "details.praise";
          var isFabulous = "details.isFabulous";
          _this.setData({
            [praiseNumber]: results.data,
            [isFabulous]: true
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

  //提示用户已经点赞
  showMsg:function(){
    wx.showToast({
      icon: 'none',
      title: '您给Ta点过赞了哟！',
    })
  }
})
