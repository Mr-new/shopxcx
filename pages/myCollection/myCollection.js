//index.js
//获取应用实例
const app = getApp()

Page({
  data: {
    motto: 'Hello World',
    userInfo: {},
    hasUserInfo: false,
    canIUse: wx.canIUse('button.open-type.getUserInfo'),
    list: [],  //商品收藏列表
    caseList: [],  //日记收藏列表
    idx:1, //默认选中的tab
    pageIndex: 1, //当前第几页
    number: 6,  //每页显示数量
    sumPage: 1,  //总页数
    isBottom: false,  //是否到底
  },
  onShow:function(){
    this.setData({
      list: [],
      caseList: [],
      pageIndex: 1,
      isBottom: false,
    })
    //获取数据列表
    this.getDataList();
  },
  onLoad: function (options) {
    //通过传过来不同参数选中不同顶部菜单
    if(options){
      this.setData({
        idx:options.idx
      })
    }
  },
  //顶部tab切换
  switch:function(e){
    let idx=e.currentTarget.dataset.id;
    this.setData({
      idx:idx,
      list: [],
      caseList:[],
      pageIndex: 1,
      isBottom: false,
    })
    //获取列表数据
    this.getDataList();
  },
  //获取列表数据
  getDataList:function(){
    let _this=this;
    let idx=_this.data.idx;  //选中tab
    wx.showLoading({
      title: '加载中',
    })
    if(idx==1){
      //此时获取商品收藏列表数据
      wx.request({
        url: app.globalData.shopRequestUrl + "Collection/getShopCollectionList",
        data: {
          'pageIndex': _this.data.pageIndex,
          'number': _this.data.number,
          'userid': wx.getStorageSync('userid'),
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
              list: _this.data.list.concat(results.data.list),
              sumPage: results.data.sumPage
            })
          } else {
            _this.setData({
              list: []
            });
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
    }else{
      //此时获取日记收藏列表数据
      wx.request({
        url: app.globalData.shopRequestUrl + "Collection/getCaseCollectionList",
        data: {
          'pageIndex': _this.data.pageIndex,
          'number': 3,
          'userid': wx.getStorageSync('userid'),
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
              sumPage: results.data.sumPage
            })
          } else {
            _this.setData({
              caseList: []
            });
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

  },
  //滑动到底
  onReachBottom: function () {
    if (this.data.pageIndex == this.data.sumPage) {
      this.setData({
        isBottom: true
      })
    } else {
      this.setData({
        pageIndex: this.data.pageIndex + 1
      })
      this.getDataList();
    }
  },
  //跳转到日记详情页面
  goCaseDetails:function(e){
    let id = e.currentTarget.dataset.id;
    wx.navigateTo({
      url: '/pages/caseDetails/caseDetails?caseId=' + id,
    })
  },
  //点赞
  addfabulous:function(e){
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
  }
  
  
})
