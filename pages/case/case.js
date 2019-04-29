//index.js
//获取应用实例
const app = getApp()

Page({
  data: {
    userInfo: {},
    hasUserInfo: false,
    canIUse: wx.canIUse('button.open-type.getUserInfo'),
    navList:[
      { id: 1, title: "全部" },
      { id: 2, title: "眼部" },
      { id: 3, title: "鼻部" },
      { id: 4, title: "自体脂肪" },
      { id: 5, title: "面部" },
      { id: 6, title: "玻尿酸" },
      { id: 7, title: "皮肤美容" },
      { id: 8, title: "瘦脸" },
      { id: 9, title: "半永久" },
    ],
    idx:1,
    searchValue:'',  //搜索内容
    caseList:[
      { pic: "http://xaxcx.17mall.cc/Public/uploadImages/default/logo.jpg", title: "美莱CURE全度美眸-小迪", className: "眼部", imgList: [{ imgUrl: "http://xaxcx.17mall.cc/Public/uploadImages/default/case_item_03.png" }, { imgUrl: "http://xaxcx.17mall.cc/Public/uploadImages/default/case_item_05.png" }, { imgUrl: "http://xaxcx.17mall.cc/Public/uploadImages/default/case_item_07.png" }], dateTime: "2018-08-29 16:21:12", address: "西安艺星整形医院", lookNumber: 236933, fabulousNumber: 195543 },
      { pic: "http://xaxcx.17mall.cc/Public/uploadImages/default/logo.jpg", title: "美莱CURE全度美眸-小迪", className: "眼部", imgList: [{ imgUrl: "http://xaxcx.17mall.cc/Public/uploadImages/default/case_item_03.png" }, { imgUrl: "http://xaxcx.17mall.cc/Public/uploadImages/default/case_item_05.png" }, { imgUrl: "http://xaxcx.17mall.cc/Public/uploadImages/default/case_item_07.png" }], dateTime: "2018-08-29 16:21:12", address: "西安艺星整形医院", lookNumber: 236933, fabulousNumber: 195543 },
      { pic: "http://xaxcx.17mall.cc/Public/uploadImages/default/logo.jpg", title: "美莱CURE全度美眸-小迪", className: "眼部", imgList: [{ imgUrl: "http://xaxcx.17mall.cc/Public/uploadImages/default/case_item_03.png" }, { imgUrl: "http://xaxcx.17mall.cc/Public/uploadImages/default/case_item_05.png" }, { imgUrl: "http://xaxcx.17mall.cc/Public/uploadImages/default/case_item_07.png" }], dateTime: "2018-08-29 16:21:12", address: "西安艺星整形医院", lookNumber: 236933, fabulousNumber: 195543 },
      { pic: "http://xaxcx.17mall.cc/Public/uploadImages/default/logo.jpg", title: "美莱CURE全度美眸-小迪", className: "眼部", imgList: [{ imgUrl: "http://xaxcx.17mall.cc/Public/uploadImages/default/case_item_03.png" }, { imgUrl: "http://xaxcx.17mall.cc/Public/uploadImages/default/case_item_05.png" }, { imgUrl: "http://xaxcx.17mall.cc/Public/uploadImages/default/case_item_07.png" }], dateTime: "2018-08-29 16:21:12", address: "西安艺星整形医院", lookNumber: 236933, fabulousNumber: 195543 },
      { pic: "http://xaxcx.17mall.cc/Public/uploadImages/default/logo.jpg", title: "美莱CURE全度美眸-小迪", className: "眼部", imgList: [{ imgUrl: "http://xaxcx.17mall.cc/Public/uploadImages/default/case_item_03.png" }, { imgUrl: "http://xaxcx.17mall.cc/Public/uploadImages/default/case_item_05.png" }, { imgUrl: "http://xaxcx.17mall.cc/Public/uploadImages/default/case_item_07.png" }], dateTime: "2018-08-29 16:21:12", address: "西安艺星整形医院", lookNumber: 236933, fabulousNumber: 195543 }
    ],
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
  //用户选中导航栏操作
  selectedNavItem:function(e){
    let id=e.currentTarget.dataset.id;
    this.setData({
      idx:id
    })
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
    console.log(this.data.searchValue);
  },
})
