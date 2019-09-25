Component({
  data: {
    selected: 0,
    color: "#B2000B",
    selectedColor: "#B2000B",
    list: [
      {
        pagePath: "/pages/index/index",
        text: "首页",
        iconPath: "/images/home.png",
        selectedIconPath: "/images/home_selected.png"
      },
      {
        pagePath: "/pages/shop/shop",
        text: "商品",
        iconPath: "/images/cart.png",
        selectedIconPath: "/images/cart_selected.png"
      },
      {
        pagePath: "/pages/webView/webView",
        text: "",
        iconPath: "/images/doctor.png",
        selectedIconPath: "/images/doctor.png"
      },
      {
        pagePath: "/pages/yanzhi/yanzhi",
        text: "颜值馆",
        iconPath: "/images/case.png",
        "selectedIconPath": "/images/case_selected.png"
      },
      {
        pagePath: "/pages/my/my",
        text: "我的",
        iconPath: "/images/my.png",
        selectedIconPath: "/images/my_selected.png"
      }
    ]
  },
  attached() {
  },
  methods: {
    switchTab(e) {
      const data = e.currentTarget.dataset
      const url = data.path
      wx.switchTab({url})
      this.setData({
        selected: data.index
      })
    }
  }
})