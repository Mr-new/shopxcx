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
    caseList:[],  //日记列表
    HospitalMsg: null,  //医院基本配置信息
    rightMenuShow:false,  //是否显示右侧菜单
    floorstatus:false,
    indicatorDots: true,
    autoplay: true,
    interval: 5000,
    duration: 1000,
    Hei: "",          //这是swiper要动态设置的高度属性
    publicImgUrl: app.globalData.publicImgUrl,  //公共图片路径
    headerOption:[  //顶部选项
      { id: 1, title: '首页', url: "/pages/index/index", type: 1 },
      { id: 2, title: '日记', url: "/pages/case/case", type: 2 },
      { id: 3, title: '专家', url: "/pages/doct/list/list", type: 2 },
      { id: 4, title: '问答', url: "/pages/askAnswer/askAnswer", type: 2 },
      { id: 5, title: '品牌', url: "/pages/yestarDetails/yestarDetails", type: 2 },
    ],
    idx:1, 
    topHei: "",  //顶部背景高度
    statusBarHeight: app.globalData.statusBarHeight,
    tankuang: true,  //周年庆弹框
    navList: [  //日记菜单列表
      { id: 0, title: "全部" }
    ],
    caseIdx: 0,
  },
  //用户选中导航栏操作
  selectedNavItem: function (e) {
    let idx = e.currentTarget.dataset.id;
    let item = e.currentTarget.dataset.item;
    if(item.type==1){
      wx.switchTab({
        url: item.url,
      })
    }else if(item.type==3){
      wx.switchTab({
        url: item.url,
      })
      app.globalData.wendaMenuIdx=1;
    }else{
      wx.navigateTo({
        url: item.url,
      })
    }
    this.setData({
      idx: idx
    })
  },
  //动态设置轮播图高度
  imgH2: function (e) {
    var winWid = wx.getSystemInfoSync().windowWidth;         //获取当前屏幕的宽度
    var imgh = e.detail.height;　　　　　　　　　　　　　　　　//图片高度
    var imgw = e.detail.width;
    var swiperH = winWid * imgh / imgw + "px"
    this.setData({
      topHei: swiperH　　　　　　　　//设置高度
    })
  },
  //动态设置轮播图高度
  imgH: function (e) {
    var winWid = wx.getSystemInfoSync().windowWidth;         //获取当前屏幕的宽度
    var imgh = e.detail.height;　　　　　　　　　　　　　　　　//图片高度
    var imgw = e.detail.width;
    var swiperH = winWid * imgh / imgw + "px"
    this.setData({
      Hei: swiperH　　　　　　　　//设置高度
    })
  },
  onShow: function(){
    if (typeof this.getTabBar === 'function' &&
      this.getTabBar()) {
      this.getTabBar().setData({
        selected: 0
      })
    }
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
  // 一维数组转换为二维数组
  arrTrans:function(num, arr) { // 一维数组转换为二维数组
    const iconsArr = []; // 声明数组
    arr.forEach((item, index) => {
      const page = Math.floor(index / num); // 计算该元素为第几个素组内
      if (!iconsArr[page]) { // 判断是否存在
        iconsArr[page] = [];
      }
      iconsArr[page].push(item);
    });
    return iconsArr;
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
          let baopin = _this.arrTrans(3, results.data);  //将一维数组转换为二维数组
          _this.setData({
            baopin: baopin
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
      url: app.globalData.shopRequestUrl + "Case/getCaseList",
      data: {
        'pageIndex': 1,
        'number': 10,
        'casemenuid': _this.data.caseIdx,
        'searchValue': "",
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
            caseList: _this.data.caseList.concat(results.data.list),
          })
        } else {
          _this.setData({
            caseList: []
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
    let _this=this;
    var animation = wx.createAnimation({
      duration: 300,
      timingFunction: 'linear',
    });
    animation.rotate(50).step()
    this.setData({
      ani: animation.export()
    })
    setTimeout(function(){
      animation.rotate(0).step(),
      _this.setData({
        ani: animation.export()
      })
      _this.setData({
        rightMenuShow: true
      })
    },200)
    
  },
  //隐藏右侧菜单操作
  hideRightMenu:function(){
    this.setData({
      rightMenuShow: false
    })
  },
  // 获取滚动条当前位置
  onPageScroll: function (e) {
    // if (e.scrollTop > 100) {
    //   this.setData({
    //     floorstatus: "-55rpx"
    //   });
    // } else {
    //   this.setData({
    //     floorstatus: "20rpx"
    //   });
    // }
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
    wx.navigateTo({
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
    if (url == "/pages/doct/list/list"){
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
  //跳转到日记详情
  goCaseDetails: function (e) {
    let caseId = e.currentTarget.dataset.caseid;
    wx.navigateTo({
      url: '/pages/caseDetails/caseDetails?caseId=' + caseId,
    })
  },
  //点赞
  addfabulous: function (e) {
    let id = e.currentTarget.dataset.id;
    let index = e.currentTarget.dataset.index;

    let _this = this;
    //判断用户是否授权登陆
    if (!wx.getStorageSync('userid')) {
      app.NoLogin("请先登陆授权后在来点赞哟！");
      return;
    }
    wx.showLoading({
      title: '加载中',
    })
    let params = {
      'caseid': id,
      'userid': wx.getStorageSync('userid'),
    }
    wx.request({
      url: app.globalData.shopRequestUrl + "Case/addfabulous",
      data: params,
      header: {
        "Content-Type": "application/x-www-form-urlencoded"
      },
      method: 'POST',
      success: function (result) {
        let results = result.data;
        if (results.success == true) {
          var fabulousnumber = "caseList[" + index + "].fabulousnumber";
          var isFabulous = "caseList[" + index + "].isFabulous";
          _this.setData({
            [fabulousnumber]: results.data,
            [isFabulous]: true
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
  //取消点赞
  delfabulous: function (e) {
    let id = e.currentTarget.dataset.id;
    let index = e.currentTarget.dataset.index;
    if (!wx.getStorageSync('userid')) {
      app.NoLogin("请先登陆授权后在来取消点赞哟！");
      return;
    }
    let _this = this;
    wx.showLoading({
      title: '加载中',
    })
    let params = {
      'caseid': id,
      'userid': wx.getStorageSync('userid'),
    }
    wx.request({
      url: app.globalData.shopRequestUrl + "Case/delfabulous",
      data: params,
      header: {
        "Content-Type": "application/x-www-form-urlencoded"
      },
      method: 'POST',
      success: function (result) {
        let results = result.data;
        if (results.success == true) {
          var fabulousnumber = "caseList[" + index + "].fabulousnumber";
          var isFabulous = "caseList[" + index + "].isFabulous";
          _this.setData({
            [fabulousnumber]: results.data,
            [isFabulous]: false
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
  //跳转到医生页面
  goDoct:function(){
    wx.switchTab({
      url: '/pages/doct/list/list',
    })
  },
  //提示用户正在开发中
  showM:function(){
    wx.showModal({
      title: '提示',
      content: '正在开发中...',
      showCancel: false
    })
  },
  // 隐藏周年庆弹框
  hidetankuang:function(){
    this.setData({
      tankuang:false
    })
  },
  //跳转到预约页面
  goOnline:function(){
    wx.navigateTo({
      url: '/pages/online/online',
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
            navList: _this.data.navList.concat(results.data)
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
  //用户选中日记导航栏操作
  selectedCaseNavItem: function (e) {
    let idx = e.currentTarget.dataset.id;
    this.setData({
      caseIdx: idx,
      caseList: [],
    })
    //获取日记列表
    this.getHomeCaseList();
  },
  //跳转到周年庆网页
  goWebView:function(){
    wx.switchTab({
      url: '/pages/webView/webView',
    })
  }
})
