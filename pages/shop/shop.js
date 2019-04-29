//index.js
//获取应用实例
const app = getApp()

Page({
  data: {
    userInfo: {},
    hasUserInfo: false,
    canIUse: wx.canIUse('button.open-type.getUserInfo'),
    searchValue:"",  //搜索关键字
    classList:[
      { title: "全部商品", id:1},
      { title: "皮肤美容", id: 2},
      { title: "玻尿酸", id: 3},
      { title: "瘦脸针", id: 4},
      { title: "眼部整形", id: 5},
      { title: "鼻部整形", id: 6},
      { title: "胸部整形", id: 7},
      { title: "口腔", id: 8},
      { title: "自体脂肪填充", id: 9},
      { title: "私密", id: 10},
      { title: "纹绣", id: 11},
      { title: "抗衰老", id: 12},
      { title: "脱毛", id: 13},
      { title: "美体塑形", id: 14},
      { title: "祛斑", id: 15},
      { title: "祛痘", id: 16},
    ],
    idx:1,  //当前选中分类
    showShopListTitle:"全部商品",  //商品列表标题
    showShopList:[
      { bigTitle: "约会美白急救包", smallTitle: "【纳米微针，美白补水】同科室不同产品限购123", imgUrl: "http://xaxcx.17mall.cc/Public/uploadImages/default/shop_item_03.png", currentPrice: 199, beforePrice: 2680.00 },
      { bigTitle: "约会美白急救包", smallTitle: "【纳米微针，美白补水】同科室不同产品限购123", imgUrl: "http://xaxcx.17mall.cc/Public/uploadImages/default/shop_item_03.png", currentPrice: 199, beforePrice: 2680.00 },
      { bigTitle: "约会美白急救包", smallTitle: "【纳米微针，美白补水】同科室不同产品限购123", imgUrl: "http://xaxcx.17mall.cc/Public/uploadImages/default/shop_item_03.png", currentPrice: 199, beforePrice: 2680.00 },
      { bigTitle: "约会美白急救包", smallTitle: "【纳米微针，美白补水】同科室不同产品限购123", imgUrl: "http://xaxcx.17mall.cc/Public/uploadImages/default/shop_item_03.png", currentPrice: 199, beforePrice: 2680.00 },
      { bigTitle: "约会美白急救包", smallTitle: "【纳米微针，美白补水】同科室不同产品限购123", imgUrl: "http://xaxcx.17mall.cc/Public/uploadImages/default/shop_item_03.png", currentPrice: 199, beforePrice: 2680.00 },
      { bigTitle: "约会美白急救包", smallTitle: "【纳米微针，美白补水】同科室不同产品限购123", imgUrl: "http://xaxcx.17mall.cc/Public/uploadImages/default/shop_item_03.png", currentPrice: 199, beforePrice: 2680.00 },
      { bigTitle: "约会美白急救包", smallTitle: "【纳米微针，美白补水】同科室不同产品限购123", imgUrl: "http://xaxcx.17mall.cc/Public/uploadImages/default/shop_item_03.png", currentPrice: 199, beforePrice: 2680.00 },
    ],
    showPurchasePage:false,  //是否显示购买页
    PurchaseMsg: { title: "约会美白急救包", imgUrl: "http://xaxcx.17mall.cc/Public/uploadImages/default/shop_item_03.png", startPrice: 250.00, endPrice: 2500.00, classList: [{ title: "线上全款", id: 1, stock: 10 }, { title: "线上全款2", id: 2, stock: 100 }, { title: "线上全款3", id: 3, stock: 999 }, { title: "线上全款4", id: 4, stock: 150 }, { title: "线上全款5", id: 5, stock: 10 }, { title: "预约金(到院需付尾款2250)", id: 6, stock: 99 }] },
    PurchaseMsgIdx: null,  //选中购买项
    // currentStock:false,  //当前选中库存数量
    num:1,  //数量
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
  //获取用户输入的关键字
  getSearchValue:function(e){
    let value=e.detail.value;
    this.setData({
      searchValue:value
    })
  },
  //发起搜索
  goSearch:function(){
    console.log(this.data.searchValue);
  },
  //用户切换分类操作
  selected:function(e){
    let idx = e.currentTarget.dataset.idx;
    let title = e.currentTarget.dataset.title;
    this.setData({
      idx:idx,
      showShopListTitle:title
    })
  },
  //上拉加载更多数据
  getMoreData:function(){
    console.log("我到底了");
  },
  //用户点击选规格操作
  selectSpec:function(){
    this.setData({
      showPurchasePage:true
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
    console.log(idx);
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
  goShopDetails:function(){
    wx.navigateTo({
      url: '/pages/shopDetails/shopDetails',
    })
  },
  //跳转到提交订单页面
  goConfirmOrder:function(){
    wx.navigateTo({
      url: '/pages/confirmOrder/confirmOrder',
    })
  }
})
