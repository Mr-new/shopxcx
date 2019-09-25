// online.js
var app = getApp();
Page({
  /**
   * 页面的初始数据
   */
  data: {
    postData:{},
    today: formatTime(),
    datetimes: formatTime(),
    imgpath: app.globalData.urlpath + "/images/",
    items: [
      { name: 'female', value: '女', checked: 'true' },
      { name: 'male', value: '男' },
    ],
    radioStr: '女',
    list: [
      { name: 'a', value: '皮肤暗沉' },
      { name: 'b', value: '大小眼' },
      { name: 'c', value: '单眼皮' },
      { name: 'd', value: '塌鼻' },
      { name: 'e', value: '大饼脸' },
      { name: 'f', value: '胸部下垂' },
      { name: 'g', value: '鱼尾纹' },
      { name: 'h', value: '抬头纹' },
      { name: 'i', value: '斑点' },
      { name: 'j', value: '大粗腿' },
    ],
    checkArr: [],
    list1: [
      { name: 'k', value: '价格' },
      { name: 'm', value: '效果' },
      { name: 'l', value: '专家' },
      { name: 'n', value: '恢复时间' },
      { name: 'o', value: '其他' },
    ],
    checkArr1: []
  },
  onLoad: function (options) {
    var that = this
    //判断用户是否授权登陆
    if (!wx.getStorageSync('userid')) {
      app.NoLogin("请先登陆授权后在来预约哟！");
      return;
    }
  },
  //用户选择性别操作
  radioChange: function (e) {
    var str = null;
    for (var value of this.data.items) {
      if (value.name === e.detail.value) {
        str = value.value;
        break;
      }
    }
    this.setData({ radioStr: str });
  },
  MyfromSubmit: function (evt) {//表单提交
    var that = this
    var postData = evt.detail.value;
    postData.sex = that.data.radioStr
    if (postData.patients.length < 1){
      wx.showToast({
        icon: 'none',
        title: '请输入姓名',
      })
    }else if(postData.tel.length < 1){
      wx.showToast({
        icon: 'none',
        title: '请输入电话号码',
      })
    }else{
      postData.typename = that.data.checkArr.join(',');
      postData.mind = that.data.checkArr1.join(',');
      console.log("提交数据",postData);
      wx.showLoading({
        title: '加载中',
      })
      wx.request({
        url: app.globalData.shopRequestUrl + "Online/addOnline",
        data: postData,
        header: {
          "Content-Type": "application/x-www-form-urlencoded"
        },
        method: 'POST',
        success: function (result) {
          let results = result.data;
          console.log(results);
          if (results.success) {
            wx.showModal({
              title: '提示',
              content: results.msg,
              showCancel: false,
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
    }
  },
  checkboxChange: function (e) {
    var arr = [];
    e.detail.value.forEach(current => {
      for (var value of this.data.list) {
        if (current === value.name) {
          arr.push(value.value);
          break;
        }
      }
    });
    this.setData({ checkArr: arr });
  },
  checkboxChange1: function (e) {
    var arr = [];
    e.detail.value.forEach(current => {
      for (var value of this.data.list1) {
        if (current === value.name) {
          arr.push(value.value);
          break;
        }
      }
    });
    this.setData({ checkArr1: arr });
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
                  [`postData.tel`]: results.data
                })
              } else {
                wx.showModal({
                  title: '提示',
                  content: '当前授权状态已失效，请重新授权!',
                  showCancel: false,
                  success: function () {
                    wx.reLaunch({
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
            content: '当前授权状态已失效，请重新授权!',
            showCancel: false,
            success: function () {
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
  bindDateChange: function (e) {//日期选择器
    this.setData({
      datetimes: e.detail.value
    })
  },
  //分享
  onShareAppMessage(res) {
    let _this = this;
    return {
      title: "预约",
      path: '/pages/online/online'
    }
  },

})

function formatTime(date = new Date) {
  var year = date.getFullYear()
  var month = date.getMonth() + 1
  var day = date.getDate()

  var hour = date.getHours()
  var minute = date.getMinutes()
  var second = date.getSeconds()

  return year + "-" + month + "-" + day;
}