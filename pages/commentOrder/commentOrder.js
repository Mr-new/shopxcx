// pages/commentOrder/commentOrder.js
var app = getApp();
Page({

  /**
   * 页面的初始数据
   */
  data: {
    content:'',
    orderItem:{},
    evaluesList:[{starValue:5,starType:0,des:'服务态度',
      stars: ['/images/starH.png', '/images/starH.png', '/images/starH.png', '/images/starH.png', '/images/starH.png']
    }],
    uploadlist:[], 
    imglist:[],  //上传图片列表用，分割
    orderId: null,  //订单id
    shopId: null,  //商品id
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    if(options){
      this.setData({
        orderId: options.orderId,
        shopId: options.shopId,
      })
    }

  },

  /**
   * 生命周期函数--监听页面初次渲染完成
   */
  onReady: function () {
  
  },

  /**
   * 生命周期函数--监听页面显示
   */
  onShow: function () {
  
  },

  /**
   * 生命周期函数--监听页面隐藏
   */
  onHide: function () {
  
  },

  /**
   * 生命周期函数--监听页面卸载
   */
  onUnload: function () {
  
  },

  /**
   * 页面相关事件处理函数--监听用户下拉动作
   */
  onPullDownRefresh: function () {
  
  },

  /**
   * 页面上拉触底事件的处理函数
   */
  onReachBottom: function () {
  
  },


  bindinput: function (d){
    this.data.content = d.detail.value;
  },

  starOnlick: function (e){
   var dataIndex = e.target.dataset.index + 1;
   var starType = e.target.dataset.startype;
   var stars = [];
   this.data.evaluesList[starType].stars.forEach(function (value, index, array) {

     if (dataIndex -1 < index) {
       stars.push('../../images/starN.png');
     } else {
       stars.push('../../images/starH.png');
     }
   });
   this.data.evaluesList[starType].stars = stars;
   this.data.evaluesList[starType].starValue = dataIndex;
   this.setData({
     evaluesList: this.data.evaluesList
   })
  },
  commitComment: function (){
    let _this=this;
    if (this.data.content == ''){
      wx.showToast({
        icon:'none',
        title: '请输入评论内容',
      })
      return;
    }
    console.log({
      orderid: _this.data.orderId,
      shopid: _this.data.shopId,
      userid: wx.getStorageSync('userid'),
      xing: this.data.evaluesList[0].starValue,
      content: this.data.content, 
      imglist:  this.data.imglist.toString()
    });
    let params = {
      orderid: _this.data.orderId,
      shopid: _this.data.shopId,
      userid: wx.getStorageSync('userid'),
      xing: this.data.evaluesList[0].starValue,
      content: this.data.content,
      imglist: this.data.imglist.toString()
    };
    wx.showLoading({
      title: '加载中',
    })
    wx.request({
      url: app.globalData.shopRequestUrl + "Comment/addComment",
      data: params,
      header: {
        "Content-Type": "application/x-www-form-urlencoded"
      },
      method: 'POST',
      success: function (result) {
        let results = result.data;
        if (results.success == true) {
          wx.showToast({
            title: results.msg,
          })
        } else {
          wx.showToast({
            icon: 'none',
            title: results.msg,
          })
        }
        setTimeout(function(){
          wx.navigateBack();
        },1000)
        
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
  //选择相册图片
  openimg:function(){
    wx.chooseImage({
      sizeType: ['original', 'compressed'],  //可选择原图或压缩后的图片
      sourceType: ['album', 'camera'], //可选择性开放访问相册、相机
      success: res => {
        // console.log(res.tempFilePaths);
        if(this.data.uploadlist.length>0){
          this.setData({
            uploadlist:this.data.uploadlist.concat(res.tempFilePaths)
          });
        }else{
          this.setData({
            uploadlist: res.tempFilePaths
          });
        }
        console.log(res.tempFilePaths);
        let pics = this.data.uploadlist;  //上传图片的地址
        
        this.uploadimg({  //执行上传图片
          url: "http://shopxcx.com/index.php/Common/Images/upload",
          path: res.tempFilePaths,  //这里是选取的图片的地址数组
        });
        
      }
    })
    
  },
  //删除图片
  deleteimg:function(e){
    let index=e.currentTarget.dataset.index;
    console.log(this.data.imglist[index]);
    
    let _this = this;
    wx.showLoading({
      title: '加载中',
    })
    wx.request({
      url: app.globalData.shopRequestUrl + "Comment/delCommentImages",
      data: {
        id: _this.data.imglist[index]
      },
      header: {
        "Content-Type": "application/x-www-form-urlencoded"
      },
      method: 'POST',
      success: function (result) {
        let results = result.data;
        _this.data.uploadlist.splice(index, 1);
        _this.data.imglist.splice(index, 1);
        _this.setData({
          uploadlist: _this.data.uploadlist,
          imglist: _this.data.imglist
        });
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
  //上传图片
  uploadimg: function (data) {
    var that = this,
      i = data.i ? data.i : 0,
      success = data.success ? data.success : 0,
      fail = data.fail ? data.fail : 0;
    wx.uploadFile({
      url: data.url,
      filePath: data.path[i],
      name: 'image',
      formData: {
        //此处可以传自定义参数……
        id: 'null'
      },
      header: {
        "Content-Type": "multipart/form-data",
        //"sessionId": getApp().globalData.sessionId,
      },
      success: (resp) => {
        success++;
        let datalist=JSON.parse(resp.data);
        // console.log(datalist.newName);
        // imglist.push(datalist.newName);
        console.log(datalist);
        that.setData({
          imglist: that.data.imglist.concat(datalist.data)
        })
        

       
      },
      fail: (res) => {
        fail++;
      },
      complete: () => {
        i++;
        if (i == data.path.length) {   //当图片传完时，停止调用
          // wx.showToast({
          //   title: '上传成功',
          //   duration: 1500,
          //   mask: 'false'
          // })
          that.setData({
            tempFilePaths: []
          })
        } else {//若图片还没有传完，则继续调用函数
          data.i = i;
          data.success = success;
          data.fail = fail;
          that.uploadimg(data);
        }
      }
    });
  },
})