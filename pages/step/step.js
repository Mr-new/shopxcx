//index.js
//获取应用实例
const app = getApp()
let PublicImgUrl = "https://xaxcx.yixingtb.com/Public/uploadImages/default/";
Page({
  data: {
    motto: 'Hello World',
    userInfo: {},
    imgUrl: "https://xaxcx.yixingtb.com/Public/uploadImages/default/",
    hasUserInfo: false,
    canIUse: wx.canIUse('button.open-type.getUserInfo'),
    sumStep:0,  //用户运动总步数
    todayStep:0,  //用户今天运动步数
    ljStep:[0,0,0,0,0],  //累计步数
    syStep:[0,0,0,0,0],  //剩余达标步数
    prizeList:[],  //门槛奖品列表
    isLuckDraw:false,  //领取奖品
    isShowMyPrize:false,  //是否显示我的卡券弹框
    myPrizeList: null,  //我的卡券列表
    issharepyq: false,  //是否显示保存分享图弹框
    shareQrImg:null,  //小程序二维码（包含userid）
    shareCoverImg: 'https://xaxcx.yixingtb.com/Public/uploadImages/default/step_share_back_01.png', // 分享封面图
    isShowSharePage:false,  //是否显示分享页面
    isShowsy:true,  //是否显示剩余多少步达成下一个目标
    isLogin:true, //是否显示授权弹框
    isAuthor:1,  //授权状态：1仅显示用户信息授权，2仅显示用户手机号授权
    src: "https://xaxcx.yixingtb.com/Public/music/stepBackMusic.mp3",  //背景音乐地址
    isShowRole: false,  //是否显示规则弹框
    activityDetails: null,  //活动规则内容
  },
  //执行登陆操作
  goLogin:function(topId){
    let _this = this;
    wx.login({
      success(res) {
        if (res.code) {
          //请求登陆接口
          wx.request({
            url: app.globalData.stepRequestUrl + "Login/login",
            data: {
              "code": res.code,
              'topId':topId
            },
            header: {
              "Content-Type": "application/x-www-form-urlencoded"
            },
            method: 'POST',
            success: function (result) {
              let results=result.data;
              console.log(results);
              wx.setStorage({
                key: 'stepUserId',
                data: results.data.userId,
              })
            },
            fail: function(err) {
              wx.showModal({
                title: '提示',
                content: '网络似乎走丢了哟',
                showCancel: false
              })
            },
            complete: function () {

            }
          })
        } else {
          console.log('登录失败！' + res.errMsg)
        }
      }
    })
  },
  //获取规则信息
  getStepRules:function(){
    let _this=this;
    wx.request({
      url: app.globalData.stepRequestUrl + "Index/getStepRules",
      data: {
        
      },
      header: {
        "Content-Type": "application/x-www-form-urlencoded"
      },
      method: 'POST',
      success: function (result) {
        let results = result.data;
        console.log(results);
        _this.setData({
          activityDetails:results.data.content
        })
      },
      fail: function (err) {
        wx.showModal({
          title: '提示',
          content: '网络似乎走丢了哟',
          showCancel: false
        })
      },
      complete: function () {

      }
    })
  },
  onLoad: function (options) {
    wx.showModal({
      title: '提示',
      content: '活动暂未开始哟！',
      showCancel: false,
      success: function () {
        wx.navigateBack({

        })
      }
    })
    this.getStepRules();
    let myAudio = wx.createAudioContext('myAudio');
    myAudio.play();  //自动播放背景音乐
    //获取门槛奖品列表
    this.getPrizeList();
    let _this=this;
    let topId = 0;  //上级id
    if (options.topId) {
      topId = options.topId
    } else if (options.scene) {
      topId = decodeURIComponent(options.scene);
    }
    console.log(topId);
    //检查session_key是否失效
    wx.checkSession({
      success() {
        // session_key 未过期，并且在本生命周期一直有效
        console.log("session未失效");
        let userId = wx.getStorageSync('stepUserId');
        if(!userId){
          //如果本地存储中没有userId则说明登陆失效：重新发起登陆
          _this.goLogin(topId);
        }
      },
      fail() {
        // session_key 已经失效，需要重新执行登录流程
        _this.goLogin(topId);
      }
    })
    // this.getUserStep();
    //判断用户是否授权用户信息和手机号
    let userinfo = wx.getStorageSync('userinfo');
    let usertel = wx.getStorageSync('usertel');
    if(userinfo && usertel){
      _this.setData({
        isLogin:false
      })
    } else if (!userinfo) {
      _this.setData({
        isLogin: true,
        isAuthor: 1
      })
    }else if(!usertel){
      _this.setData({
        isLogin: true,
        isAuthor: 2
      })
    }else{
      _this.setData({
        isLogin: true,
        isAuthor: 1
      })
    }
    
  },
  onShow:function(){
    this.getUserStep();
  },
  //获取用户基本信息
  getUserInfo: function(e) {
    let _this=this;
    let userInfo=e.detail.userInfo;  //用户信息
    if(userInfo!=undefined){
      let userId = wx.getStorageSync('stepUserId');  //用户id
      //请求绑定用户信息接口
      wx.request({
        url: app.globalData.stepRequestUrl + "Login/getUserInfo",
        data: {
          "userInfo": JSON.stringify(userInfo),
          "userId": userId
        },
        header: {
          "Content-Type": "application/x-www-form-urlencoded"
        },
        method: 'POST',
        success: function (result) {
          let results = result.data;
          console.log(results);
          // wx.showModal({
          //   title: '提示',
          //   content: '获取用户信息成功',
          //   showCancel: false
          // })
          wx.setStorageSync('userinfo', true);
          //判断用户是否授权手机号，如果授权则直接隐藏授权弹框，如果未授权则显示手机号授权弹框
          let usertel = wx.getStorageSync('usertel');
          if(usertel){
            _this.setData({
              isLogin:false,
              isAuthor:1,
            })
          }else{
            _this.setData({
              isAuthor: 2
            });
          } 
        },
        fail: function (err) {
          wx.showModal({
            title: '提示',
            content: '网络似乎走丢了哟',
            showCancel: false
          })
        },
        complete: function () {

        }
      })
    }else{
      wx.showModal({
        title: '提示',
        content: '请允许用户信息授权,方便中奖后客服联系您哟',
        showCancel: false
      })
    }
  },
  //获取用户手机号信息
  getPhoneNumber:function(e){
    let _this = this;
    let encryptedData = e.detail.encryptedData;
    if (encryptedData) {
      wx.login({
        success: res => {
          wx.request({
            url: app.globalData.stepRequestUrl + "Login/getUserTel",
            data: {
              'code': res.code,
              'iv': e.detail.iv,
              'encryptedData': encryptedData
            },
            header: {
              "Content-Type": "application/x-www-form-urlencoded"
            },
            method: 'POST',
            success: function (result) {
              console.log(result.data);
              _this.setData({
                isAuthor: 1,
                isLogin:false,
              });
              wx.setStorageSync('usertel', true);
              // wx.showModal({
              //   title: '提示',
              //   content: '获取用户手机号码成功',
              //   showCancel: false
              // })
            },
            fail: function () {
              wx.showModal({
                title: '提示',
                content: '网络似乎走丢了哟',
                showCancel: false
              })
            },
            complete: function () {

            }
          })
        }
      })
    } else {
      wx.showModal({
        title: '提示',
        content: '请允许手机号授权,方便中奖后客服联系您哟',
        showCancel: false,
      })
    }
  },
  //获取用户运动步数
  getUserStep:function(){
    let _this=this;
    wx.login({
      success(result) {
        let code = result.code;
        wx.getWeRunData({
          success(res) {
            let encryptedData = res.encryptedData;
            let iv = res.iv;
            wx.request({
              url: app.globalData.stepRequestUrl + "Login/getUserStep",
              data: {
                'code': code,
                'iv': iv,
                'encryptedData': encryptedData
              },
              header: {
                "Content-Type": "application/x-www-form-urlencoded"
              },
              method: 'POST',
              success: function (result) {
                console.log(result.data);
                // return;
                // wx.showModal({
                //   title: '提示',
                //   content: result.data.msg,
                //   showCancel: false
                // })
                if(result.data.success){
                  if(result.data.data.isLuckDraw==4){
                    _this.setData({
                      isShowsy:false
                    })
                  }
                  _this.setData({
                    sumStep: result.data.data.sumSetp,
                    todayStep:result.data.data.todayStep,
                    ljStep: result.data.data.sumSetp.toString().split(''),
                    syStep: result.data.data.syStep.toString().split(''),
                    isLuckDraw: result.data.data.isLuckDraw
                  })
                }
                
              },
              fail: function () {
                wx.showModal({
                  title: '提示',
                  content: '网络似乎走丢了哟',
                  showCancel: false,
                })
              },
              complete: function () {

              }
            })
          },
          fail:function(){
            //如果用户拒绝授权则跳转到授权页面
            wx.showModal({
              title: '提示',
              content: '请允许微信运动授权，才可以参与健步挑战赛哟!',
              showCancel: false,
              success(res) {
                if (res.confirm) {
                  wx.openSetting({
                    success(res) {
                    }
                  })
                }
              }
            })
          }
        })
      }
    })
  },
  //获取门槛奖品列表
  getPrizeList:function(){
    let _this=this;
    wx.request({
      url: app.globalData.stepRequestUrl + "Index/getPrizeList",
      data: {
        
      },
      header: {
        "Content-Type": "application/x-www-form-urlencoded"
      },
      method: 'POST',
      success: function (result) {
        // console.log(result.data);
        _this.setData({
          prizeList:result.data.data
        })
      },
      fail: function () {
        wx.showModal({
          title: '提示',
          content: '网络似乎走丢了哟',
          showCancel: false
        })
      },
      complete: function () {

      }
    })
  },
  //显示我的卡券弹框
  showMyPrize:function(){
    let _this=this;
    wx.request({
      url: app.globalData.stepRequestUrl + "Index/getMyCardList",
      data: {
        "userid": wx.getStorageSync('stepUserId')
      },
      header: {
        "Content-Type": "application/x-www-form-urlencoded"
      },
      method: 'POST',
      success: function (result) {
        let results=result.data;
        if(results.success){
          _this.setData({
            myPrizeList:results.data
          })
        }
      },
      fail: function (err) {
        wx.showModal({
          title: '提示',
          content: '网络似乎走丢了哟',
          showCancel: false
        })
      },
      complete: function () {

      }
    })
    this.setData({
      isShowMyPrize:true
    })
  },
  //隐藏我的卡券弹框
  hideMyPrize:function(){
    this.setData({
      isShowMyPrize:false
    })
  },
  //领取奖品操作
  receivePrize:function(){
    let userid = wx.getStorageSync('stepUserId');
    let prizeid=this.data.isLuckDraw;
    let _this = this;
    wx.request({
      url: app.globalData.stepRequestUrl + "Index/receivePrize",
      data: {
        "userid": userid,
        "prizeid":prizeid
      },
      header: {
        "Content-Type": "application/x-www-form-urlencoded"
      },
      method: 'POST',
      success: function (result) {
        let results = result.data;
        console.log(results);
        if(results.data==true){
          wx.showModal({
            title: '提示',
            content: results.msg,
            showCancel: false,
            confirmText:'去抽奖',
            success(res) {
              if (res.confirm) {
                wx.navigateTo({
                  url: '/pages/step/lottery',
                })
              }
            }
          })
        }else{
          wx.showModal({
            title: '提示',
            content: results.msg,
            showCancel: false
          })
        }
        
      },
      fail: function (err) {
        wx.showModal({
          title: '提示',
          content: '网络似乎走丢了哟',
          showCancel: false
        })
      },
      complete: function () {

      }
    })
  },
  //转发
  onShareAppMessage: function (res) {
    return {
      title: '健步挑战赛，赢10000元项目打造基金!',
      path: '/pages/step/step?topId=' + wx.getStorageSync('stepUserId'),
      success: function (res) {
        console.log('成功', res)
      }
    }
  },
  //隐藏保存分享图弹框
  hideIssharepyq: function () {
    this.setData({
      issharepyq: false
    })
  },
  //显示保存分享图弹框
  showsharepyq: function () {
    this.setData({
      issharepyq: true
    });
    this.downloadImg();
  },

  downloadImg: function () {
    let that = this;
    let userId = wx.getStorageSync('stepUserId');
    wx.showLoading({
      title: '正在生成中',
    })
    wx.request({
      url: app.globalData.stepRequestUrl + "Qrcode/createQrcode",
      data: {
        'userId': userId
      },
      header: {
        "Content-Type": "application/x-www-form-urlencoded"
      },
      method: 'POST',
      success: function (result) {
        console.log(result.data);
        if (result.data.success) {
          that.setData({
            shareQrImg: result.data.data
          })
          // 创建画布
          const ctx = wx.createCanvasContext('shareCanvas')
          // 白色背景
          ctx.setFillStyle('#fff')
          ctx.fillRect(0, 0, 300, 500)
          ctx.draw()
          // 下载视频封面图
          wx.getImageInfo({
            src: that.data.shareCoverImg,
            success: (res2) => {
              ctx.drawImage(res2.path, 0, 0, 300, 350)
              // 分享标题
              // ctx.setTextAlign('center')    // 文字居中
              // ctx.setFillStyle('#000')  // 文字颜色：黑色
              // ctx.setFontSize(20)         // 文字字号：20px
              // if (that.data.shareTitle.length <= 14) {
              //   // 不用换行
              //   ctx.fillText(that.data.shareTitle, 10, 200, 280)
              // } else if (that.data.shareTitle.length <= 28) {
              //   // 两行
              //   let firstLine = that.data.shareTitle.substring(0, 14);
              //   let secondLine = that.data.shareTitle.substring(14, 27);
              //   ctx.fillText(firstLine, 10, 200, 280)
              //   ctx.fillText(secondLine, 10, 224, 280)
              // } else {
              //   // 超过两行
              //   let firstLine = that.data.shareTitle.substring(0, 14);
              //   let secondLine = that.data.shareTitle.substring(14, 27) + '...';
              //   ctx.fillText(firstLine, 10, 200, 280)
              //   ctx.fillText(secondLine, 10, 224, 280)
              // }

              // 下载二维码
              wx.getImageInfo({
                src: that.data.shareQrImg,
                success: (res3) => {
                  let qrImgSize = 100;
                  let qrHeightSez = 100;
                  ctx.drawImage(res3.path, 105, 355, qrImgSize, qrHeightSez)
                  ctx.stroke()
                  ctx.draw(true)
                  // 用户昵称
                  // ctx.setFillStyle('#fff')  // 文字颜色：黑色
                  // ctx.setFontSize(18) // 文字字号：16px
                  // ctx.fillText(that.data.userInfo.nickName, 80, 340)
                  // 下载用户头像
                  // wx.getImageInfo({
                  //   src: that.data.userInfo.avatarUrl,
                  //   success: (res4) => {
                  //     // 先画圆形，制作圆形头像(圆心x，圆心y，半径r)
                  //     ctx.arc(45, 330, 30, 0, Math.PI * 2, false)
                  //     ctx.clip()
                  //     // 绘制头像图片
                  //     let headImgSize = 100
                  //     ctx.drawImage(res4.path, 10, 290, headImgSize, headImgSize)
                  //     // ctx.stroke() // 圆形边框
                  //     ctx.draw(true)
                  //     wx.hideLoading();
                  //   }
                  // })
                }
              })
            }
          })
        } else {
          wx.showModal({
            title: '提示',
            content: result.data.data,
            showCancel: false
          })
        }
      },
      fail: function () {
        wx.showModal({
          title: '提示',
          content: '网络似乎走丢了哟',
          showCancel: false
        })
      },
      complete: function () {
        wx.hideLoading();
      }
    })
  },
  //保存到相册并分享到朋友圈
  baocun: function () {
    // 保存到相册
    let _this = this;
    wx.canvasToTempFilePath({
      canvasId: 'shareCanvas',
      success: function (res) {
        wx.saveImageToPhotosAlbum({
          filePath: res.tempFilePath,
          success: function (res) {
            wx.showToast({
              title: '分享图片已保存到相册'
            })
            _this.setData({
              issharepyq:false
            })
          }
        })
      }
    }, this)
  },
  //显示分享弹框
  showSharePage:function(){
    this.setData({
      isShowSharePage:true
    })
  },
  //隐藏分享弹框
  hideSharePage:function(){
    this.setData({
      isShowSharePage: false
    })
  },
  //跳转到抽奖页面
  goLottery:function(){
    wx.navigateTo({
      url: '/pages/step/lottery',
    })
  },
  //隐藏活动规则弹框
  hideRole: function () {
    this.setData({
      isShowRole: false
    })
  },
  //显示活动规则弹框
  showRole: function () {
    this.setData({
      isShowRole: true
    })
  },
})
