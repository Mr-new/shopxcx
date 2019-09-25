Component({
  properties: {
    // 这里定义了innerText属性，属性值可以在组件使用时指定
    innerText: {
      type: String,
      value: 'default value',
    }
  },
  data: {
    // 这里是一些组件内部数据
    someData: {},
    isShow: false, // 初始option不显示
  },
  methods: {
    // 这里是一个自定义方法
    changeisShow: function () {
      this.setData({
        isShow: !this.data.isShow
      })
    }
  }
})