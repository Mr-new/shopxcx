//index.js
//获取应用实例
const app = getApp()

Page({
  data: {
    motto: 'Hello World',
    userInfo: {},
    hasUserInfo: false,
    canIUse: wx.canIUse('button.open-type.getUserInfo'),
    publicImgUrl: app.globalData.publicImgUrl,  //公共图片路径
    idx:1,  //默认选中tab
    orderid:null,  //砍价订单id
    details: null,  //砍价订单详情数据
    countDownList: [],
    actEndTimeList: []
  },
 
  onLoad: function (options) {
    if(options){
      this.setData({
        orderid: options.orderid
      })
    }
  },
  onShow:function(){
    this.getData();
    
  },
  onPullDownRefresh() {
    this.onShow();
  },
  //获取邀请详情数据
  getData: function () {
    let _this = this;
    wx.showLoading({
      title: '加载中',
    })
    wx.request({
      url: app.globalData.shopRequestUrl + "Bargain/getBargainDetails",
      data: {
        'orderid': _this.data.orderid,
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
            details: results.data
          })
          let endTimeList = [];
          // 将活动的结束时间参数提成一个单独的数组，方便操作
          let goodsList = [
            { actEndTime: _this.data.details.goods.bargainenddatetime },
          ]
          goodsList.forEach(o => { endTimeList.push(o.actEndTime) })
          _this.setData({ actEndTimeList: endTimeList });
          // 执行倒计时函数
          _this.countDown();
        } else {
          wx.showToast({
            icon: 'none',
            duration:2000,
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
        wx.stopPullDownRefresh();
      }
    })
  },
  //切换底部选项
  tabSwitch:function(e){
    let idx=e.currentTarget.dataset.id;
    this.setData({
      idx: idx
    })
  },
  timeFormat(param) {//小于10的格式化函数
    return param < 10 ? '0' + param : param;
  },
  countDown() {//倒计时函数
    // 获取当前时间，同时得到活动结束时间数组
    let newTime = new Date().getTime();
    let endTimeList = this.data.actEndTimeList;
    let countDownArr = [];

    // 对结束时间进行处理渲染到页面
    endTimeList.forEach(o => {
      let endTime = new Date(o).getTime();
      let obj = null;
      // 如果活动未结束，对时间进行处理
      if (endTime - newTime > 0) {
        let time = (endTime - newTime) / 1000;
        // 获取天、时、分、秒
        let day = parseInt(time / (60 * 60 * 24));
        let hou = parseInt(time % (60 * 60 * 24) / 3600);
        let min = parseInt(time % (60 * 60 * 24) % 3600 / 60);
        let sec = parseInt(time % (60 * 60 * 24) % 3600 % 60);
        obj = {
          day: this.timeFormat(day),
          hou: this.timeFormat(hou),
          min: this.timeFormat(min),
          sec: this.timeFormat(sec)
        }
      } else {//活动已结束，全部设置为'00'
        obj = {
          day: '00',
          hou: '00',
          min: '00',
          sec: '00'
        }
      }
      countDownArr.push(obj);
    })
    // 渲染，然后每隔一秒执行一次倒计时函数
    this.setData({ countDownList: countDownArr })
    setTimeout(this.countDown, 1000);
  },
  //转发
  onShareAppMessage: function (res) {
    if (res.from === 'button') {

    }
    return {
      title: '快来帮我砍价',
      path: '/pages/bargainShare/bargainShare?orderid=' + this.data.orderid,
      success: function (res) {
        console.log('成功', res)
      }
    }
  },
  //砍价操作
  doBargain:function(){
    let _this = this;
    wx.showLoading({
      title: '加载中',
    })
    wx.request({
      url: app.globalData.shopRequestUrl + "Bargain/doBargain",
      data: {
        'orderid': _this.data.orderid,
        'userid': wx.getStorageSync('userid')
      },
      header: {
        "Content-Type": "application/x-www-form-urlencoded"
      },
      method: 'POST',
      success: function (result) {
        let results = result.data;
        console.log(results);
        wx.showModal({
          title: '提示',
          content: results.msg,
          showCancel: false,
          success:function(){
            _this.onShow();
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
  }
})
