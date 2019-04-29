//index.js
//获取应用实例
const app = getApp()

Page({
  data: {
    arr: [
      { src: "http://shopxcx.com/Public/uploadImages/default/details_img_02.png" },
      { src: "http://shopxcx.com/Public/uploadImages/default/details_img2_02.png" },
    ],
    indicatorDots: false,
    autoplay: false,
    interval: 3000,
    duration: 1000,
    userInfo: {},
    hasUserInfo: false,
    canIUse: wx.canIUse('button.open-type.getUserInfo'),
    detailsImgList:[
      { imgUrl: "http://shopxcx.com/Public/uploadImages/default/details1.jpg" },
      { imgUrl: "http://shopxcx.com/Public/uploadImages/default/details2.jpg" },
      { imgUrl: "http://shopxcx.com/Public/uploadImages/default/details3.jpg" },
      { imgUrl: "http://shopxcx.com/Public/uploadImages/default/details4.jpg" },
      { imgUrl: "http://shopxcx.com/Public/uploadImages/default/details5.jpg" },
      { imgUrl: "http://shopxcx.com/Public/uploadImages/default/details6.jpg" },
      { imgUrl: "http://shopxcx.com/Public/uploadImages/default/details7.jpg" },
      { imgUrl: "http://shopxcx.com/Public/uploadImages/default/details8.jpg" },
      { imgUrl: "http://shopxcx.com/Public/uploadImages/default/details9.jpg" },
      { imgUrl: "http://shopxcx.com/Public/uploadImages/default/details10.jpg" },
      { imgUrl: "http://shopxcx.com/Public/uploadImages/default/details11.jpg" },
      { imgUrl: "http://shopxcx.com/Public/uploadImages/default/details12.jpg" },
      { imgUrl: "http://shopxcx.com/Public/uploadImages/default/details13.jpg" },
      { imgUrl: "http://shopxcx.com/Public/uploadImages/default/details14.jpg" },
      { imgUrl: "http://shopxcx.com/Public/uploadImages/default/details15.jpg" },
      { imgUrl: "http://shopxcx.com/Public/uploadImages/default/details16.jpg" }
    ],
    idx:1,
    commentList:[
      { pic: "http://shopxcx.com/Public/uploadImages/default/logo.jpg", name: "微***", xing: [0, 1, 2, 3, 4, 5], dateTime: "2018-10-25 16:54", commentContent: "之前一直在用这款祛痘，感觉很不错，这次又来光顾了，长痘痘的姐妹们，可以来尝试一下哦", imgList: ["http://shopxcx.com/Public/uploadImages/default/case_image_09.png", "http://shopxcx.com/Public/uploadImages/default/case_item_03.png", "http://shopxcx.com/Public/uploadImages/default/case_item_05.png", "http://shopxcx.com/Public/uploadImages/default/case_item_07.png", "http://shopxcx.com/Public/uploadImages/default/case_image_11.png"]},
      { pic: "http://shopxcx.com/Public/uploadImages/default/logo.jpg", name: "微***", xing: [0, 1, 2, 3, 4, 5], dateTime: "2018-10-25 16:54", commentContent: "之前一直在用这款祛痘，感觉很不错，这次又来光顾了，长痘痘的姐妹们，可以来尝试一下哦", imgList: ["http://shopxcx.com/Public/uploadImages/default/case_image_09.png", "http://shopxcx.com/Public/uploadImages/default/case_item_03.png", "http://shopxcx.com/Public/uploadImages/default/case_item_05.png",]},
      { pic: "http://shopxcx.com/Public/uploadImages/default/logo.jpg", name: "微***", xing: [0, 1, 2, 3, 4, 5], dateTime: "2018-10-25 16:54", commentContent: "之前一直在用这款祛痘，感觉很不错，这次又来光顾了，长痘痘的姐妹们，可以来尝试一下哦", imgList: ["http://shopxcx.com/Public/uploadImages/default/case_image_09.png", "http://shopxcx.com/Public/uploadImages/default/case_item_03.png", "http://shopxcx.com/Public/uploadImages/default/case_item_05.png", "http://shopxcx.com/Public/uploadImages/default/case_item_07.png", "http://shopxcx.com/Public/uploadImages/default/case_image_11.png"]},
      { pic: "http://shopxcx.com/Public/uploadImages/default/logo.jpg", name: "微***", xing: [0, 1, 2, 3, 4, 5], dateTime: "2018-10-25 16:54", commentContent: "之前一直在用这款祛痘，感觉很不错，这次又来光顾了，长痘痘的姐妹们，可以来尝试一下哦", imgList: ["http://shopxcx.com/Public/uploadImages/default/case_image_09.png", "http://shopxcx.com/Public/uploadImages/default/case_item_03.png", "http://shopxcx.com/Public/uploadImages/default/case_item_05.png", "http://shopxcx.com/Public/uploadImages/default/case_item_07.png"]},
      { pic: "http://shopxcx.com/Public/uploadImages/default/logo.jpg", name: "微***", xing: [0, 1, 2, 3, 4, 5], dateTime: "2018-10-25 16:54", commentContent: "之前一直在用这款祛痘，感觉很不错，这次又来光顾了，长痘痘的姐妹们，可以来尝试一下哦", imgList: ["http://shopxcx.com/Public/uploadImages/default/case_image_09.png", "http://shopxcx.com/Public/uploadImages/default/case_item_03.png",]},
      
    ],
    showPurchasePage: false,  //是否显示购买页
    PurchaseMsg: { title: "约会美白急救包", imgUrl: "http://xaxcx.17mall.cc/Public/uploadImages/default/shop_item_03.png", startPrice: 250.00, endPrice: 2500.00, classList: [{ title: "线上全款", id: 1, stock: 10 }, { title: "线上全款2", id: 2, stock: 100 }, { title: "线上全款3", id: 3, stock: 999 }, { title: "线上全款4", id: 4, stock: 150 }, { title: "线上全款5", id: 5, stock: 10 }, { title: "预约金(到院需付尾款2250)", id: 6, stock: 99 }] },
    PurchaseMsgIdx: null,  //选中购买项
    num: 1,  //数量
    btnStatus:3,  //按钮显示：1仅显示加入购物车，2仅显示立即购买，3加入购物车和立即购买都显示
  },
  //事件处理函数
  bindViewTap: function() {
    wx.navigateTo({
      url: '../logs/logs'
    })
  },
  onLoad: function () {
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
  //tab切换操作
  switchTab:function(e){
    let id = e.currentTarget.dataset.id;
    this.setData({
      idx:id
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
    wx.navigateTo({
      url: '/pages/confirmOrder/confirmOrder',
    })
  }
})
