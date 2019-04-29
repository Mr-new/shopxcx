//index.js
//获取应用实例
const app = getApp()
Page({
  data: {
    motto: 'Hello World',
    userInfo: {},
    hasUserInfo: false,
    canIUse: wx.canIUse('button.open-type.getUserInfo'),
    imgUrl: app.globalData.publicImgUrl,  //公共图片路径
    menuList:[  //tab列表
      { id: 0, title: "全部" },
      { id: 1, title: "待支付" },
      { id: 2, title: "已支付" },
      { id: 3, title: "待接单" },
      { id: 4, title: "退款订单" },
    ],
    idx:0,  //默认选中
    orderList:[  //订单列表
      { id: 1, orderNumber: 20190424484854509, datetime: "2019-04-24 14:17:04", title: "【皮肤】美莱M22光子嫩肤（全面部），限时特惠2500", type: "线上全款", number: 1, price: 2450.00, img: app.globalData.publicImgUrl + "shop_item_03.png" },
      { id: 2, orderNumber: 20190424484854509, datetime: "2019-04-24 14:17:04", title: "【皮肤】美莱M22光子嫩肤（全面部），限时特惠2500", type: "线上全款", number: 1, price: 2450.99, img: app.globalData.publicImgUrl + "shop_item_03.png" },
      { id: 3, orderNumber: 20190424484854509, datetime: "2019-04-24 14:17:04", title: "【皮肤】美莱M22光子嫩肤（全面部），限时特惠2500", type: "线上全款", number: 1, price: 2450.00, img: app.globalData.publicImgUrl + "shop_item_03.png" },
    ],
  },
  onLoad: function (options) {
    //判断传过来不同参数选中不同顶部菜单
    if(options){
      this.setData({
        idx: options.idx
      })
    }
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
  //tab切换
  tabSwitch:function(e){
    let index=e.currentTarget.dataset.id;
    this.setData({
      idx:index
    })
  },
  //跳转到订单详情页面
  goOrderDetails:function(){
    wx.navigateTo({
      url: '/pages/orderDetails/orderDetails',
    })
  },
  //跳转到支付
  gopay:function(){
    wx.showModal({
      title: '提示',
      content: '支付功能正在开发中',
    })
  }
})
