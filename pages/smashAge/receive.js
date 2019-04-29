//index.js
//获取应用实例
const app = getApp()

Page({
  data: {
    motto: 'Hello World',
    userInfo: {},
    hasUserInfo: false,
    canIUse: wx.canIUse('button.open-type.getUserInfo'),
    isAlert:false,
    inCode:'',  //用户输入的内部码
    issharepyq:false,  //是否显示分享朋友圈弹框
    shareTitle: '全球星粉节疯狂砸金蛋，盘iphone XS', // 分享标题
    shareCoverImg: 'https://xaxcx.17mall.cc/Public/uploadImages/default/share.png', // 分享封面图
    shareQrImg: 'https://xaxcx.17mall.cc/Public/uploadImages/default/qrcode.png', // 分享小程序二维码
    userInfo: {
      headImg: '', //用户头像
      nickName: '', // 昵称
    },
    details:[
      { title: "【关注公众号】关注后可获得额外2次砸蛋机会" },
      { title: "【分享朋友】分享朋友可以获得额外5次砸蛋机会" },
      { title: "【分享给好友】分享给好友可以获得额外1次砸蛋机会(每分享1个多1次，最多10次)" },
      { title: "【内部码】输入内部码可以获得5次额外砸蛋机会" },
    ],
    isgzh:false,  //是否显示公众号二维码图片
    gzhImg: "https://xaxcx.17mall.cc/Public/uploadImages/default/gzh_01.jpg",  //公众号二维码图片
  },
  //事件处理函数
  bindViewTap: function() {
    wx.navigateTo({
      url: '../logs/logs'
    })
  },
  onLoad: function () {
    if (app.globalData.userInfo) {
      this.setData({
        userInfo: app.globalData.userInfo,
        hasUserInfo: true
      })
      console.log(this.data.userInfo);
      
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
  getUserInfo: function(e) {
    console.log(e)
    app.globalData.userInfo = e.detail.userInfo
    this.setData({
      userInfo: e.detail.userInfo,
      hasUserInfo: true
    })
  },
  //显示输入内部码弹框
  showAlert:function(){
    this.setData({
      isAlert:true
    })
  },
  //隐藏输入内部码弹框
  hideAlert:function(){
    this.setData({
      isAlert: false
    })
  },
  //更新用户输入的内部码
  updateInCode:function(e){
    this.setData({
      inCode:e.detail.value
    })
  },
  //提交内部码
  submitInCode:function(){
    let inCode = this.data.inCode;
    let userId = wx.getStorageSync('userId');
    let _this=this;
    wx.showLoading({
      title: '加载中',
    })
    wx.request({
      url: app.globalData.testRequestUrl + "Index/userInCode",
      data: {
        'inCode': inCode,
        'userId':userId
      },
      header: {
        "Content-Type": "application/x-www-form-urlencoded"
      },
      method: 'POST',
      success: function (result) {
        _this.setData({
          isAlert:false
        })
        console.log(result.data);
        app.globalData.frequency=result.data.frequency;
        wx.showModal({
          title: '提示',
          content: result.data.data,
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
        wx.hideLoading();
      }
    })
  },
  //转发
  onShareAppMessage: function (res) {
    // let userId=wx.getStorageSync('userId');
    // wx.request({
    //   url: app.globalData.testRequestUrl + "Index/shareFriends",
    //   data: {
    //     'userId': userId
    //   },
    //   header: {
    //     "Content-Type": "application/x-www-form-urlencoded"
    //   },
    //   method: 'POST',
    //   success: function (result) {
    //     console.log(result.data);
    //     app.globalData.frequency = result.data.frequency;
    //     wx.showModal({
    //       title: '提示',
    //       content: result.data.data,
    //       showCancel: false
    //     })
    //   },
    //   fail: function () {
    //     wx.showModal({
    //       title: '提示',
    //       content: '网络似乎走丢了哟',
    //       showCancel: false
    //     })
    //   },
    //   complete: function () {
        
    //   }
    // })

    wx.showModal({
      title: '提示',
      content: "好友进入小程序即可获得1次机会",
      showCancel: false
    })

    // if (res.from === 'button') {

    // }
    console.log(wx.getStorageSync('userId'));
    return {
      title: '星粉节疯狂砸金蛋',
      path: '/pages/smashAge/smashAge?topId=' + wx.getStorageSync('userId'),
      imageUrl: "https://xaxcx.17mall.cc/Public/uploadImages/default/share.png",
      success: function (res) {
        console.log('成功', res)
      },
    }
  },

  showsharepyq:function(){
    this.setData({
      issharepyq:true
    });
    this.downloadImg();
  },

  downloadImg: function () {
    let that=this;
    let userId=wx.getStorageSync('userId');
    wx.showLoading({
      title: '正在生成中',
    })
    wx.request({
      url: app.globalData.testRequestUrl + "Qrcode/createQrcode",
      data: {
        'userId': userId
      },
      header: {
        "Content-Type": "application/x-www-form-urlencoded"
      },
      method: 'POST',
      success: function (result) {
        console.log(result.data);
        if(result.data.success){
          that.setData({
            shareQrImg:result.data.data
          })
          // 创建画布
          const ctx = wx.createCanvasContext('shareCanvas')
          // 白色背景
          ctx.setFillStyle('#fff')
          ctx.fillRect(0, 0, 300, 460)
          ctx.draw()
          // 下载视频封面图
          wx.getImageInfo({
            src: that.data.shareCoverImg,
            success: (res2) => {
              ctx.drawImage(res2.path, 0, 0, 300, 310)
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
                  ctx.drawImage(res3.path, 105, 330, qrImgSize, qrHeightSez)
                  ctx.stroke()
                  ctx.draw(true)
                  // 用户昵称
                  ctx.setFillStyle('#fff')  // 文字颜色：黑色
                  ctx.setFontSize(18) // 文字字号：16px
                  ctx.fillText(that.data.userInfo.nickName, 80, 340)
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
        }else{
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
  baocun:function(){
    // 保存到相册
    let _this=this;
    wx.canvasToTempFilePath({
      canvasId: 'shareCanvas',
      success: function (res) {
        wx.saveImageToPhotosAlbum({
          filePath: res.tempFilePath,
          success: function (res) {
            let userId = wx.getStorageSync('userId');
            wx.request({
              url: app.globalData.testRequestUrl + "Index/shareFriendCircle",
              data: {
                'userId': userId
              },
              header: {
                "Content-Type": "application/x-www-form-urlencoded"
              },
              method: 'POST',
              success: function (result) {
                console.log(result.data);
                app.globalData.frequency = result.data.frequency;
                wx.showModal({
                  title: '提示',
                  content: result.data.data,
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
                _this.setData({
                  issharepyq:false
                })
              }
            })
            // wx.showToast({
            //   title: '分享图片已保存到相册'
            // })
          }
        })
      }
    }, this)
  },
  //隐藏分享朋友圈弹框
  hideIssharepyq:function(){
    this.setData({
      issharepyq:false
    })
  },

  //显示关注公众号弹框
  isPublicAddress:function(){
    this.setData({
      isgzh:true
    })
  },
  //长按识别图中二维码
  previewImage: function (e) {
    var current = e.currentTarget.dataset.imgurl;
    console.log(e.currentTarget.dataset.imgurl);
    wx.previewImage({
      current: current,
      urls: [current]
    })
  },
  //保存图片
  downloadgzhImage:function(imageUrl) {
    let that=this;
    // 下载文件  
    wx.downloadFile({
      url: that.data.gzhImg,
      success: function (res) {
        console.log("下载文件：success");
        console.log(res);

        // 保存图片到系统相册  
        wx.saveImageToPhotosAlbum({
          filePath: res.tempFilePath,
          success(res) {
            console.log("保存图片：success");
            wx.showToast({
              title: '保存成功',
            });
          },
          fail(res) {
            console.log("保存图片：fail");
            console.log(res);
          }
        })
      },
      fail: function (res) {
        console.log("下载文件：fail");
        console.log(res);
      }
    })
  },
  //隐藏公众号二维码弹框
  hideIsgzh:function(){
    this.setData({
      isgzh:false
    })
  },
  //领取机会
  receive:function(){
    let userId = wx.getStorageSync('userId');
    wx.request({
      url: app.globalData.testRequestUrl + "Index/isPublicAddress",
      data: {
        'userId': userId
      },
      header: {
        "Content-Type": "application/x-www-form-urlencoded"
      },
      method: 'POST',
      success: function (result) {
        console.log(result.data);
        app.globalData.frequency = result.data.frequency;
        wx.showModal({
          title: '提示',
          content: result.data.data,
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
  }  





    
})
