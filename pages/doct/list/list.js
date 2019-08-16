// doctlist.js
var app = getApp();
Page({
  data: {
    doctlist:[],
    doct_type:"all",
    navSwiperCurrent: 0,
    offset:0,
    likes_doctor_id_list: [],

    imgpath: app.globalData.urlpath+"/images/",
    pageIndex: 1, //当前第几页
    number: 10,  //每页显示数量
    sumPage: 1,  //总页数
    isBottom: false,  //是否到底
    HospitalMsg: null,
  },
  onLoad: function (options) {
    //当app.js中的getHospitalMsg方法执行完后设置医院基本配置信息
    let _this=this;
    app.getHospitalMsg().then(function (res) {
      //获取医院基本配置信息
      _this.setData({
        HospitalMsg: app.globalData.HospitalMsg
      })
    })
  },
  onShow:function(){
    this.setData({
      doctlist: [],
      pageIndex: 1,
      isBottom: false,
    })
    this.loadDoctList();
  },
  //点赞
  bindPraise: function (e) {
    let doctorid = e.currentTarget.dataset.doctor_id;
    var index = e.currentTarget.dataset.list_index
    let _this = this;
    wx.showLoading({
      title: '加载中',
    })
    let params = {
      'doctorid': doctorid,
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
          var praiseNumber = "doctlist[" + index + "].praise";
          var isFabulous = "doctlist[" + index + "].isFabulous";
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
  //取消点赞
  bindcancelPraise: function (e) {
    var doctorid = e.currentTarget.dataset.doctor_id
    var index = e.currentTarget.dataset.list_index
    let _this = this;
    wx.showLoading({
      title: '加载中',
    })
    let params = {
      'doctorid': doctorid,
      'userid': wx.getStorageSync('userid'),
    }
    wx.request({
      url: app.globalData.shopRequestUrl + "Doctor/delPraise",
      data: params,
      header: {
        "Content-Type": "application/x-www-form-urlencoded"
      },
      method: 'POST',
      success: function (result) {
        let results = result.data;
        if (results.success == true) {
          var praiseNumber = "doctlist[" + index + "].praise";
          var isFabulous = "doctlist[" + index + "].isFabulous";
          _this.setData({
            [praiseNumber]: results.data,
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
  onMakePhone:function(){
    wx.makePhoneCall({
      phoneNumber: app.globalData.tel
    })
  },
  //上拉加载更多
  onReachBottom:function(){
    if (this.data.pageIndex == this.data.sumPage) {
      this.setData({
        isBottom: true
      })
    } else {
      this.setData({
        pageIndex: this.data.pageIndex + 1
      })
      this.loadDoctList();
    }
  },
  //跳转到医生详情页面
  goDoctDetails:function(e){
    let doctor_id = e.currentTarget.dataset.doctor_id;
    wx.navigateTo({
      url: '/pages/doct/details/details?doctorid='+doctor_id,
    })
  },
  //加载医生列表数据
  loadDoctList:function(){
    let _this = this;
    wx.showLoading({
      title: '加载中',
    })
    wx.request({
      url: app.globalData.shopRequestUrl + "Doctor/getDoctorList",
      data: {
        'userid': wx.getStorageSync('userid'),
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
            doctlist: _this.data.doctlist.concat(results.data.list),
            sumPage: results.data.sumPage
          })
        } else {
          _this.setData({
            showShopList: []
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