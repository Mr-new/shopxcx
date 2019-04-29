//app.js
App({
  onLaunch: function () {
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
    // 登录
    // this.goLogin();
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
  //执行登陆操作
  goLogin:function(topId,callback){
    let _this = this;
    wx.login({
      success: res => {
        // 发送 res.code 到后台换取 openId, sessionKey, unionId
        console.log(res);
        wx.request({
          url: this.globalData.testRequestUrl + "Login/login",
          data: {
            "code": res.code,
            "topId": topId
          },
          header: {
            "Content-Type": "application/x-www-form-urlencoded"
          },
          method: 'POST',
          success: function (result) {
            if (result.data.success) {
              let third_Session = result.data.data.session3rd;
              let userId = result.data.data.userId;
              let frequency = result.data.data.frequency;
              console.log(result.data);
              _this.globalData.frequency = frequency;  //记录用户可用砸蛋次数
              callback();
              //记录session3rd
              wx.setStorage({
                key: "third_Session",
                data: third_Session
              })
              //记录用户id
              wx.setStorage({
                key: 'userId',
                data: userId,
              })
            } else {
              console.log(result);
            }
          }
        })
      }
    })
  },
  globalData: {
    userInfo: null,
    frequency:0, //砸蛋次数
    // 砸金蛋接口地址
    // testRequestUrl:"http://shopxcx.com/index.php/Api/",  //测试地址
    testRequestUrl: "https://xaxcx.17mall.cc/index.php/Api/",  //线上地址
    //健步挑战赛接口地址
    // stepRequestUrl: "http://shopxcx.com/index.php/Step/",  //测试地址
    stepRequestUrl: "https://xaxcx.17mall.cc/index.php/Step/",  //线上地址
    publicImgUrl: "http://shopxcx.com/Public/uploadImages/default/"
  }
})