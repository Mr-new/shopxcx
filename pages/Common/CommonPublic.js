function HttpRequest(apiUrl,method='GET',data={},callBack){
  const app=getApp()
  wx.showLoading({
    title: "加载中",
    mask : true
  })
  wx.request({
    url: app.globalData.urlpath +"/api/"+ apiUrl,
    data: data,
    method: method,
    header: {
      'content-type': 'application/json',
    },
    success: function (res) {
      wx.hideLoading()
      if (res.statusCode == 200){
        if (res.data.errCode == 200) {
          return typeof callBack == "function" && callBack(res.data.item)
        } else {
          wx.showToast({
            title: res.data.errMsg,
            image: '/icon/icon_tips.png',
            duration: 2000
          })
        }
      }else{
        wx.showToast({
          title: "请求失败!",
          image: '/icon/icon_tips.png',
          duration: 2000
        })
      }
    },
    fail:function(){
      wx.showLoading({
        title: "获取数据失败",
        mask: true
      })
    }
  })
}
/** 加减乘除运算 **/
/** 加 **/
function addition(a, b) {
  var c, d, e;
  try {
    c = a.toString().split(".")[1].length;
  } catch (f) {
    c = 0;
  }
  try {
    d = b.toString().split(".")[1].length;
  } catch (f) {
    d = 0;
  }
  return e = Math.pow(10, Math.max(c, d)), (multiply(a, e) + multiply(b, e)) / e;
}
/** 减 **/
function subtraction(a, b) {
  var c, d, e;
  try {
    c = a.toString().split(".")[1].length;
  } catch (f) {
    c = 0;
  }
  try {
    d = b.toString().split(".")[1].length;
  } catch (f) {
    d = 0;
  }
  return e = Math.pow(10, Math.max(c, d)), (multiply(a, e) - multiply(b, e)) / e;
}
/** 乘 **/
function multiply(a, b) {
  var c = 0,
    d = a.toString(),
    e = b.toString();
  try {
    c += d.split(".")[1].length;
  } catch (f) { }
  try {
    c += e.split(".")[1].length;
  } catch (f) { }
  return Number(d.replace(".", "")) * Number(e.replace(".", "")) / Math.pow(10, c);
}
/** 除 **/
function division(a, b) {
  var c, d, e = 0,
    f = 0;
  try {
    e = a.toString().split(".")[1].length;
  } catch (g) { }
  try {
    f = b.toString().split(".")[1].length;
  } catch (g) { }
  return c = Number(a.toString().replace(".", "")), d = Number(b.toString().replace(".", "")), multiply(c / d, Math.pow(10, f - e));
}
/** 加减乘除运算 end**/
/**数组对象总数 **/
function objCount (obj) {
  var objType = typeof obj;
  if (objType == "string") {
    return obj.length;
  } else if (objType == "object") {
    var objLen = 0;
    for (var i in obj) {
      objLen++;
    }
    return objLen;
  }
  return false;
}
/**数组对象总数  END**/
/**数组对象排序 **/
function objSort(objData, field = 'sort', order='asc'){
  if (typeof objData == "object"){
    var new_objData = [];
    for (var i in objData) {//不使用过滤
      new_objData.push(objData[i])
    }
    new_objData.sort(compare(field, order))
    return new_objData
  }else{
    return false
  }
}
function compare(prop,order){
  if (order =="asc"){
    return function (obj1, obj2) {
      var val1 = obj1[prop];
      var val2 = obj2[prop];
      
      if (!isNaN(Number(val1)) && !isNaN(Number(val2))) {
        val1 = Number(val1);
        val2 = Number(val2);
      }
      if (val1 < val2) {
        return -1;
      } else if (val1 > val2) {
        return 1;
      } else {
        return 0;
      }
    }
  } else if (order == "desc"){
    return function (obj1, obj2) {
      var val1 = obj1[prop];
      var val2 = obj2[prop];
      if (!isNaN(Number(val1)) && !isNaN(Number(val2))) {
        val1 = Number(val1);
        val2 = Number(val2);
      }
      if (val1 > val2) {
        return -1;
      } else if (val1 < val2) {
        return 1;
      } else {
        return 0;
      }
    }
  }
  
}
function arrayRemove(arr,index){
  if (isNaN(index) || index > arr.length) { return false; }
  arr.splice(index, 1);
  return arr
}
function removeByValue(arr, val) {
  for (var i = 0; i < arr.length; i++) {
    if (arr[i] == val) {
      arr.splice(i, 1);
      break;
    }
  }
  return arr
}
/**数组对象排序  END**/
/**生成随机字符串 **/
function randomString(len) {
  　　len = len || 32;
  　　var $chars = 'ABCDEFGHJKMNPQRSTWXYZabcdefhijkmnprstwxyz2345678';    /****默认去掉了容易混淆的字符oOLl,9gq,Vv,Uu,I1****/
  　　var maxPos = $chars.length;
  　　var pwd = '';
  　　for (var i = 0; i < len; i++) {
    　　　　pwd += $chars.charAt(Math.floor(Math.random() * maxPos));
  　　}
  　　return pwd;
}
function in_array(search, array) {
  for (var i in array) {
    if (array[i] == search) {
      return true;
    }
  }
  return false;
}
/**计算字符串长度**/
function stringCount(str) {
  if (str == null) return 0;
  str = str.replace(/^\s+|\s+$/g, "");
  if (typeof str != "string") {
    str += "";
  }
  return str.replace(/[^\x00-\xff]/g, "ab").length;
}
module.exports.objCount = objCount
exports.HttpRequest = HttpRequest
exports.objSort = objSort
exports.addition = addition
exports.subtraction = subtraction
exports.multiply = multiply
exports.division = division
exports.randomString = randomString
exports.in_array = in_array
exports.arrayRemove = arrayRemove
exports.removeByValue = removeByValue
exports.stringCount = stringCount