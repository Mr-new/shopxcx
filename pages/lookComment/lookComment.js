// pages/commentOrder/commentOrder.js
var app = getApp();
Page({

  /**
   * 页面的初始数据
   */
  data: {
    content:'',
    orderItem:{},
    evaluesList:[{starValue:5,starType:0,des:'服务态度'}],
    stars: [],
    uploadlist:[], 
    imglist:[],  //上传图片列表用，分割
    commentId:null,  //评论id
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    if(options){
      this.setData({
        commentId: options.commentId
      })
    }
    //获取评论详情
    this.getComment();

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

  
  getComment: function (){
    let _this=this;
    wx.showLoading({
      title: '加载中',
    })
    wx.request({
      url: app.globalData.shopRequestUrl + "Comment/getComment",
      data: {
        id: _this.data.commentId
      },
      header: {
        "Content-Type": "application/x-www-form-urlencoded"
      },
      method: 'POST',
      success: function (result) {
        let results = result.data;
        console.log(results);
        if (results.success == true) {
          let temp=[];
          for(let i=0; i<results.data.xing; i++){
            temp.push('/images/starH.png');
          }
          let cha=5-results.data.xing;
          for(let j=0; j<cha; j++){
            temp.push('/images/starN.png')
          }
          _this.setData({
            content: results.data.content,
            uploadlist: results.data.imglist,
            stars: temp
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

})