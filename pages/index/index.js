//index.js
//获取应用实例
const app = getApp()

Page({
  data: {
    motto: 'Hello World',
    userInfo: {},
    hasUserInfo: false,
    canIUse: wx.canIUse('button.open-type.getUserInfo'),
    bannerList: [],  //轮播图列表
    menuList:[],  //菜单列表
    details:[
      { title: "双眼皮大作战", src: "http://xaxcx.17mall.cc/Public/uploadImages/default/default1.png" },
      { title: "双眼皮大作战", src: "http://xaxcx.17mall.cc/Public/uploadImages/default/default2.png" },
      { title: "双眼皮大作战", src: "http://xaxcx.17mall.cc/Public/uploadImages/default/default3.png" }
    ],
    baopin:[],  //热门爆品列表
    caseMenu:[],  //日记菜单列表
    caseList:[],  //日记列表
    HospitalMsg: null,  //医院基本配置信息
    rightMenuShow:false,  //是否显示右侧菜单
    floorstatus:false,
    indicatorDots: true,
    autoplay: true,
    interval: 3000,
    duration: 1000,
  },
  onLoad: function () {
    let _this=this;
    //获取banner轮播图列表
    this.getBannerList();
    //获取菜单列表
    this.getMenuList();
    //获取日记菜单列表
    this.getCaseMenuList();
    //获取热门爆品列表
    this.getHotCommodityList();
    //获取首页日记列表
    this.getHomeCaseList();

    //当app.js中的getHospitalMsg方法执行完后设置医院基本配置信息
    app.getHospitalMsg().then(function(res){
      //获取医院基本配置信息
      _this.setData({
        HospitalMsg: app.globalData.HospitalMsg
      })
      //设置首页标题
      wx.setNavigationBarTitle({
        title: _this.data.HospitalMsg.hospitalname
      })
    })
  },
  getUserInfo: function(e) {
    console.log(e)
    app.globalData.userInfo = e.detail.userInfo
    this.setData({
      userInfo: e.detail.userInfo,
      hasUserInfo: true
    })
  },
  //获取banner轮播图列表
  getBannerList:function(){
    let _this=this;
    wx.showLoading({
      title: '加载中',
    })
    wx.request({
      url: app.globalData.shopRequestUrl + "Banner/getBannerList",
      data: {
        
      },
      header: {
        "Content-Type": "application/x-www-form-urlencoded"
      },
      method: 'POST',
      success: function (result) {
        let results = result.data;
        if(results.success==true){
          _this.setData({
            bannerList: results.data
          })
        }else{
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
  //获取菜单列表
  getMenuList: function () {
    let _this = this;
    wx.showLoading({
      title: '加载中',
    })
    wx.request({
      url: app.globalData.shopRequestUrl + "Menu/getMenuList",
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
            menuList: results.data
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
  //获取日记菜单列表
  getCaseMenuList: function () {
    let _this = this;
    wx.showLoading({
      title: '加载中',
    })
    wx.request({
      url: app.globalData.shopRequestUrl + "Case/getCaseMenuList",
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
            caseMenu: results.data
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
  //获取热门爆品列表
  getHotCommodityList:function(){
    let _this = this;
    wx.showLoading({
      title: '加载中',
    })
    wx.request({
      url: app.globalData.shopRequestUrl + "Index/getHotCommodityList",
      data: {

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
            baopin: results.data
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
  //获取首页日记列表
  getHomeCaseList: function () {
    let _this = this;
    wx.showLoading({
      title: '加载中',
    })
    wx.request({
      url: app.globalData.shopRequestUrl + "Index/getHomeCaseList",
      data: {

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
            caseList: results.data
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
  //拨打电话
  goTel:function(e){
    let tel=e.currentTarget.dataset.tel;
    wx.makePhoneCall({
      phoneNumber: tel
    })
  },
  //导航到院
  goMap:function(){
    let _this=this;
    let lng = _this.data.HospitalMsg.lng;
    let lat = _this.data.HospitalMsg.lat;
    // console.log(parseFloat(lng));
    // console.log(lat);
    wx.openLocation({//​使用微信内置地图查看位置。
      latitude: parseFloat(lat),//要去的纬度-地址
      longitude: parseFloat(lng),//要去的经度-地址
      name: _this.data.HospitalMsg.hospitalname,
      address: _this.data.HospitalMsg.address
    })
  },
  //显示右侧菜单操作
  showRightMenu:function(){
    this.setData({
      rightMenuShow:true
    })
  },
  //隐藏右侧菜单操作
  hideRightMenu:function(){
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
  //跳转到日记页面
  goCase:function(e){
    let idx=e.currentTarget.dataset.id;
    app.globalData.caseMenuIdx = idx;
    wx.switchTab({
      url: '/pages/case/case',
      success:function(){
        var page = getCurrentPages().pop();
        if (page == undefined || page == null) return;
        page.onLoad();
      }
    })
  },
  //跳转到我的页面
  goMy:function(){
    wx.switchTab({
      url: '/pages/my/my',
    })
  },
  //检测是否有跳转路径，没有则提示功能未开放
  showTos:function(e){
    let url=e.currentTarget.dataset.url;
    if (url == "/pages/case/case"){
      wx.switchTab({
        url: '/pages/case/case',
      })
    } else if (url == "/pages/doct/list/list"){
      wx.switchTab({
        url: '/pages/doct/list/list',
      })
    } else if (url == "/pages/groupon/list/list"){
      wx.navigateToMiniProgram({
        appId: 'wx6f4dff03fc7e3934',
        path: 'pages/groupon/list/list',
        extraData: {
          
        },
        envVersion: 'develop',
        success(res) {
          // 打开其他小程序成功同步触发
          // wx.showToast({
          //   title: '跳转成功'
          // })
        }
      })
    } else if (!url){
      wx.showModal({
        title: '提示',
        content: '此功能暂未开放哟',
        showCancel: false
      })
    }
  },
  //分享
  onShareAppMessage(res) {
    let _this = this;
    return {
      title: _this.data.HospitalMsg.hospitalname,
      path: '/pages/index/index'
    }
  },
})
