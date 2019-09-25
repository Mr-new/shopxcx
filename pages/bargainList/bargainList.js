//index.js
//获取应用实例
const app = getApp()
// let goodsList = [
//   { actEndTime: '2020/05/01 10:00:43' },
//   { actEndTime: '2018/04/01 11:00:00' },
//   { actEndTime: '2018/06/01 12:45:56' },
//   { actEndTime: '2018/07/01 15:00:23' },
//   { actEndTime: '2018/05/23 17:00:22' },
//   { actEndTime: '2018/05/14 19:00:44' },
//   { actEndTime: '2018/05/21 21:00:34' },
//   { actEndTime: '2018/06/17 09:00:37' },
//   { actEndTime: '2018/03/21 05:00:59' },
//   { actEndTime: '2018/04/19 07:00:48' },
//   { actEndTime: '2018/04/28 03:00:11' }
// ]
Page({
  data: {
    motto: 'Hello World',
    userInfo: {},
    hasUserInfo: false,
    canIUse: wx.canIUse('button.open-type.getUserInfo'),
    tabList: [
      { id: 1, title: "进行中" },
      { id: 2, title: "未开始" },
    ],
    idx: 1,
    goodsList:[],  //秒杀商品列表
    countDownList: [],
    actEndTimeList: []
  },
  
  onLoad: function () {
    //获取秒杀商品列表
    this.getSeckillCommodityList();
    
  },
  //tab切换
  tabChange: function(e){
    let idx = e.currentTarget.dataset.id;
    this.setData({
      idx: idx
    })
    //获取秒杀商品列表
    this.getSeckillCommodityList();
  },
  //获取秒杀商品列表
  getSeckillCommodityList: function () {
    let _this = this;
    wx.showLoading({
      title: '加载中',
    })
    wx.request({
      url: app.globalData.shopRequestUrl + "Bargain/getBargainCommodityList",
      data: {
        status: _this.data.idx
      },
      header: {
        "Content-Type": "application/x-www-form-urlencoded"
      },
      method: 'POST',
      success: function (result) {
        let results = result.data;
        console.log(results);
        // return;
        if (results.success == true) {
          _this.setData({
            goodsList: results.data
          })
          let endTimeList = [];
          // 将活动的结束时间参数提成一个单独的数组，方便操作
          if(_this.data.idx==1){
            _this.data.goodsList.forEach(o => { endTimeList.push(app.dateFromString(o.bargainenddatetime)) })
          }else{
            _this.data.goodsList.forEach(o => { endTimeList.push(app.dateFromString(o.bargainstartdatetime)) })
          }
          _this.setData({ actEndTimeList: endTimeList });
          // 执行倒计时函数
          _this.countDown();
        } else {
          _this.setData({
            goodsList: []
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
  //跳转到秒杀商品详情
  goShopDetails:function(e){
    if(this.data.idx==2){
      wx.showModal({
        title: '提示',
        content: '砍价活动暂未开始哟!',
        showCancel: false,
      })
    }else{
      let shopId = e.currentTarget.dataset.shopid;
      wx.navigateTo({
        url: '/pages/bargainDetails/bargainDetails?shopId=' + shopId,
      })
    }
  }
})
