//index.js
//获取应用实例
const app = getApp()
var WxParse = require('../../wxParse/wxParse.js');
Page({
  data: {
    indicatorDots: false,
    autoplay: false,
    interval: 3000,
    duration: 1000,
    userInfo: {},
    hasUserInfo: false,
    canIUse: wx.canIUse('button.open-type.getUserInfo'),
    shopId: null,  //商品id
    shopDetails:[],  //商品详情数据
    idx:1,  //默认选中tab
    commentList:[],  //评论列表数据
    showPurchasePage: false,  //是否显示购买页
    // PurchaseMsg: { title: "约会美白急救包", imgUrl: "http://xaxcx.17mall.cc/Public/uploadImages/default/shop_item_03.png", startPrice: 250.00, endPrice: 2500.00, classList: [{ title: "线上全款", id: 1, stock: 10 }, { title: "线上全款2", id: 2, stock: 100 }, { title: "线上全款3", id: 3, stock: 999 }, { title: "线上全款4", id: 4, stock: 150 }, { title: "线上全款5", id: 5, stock: 10 }, { title: "预约金(到院需付尾款2250)", id: 6, stock: 99 }] },
    PurchaseMsgIdx: null,  //选中购买项
    num: 1,  //数量
    btnStatus:3,  //按钮显示：1仅显示加入购物车，2仅显示立即购买，3加入购物车和立即购买都显示
    pageIndex: 1, //当前第几页
    number: 10,  //每页显示数量
    sumPage: 1,  //总页数
    isBottom: false,  //是否到底
    rightMenuShow: false,  //是否显示右侧菜单
    floorstatus: false,
    HospitalMsg: null,  //医院基本配置信息
  },
  onLoad: function (options) {
    let _this=this;
    //记录商品id
    if(options.shopId){
      this.setData({
        shopId: options.shopId
      })
    }
    this.getIntegralGoodsDetails();  //根据商品id获取商品详情

    //当app.js中的getHospitalMsg方法执行完后设置医院基本配置信息
    app.getHospitalMsg().then(function (res) {
      //获取医院基本配置信息
      _this.setData({
        HospitalMsg: app.globalData.HospitalMsg
      })
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
  //获取积分商品详情数据
  getIntegralGoodsDetails:function(){
    //判断用户是否授权登陆
    if (!wx.getStorageSync('userid')) {
      app.NoLogin("请先登陆授权后在来兑换商品哟！");
      return;
    }
    let _this = this;
    wx.showLoading({
      title: '加载中',
    })
    wx.request({
      url: app.globalData.shopRequestUrl + "Integral/getIntegralGoodsDetails",
      data: {
        'id' : _this.data.shopId,
        'userid': wx.getStorageSync('userid')
      },
      header: {
        "Content-Type": "application/x-www-form-urlencoded"
      },
      method: 'POST',
      success: function (result) {
        let results = result.data;
        if (results.success == true) {
          _this.setData({
            shopDetails: results.data
          })
          var article = results.data.details;
          WxParse.wxParse('article', 'html', article, _this, 0);
          //设置页面标题为商品名称
          wx.setNavigationBarTitle({
            title: _this.data.shopDetails.title
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
      title: _this.data.shopDetails.title,
      path: '/pages/integralDetails/integralDetails?shopId=' + _this.data.shopDetails.id
    }
  },
  
  //跳转到购物车页面
  goShopCart:function(){
    wx.navigateTo({
      url: '/pages/shopCart/shopCart',
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
  goMy:function(){
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
  //跳转到提交积分订单页面
  goConfirmIntegralOrder:function(){
    //判断用户是否授权登陆
    if (!wx.getStorageSync('userid')) {
      app.NoLogin("请先登陆授权后在来兑换商品哟！");
      return;
    }
    let _this=this;
    if (parseInt(_this.data.shopDetails['userIntegral']) < parseInt(_this.data.shopDetails['integral'])){
      wx.showModal({
        title: '提示',
        content: '当前积分不足以兑换此商品哟',
        showCancel: false
      })
    }else{
      wx.navigateTo({
        url: '/pages/confirmIntegralOrder/confirmIntegralOrder?shopId='+_this.data.shopDetails['id'],
      })
    }   
  }
})
