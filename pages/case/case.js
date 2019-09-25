//index.js
//获取应用实例
const app = getApp()

Page({
  data: {
    userInfo: {},
    hasUserInfo: false,
    canIUse: wx.canIUse('button.open-type.getUserInfo'),
    pageIndex: 1, //当前第几页
    number: 10,  //每页显示数量
    sumPage: 1,  //总页数
    isBottom: false,  //是否到底
    searchValue: "",  //搜索关键字
    navList: [  //日记菜单列表
      { id: 0, title: "全部" }
    ],  
    idx:0,
    searchValue:'',  //搜索内容
    caseList:[],  //日记列表
    HospitalMsg: null,  //医院基本配置信息
    telAuthor: false,  //用户是否授权手机号
  },
  onShow: function(){
    this.setData({
      searchValue: "",
      caseList: [],
      pageIndex: 1,
      isBottom: false,
      idx: app.globalData.caseMenuIdx
    })
    //获取日记列表
    this.getCaseList();
    
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
    //获取日记菜单列表
    this.setData({
      navList: [  //日记菜单列表
        { id: 0, title: "全部" }
      ],
    })
    this.getCaseMenuList();
    

    this.setData({
      idx: app.globalData.caseMenuIdx
    })
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
  //获取日记菜单列表
  getCaseMenuList: function () {
    let _this = this;
    wx.showLoading({
      title: '加载中',
    })
    wx.request({
      url: app.globalData.shopRequestUrl + "Case/getCaseMenuList",
      data: {

      },
      header: {
        "Content-Type": "application/x-www-form-urlencoded"
      },
      method: 'POST',
      success: function (result) {
        let results = result.data;
        if (results.success == true) {
          _this.setData({
            navList: _this.data.navList.concat(results.data)
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
  //用户选中导航栏操作
  selectedNavItem:function(e){
    let idx=e.currentTarget.dataset.id;
    this.setData({
      idx:idx
    })
    this.setData({
      idx: idx,
      searchValue: "",
      caseList: [],
      pageIndex: 1,
      isBottom: false,
    })
    //获取日记列表
    this.getCaseList();
  },
  //记录用户输入的关键字
  getSearchValue:function(e){
    let value = e.detail.value;
    this.setData({
      searchValue: value
    })
  },
  //发起搜索
  goSearch: function () {
    this.setData({
      caseList:[],
      pageIndex: 1,
      isBottom: false,
    })
    //获取日记列表
    this.getCaseList();
  },
  //跳转到日记详情
  goCaseDetails:function(e){
    let caseId=e.currentTarget.dataset.caseid;
    wx.navigateTo({
      url: '/pages/caseDetails/caseDetails?caseId=' + caseId,
    })
  },
  //获取日记列表
  getCaseList: function () {
    let _this = this;
    wx.showLoading({
      title: '加载中',
    })
    wx.request({
      url: app.globalData.shopRequestUrl + "Case/getCaseList",
      data: {
        'pageIndex': _this.data.pageIndex,
        'number': _this.data.number,
        'casemenuid': _this.data.idx,
        'searchValue': _this.data.searchValue,
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
            caseList: _this.data.caseList.concat(results.data.list),
            sumPage: results.data.sumPage,
            telAuthor: results.data.isTelAuthor
          })
        } else {
          _this.setData({
            caseList: [],
            telAuthor: results.data.isTelAuthor
          })
          // wx.showToast({
          //   icon: 'none',
          //   title: results.msg,
          // })
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
  //上拉加载更多数据
  getMoreData: function () {
    if (this.data.pageIndex == this.data.sumPage) {
      this.setData({
        isBottom: true
      })
    } else {
      this.setData({
        pageIndex: this.data.pageIndex + 1
      })
      this.getCaseList();
    }
    //console.log("我到底了", this.data.pageIndex);
  },
  //点赞
  addfabulous: function (e) {
    let id = e.currentTarget.dataset.id;
    let index = e.currentTarget.dataset.index;
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
          var fabulousnumber = "caseList[" + index + "].fabulousnumber";
          var isFabulous = "caseList[" + index + "].isFabulous";
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
    let id = e.currentTarget.dataset.id;
    let index = e.currentTarget.dataset.index;
    //判断用户是否授权登陆
    if (!wx.getStorageSync('userid')) {
      app.NoLogin("请先登陆授权后在来取消点赞哟！");
      return;
    }
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
          var fabulousnumber = "caseList[" + index + "].fabulousnumber";
          var isFabulous = "caseList[" + index + "].isFabulous";
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
  //分享
  onShareAppMessage(res) {
    let _this = this;
    return {
      title: "日记",
      path: '/pages/case/case'
    }
  },
  //获取用户手机号信息
  getPhoneNumber: function (e) {
    let _this = this;
    let encryptedData = e.detail.encryptedData;
    if (encryptedData) {
      wx.checkSession({
        success() {
          //此时session_key未失效执行获取用户手机号操作
          wx.showLoading({
            title: '加载中',
          })
          wx.request({
            url: app.globalData.shopRequestUrl + "Yanzhi/getUserTel",
            data: {
              'iv': e.detail.iv,
              'encryptedData': encryptedData,
              'userId': wx.getStorageSync('userid'),
              'consultationid': wx.getStorageSync('consultationid')  //咨询id
            },
            header: {
              "Content-Type": "application/x-www-form-urlencoded"
            },
            method: 'POST',
            success: function (result) {
              let results = result.data;
              console.log(results);
              if (results.success) {
                _this.setData({
                  telAuthor: true
                })
              } else {
                wx.showModal({
                  title: '提示',
                  content: '当前登陆授权状态已失效，请重新授权!',
                  showCancel: false,
                  success: function () {
                    wx.navigateTo({
                      url: '/pages/author/author',
                    })
                  }
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
        },
        fail() {
          //此时session_key已失效跳转到授权页面
          wx.showModal({
            title: '提示',
            content: '当前登陆授权状态已失效，请重新授权!',
            showCancel: false,
            success: function () {
              wx.navigateTo({
                url: '/pages/author/author',
              })
            }
          })

        }
      })
    } else {
      wx.showModal({
        title: '提示',
        content: '请允许手机号授权后才可以查看日记详情哟！',
        showCancel: false,
      })
    }
  },
})
