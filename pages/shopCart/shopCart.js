//index.js
//获取应用实例
const app = getApp()
Page({
  data: {
    motto: 'Hello World',
    userInfo: {},
    hasUserInfo: false,
    canIUse: wx.canIUse('button.open-type.getUserInfo'),
    shoplist: [
      { title: "海薇玻尿酸【PLM多维立体定格术】【鼻子除外】", type: "线上全款", price: 159.90, imgurl: "http://shopxcx.com/Public/uploadImages/default/shop_item_03.png", number: 1, ischecked: false },
      { title: "海薇玻尿酸【PLM多维立体定格术】【鼻子除外】", type: "线上全款", price: 159.90, imgurl: "http://shopxcx.com/Public/uploadImages/default/shop_item_03.png", number: 1, ischecked: false },
      { title: "海薇玻尿酸【PLM多维立体定格术】【鼻子除外】", type: "线上全款", price: 159.90, imgurl: "http://shopxcx.com/Public/uploadImages/default/shop_item_03.png", number: 1, ischecked: false },
      { title: "海薇玻尿酸【PLM多维立体定格术】【鼻子除外】", type: "线上全款", price: 159.90, imgurl: "http://shopxcx.com/Public/uploadImages/default/shop_item_03.png", number: 1, ischecked: false },
      { title: "海薇玻尿酸【PLM多维立体定格术】【鼻子除外】", type: "线上全款", price: 159.90, imgurl: "http://shopxcx.com/Public/uploadImages/default/shop_item_03.png", number: 1, ischecked: false },
      { title: "海薇玻尿酸【PLM多维立体定格术】【鼻子除外】", type: "线上全款", price: 159.90, imgurl: "http://shopxcx.com/Public/uploadImages/default/shop_item_03.png", number: 1, ischecked: false },
      { title: "海薇玻尿酸【PLM多维立体定格术】【鼻子除外】", type: "线上全款", price: 159.90, imgurl: "http://shopxcx.com/Public/uploadImages/default/shop_item_03.png", number: 1, ischecked: false },
      { title: "海薇玻尿酸【PLM多维立体定格术】【鼻子除外】", type: "线上全款", price: 159.90, imgurl: "http://shopxcx.com/Public/uploadImages/default/shop_item_03.png", number: 1, ischecked: false },
    ],
    isshow: "none",  //是否显示购物车无商品提示
    sumprice: "0.00",  //购物车所有商品总金额
    isselected: false,  //是否全选
  },
  onLoad: function () {
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
  //点击选中  or  未选中
  select: function (e) {
    const index = e.currentTarget.dataset.index;    // 获取data- 传进来的index
    let shoplist = this.data.shoplist;                    // 获取购物车列表
    const ischecked = shoplist[index].ischecked;         // 获取当前商品的选中状态
    shoplist[index].ischecked = !ischecked;              // 改变状态
    this.setData({
      shoplist: shoplist
    });
    this.getTotalPrice();                           // 重新获取总价
  },
  //点击+号  or  -号改变数量
  numberadd: function (e) {
    var _this = this; //小程序setdata中的this指向改变所以需要记录this
    var index = e.currentTarget.id;  //当前点击的第几个
    var key = "shoplist[" + index + "].number";  //当前在shoplist数组中的位置
    var operator = e.currentTarget.dataset.addorreduce;  //运算符：判断是+还是-
    if (operator == "+") {
      //如果运算符为+所要执行的操作
      this.setData({
        [key]: _this.data.shoplist[index].number + 1
      });

    } else {
      //如果运算符为-所要执行的操作
      if (_this.data.shoplist[index].number > 1) {
        this.setData({
          [key]: _this.data.shoplist[index].number - 1,
        });
      }

    }
    this.getTotalPrice();                           // 重新获取总价
  },
  //全选
  allselected: function () {
    let isselected = this.data.isselected;    // 是否全选状态
    isselected = !isselected;
    let shoplist = this.data.shoplist;
    for (let i = 0; i < shoplist.length; i++) {
      shoplist[i].ischecked = isselected;            // 改变所有商品状态
    }
    this.setData({
      isselected: isselected,
      shoplist: shoplist
    });
    this.getTotalPrice();                               // 重新获取总价
  },
  //计算总价
  getTotalPrice() {
    let shoplist = this.data.shoplist;                  // 获取购物车列表
    let sumprice = 0;
    for (let i = 0; i < shoplist.length; i++) {         // 循环列表得到每个数据
      if (shoplist[i].ischecked) {                   // 判断选中才会计算价格
        sumprice += shoplist[i].number * shoplist[i].price;     // 所有价格加起来
      }
    }
    this.setData({                                // 最后赋值到data中渲染到页面
      shoplist: shoplist,
      sumprice: sumprice.toFixed(2)
    });
  },
  //删除选中商品操作
  deleteShop:function(){
    let _this=this;
    wx.showModal({
      title: '提示',
      content: '确认删除选中的商品',
      success(res) {
        if (res.confirm) {
          let shoplist = _this.data.shoplist;                  // 获取购物车列表
          let temp = [];  //存放不删除的数据
          for (let i = 0; i < shoplist.length; i++) {         // 循环列表得到每个数据
            if (shoplist[i].ischecked == false) {
              temp.push(shoplist[i]);
            }
          }
          _this.setData({                                // 最后赋值到data中渲染到页面
            shoplist: temp,
          });
          wx.showToast({
            icon: "success",
            title: '删除成功',
          })
        } else if (res.cancel) {
          console.log('用户点击取消')
        }
      }
    })
    
  },
  //跳转到提交订单页面
  gobalance: function () {
    if (this.data.sumprice == "0.00") {
      wx.showToast({
        icon: 'none',
        title: "请选择商品",
      });
    } else {
      wx.navigateTo({
        url: '/pages/confirmOrder/confirmOrder',
      });
    }

  }
})
