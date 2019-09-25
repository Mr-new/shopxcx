//index.js
//获取应用实例
const app = getApp()
var WxParse = require('../../wxParse/wxParse.js');
Page({
  data: {
    userInfo: {},
    hasUserInfo: false,
    canIUse: wx.canIUse('button.open-type.getUserInfo'),
    HospitalMsg: null,  //医院基本配置信息
    caseId: null,  //日记id
    caseDetails: null,  //日记详情数据
    rightMenuShow: false,  //是否显示右侧菜单
    floorstatus: false,
    indicatorDots: true,
    autoplay: true,
    interval: 3000,
    duration: 1000,
    Hei: "",          //这是swiper要动态设置的高度属性
    isShowComment: false,  //是否显示评论弹框
    inputComment: null,  //用户正在输入的文本
    pageIndex: 1, //当前第几页
    number: 10,  //每页显示数量
    sumPage: 1,  //总页数
    isBottom: false,  //是否到底
    commentList: [],  //评论列表
    count: 0,  //总评论数量
    publicImgUrl: app.globalData.publicImgUrl,  //公共图片路径
    order: 'desc',  //排序：asc正序，  desc倒叙
    telAuthor: false,  //用户是否授权手机号
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
  onShow: function () {
    this.setData({
      commentList: [],
      pageIndex: 1,
      isBottom: false,
    })
    //获取评论列表
    this.getCaseCommentList();
    //获取日记详情数据
    this.getCaseDetails();
  },
  onLoad: function (options) {
    
    let _this=this;
    //记录日记id
    if(options.caseId){
      this.setData({
        caseId : options.caseId
      })
    }
    //当app.js中的getHospitalMsg方法执行完后设置医院基本配置信息
    app.getHospitalMsg().then(function (res) {
      //获取医院基本配置信息
      _this.setData({
        HospitalMsg: app.globalData.HospitalMsg
      })
    })
    //判断用户是否授权登陆
    if (!wx.getStorageSync('userid')) {
      app.NoLogin("请先登陆授权后在来查看日记哟！");
      return;
    }

    
  },
  //获取评论列表
  getCaseCommentList: function () {
    let _this = this;
    wx.showLoading({
      title: '加载中',
    })
    wx.request({
      url: app.globalData.shopRequestUrl + "Case/getCaseCommentList",
      data: {
        'pageIndex': _this.data.pageIndex,
        'number': _this.data.number,
        'caseid': _this.data.caseId
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
            commentList: _this.data.commentList.concat(results.data.list),
            sumPage: results.data.sumPage,
            count: results.data.count
          })
        } else {
          _this.setData({
            commentList: []
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
  //ToDo上拉加载更多评论
  //上拉加载更多数据
  getMoreData: function () {
    if (this.data.pageIndex == this.data.sumPage) {
      this.setData({
        isBottom: true
      })
    } else {
      this.setData({
        pageIndex: this.data.pageIndex + 1
      })
      this.getCaseCommentList();
    }
    //console.log("我到底了", this.data.pageIndex);
  },
  onReachBottom:function(){
    this.getMoreData();
  },

  //跳转到首页
  goHome:function(){
    wx.switchTab({
      url: '/pages/index/index',
    })
  },
  //拨打电话
  goTel: function () {
    let tel=this.data.HospitalMsg.tel;
    wx.makePhoneCall({
      phoneNumber: tel
    })
  },
  //获取日记详情数据
  getCaseDetails: function () {
    let _this = this;
    wx.showLoading({
      title: '加载中',
    })
    wx.request({
      url: app.globalData.shopRequestUrl + "Case/getCaseDetails",
      data: {
        'id': _this.data.caseId,
        'userid': wx.getStorageSync('userid'),
        'order': _this.data.order
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
            caseDetails: results.data,
            telAuthor: results.telAuthor
          })
          wx.setNavigationBarTitle({
            title: _this.data.caseDetails.name
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
  //点赞
  addfabulous: function (e) {
    //判断用户是否授权登陆
    if (!wx.getStorageSync('userid')) {
      app.NoLogin("请先登陆授权后在来点赞哟！");
      return;
    }
    let id = this.data.caseDetails.id;
    let _this = this;
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
          var isFabulous = "caseDetails.isFabulous";
          var fabulousnumber = "caseDetails.fabulousnumber";
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
    let id = this.data.caseDetails.id;
    let index = e.currentTarget.dataset.index;
    //判断用户是否授权登陆
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
          var fabulousnumber = "caseDetails.fabulousnumber";
          var isFabulous = "caseDetails.isFabulous";
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

  onShareAppMessage(res) {
    let _this=this;
    return {
      title: _this.data.caseDetails.name,
      path: '/pages/caseDetails/caseDetails?caseId=' + _this.data.caseDetails.id
    }
  },
  //加入收藏
  addCaseCollection: function () {
    //判断用户是否授权登陆
    if (!wx.getStorageSync('userid')) {
      app.NoLogin("请先登陆授权后在来收藏哟！");
      return;
    }
    let _this = this;
    wx.showLoading({
      title: '加载中',
    })
    let params = {
      'caseid': this.data.caseId,
      'userid': wx.getStorageSync('userid'),
    }
    wx.request({
      url: app.globalData.shopRequestUrl + "Collection/addCaseCollection",
      data: params,
      header: {
        "Content-Type": "application/x-www-form-urlencoded"
      },
      method: 'POST',
      success: function (result) {
        let results = result.data;
        if (results.success == true) {
          _this.setData({
            ['caseDetails.isCollection']: true
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
  deleteCaseCollection: function () {
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
      'caseid': this.data.caseId,
      'userid': wx.getStorageSync('userid'),
    }
    wx.request({
      url: app.globalData.shopRequestUrl + "Collection/deleteCaseCollection",
      data: params,
      header: {
        "Content-Type": "application/x-www-form-urlencoded"
      },
      method: 'POST',
      success: function (result) {
        let results = result.data;
        if (results.success == true) {
          _this.setData({
            ['caseDetails.isCollection']: false
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
  goMy: function () {
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
  //显示评论弹框
  showCommentPage:function(){
    this.setData({
      isShowComment:true
    })
  },
  //隐藏评论弹框
  hideCommentPage:function(){
    this.setData({
      isShowComment: false
    })
  },
  //记录用户输入的评论内容
  getInputComment:function(e){
    let text=e.detail.value;
    this.setData({
      inputComment: text
    })
  },
  //提交评论内容
  submit:function(){
    //判断用户是否授权登陆
    if (!wx.getStorageSync('userid')) {
      app.NoLogin("请先登陆授权后在来评论哟！");
      return;
    }
    let _this = this;
    wx.showLoading({
      title: '加载中',
    })
    let params = {
      'caseid': this.data.caseId,
      'userid': wx.getStorageSync('userid'),
      'content': this.data.inputComment
    }
    wx.request({
      url: app.globalData.shopRequestUrl + "Case/addComment",
      data: params,
      header: {
        "Content-Type": "application/x-www-form-urlencoded"
      },
      method: 'POST',
      success: function (result) {
        let results = result.data;
        wx.showModal({
          title: '提示',
          content: results.msg,
          showCancel: false
        })
        _this.setData({
          inputComment: null,
        })
        _this.onShow();
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
  //跳转到商品详情页面
  goShopDetails: function (e) {
    let shopId = e.currentTarget.dataset.shopid;
    wx.navigateTo({
      url: '/pages/shopDetails/shopDetails?shopId=' + shopId,
    })
  },
  /** 
	 * 预览图片
	 */
  previewImage: function (e) {
    var current = e.target.dataset.src;
    var imgList = e.target.dataset.imglist;
    wx.previewImage({
      current: current, // 当前显示图片的http链接
      urls: imgList // 需要预览的图片http链接列表
    })
  },
  // 获取倒叙变美过程
  changeDesc:function(){
    this.setData({
      order: 'asc'
    })
    this.getCaseDetails();
  },
  // 获取正叙变美过程
  changeAsc: function () {
    this.setData({
      order: 'desc'
    })
    this.getCaseDetails();
  },
  //获取用户手机号信息
  getPhoneNumber: function (e) {
    let _this = this;
    let encryptedData = e.detail.encryptedData;
    if (encryptedData) {
      wx.checkSession({
        success() {
          //此时session_key未失效执行获取用户手机号操作
          wx.showLoading({
            title: '加载中',
          })
          wx.request({
            url: app.globalData.shopRequestUrl + "Case/getUserTel",
            data: {
              'iv': e.detail.iv,
              'encryptedData': encryptedData,
              'userId': wx.getStorageSync('userid'),
              'caseid': _this.data.caseId
            },
            header: {
              "Content-Type": "application/x-www-form-urlencoded"
            },
            method: 'POST',
            success: function (result) {
              let results = result.data;
              if (results.success) {
                _this.setData({
                  telAuthor: true
                })
              } else {
                wx.showModal({
                  title: '提示',
                  content: '当前登陆授权状态已失效，请重新授权!',
                  showCancel: false,
                  success: function () {
                    wx.navigateTo({
                      url: '/pages/author/author',
                    })
                  }
                })
              }
            },
            fail: function () {
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
        fail() {
          //此时session_key已失效跳转到授权页面
          wx.showModal({
            title: '提示',
            content: '当前登陆授权状态已失效，请重新授权!',
            showCancel: false,
            success: function () {
              wx.navigateTo({
                url: '/pages/author/author',
              })
            }
          })

        }
      })
    } else {
      wx.showModal({
        title: '提示',
        content: '请允许手机号授权后才可以查看日记详情哟！',
        showCancel: false,
      })
    }
  },
})
