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
    idx: 0,
    searchValue:'',  //搜索内容
    askList:[],  //问答列表
    HospitalMsg: null,  //医院基本配置信息
  },
  onShow: function(){
    
    
    
  },
  onLoad: function (options) {
    this.setData({
      idx: app.globalData.wendaMenuIdx
    })
    let _this=this;
    //当app.js中的getHospitalMsg方法执行完后设置医院基本配置信息
    app.getHospitalMsg().then(function (res) {
      //获取医院基本配置信息
      _this.setData({
        HospitalMsg: app.globalData.HospitalMsg
      })
    })
    this.setData({
      searchValue: "",
      askList: [],
      pageIndex: 1,
      isBottom: false,
    })
    //获取日记菜单列表
    this.getCaseMenuList();
    //获取日记列表
    this.getCaseList();
    
  
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
    console.log(idx);
    this.setData({
      idx: idx,
      searchValue: "",
      askList: [],
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
      askList: [],
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
    let index=this.data.idx;
    let _this = this;
    wx.showLoading({
      title: '加载中',
    })
    //加载问答数据
    wx.request({
      url: app.globalData.shopRequestUrl + "AskAnswer/getAskAnswerList",
      data: {
        'pageIndex': _this.data.pageIndex,
        'number': _this.data.number,
        'searchValue': _this.data.searchValue,
        'casemenuid': _this.data.idx
      },
      header: {
        "Content-Type": "application/x-www-form-urlencoded"
      },
      method: 'POST',
      success: function (result) {
        let results = result.data;
        if (results.success == true) {
          _this.setData({
            askList: _this.data.askList.concat(results.data.list),
            sumPage: results.data.sumPage
          })
        } else {
          _this.setData({
            askList: []
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
      title: "问答",
      path: '/pages/askAnswer/askAnswer'
    }
  },
  //跳转到问答详情页面
  goAskDetails:function(e){
    let index = e.currentTarget.dataset.index;
    let looknum = "askList[" + index + "].looknum";
    let afterLookNum=parseInt(this.data.askList[index].looknum);
    this.setData({
      [looknum]: afterLookNum+1,
    })
    let id=e.currentTarget.dataset.id;
    wx.navigateTo({
      url: '/pages/askDetails/askDetails?id='+id,
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
})
