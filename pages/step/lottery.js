//index.js
//获取应用实例
const app = getApp()
let PublicImgUrl = "https://xaxcx.17mall.cc/Public/uploadImages/default/";
Page({
  data: {
    motto: 'Hello World',
    userInfo: {},
    hasUserInfo: false,
    canIUse: wx.canIUse('button.open-type.getUserInfo'),
    imgUrl: "https://xaxcx.17mall.cc/Public/uploadImages/default/",  //公共图片路径
    percentage: "0%",  //达成目标百分比
    satisfy: 0,  //达成目标总人数
    giftList: [],  //礼品列表
    userList: [],  //达成目标人员列表
    inYesUser: false,  //中奖人员列表
    isShowMyPrize: false,  //是否显示中奖名单弹框
  },
  
  onLoad: function () {
    
  },
  onShow: function(){
    this.getDefaultDate();
  },
  //获取默认数据：达成目标总人数、达成目标百分比、礼品列表、达成目标人员列表、中奖人员列表
  getDefaultDate:function(){
    wx.showLoading({
      title: '加载中',
    })
    let _this=this;
    wx.request({
      url: app.globalData.stepRequestUrl + "Index/getGiftDefaultData",
      data: {
        
      },
      header: {
        "Content-Type": "application/x-www-form-urlencoded"
      },
      method: 'POST',
      success: function (result) {
        let results = result.data;
        console.log(results);
        _this.setData({
          percentage: results.data.percentage,
          satisfy: results.data.satisfy,
          giftList: results.data.giftList,
          userList: results.data.userList,
          inYesUser: results.data.inYesUser
        })
      },
      fail: function (err) {
        wx.showModal({
          title: '提示',
          content: '网络似乎走丢了哟',
          showCancel: false
        })
      },
      complete: function () {
        wx.hideLoading();
      }
    })
  },
  //显示中奖名单弹框
  showMyPrize: function () {
    let _this = this;
    this.setData({
      isShowMyPrize: true
    })
  },
  //隐藏中奖名单弹框
  hideMyPrize: function () {
    this.setData({
      isShowMyPrize: false
    })
  },
  
})
