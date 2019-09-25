//app.js
App({
  onLaunch: function () {
    let _this=this;
    //获取医院配置信息
    this.getHospitalMsg();  
    //检测用户是否授权
    // this.authorUserInfo();
    //获取用户设备状态栏高度并记录
    wx.getSystemInfo({
      success: function (res) {
        _this.globalData.statusBarHeight = res.statusBarHeight;
      }
    })



    // 展示本地存储能力
    var logs = wx.getStorageSync('logs') || []
    logs.unshift(Date.now())
    wx.setStorageSync('logs', logs)
    if (wx.canIUse('getUpdateManager')) {
      const updateManager = wx.getUpdateManager()
      updateManager.onCheckForUpdate(function (res) {
        console.log('onCheckForUpdate====', res)
        // 请求完新版本信息的回调
        if (res.hasUpdate) {
          console.log('res.hasUpdate====')
          updateManager.onUpdateReady(function () {
            wx.showModal({
              title: '更新提示',
              content: '新版本已经准备好，是否重启应用？',
              success: function (res) {
                console.log('success====', res)
                // res: {errMsg: "showModal: ok", cancel: false, confirm: true}
                if (res.confirm) {
                  // 新的版本已经下载好，调用 applyUpdate 应用新版本并重启
                  updateManager.applyUpdate()
                }
              }
            })
          })
          updateManager.onUpdateFailed(function () {
            // 新的版本下载失败
            wx.showModal({
              title: '已经有新版本了哟~',
              content: '新版本已经上线啦~，请您删除当前小程序，重新搜索打开哟~'
            })
          })
        }
      })
    }
    // 获取用户信息
    wx.getSetting({
      success: res => {
        if (res.authSetting['scope.userInfo']) {
          // 已经授权，可以直接调用 getUserInfo 获取头像昵称，不会弹框
          wx.getUserInfo({
            success: res => {
              // 可以将 res 发送给后台解码出 unionId
              this.globalData.userInfo = res.userInfo

              // 由于 getUserInfo 是网络请求，可能会在 Page.onLoad 之后才返回
              // 所以此处加入 callback 以防止这种情况
              if (this.userInfoReadyCallback) {
                this.userInfoReadyCallback(res)
              }
            }
          })
        }
      }
    })
  },
  //获取医院配置信息
  getHospitalMsg: function () {
    let _this = this;
    return new Promise(function (resolve, reject) {
      wx.request({
        url: _this.globalData.shopRequestUrl + "Hospital/getHospitalMsg",
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
            _this.globalData.HospitalMsg = results.data;
            resolve(results);
          } else {
            wx.showToast({
              icon: 'none',
              title: results.msg,
            })
            reject('error');
          }
        },
        fail: function (err) {
          wx.showToast({
            icon: 'none',
            title: '网络似乎走丢了哟',
          })
        },
        complete: function () {

        }
      })
    });
  },
  //未登陆:弹出提示框并跳转到登陆授权页面
  NoLogin:function(msg){
    wx.showModal({
      title: '提示',
      content: msg,
      showCancel: false,
      success: function () {
        wx.navigateTo({
          url: '/pages/author/author',
        })
      }
    })
  },
  //兼容ios时间转换
  dateFromString:function(time){
    time = time.replace(/-/g, ':').replace(' ', ':')
    time = time.split(':')
    var time1 = new Date(time[0], (time[1] - 1), time[2], time[3], time[4], time[5])
    return time1
  },
  //判断用户是否授权用户信息：如果为授权则跳转到授权页面，已授权则执行接下来操作
  // authorUserInfo:function(){
  //   let userid=wx.getStorageSync('userid');
  //   if(!userid){
  //     console.log("未授权，跳转到授权页面")
  //     // wx.reLaunch({
  //     //   url: '/pages/author/author',
  //     // })
  //   }
  //   wx.getSetting({
  //     success: function (res) {
  //       if (!res.authSetting['scope.userInfo']) {
  //         console.log("未授权，跳转到授权页面")
  //         // wx.reLaunch({
  //         //   url: '/pages/author/author',
  //         // })
  //       }
  //     },
  //     fail:function(){
  //       wx.reLaunch({
  //         url: '/pages/author/author',
  //       })
  //     }
  //   })
  // },

  //全局变量
  globalData: {
    statusBarHeight: 0,  //顶部状态栏高度
    userInfo: null,  //用户信息
    caseMenuIdx:0,  //日记选中菜单
    wendaMenuIdx:0,  //颜值馆默认选中菜单
    frequency:0, //砸蛋次数
    // 砸金蛋接口地址
    // testRequestUrl:"http://shopxcx.com/index.php/Api/",  //测试地址
    testRequestUrl: "https://xaxcx.yixingtb.com/index.php/Api/",  //线上地址
    //健步挑战赛接口地址
    // stepRequestUrl: "http://shopxcx.com/index.php/Step/",  //测试地址
    stepRequestUrl: "https://xaxcx.yixingtb.com/index.php/Step/",  //线上地址
    //公共图片路径
    publicImgUrl: "https://xaxcx.yixingtb.com/Public/uploadImages/default/",
    //商城接口地址
    // shopRequestUrl: "http://shopxcx.com/index.php/Shop/",  //测试地址
    shopRequestUrl: "https://xaxcx.yixingtb.com/index.php/Shop/",  //线上地址
    HospitalMsg:null, //医院基本信息配置
    urlpath: "https://wxxcx.yixingtb.com",
  }
})