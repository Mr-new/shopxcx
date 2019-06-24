//index.js
//获取应用实例
const app = getApp()
var WxParse = require('../../wxParse/wxParse.js');
Page({
  data: {
    userInfo: {},
    hasUserInfo: false,
    canIUse: wx.canIUse('button.open-type.getUserInfo'),
    HospitalMsg: null,  //医院基本配置信息
    caseId: null,  //日记id
    caseDetails: null,  //日记详情数据
    rightMenuShow: false,  //是否显示右侧菜单
    floorstatus: false,
  },
  onLoad: function (options) {
    let _this=this;
    //记录日记id
    if(options.caseId){
      this.setData({
        caseId : options.caseId
      })
    }
    //当app.js中的getHospitalMsg方法执行完后设置医院基本配置信息
    app.getHospitalMsg().then(function (res) {
      //获取医院基本配置信息
      _this.setData({
        HospitalMsg: app.globalData.HospitalMsg
      })
    })
    //获取日记详情数据
    this.getCaseDetails();

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
  //跳转到首页
  goHome:function(){
    wx.switchTab({
      url: '/pages/index/index',
    })
  },
  //拨打电话
  goTel: function () {
    let tel=this.data.HospitalMsg.tel;
    wx.makePhoneCall({
      phoneNumber: tel
    })
  },
  //获取日记详情数据
  getCaseDetails: function () {
    let _this = this;
    wx.showLoading({
      title: '加载中',
    })
    wx.request({
      url: app.globalData.shopRequestUrl + "Case/getCaseDetails",
      data: {
        'id': _this.data.caseId,
        'userid': wx.getStorageSync('userid')
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
            caseDetails: results.data
          })
          var article = results.data.details;
          WxParse.wxParse('article', 'html', article, _this, 0);
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
  onShareAppMessage(res) {
    let _this=this;
    return {
      title: _this.data.caseDetails.remarks,
      path: '/pages/caseDetails/caseDetails?caseId=' + _this.data.caseDetails.id
    }
  },
  //加入收藏
  addCaseCollection: function () {
    let _this = this;
    wx.showLoading({
      title: '加载中',
    })
    let params = {
      'caseid': this.data.caseId,
      'userid': wx.getStorageSync('userid'),
    }
    wx.request({
      url: app.globalData.shopRequestUrl + "Collection/addCaseCollection",
      data: params,
      header: {
        "Content-Type": "application/x-www-form-urlencoded"
      },
      method: 'POST',
      success: function (result) {
        let results = result.data;
        if (results.success == true) {
          _this.setData({
            ['caseDetails.isCollection']: true
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
  //取消收藏
  deleteCaseCollection: function () {
    let _this = this;
    wx.showLoading({
      title: '加载中',
    })
    let params = {
      'caseid': this.data.caseId,
      'userid': wx.getStorageSync('userid'),
    }
    wx.request({
      url: app.globalData.shopRequestUrl + "Collection/deleteCaseCollection",
      data: params,
      header: {
        "Content-Type": "application/x-www-form-urlencoded"
      },
      method: 'POST',
      success: function (result) {
        let results = result.data;
        if (results.success == true) {
          _this.setData({
            ['caseDetails.isCollection']: false
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
  goTel: function (e) {
    let tel = e.currentTarget.dataset.tel;
    wx.makePhoneCall({
      phoneNumber: tel
    })
  },
  //显示右侧菜单操作
  showRightMenu: function () {
    this.setData({
      rightMenuShow: true
    })
  },
  //隐藏右侧菜单操作
  hideRightMenu: function () {
    this.setData({
      rightMenuShow: false
    })
  },
  // 获取滚动条当前位置
  onPageScroll: function (e) {
    if (e.scrollTop > 100) {
      this.setData({
        floorstatus: true
      });
    } else {
      this.setData({
        floorstatus: false
      });
    }
  },

  //回到顶部
  goTop: function (e) {  // 一键回到顶部
    if (wx.pageScrollTo) {
      wx.pageScrollTo({
        scrollTop: 0
      })
    } else {
      wx.showModal({
        title: '提示',
        content: '当前微信版本过低，无法使用该功能，请升级到最新微信版本后重试。'
      })
    }
  },
  //跳转到我的页面
  goMy: function () {
    wx.switchTab({
      url: '/pages/my/my',
    })
  },
  //跳转到首页
  goHome: function () {
    wx.switchTab({
      url: '/pages/index/index',
    })
  },
})
