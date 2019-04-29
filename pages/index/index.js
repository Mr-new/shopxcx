//index.js
//获取应用实例
const app = getApp()

Page({
  data: {
    motto: 'Hello World',
    userInfo: {},
    hasUserInfo: false,
    canIUse: wx.canIUse('button.open-type.getUserInfo'),
    arr: [
      { src: "http://xaxcx.17mall.cc/Public/uploadImages/default/banner1.png"},
      { src: "http://xaxcx.17mall.cc/Public/uploadImages/default/banner2.png" },
      { src: "http://xaxcx.17mall.cc/Public/uploadImages/default/banner3.png" },
    ],
    menuList:[
      { src: "http://xaxcx.17mall.cc/Public/uploadImages/default/menu_03.png", title: "秒杀", englishTitle: "Second kill", fontColor:"#469CF7", id:1},
      { src: "http://xaxcx.17mall.cc/Public/uploadImages/default/menu_05.png", title: "视频", englishTitle: "Second kill", fontColor: "#DD4D31", id: 2},
      { src: "http://xaxcx.17mall.cc/Public/uploadImages/default/menu_07.png", title: "红包", englishTitle: "Second kill", fontColor: "#E35DB4", id: 3},
      { src: "http://xaxcx.17mall.cc/Public/uploadImages/default/menu_09.png", title: "导航", englishTitle: "Second kill", fontColor: "#EA973E", id: 4},
      { src: "http://xaxcx.17mall.cc/Public/uploadImages/default/menu_11.png", title: "预约", englishTitle: "Second kill", fontColor: "#908BF1", id: 5},
      { src: "http://xaxcx.17mall.cc/Public/uploadImages/default/menu_18.png", title: "优惠券", englishTitle: "Second kill", fontColor: "#E59792", id: 6},
      { src: "http://xaxcx.17mall.cc/Public/uploadImages/default/menu_19.png", title: "积分商城", englishTitle: "Second kill", fontColor: "#D598F8", id: 7},
      { src: "http://xaxcx.17mall.cc/Public/uploadImages/default/menu_20.png", title: "日记", englishTitle: "Second kill", fontColor: "#F3B040", id: 8},
      { src: "http://xaxcx.17mall.cc/Public/uploadImages/default/menu_21.png", title: "推客", englishTitle: "Second kill", fontColor: "#64CBD2", id: 9},
      { src: "http://xaxcx.17mall.cc/Public/uploadImages/default/menu_22.png", title: "艺星", englishTitle: "Second kill", fontColor: "#B54EDC", id: 10},
    ],
    details:[
      { title: "双眼皮大作战", src: "http://xaxcx.17mall.cc/Public/uploadImages/default/default1.png" },
      { title: "双眼皮大作战", src: "http://xaxcx.17mall.cc/Public/uploadImages/default/default2.png" },
      { title: "双眼皮大作战", src: "http://xaxcx.17mall.cc/Public/uploadImages/default/default3.png" }
    ],
    baopin:[
      { bigTitle: "润月雅水光针", smallTitle: "长效补水  嫩肤美白", price: 1280, src: "http://xaxcx.17mall.cc/Public/uploadImages/default/shop_03.png" },
      { bigTitle: "润月雅水光针", smallTitle: "长效补水  嫩肤美白", price: 199, src: "http://xaxcx.17mall.cc/Public/uploadImages/default/shop_03.png" },
      { bigTitle: "润月雅水光针", smallTitle: "长效补水  嫩肤美白", price: 199, src: "http://xaxcx.17mall.cc/Public/uploadImages/default/shop_03.png" },
      { bigTitle: "润月雅水光针", smallTitle: "长效补水  嫩肤美白", price: 199, src: "http://xaxcx.17mall.cc/Public/uploadImages/default/shop_03.png" },
    ],
    caseMenu:[
      { title: "眼部", src: "http://xaxcx.17mall.cc/Public/uploadImages/default/case_menu_03.png" },
      { title: "鼻部", src: "http://xaxcx.17mall.cc/Public/uploadImages/default/case_menu_05.png" },
      { title: "自体脂肪", src: "http://xaxcx.17mall.cc/Public/uploadImages/default/case_menu_07.png" },
      { title: "面部", src: "http://xaxcx.17mall.cc/Public/uploadImages/default/case_menu_09.png" },
      { title: "玻尿酸", src: "http://xaxcx.17mall.cc/Public/uploadImages/default/case_menu_15.png" },
      { title: "皮肤美容", src: "http://xaxcx.17mall.cc/Public/uploadImages/default/case_menu_16.png" },
      { title: "瘦脸", src: "http://xaxcx.17mall.cc/Public/uploadImages/default/case_menu_17.png" },
      { title: "半永久", src: "http://xaxcx.17mall.cc/Public/uploadImages/default/case_menu_18.png" },
    ],
    caseList:[
      { name: "小蕊", pic: "http://xaxcx.17mall.cc/Public/uploadImages/default/case_image_09.png", product: "上脸去皮术+重脸成形术+内次赘皮矫正术", doctor: "韩超", productName: "【美莱CURE全面美眸】", price: 1280, imgList: [{ imgUrl: "http://xaxcx.17mall.cc/Public/uploadImages/default/case_image_07.png" }, { imgUrl: "http://xaxcx.17mall.cc/Public/uploadImages/default/case_image_09.png" }, { imgUrl: "http://xaxcx.17mall.cc/Public/uploadImages/default/case_image_11.png" }]},
      { name: "小蕊", pic: "http://xaxcx.17mall.cc/Public/uploadImages/default/case_image_09.png", product: "上脸去皮术+重脸成形术+内次赘皮矫正术", doctor: "韩超", productName: "【美莱CURE全面美眸】", price: 1280, imgList: [{ imgUrl: "http://xaxcx.17mall.cc/Public/uploadImages/default/case_image_07.png" }, { imgUrl: "http://xaxcx.17mall.cc/Public/uploadImages/default/case_image_09.png" }, { imgUrl: "http://xaxcx.17mall.cc/Public/uploadImages/default/case_image_11.png" }] },
      { name: "小蕊", pic: "http://xaxcx.17mall.cc/Public/uploadImages/default/case_image_09.png", product: "上脸去皮术+重脸成形术+内次赘皮矫正术", doctor: "韩超", productName: "【美莱CURE全面美眸】", price: 1280, imgList: [{ imgUrl: "http://xaxcx.17mall.cc/Public/uploadImages/default/case_image_07.png" }, { imgUrl: "http://xaxcx.17mall.cc/Public/uploadImages/default/case_image_09.png" }, { imgUrl: "http://xaxcx.17mall.cc/Public/uploadImages/default/case_image_11.png" }] },
      { name: "小蕊", pic: "http://shopxcx.com/Public/uploadImages/default/case_image_09.png", product: "上脸去皮术+重脸成形术+内次赘皮矫正术", doctor: "韩超", productName: "【美莱CURE全面美眸】", price: 1280, imgList: [{ imgUrl: "http://xaxcx.17mall.cc/Public/uploadImages/default/case_image_07.png" }, { imgUrl: "http://xaxcx.17mall.cc/Public/uploadImages/default/case_image_09.png" }, { imgUrl: "http://xaxcx.17mall.cc/Public/uploadImages/default/case_image_11.png" }] }
    ],
    HospitalMsg: { dateTime: "8:45-19:00", address: "浙江省杭州市西湖区莫干山路333号", tel: "153811331063", location: { lng: 121.6471612268, lat: 31.0964714403}},
    rightMenuShow:false,  //是否显示右侧菜单
    floorstatus:false,
    indicatorDots: true,
    autoplay: true,
    interval: 3000,
    duration: 1000,
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
  //拨打电话
  goTel:function(e){
    let tel=e.currentTarget.dataset.tel;
    wx.makePhoneCall({
      phoneNumber: tel
    })
  },
  //导航到院
  goMap:function(e){
    let lng = e.currentTarget.dataset.lng;
    let lat = e.currentTarget.dataset.lat;
    console.log(lng);
    console.log(lat);
    wx.openLocation({//​使用微信内置地图查看位置。
      latitude: lat,//要去的纬度-地址
      longitude: lng,//要去的经度-地址
      name: "西安艺星整形医院",
      address: '西安艺星整形医院'
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
})
