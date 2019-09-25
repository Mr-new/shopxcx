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
      { id: 3, title: "已取消" },
      { id: 4, title: "退款订单" },
    ],
    idx:0,  //默认选中
    orderList: [],  //订单列表
    pageIndex: 1, //当前第几页
    number: 3,  //每页显示数量
    sumPage: 1,  //总页数
    isBottom: false,  //是否到底
  },
  onShow: function(){
    this.setData({
      orderList: [],
      pageIndex: 1,
      isBottom: false,
    });
    //获取订单数据列表
    this.getOrderList();
  },
  onLoad: function (options) {
    //判断传过来不同参数选中不同顶部菜单
    // if(options){
    //   this.setData({
    //     idx: options.idx
    //   })
    // }
  },
  //tab切换
  tabSwitch:function(e){
    let index=e.currentTarget.dataset.id;
    this.setData({
      idx:index,
      orderList:[],
      pageIndex: 1,
      isBottom: false,
    });
    //获取订单数据列表
    this.getOrderList();
  },
  //跳转到订单详情页面
  goOrderDetails:function(e){
    let id=e.currentTarget.dataset.id;
    wx.navigateTo({
      url: '/pages/integralOrderDetails/integralOrderDetails?id='+id,
    })
  },
  //跳转到支付
  gopay:function(e){
    let _this=this;
    let id = e.currentTarget.dataset.id;
    wx.showLoading({
      title: '加载中',
    })
    wx.request({
      url: app.globalData.shopRequestUrl + "Order/payOrder",
      data: {
        'id': id,
      },
      header: {
        "Content-Type": "application/x-www-form-urlencoded"
      },
      method: 'POST',
      success: function (result) {
        let results = result.data;
        if(results.success==true){
          wx.requestPayment({
            timeStamp: results.data['timeStamp'],
            nonceStr: results.data['nonceStr'],
            package: results.data['package'],
            signType: results.data['signType'],
            paySign: results.data['paySign'],
            success: function (res) {
              wx.navigateTo({
                url: '/pages/paySuccess/paySuccess?orderNumber=' + results.data['orderNumber'] + '&sumPrice=' + results.data['sumPrice'],
              })
            },
            fail: function (res) {
              wx.navigateTo({
                url: '/pages/orderDetails/orderDetails?id='+ id,
              })
            }
          })
        }else{
          wx.showToast({
            icon: 'none',
            title: '出错了哟！',
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
  //滑动到底
  onReachBottom:function(){
    if (this.data.pageIndex == this.data.sumPage) {
      this.setData({
        isBottom: true
      })
    } else {
      this.setData({
        pageIndex: this.data.pageIndex + 1
      })
      this.getOrderList();
    }
  },
  //获取订单数据
  getOrderList: function () {
    //判断用户是否授权登陆
    if (!wx.getStorageSync('userid')) {
      app.NoLogin("请先登陆授权后在来查看积分订单哟！");
      return;
    }
    let _this = this;
    wx.showLoading({
      title: '加载中',
    })
    wx.request({
      url: app.globalData.shopRequestUrl + "Integral/getOrderList",
      data: {
        'pageIndex': _this.data.pageIndex,
        'number': _this.data.number,
        'userid': wx.getStorageSync('userid'),
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
            orderList: _this.data.orderList.concat(results.data.list),
            sumPage: results.data.sumPage
          })
        } else {
          _this.setData({
            orderList: []
          });
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
  //取消订单
  canceOrder: function (e) {
    let _this = this;
    wx.showModal({
      title: '提示',
      content: '确认取消订单？',
      success(res) {
        if (res.confirm) {
          let id = e.currentTarget.dataset.id;
          wx.showLoading({
            title: '加载中',
          })
          wx.request({
            url: app.globalData.shopRequestUrl + "Order/saveOrderStatus",
            data: {
              'id': id,
              'status': 3
            },
            header: {
              "Content-Type": "application/x-www-form-urlencoded"
            },
            method: 'POST',
            success: function (result) {
              let results = result.data;
              wx.showToast({
                icon: 'none',
                title: results.msg,
              });
              //获取订单列表数据
              _this.getOrderList();
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
        } else if (res.cancel) {
          console.log('用户点击取消')
        }
      }
    })
  },
  //申请退款
  refund:function(e){
    let _this = this;
    wx.showModal({
      title: '提示',
      content: '确认申请退款？',
      success(res) {
        if (res.confirm) {
          let id = e.currentTarget.dataset.id;
          wx.showLoading({
            title: '加载中',
          })
          wx.request({
            url: app.globalData.shopRequestUrl + "Order/saveOrderStatus",
            data: {
              'id': id,
              'status': 4
            },
            header: {
              "Content-Type": "application/x-www-form-urlencoded"
            },
            method: 'POST',
            success: function (result) {
              let results = result.data;
              wx.showModal({
                title: '提示',
                content: '订单已申请退款，请耐心等待客服退款!',
                showCancel:false,
                success(res) {
                  if (res.confirm) {
                    //获取订单列表数据
                    _this.setData({
                      idx: 4,
                      orderList: [],
                      pageIndex: 1,
                      isBottom: false,
                    })
                    _this.getOrderList();
                  }
                }
              })

              
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
        } else if (res.cancel) {
          console.log('用户点击取消')
        }
      }
    })
  },
  //提交评论
  comment:function(e){
    let orderId=e.currentTarget.dataset.id;
    let shopId=e.currentTarget.dataset.shopid;
    wx.navigateTo({
      url: '/pages/commentOrder/commentOrder?orderId=' + orderId + '&shopId=' + shopId,
    })
  },
  //跳转到查看评论页面
  goComment:function(e){
    let commentId=e.currentTarget.dataset.id;
    wx.navigateTo({
      url: '/pages/lookComment/lookComment?commentId='+commentId,
    })
  }

})
