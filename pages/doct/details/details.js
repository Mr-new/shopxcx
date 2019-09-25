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
    tab:[
      { id: 1, title: '档案', icon: 'iconfont icon-cedaohang-tongxunlu', size: 16},
      { id: 2, title: '证书', icon: 'iconfont icon-zhengshu', size: 17 },
      { id: 3, title: '项目', icon: 'iconfont icon-xiangmuguanli', size: 14 },
      { id: 4, title: '评价', icon: 'iconfont icon-pingjia1', size: 16 },
      { id: 5, title: '日记', icon: 'iconfont icon-huaban', size: 20 },
    ],
    idx: 1,
    HospitalMsg: null, 
  
  },
  onLoad: function (options) {
    this.setData({
      "doctorid": options.doctorid
    })
    let _this=this;
    //当app.js中的getHospitalMsg方法执行完后设置医院基本配置信息
    app.getHospitalMsg().then(function (res) {
      //获取医院基本配置信息
      _this.setData({
        HospitalMsg: app.globalData.HospitalMsg
      })
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
          //设置页面标题为医生名称
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
    //判断用户是否授权登陆
    if (!wx.getStorageSync('userid')) {
      app.NoLogin("请先登陆授权后在来点赞哟！");
      return;
    }
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
  },
  //tab切换
  tabswitch:function(e){
    let _this=this;
    let idx=e.currentTarget.dataset.id;
    let temp="";
    if(idx==1){
      if (_this.data.details.content != null) {
        temp = _this.data.details.content
      } else {
        temp = "<div style='line-height:500rpx; width:100%; text-align:center'>暂无数据哟！</div>"
      }
    } else if (idx == 2){
      if (_this.data.details.cert != null) {
        temp = _this.data.details.cert
      }else{
        temp = "<div style='line-height:500rpx; width:100%; text-align:center'>暂无数据哟！</div>"
      }
    } else if (idx == 3) {
      if (_this.data.details.project!=null){
        temp = _this.data.details.project
      } else {
        temp = "<div style='line-height:500rpx; width:100%; text-align:center'>暂无数据哟！</div>"
      }
    }else{
      temp="<div style='line-height:500rpx; width:100%; text-align:center'>暂无数据哟！</div>"
    }
    WxParse.wxParse('article', 'html', temp, _this, 0);
    this.setData({
      idx:idx
    })
  },
  //关注医生操作
  addFollow:function(){
    //判断用户是否授权登陆
    if (!wx.getStorageSync('userid')) {
      app.NoLogin("请先登陆授权后在来关注哟！");
      return;
    }
    let _this = this;
    wx.showLoading({
      title: '加载中',
    })
    let params = {
      'doctorid': _this.data.doctorid,
      'userid': wx.getStorageSync('userid'),
    }
    wx.request({
      url: app.globalData.shopRequestUrl + "Doctor/addFollow",
      data: params,
      header: {
        "Content-Type": "application/x-www-form-urlencoded"
      },
      method: 'POST',
      success: function (result) {
        let results = result.data;
        if (results.success == true) {
          var isFollow = "details.isFollow";
          var follow = "details.follow";
          _this.setData({
            [isFollow]: true,
            [follow]: results.data
          })
          wx.showToast({
            icon: 'success',
            title: results.msg,
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
  //取消关注医生操作
  delFollow: function () {
    //判断用户是否授权登陆
    if (!wx.getStorageSync('userid')) {
      app.NoLogin("请先登陆授权后在来取消关注哟！");
      return;
    }
    let _this = this;
    wx.showLoading({
      title: '加载中',
    })
    let params = {
      'doctorid': _this.data.doctorid,
      'userid': wx.getStorageSync('userid'),
    }
    wx.request({
      url: app.globalData.shopRequestUrl + "Doctor/delFollow",
      data: params,
      header: {
        "Content-Type": "application/x-www-form-urlencoded"
      },
      method: 'POST',
      success: function (result) {
        let results = result.data;
        if (results.success == true) {
          var isFollow = "details.isFollow";
          var follow = "details.follow";
          _this.setData({
            [isFollow]: false,
            [follow]: results.data
          })
          wx.showToast({
            icon: 'success',
            title: results.msg,
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
  //跳转到日记详情
  goCaseDetails: function (e) {
    let caseId = e.currentTarget.dataset.caseid;
    wx.navigateTo({
      url: '/pages/caseDetails/caseDetails?caseId=' + caseId,
    })
  },
  //点赞
  addfabulous: function (e) {
    //判断用户是否授权登陆
    if (!wx.getStorageSync('userid')) {
      app.NoLogin("请先登陆授权后在来点赞哟！");
      return;
    }
    let id = e.currentTarget.dataset.id;
    let index = e.currentTarget.dataset.index;

    let _this = this;
    wx.showLoading({
      title: '加载中',
    })
    let params = {
      'caseid': id,
      'userid': wx.getStorageSync('userid'),
    }
    wx.request({
      url: app.globalData.shopRequestUrl + "Case/addfabulous",
      data: params,
      header: {
        "Content-Type": "application/x-www-form-urlencoded"
      },
      method: 'POST',
      success: function (result) {
        let results = result.data;
        if (results.success == true) {
          var fabulousnumber = "details.caseList[" + index + "].fabulousnumber";
          var isFabulous = "details.caseList[" + index + "].isFabulous";
          _this.setData({
            [fabulousnumber]: results.data,
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
  //取消点赞
  delfabulous: function (e) {
    //判断用户是否授权登陆
    if (!wx.getStorageSync('userid')) {
      app.NoLogin("请先登陆授权后在来取消点赞哟！");
      return;
    }
    let id = e.currentTarget.dataset.id;
    let index = e.currentTarget.dataset.index;

    let _this = this;
    wx.showLoading({
      title: '加载中',
    })
    let params = {
      'caseid': id,
      'userid': wx.getStorageSync('userid'),
    }
    wx.request({
      url: app.globalData.shopRequestUrl + "Case/delfabulous",
      data: params,
      header: {
        "Content-Type": "application/x-www-form-urlencoded"
      },
      method: 'POST',
      success: function (result) {
        let results = result.data;
        if (results.success == true) {
          var fabulousnumber = "details.caseList[" + index + "].fabulousnumber";
          var isFabulous = "details.caseList[" + index + "].isFabulous";
          _this.setData({
            [fabulousnumber]: results.data,
            [isFabulous]: false
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
})
