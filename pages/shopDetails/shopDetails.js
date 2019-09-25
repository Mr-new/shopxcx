//index.js
//获取应用实例
const app = getApp()
var WxParse = require('../../wxParse/wxParse.js');
var util = require('../../utils/util.js');
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
    publicImgUrl: app.globalData.publicImgUrl,  //公共图片路径
  },
  onLoad: function (options) {
    let _this=this;
    //记录商品id
    if(options.shopId){
      this.setData({
        shopId: options.shopId
      })
    }
    this.getCommodityDetailsList();  //根据商品id获取商品详情

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
  //获取商品详情数据
  getCommodityDetailsList:function(){
    let _this = this;
    wx.showLoading({
      title: '加载中',
    })
    wx.request({
      url: app.globalData.shopRequestUrl + "Commodity/getCommodityDetailsList",
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
        console.log(results);
        if (results.success == true) {
          _this.setData({
            shopDetails: results.data
          })
          var article = results.data.details;
          WxParse.wxParse('article', 'html', article, _this, 0);
          //设置页面标题为商品名称
          wx.setNavigationBarTitle({
            title: _this.data.shopDetails.name
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
  //tab切换操作
  switchTab:function(e){
    let id = e.currentTarget.dataset.id;
    this.setData({
      idx:id
    })
    if(id==2){
      //获取评论列表内容
      this.setData({
        commentList: [],
        pageIndex: 1,
        isBottom: false,
      });
      this.getCommentList();
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
      this.getCommentList();
    }
  },
  //获取评论列表
  getCommentList:function(){
    let _this = this;
    wx.showLoading({
      title: '加载中',
    })
    wx.request({
      url: app.globalData.shopRequestUrl + "Commodity/getCommentList",
      data: {
        'pageIndex': _this.data.pageIndex,
        'number': _this.data.number,
        'shopid': _this.data.shopId
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
            commentList: _this.data.commentList.concat(results.data.list),
            sumPage: results.data.sumPage
          })
        } else {
          _this.setData({
            commentList: []
          });
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
  //查看大图
  showBigImg:function(e){
    console.log(e);
    let currentimg = e.currentTarget.dataset.currentimg;
    let imgList = e.currentTarget.dataset.imglist;
    wx.previewImage({
      current: currentimg, // 当前显示图片的http链接
      urls: imgList // 需要预览的图片http链接列表
    })
  },
  //用户点击选规格操作
  selectSpec: function (e) {
    let selected=e.currentTarget.dataset.selected;
    this.setData({
      showPurchasePage: true,
      btnStatus:selected
    })
  },
  //用户点击X关闭购买页
  hidePurchasePage: function () {
    this.setData({
      showPurchasePage: false,
    })
  },
  //用户选中购买类中的某个项目
  selectedClass: function (e) {
    let idx = e.currentTarget.dataset.idx;
    console.log(idx);
    this.setData({
      PurchaseMsgIdx: idx
    })
  },
  //用户点击-操作
  reduce: function () {
    if (this.data.num > 1) {
      this.setData({
        num: this.data.num -= 1
      })
    }
  },
  //用户点击+操作
  add: function () {
    if (this.data.num < 99) {
      this.setData({
        num: this.data.num += 1
      })
    }
  },
  //跳转到提交订单页面
  goConfirmOrder: function () {
    //判断用户是否授权登陆
    if (!wx.getStorageSync('userid')) {
      app.NoLogin("请先登陆授权后在来购买商品哟！");
      return;
    }
   
    //普通商品购买：需要选择规格
    if (this.data.PurchaseMsgIdx == null) {
      wx.showToast({
        icon: 'none',
        title: '请选择商品规格',
      })
    } else {
      let temp = [{
        'shopId': this.data.shopId,  //商品id
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
  addShopCart: function () {
    //判断用户是否授权登陆
    if (!wx.getStorageSync('userid')) {
      app.NoLogin("请先登陆授权后在来加入购物车哟！");
      return;
    }
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
      let params = {
        'shopid': this.data.shopId,
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
    }
  },
  //分享
  onShareAppMessage(res) {
    let _this = this;
    return {
      title: _this.data.shopDetails.name,
      path: '/pages/shopDetails/shopDetails?shopId=' + _this.data.shopDetails.id
    }
  },
  //加入收藏
  addShopCollection:function(){
    //判断用户是否授权登陆
    if (!wx.getStorageSync('userid')) {
      app.NoLogin("请先登陆授权后在来加入收藏哟！");
      return;
    }
    let _this = this;
    wx.showLoading({
      title: '加载中',
    })
    let params = {
      'shopid': this.data.shopId,
      'userid': wx.getStorageSync('userid'),
    }
    wx.request({
      url: app.globalData.shopRequestUrl + "Collection/addShopCollection",
      data: params,
      header: {
        "Content-Type": "application/x-www-form-urlencoded"
      },
      method: 'POST',
      success: function (result) {
        let results = result.data;
        if (results.success == true) {
          _this.setData({
            ['shopDetails.isCollection']: true
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
  deleteShopCollection:function(){
    //判断用户是否授权登陆
    if (!wx.getStorageSync('userid')) {
      app.NoLogin("请先登陆授权后在来取消收藏哟！");
      return;
    }
    let _this = this;
    wx.showLoading({
      title: '加载中',
    })
    let params = {
      'shopid': this.data.shopId,
      'userid': wx.getStorageSync('userid'),
    }
    wx.request({
      url: app.globalData.shopRequestUrl + "Collection/deleteShopCollection",
      data: params,
      header: {
        "Content-Type": "application/x-www-form-urlencoded"
      },
      method: 'POST',
      success: function (result) {
        let results = result.data;
        if (results.success == true) {
          _this.setData({
            ['shopDetails.isCollection']: false
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
})
