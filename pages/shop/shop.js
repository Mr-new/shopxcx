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
    searchValue:"",  //搜索关键字
    classList:[  //商品分类列表
      { title: "全部", id: 0},
    ],
    idx:0,  //当前选中分类
    showShopListTitle:"全部商品",  //商品列表标题
    showShopList:[],  //商品列表
    showPurchasePage:false,  //是否显示购买页
    shopItem: null,  //选中商品项
    PurchaseMsgIdx: null,  //选中购买项 
    num:1,  //数量
  },
  onLoad: function () {
    //获取商品分类列表
    this.getCommodityMenuList();
    //获取商品列表
    this.getCommodityList();

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
  //获取商品分类列表
  getCommodityMenuList: function () {
    let _this = this;
    wx.showLoading({
      title: '加载中',
    })
    wx.request({
      url: app.globalData.shopRequestUrl + "Commodity/getCommodityMenuList",
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
            classList: _this.data.classList.concat(results.data)
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
  //获取用户输入的关键字
  getSearchValue:function(e){
    let value=e.detail.value;
    this.setData({
      searchValue:value
    })
  },
  //发起搜索
  goSearch:function(){
    //console.log(this.data.searchValue);
    this.setData({
      showShopListTitle:"搜索商品",
      showShopList: [],
      pageIndex:1,
      isBottom: false,
    })
    //获取商品列表
    this.getCommodityList();
  },
  //用户切换分类操作
  selected:function(e){
    let idx = e.currentTarget.dataset.idx;
    let title = e.currentTarget.dataset.title;
    this.setData({
      idx:idx,
      showShopListTitle:title,
      searchValue: "",
      showShopList: [],
      pageIndex: 1,
      isBottom: false,
    })
    //获取商品列表
    this.getCommodityList();
  },
  //获取商品列表
  getCommodityList: function (){
    let _this = this;
    wx.showLoading({
      title: '加载中',
    })
    wx.request({
      url: app.globalData.shopRequestUrl + "Commodity/getCommodityList",
      data: {
        'pageIndex' : _this.data.pageIndex,
        'number' : _this.data.number,
        'categoryid' : _this.data.idx,
        'searchValue': _this.data.searchValue
      },
      header: {
        "Content-Type": "application/x-www-form-urlencoded"
      },
      method: 'POST',
      success: function (result) {
        let results = result.data;
        // console.log(results);
        if (results.success == true) {
          _this.setData({
            showShopList: _this.data.showShopList.concat(results.data.list),
            sumPage: results.data.sumPage
          })
        } else {
          _this.setData({
            showShopList: []
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
  onReachBottom: function () {
    if (this.data.pageIndex == this.data.sumPage) {
      this.setData({
        isBottom: true
      })
    } else {
      this.setData({
        pageIndex: this.data.pageIndex + 1
      })
      this.getCommodityList();
    }
  },
  
  // getMoreData:function(){
  //   if(this.data.pageIndex == this.data.sumPage){
  //     this.setData({
  //       isBottom: true
  //     })
  //   }else{
  //     this.setData({
  //       pageIndex: this.data.pageIndex + 1
  //     })
  //     this.getCommodityList();
  //   }
  //   // console.log("我到底了",this.data.pageIndex);
  // },
  //用户点击选规格操作
  selectSpec:function(e){
    let selectedItem = e.currentTarget.dataset.selecteditem;
    // console.log(selectedItem);
    this.setData({
      showPurchasePage:true,
      shopItem:selectedItem
    })
  },
  //用户点击X关闭购买页
  hidePurchasePage:function(){
    this.setData({
      showPurchasePage: false,
      PurchaseMsgIdx: null,
      num:1
    })
  },
  //用户选中购买类中的某个项目
  selectedClass:function(e){
    let idx = e.currentTarget.dataset.idx;
    // console.log(idx);
    this.setData({
      PurchaseMsgIdx: idx
    })
  },
  //用户点击-操作
  reduce:function(){
    if(this.data.num>1){
      this.setData({
        num: this.data.num -= 1
      })
    }
  },  
  //用户点击+操作
  add:function(){
    if(this.data.num<99){
      this.setData({
        num: this.data.num += 1
      })
    }
  },
  //跳转到商品详情页面
  goShopDetails:function(e){
    let shopId=e.currentTarget.dataset.shopid;
    wx.navigateTo({
      url: '/pages/shopDetails/shopDetails?shopId=' + shopId,
    })
  },
  //跳转到提交订单页面
  goConfirmOrder:function(){
    if (this.data.PurchaseMsgIdx==null){
      wx.showToast({
        icon: 'none',
        title: '请选择商品规格',
      })
    }else{
      let temp = [{
        'shopId': this.data.shopItem.id,  //商品id
        'specsId': this.data.PurchaseMsgIdx.id,  //规格id
        'number': this.data.num,  //数量
      }];
      let orderArr = JSON.stringify(temp);
      wx.navigateTo({
        url: '/pages/confirmOrder/confirmOrder?orderArr=' + orderArr,
      })
    }
  },
  //加入购物车
  addShopCart:function(){
    if (this.data.PurchaseMsgIdx == null) {
      wx.showToast({
        icon: 'none',
        title: '请选择商品规格',
      })
    } else {
      let _this = this;
      wx.showLoading({
        title: '加载中',
      })
      let params={
        'shopid': this.data.shopItem.id,
        'specsid': this.data.PurchaseMsgIdx.id,
        'userid': wx.getStorageSync('userid'),
        'number': this.data.num
      }
      wx.request({
        url: app.globalData.shopRequestUrl + "Cart/addShopCart",
        data: params,
        header: {
          "Content-Type": "application/x-www-form-urlencoded"
        },
        method: 'POST',
        success: function (result) {
          let results = result.data;
          if (results.success == true) {
            wx.showToast({
              icon:'success',
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
    }
  },
  //分享
  onShareAppMessage(res) {
    let _this = this;
    return {
      title: "商品列表",
      path: '/pages/shop/shop'
    }
  },
})
