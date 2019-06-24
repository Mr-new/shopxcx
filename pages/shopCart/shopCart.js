//index.js
//获取应用实例
const app = getApp()
Page({
  data: {
    motto: 'Hello World',
    userInfo: {},
    hasUserInfo: false,
    canIUse: wx.canIUse('button.open-type.getUserInfo'),
    shoplist: [],  //商品列表
    isshow: "none",  //是否显示购物车无商品提示
    sumprice: "0.00",  //购物车所有商品总金额
    isselected: true,  //是否全选
  },
  onLoad: function () {
    //获取购物车列表数据
    this.getShopCartList();
  },
  //点击选中  or  未选中
  select: function (e) {
    const index = e.currentTarget.dataset.index;    // 获取data- 传进来的index
    let shoplist = this.data.shoplist;                    // 获取购物车列表
    const checked = shoplist[index].checked;         // 获取当前商品的选中状态
    shoplist[index].checked = !checked;              // 改变状态
    //判断商品是否全被勾选如果全被勾选则将全选选中否则则取消全选选中
    let temp=0;
    for (let i = 0; i < shoplist.length;i++){
      if (shoplist[i]['checked']==true){
        temp++;
      }
    }
    if(temp==shoplist.length){
      this.setData({
        isselected: true
      })
    }else{
      this.setData({
        isselected: false
      })
    }
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
        [key]: parseInt(_this.data.shoplist[index].number) + 1
      });

    } else {
      //如果运算符为-所要执行的操作
      if (_this.data.shoplist[index].number > 1) {
        this.setData({
          [key]: parseInt(_this.data.shoplist[index].number) - 1,
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
      shoplist[i].checked = isselected;            // 改变所有商品状态
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
      if (shoplist[i].checked) {                   // 判断选中才会计算价格
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
    let _this = this;
    let shoplist = _this.data.shoplist;                  // 获取购物车列表
    let temp = [];  //要删除的数据
    for (let i = 0; i < shoplist.length; i++) {         // 循环列表得到每个数据
      if (shoplist[i].checked == true) {
        temp.push(shoplist[i]['id']);
      }
    }
    if(temp.length==0){
      wx.showToast({
        icon: 'none',
        title: '请选中要删除的商品',
      })
    }else{
      wx.showModal({
        title: '提示',
        content: '确认删除选中的商品',
        success(res) {
          if (res.confirm) {
            wx.request({
              url: app.globalData.shopRequestUrl + "Cart/deleteCartList",
              data: {
                'ids': temp,
              },
              header: {
                "Content-Type": "application/x-www-form-urlencoded"
              },
              method: 'POST',
              success: function (result) {
                let results = result.data;
                console.log(results);
                if (results.success == true) {
                  //获取购物车列表数据
                  _this.getShopCartList();
                  //计算总价
                  _this.getTotalPrice();
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
          } else if (res.cancel) {
            console.log('用户点击取消')
          }
        }
      })
    }
  },
  //跳转到提交订单页面
  gobalance: function () {
    let shoplist = this.data.shoplist;                  // 获取购物车列表
    let temp = [];  //临时数组  
    for (let i = 0; i < shoplist.length; i++) {         // 循环列表得到每个数据
      if (shoplist[i].checked == true) {
        let tempObj={
          'cartId': shoplist[i]['id'],
          'shopId': shoplist[i]['shopid'],
          'specsId': shoplist[i]['specsid'],
          'number': shoplist[i]['number']
        }
        temp.push(tempObj);
      }
    }
    if (temp.length == 0) {
      wx.showToast({
        icon: 'none',
        title: "请选择商品",
      });
    } else {
      console.log(temp)
      let orderArr=JSON.stringify(temp);
      wx.navigateTo({
        url: '/pages/confirmOrder/confirmOrder?orderArr=' + orderArr,
      });
    }

  },
  //跳转到商品页面
  goShop:function(){
    wx.switchTab({
      url: '/pages/shop/shop',
    })
  },
  //获取购物车列表数据
  getShopCartList: function () {
    let _this = this;
    wx.showLoading({
      title: '加载中',
    })
    wx.request({
      url: app.globalData.shopRequestUrl + "Cart/getShopCartList",
      data: {
        'userid': wx.getStorageSync('userid'),
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
            shoplist: results.data
          })
          //计算总价
          _this.getTotalPrice();
        } else {
          _this.setData({
            shoplist: []
          });
          // wx.showToast({
          //   icon: 'none',
          //   title: results.msg,
          // })
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
