//index.js
//获取应用实例
const app = getApp()

Page({
  data: {
    motto: 'Hello World',
    userInfo: {},
    hasUserInfo: false,
    canIUse: wx.canIUse('button.open-type.getUserInfo'),
    list:[  //商品收藏列表
      { id: 1, image: "http://shopxcx.com/Public/uploadImages/default/shop_item_03.png", title: "【皮肤】美莱M22光子嫩肤（全面部），限时特惠2500", price: 250.99 },
      { id: 2, image: "http://shopxcx.com/Public/uploadImages/default/shop_item_03.png", title: "【皮肤】美莱M22光子嫩肤（全面部），限时特惠2500", price: 250.88 },
      { id: 2, image: "http://shopxcx.com/Public/uploadImages/default/shop_item_03.png", title: "【皮肤】美莱M22光子嫩肤（全面部），限时特惠2500", price: 250.66 },
    ],
    caseList: [  //日记收藏列表
      { pic: "http://xaxcx.17mall.cc/Public/uploadImages/default/logo.jpg", title: "美莱CURE全度美眸-小迪", className: "眼部", imgList: [{ imgUrl: "http://xaxcx.17mall.cc/Public/uploadImages/default/case_item_03.png" }, { imgUrl: "http://xaxcx.17mall.cc/Public/uploadImages/default/case_item_05.png" }, { imgUrl: "http://xaxcx.17mall.cc/Public/uploadImages/default/case_item_07.png" }], dateTime: "2018-08-29 16:21:12", address: "西安艺星整形医院", lookNumber: 236933, fabulousNumber: 195543 },
      { pic: "http://xaxcx.17mall.cc/Public/uploadImages/default/logo.jpg", title: "美莱CURE全度美眸-小迪", className: "眼部", imgList: [{ imgUrl: "http://xaxcx.17mall.cc/Public/uploadImages/default/case_item_03.png" }, { imgUrl: "http://xaxcx.17mall.cc/Public/uploadImages/default/case_item_05.png" }, { imgUrl: "http://xaxcx.17mall.cc/Public/uploadImages/default/case_item_07.png" }], dateTime: "2018-08-29 16:21:12", address: "西安艺星整形医院", lookNumber: 236933, fabulousNumber: 195543 },
      { pic: "http://xaxcx.17mall.cc/Public/uploadImages/default/logo.jpg", title: "美莱CURE全度美眸-小迪", className: "眼部", imgList: [{ imgUrl: "http://xaxcx.17mall.cc/Public/uploadImages/default/case_item_03.png" }, { imgUrl: "http://xaxcx.17mall.cc/Public/uploadImages/default/case_item_05.png" }, { imgUrl: "http://xaxcx.17mall.cc/Public/uploadImages/default/case_item_07.png" }], dateTime: "2018-08-29 16:21:12", address: "西安艺星整形医院", lookNumber: 236933, fabulousNumber: 195543 },
      { pic: "http://xaxcx.17mall.cc/Public/uploadImages/default/logo.jpg", title: "美莱CURE全度美眸-小迪", className: "眼部", imgList: [{ imgUrl: "http://xaxcx.17mall.cc/Public/uploadImages/default/case_item_03.png" }, { imgUrl: "http://xaxcx.17mall.cc/Public/uploadImages/default/case_item_05.png" }, { imgUrl: "http://xaxcx.17mall.cc/Public/uploadImages/default/case_item_07.png" }], dateTime: "2018-08-29 16:21:12", address: "西安艺星整形医院", lookNumber: 236933, fabulousNumber: 195543 },
      { pic: "http://xaxcx.17mall.cc/Public/uploadImages/default/logo.jpg", title: "美莱CURE全度美眸-小迪", className: "眼部", imgList: [{ imgUrl: "http://xaxcx.17mall.cc/Public/uploadImages/default/case_item_03.png" }, { imgUrl: "http://xaxcx.17mall.cc/Public/uploadImages/default/case_item_05.png" }, { imgUrl: "http://xaxcx.17mall.cc/Public/uploadImages/default/case_item_07.png" }], dateTime: "2018-08-29 16:21:12", address: "西安艺星整形医院", lookNumber: 236933, fabulousNumber: 195543 }
    ],
    idx:1, //默认选中的tab
  },
  onLoad: function (options) {
    //通过传过来不同参数选中不同顶部菜单
    if(options){
      this.setData({
        idx:options.idx
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
  //顶部tab切换
  switch:function(e){
    let idx=e.currentTarget.dataset.id;
    this.setData({
      idx:idx
    })
  }
  
})
