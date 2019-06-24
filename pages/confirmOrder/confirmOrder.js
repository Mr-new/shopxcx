//index.js
//获取应用实例
const app = getApp()

Page({
  data: {
    motto: 'Hello World',
    userInfo: {},
    hasUserInfo: false,
    canIUse: wx.canIUse('button.open-type.getUserInfo'),
    HospitalMsg: null,  //医院基本配置信息
    // shopId: null,  //商品id
    // specsId: null,  //规格id
    // num: null,  //数量
    orderArr: [],  //提交订单信息：购物车id，商品id，规格id，数量
    orderDetails: null,  //订单详细信息
    tel: "",  //手机号码 
    remarks: "",  //备注内容
  },
  onLoad: function (options) {
    if(options){
      let orderArr=JSON.parse(options.orderArr);
      console.log(orderArr);
      this.setData({
        orderArr: orderArr
      })
    }
    //获取医院基本配置信息
    this.setData({
      HospitalMsg: app.globalData.HospitalMsg
    })
    //获取订单详情数据
    this.getOrderMsg();


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
  //获取订单详情数据
  getOrderMsg: function () {
    let _this = this;
    wx.showLoading({
      title: '加载中',
    })
    wx.request({
      url: app.globalData.shopRequestUrl + "Order/getOrderMsg",
      data: {
        'orderArr': JSON.stringify(_this.data.orderArr)
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
            orderDetails: results.data
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
  //获取手机号
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
            url: app.globalData.shopRequestUrl + "Order/getUserTel",
            data: {
              'iv': e.detail.iv,
              'encryptedData': encryptedData,
              'userId': wx.getStorageSync('userid')
            },
            header: {
              "Content-Type": "application/x-www-form-urlencoded"
            },
            method: 'POST',
            success: function (result) {
              let results = result.data;
              console.log(results);
              if (results.success) {
                _this.setData({
                  tel: results.data
                })
              } else {
                wx.showToast({
                  icon: 'none',
                  title: results.msg,
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
            content: '当前授权状态已失效，请重新授权!',
            showCancel: false,
            success:function(){
              wx.reLaunch({
                url: '/pages/author/author',
              })
            }
          })
          
        }
      })
    } else {
      wx.showModal({
        title: '提示',
        content: '请允许手机号授权',
        showCancel: false,
      })
    }
  },
  //记录用户输入的手机号
  getTelValue:function(e){
    this.setData({
      tel: e.detail.value
    })
  },
  //记录用户输入的备注内容
  getRemarksValue:function(e){
    this.setData({
      remarks: e.detail.value
    })
  },
  //导航到院
  goMap: function (e) {
    let _this=this;
    let lng = this.data.HospitalMsg.lng;
    let lat = this.data.HospitalMsg.lat;
    wx.openLocation({//​使用微信内置地图查看位置。
      latitude: parseFloat(lat),//要去的纬度-地址
      longitude: parseFloat(lng),//要去的经度-地址
      name: _this.data.HospitalMsg.hospitalname,
      address: _this.data.HospitalMsg.address
    })
  },

  //提交订单并发起支付
  goPay:function(){
    let _this = this;
    if(_this.data.tel.length==0){
      wx.showToast({
        icon:'none',
        title: '请输入手机号',
      })
    }else{
      wx.showLoading({
        title: '加载中',
      });
      let params={  //提交订单数据
        'userid': wx.getStorageSync('userid'),
        'orderArr': JSON.stringify(_this.data.orderArr),
        'tel': _this.data.tel,
        'remarks': _this.data.remarks,
        'sumprice': _this.data.orderDetails.sumPrice,
      }
      wx.request({
        url: app.globalData.shopRequestUrl + "Order/submitOrder",
        data: params,
        header: {
          "Content-Type": "application/x-www-form-urlencoded"
        },
        method: 'POST',
        success: function (result) {
          let results = result.data;
          console.log(results);
          if (results.success == true) {
            if(results.data.state==200){
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
                  wx.redirectTo({
                    url: '/pages/order/order?idx=' + 1,
                  })
                }
              })
            }else{
              console.log(results.data);
              wx.showToast({
                icon: 'none',
                title: '出错了哟',
              })
            }
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
    }
    
    
    // wx.navigateTo({
    //   url: '/pages/paySuccess/paySuccess',
    // })
  }
})
