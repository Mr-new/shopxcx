//index.js
//获取应用实例
const app = getApp()
let imagesUrl ="https://xaxcx.yixingtb.com/Public/uploadImages/default/";

Page({
  data: {
    motto: 'Hello World',
    userInfo: {},
    hasUserInfo: false,
    canIUse: wx.canIUse('button.open-type.getUserInfo'),
    backImg: imagesUrl +"backImage_01.png",
    titleImg: imagesUrl +"title_02.png",
    ageList:[
      { imgUrl: imagesUrl + "dan_03.png", id: 1 },
      { imgUrl: imagesUrl + "dan_03.png", id: 2 },
      { imgUrl: imagesUrl + "dan_03.png", id: 3 },
      { imgUrl: imagesUrl + "dan_03.png", id: 4 },
      { imgUrl: imagesUrl + "dan_03.png", id: 5 },
      { imgUrl: imagesUrl + "dan_03.png", id: 6 },
    ],
    giftList:[
      { title: "1. iphone XS一部" },
      { title: "2. 380抵用3800奖券" },
      { title: "3. 瘦脸针50元抵用券(满500可用，可与特价同享)" },
      { title: "4. 玻尿酸50元抵用券(满500可用，可与特价同享)" },
      { title: "5. 线下领取小礼品" },
      { title: "6. 脱毛0元单次体验" },
      { title: "7. 眼部立减券，立减1000(满5000可用，可与特价同享)" },
    ],
    activityDetails:[
      { content: "1、活动期间玩家每天有1次免费砸蛋机会" },
      { content: "2、免费砸蛋机会用完之后，可以通过做任务活动继续获得砸蛋机会" },
      { content: "3、关注公众号可以获得额外2次砸金蛋机会" },
      { content: "4、分享朋友圈可以获得额外5次砸金蛋机会" },
      { content: "5、输入内部码可以获得额外5次砸金蛋机会" },
      { content: "6、本次活动最终解释权归西安艺星所有" },
    ],
    isShowRole:false,
    isShowprize:false,
    //获奖记录
    prizeList: [
      { content: "恭喜您获得380抵用3800奖券" },
      { content: "恭喜您获得瘦脸针50元抵用券" },
      { content: "恭喜您获得线下领取小礼品" },
    ],
    //中奖名单
    winPrizeList:[],
    boom:false,
    boomImgUrl: imagesUrl +"boom.gif",
    giftTips:false,
    giftTipsMsg: { id: 0, prize: "很遗憾，未获得奖品！", recordId:0},
    isUserTel: wx.getStorageSync('isUserTel'),  //是否获取用户手机号
    isLogin:false,  //是否显示登录框
    frequency: 0,  //剩余砸蛋次数
    isKu:false, //是否显示砸蛋次数用完弹框
    isShowBtn:false,  //是否显示领奖按钮
    PrizeTitle:"", //领奖弹框标题
    PrizeImgUrl:"", //领奖弹框图片地址
    publicImgUrl: app.globalData.publicImgUrl,  //公共图片路径
  },
  //执行登陆操作
  goLogin: function (topId, callback) {
    let _this = this;
    wx.login({
      success: res => {
        // 发送 res.code 到后台换取 openId, sessionKey, unionId
        console.log(res);
        wx.request({
          url: app.globalData.testRequestUrl + "Login/login",
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
              app.globalData.frequency = frequency;  //记录用户可用砸蛋次数
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
  onLoad: function (options) {
    wx.showModal({
      title: '提示',
      content: '活动暂未开始哟！',
      showCancel: false,
      success:function(){
        wx.navigateBack({
        
        })
      }
    })
    let _this = this;
    let topId=0;  //上级id
    if(options.topId){
      topId = options.topId
    }else if (options.scene){
      topId = decodeURIComponent(options.scene);
    }
    console.log(topId);
    this.goLogin(topId, function () {
      _this.setData({
        frequency: app.globalData.frequency
      })
    })
    //获取初始数据
    this.getDefaultData();
    let backMusic = wx.createAudioContext('backMusic');
    backMusic.play();  //自动播放背景音乐
    //检测是否授权
    
    wx.getSetting({
      success(res) {
        //判断用户信息是否授权
        if (res.authSetting['scope.userInfo']) {
          _this.setData({
            isLogin:false
          })
        }else{
          _this.setData({
            isLogin: true
          })
        }
      }
    })
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
  onShow:function(){
    let _this = this;
    wx.request({
      url: app.globalData.testRequestUrl + "Index/getUserFrequency",
      data: {
        "userId":wx.getStorageSync("userId")
      },
      header: {
        "Content-Type": "application/x-www-form-urlencoded"
      },
      method: 'POST',
      success: function (result) {
        console.log(result.data);
        app.globalData.frequency = result.data.data;
        _this.setData({
          frequency:result.data.data
        })
      },
      complete: function () {

      }
    })
  },
  //获取初始数据
  getDefaultData(){
    let _this=this;
    wx.request({
      url: app.globalData.testRequestUrl + "Index/getDefaultData",
      data: {
        
      },
      header: {
        "Content-Type": "application/x-www-form-urlencoded"
      },
      method: 'POST',
      success: function (result) {
        console.log(result.data);
        if(result.data.success){
          //初始化规则列表和奖品列表
          _this.setData({
            activityDetails:result.data.data.rulesList[0].content,
            giftList:result.data.data.prizeList,
            winPrizeList: result.data.data.winPrizeList
          })
        }else{
          wx.showModal({
            title: '提示',
            content: '网络似乎走丢了哟',
            showCancel: false
          })
        }

      },
      complete: function () {

      }
    })

  },
  //隐藏活动规则弹框
  hideRole:function(){
    this.setData({
      isShowRole:false
    })
  },
  //显示活动规则弹框
  showRole:function(){
    this.setData({
      isShowRole: true
    })
  },
  //隐藏获奖记录弹框
  hidePrize: function () {
    this.setData({
      isShowprize: false
    })
  },
  //点击砸蛋操作
  goSmashEggs:function(e){
    let _this=this;
    if(_this.data.frequency!=0){
      let boomMusic = wx.createAudioContext('boomMusic');
      //由于音频和动画效果不同步：此处将音频延时800毫秒播放音频
      setTimeout(function () {
        boomMusic.seek(0);  //确保每次播放音频都是从头开始
        boomMusic.play();  //播放音频
      }, 800)
      this.setData({
        boom: true,
      });
      setTimeout(function () {
        //通过每次重新加载砸蛋GIF动图实现砸蛋效果,否则会停留在最后一帧
        //踩坑：图片缓存导致图片不会重新加载  解决方案：通过拼接参数解决
        let temp = _this.data.boomImgUrl + '?v=' + Math.random() / 9999;
        _this.setData({
          boom: false,
          giftTips: true,
          boomImgUrl: temp
        })
      }, 1500)
      let userId = wx.getStorageSync('userId');
      wx.request({
        url: app.globalData.testRequestUrl + "Index/smashEggs",
        data: {
          'userId': userId
        },
        header: {
          "Content-Type": "application/x-www-form-urlencoded"
        },
        method: 'POST',
        success: function (result) {
          console.log(result.data);
          if (result.data.success==true) {
            result.data.data.yes.prize = "恭喜您获得" + result.data.data.yes.prize;
            app.globalData.frequency = result.data.data.frequency;
            _this.setData({
              giftTipsMsg: result.data.data.yes,
              PrizeTitle:"恭喜您",
              isShowBtn:true,
              PrizeImgUrl: imagesUrl + "gift2_03.png",
              frequency: result.data.data.currentFrequency
            })
          } else {
            app.globalData.frequency = result.data.data.frequency;
            _this.setData({
              giftTipsMsg: result.data.data.yes,
              PrizeTitle: "真可惜",
              isShowBtn: false,
              PrizeImgUrl: imagesUrl + "ku.png",
              frequency: result.data.data.currentFrequency
            })
          }
        },
        complete: function () {

        }
      })
    }else{
      //显示砸蛋次数用完弹框
      _this.setData({
        isKu:true
      })
    }
  },
  //隐藏砸蛋次数用完弹框
  hideKu:function(){
    this.setData({
      isKu:false
    })
  },
  //隐藏中奖提示框
  hideGiftTips:function(){
    this.setData({
      giftTips: false
    })
  },
  //获取用户手机号
  getPhoneNumber:function(e){
    let _this=this;
    let encryptedData = e.detail.encryptedData;
    if (encryptedData){
      wx.login({
        success: res=>{
          wx.request({
            url: app.globalData.testRequestUrl + "Login/getUserTel",
            data: {
              'code':res.code,
              'iv': e.detail.iv,
              'encryptedData': encryptedData
            },
            header: {
              "Content-Type": "application/x-www-form-urlencoded"
            },
            method: 'POST',
            success: function (result) {
              console.log(result.data);
              _this.goSmashEggs(e);
              _this.setData({
                isUserTel: true
              })
              wx.setStorageSync('isUserTel', true);
            },
            fail: function(){

            },
            complete: function () {
              
            }
          })
        }
      })
    }else{
      wx.showModal({
        title: '提示',
        content: '请允许手机号授权,方便中奖后客服联系您哟',
        showCancel:false
      })
    }
  },
  //获取用户信息
  getUserInfo:function(){
    wx.getUserInfo({
      withCredentials: true,//此处设为true，才会返回encryptedData等敏感信息
      lang:"zh_CN",
      success: res => {
        // 可以将 res 发送给后台解码出 unionId
        let userInfo = res.userInfo;
        if (userInfo) {
          app.globalData.userInfo=userInfo;  //全局变量存储用户信息
          let _this = this;
          let userId = wx.getStorageSync('userId');
          wx.request({
            url: app.globalData.testRequestUrl + "Login/getUserInfo",
            data: {
              "userInfo": JSON.stringify(userInfo),
              'userId': userId
            },
            header: {
              "Content-Type": "application/x-www-form-urlencoded"
            },
            method: 'POST',
            success: function (result) {
              console.log(result.data);
            },
            complete: function () {
              _this.setData({
                isLogin: false
              })
            }
          })
        }  
      },
      fail: err=>{
        wx.showModal({
          title: '提示',
          content: '请允许用户信息授权,方便中奖后客服联系您哟',
          showCancel: false
        })
      }
    })
  },
  //跳转到领取机会页面
  goReceive:function(){
    wx.navigateTo({
      url: '/pages/smashAge/receive',
    })
  },
  //弹出提示框
  showModel:function(e){
    let _this=this;
    let recordId=e.currentTarget.dataset.id;
    wx.request({
      url: app.globalData.testRequestUrl + "Index/receivePrizes",
      data: {
        'recordId': recordId
      },
      header: {
        "Content-Type": "application/x-www-form-urlencoded"
      },
      method: 'POST',
      success: function (result) {
        console.log(result.data);
        _this.setData({
          giftTips:false
        })
        wx.showModal({
          title: '恭喜您',
          content: '恭喜您领取成功，稍后我们的客服会电话联系您确认兑换信息',
          showCancel: false
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
  //跳转到获奖记录页面
  showPrize:function(){
    wx.navigateTo({
      url: '/pages/smashAge/prizeRecord',
    })
  },
  //转发
  onShareAppMessage: function (res) {
    // if (res.from === 'button') {

    // }
    return {
      title: '星粉节疯狂砸金蛋',
      path: '/pages/smashAge/smashAge?topId=' + wx.getStorageSync('userId'),
      imageUrl: "https://xaxcx.17mall.cc/Public/uploadImages/default/share.png",
      success: function (res) {
        console.log('成功', res)
      }
    }
  }
})
