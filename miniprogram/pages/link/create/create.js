const api = require('../../../utils/apiCloud.js');

//生成日期格式
const formatDate = date => {
  const year = date.getFullYear()
  const month = date.getMonth() + 1
  const day = date.getDate()
  return [year, month, day].map(formatNumber).join('/') 
}
const formatNumber = n => {
  n = n.toString()
  return n[1] ? n : '0' + n
}

//生成日期格式
const formatTimeDay = date => {
  const year = date.getFullYear()
  const month = date.getMonth() + 1
  const day = date.getDate()
  const hour = date.getHours()
  const minute = date.getMinutes()
  const second = date.getSeconds()

  return [year, month, day].map(formatNumber).join('/') + ' ' + [hour, minute, second].map(formatNumber).join(':')
}

const getExecTime_real = stringdate => {
  var date = new Date(stringdate);
  var timestamp = Date.parse(date);
  timestamp = timestamp / 1000;
  //会议时间减去10分钟的时间戳，云函数有时差8小时
  // var ten_timestamp = timestamp - 10 * 60 + 8 * 60 * 60;
  var ten_timestamp = timestamp - 10 * 60 ;
  //会议时间减去十分钟的时间
  var n_to = ten_timestamp * 1000;
  var ten_date = new Date(n_to);
  return formatTimeDay(ten_date);
}

const getOverTime = stringdate => {
  var date = new Date(stringdate);
  var timestamp = Date.parse(date);
  timestamp = timestamp / 1000;
  //会议时间，云函数有时差8小时
  // var ten_timestamp = timestamp + 8 * 60 * 60;
  var ten_timestamp = timestamp;
  //会议时间减去十分钟的时间
  var n_to = ten_timestamp * 1000;
  var ten_date = new Date(n_to);
  return formatTimeDay(ten_date);
}


const getJiexiRes=stringJiexi=>{
  const typearr=['腾讯会议','钉钉会议'];
  var jsonres = new Object();
  if (stringJiexi.search(typearr[0])!=-1){
    var jiexi_line=stringJiexi.split("\n");
    for(var i=0;i<jiexi_line.length;i++){
      if(jiexi_line[i].search('会议主题')!=-1){
        jsonres.title = jiexi_line[i].split("：")[1];
      }
      else if (jiexi_line[i].search('会议时间') != -1) {
        var tempdate = jiexi_line[i].split("：")[1];
        jsonres.date=tempdate.split(" ")[0];
        var temptime = tempdate.split(" ")[1];
        jsonres.time = temptime.split("-")[0];
      }
      else if (jiexi_line[i].search('https') != -1){
        jsonres.address = jiexi_line[i];
      }
      else if (jiexi_line[i].search('邀请您参加腾讯会议') != -1){
        jsonres.name = jiexi_line[i].split("邀")[0];
      }
      else if (jiexi_line[i].search('会议密码') != -1) {
        jsonres.remark = jiexi_line[i];
      }
    }
    return jsonres;
  }
  else if (stringJiexi.search(typearr[1]) != -1){
    console.log("解析钉钉会议");
    return false;
  }
  else{
    console.log("解析失败");
    return false;
  }
}



function utils(){
  var time = new Date()
  return {
    year: time.getFullYear(),
    month: time.getMonth() + 1,
    date: time.getDate(),
    hours: time.getHours(),
    minutes: time.getMinutes()
  }
}



var app = getApp()
Page({
  data: {
    taskid: '', //接龙的id号
    title: '', //接龙标题
    date: '', //会议日期
    time: '', //会议时间
    address: '',
    name: '',
    tel: '',
    remark: '',
    jiexi:'',
    peopleNumber: '', //会议人数
    noName: true, //是否公开参与会议人员
    execTime:'',//会议触发通知时间，即会议时间前10分钟
    overTime:'',
    taskType:'',//会议类型，1为未开始会议，0为已提醒会议，2为已结束会议
  },
  onShow:function(){
    var that = this;
    that.setData({
      date: utils().year + '/' + ('0' + utils().month).substr(-2) + '/' + ('0' + utils().date).substr(-2),
      time: ('0' + utils().hours).substr(-2) + ':' + ('0' + utils().minutes).substr(-2)
    })
  },
  onLoad: function() {
    this.islogin()
    var that = this;
    that.setData({
      date: utils().year + '/' + ('0' + utils().month).substr(-2) + '/' + ('0' + utils().date).substr(-2),
      time: ('0' + utils().hours).substr(-2) + ':' + ('0' + utils().minutes).substr(-2)
    })
    wx.getUserInfo({
      success: (res) => {
        that.setData({
          name: res.userInfo.nickName
        })
      },
    })
  },
  islogin() {
    let that = this;
    wx.checkSession({
      success() {
        wx.getUserInfo({
          fail: () => {
            app.globalData.islogin = true
            wx.switchTab({
              url: '../../link/index/index',
            })
          }
        })
      },
      fail() {
        app.globalData.islogin = true
        wx.switchTab({
          url: '../../link/index/index',
        })
      }
    })
  },
  bindDateChange: function(e) {
    var that = this;
    var tempdate = new Date(e.detail.value);
    var date=formatDate(tempdate)
    that.setData({
      date: date,
    })
  },
  bindTimeChange: function(e) {
    var that = this;
    that.setData({
      time: e.detail.value,
    })
  },
  bindTitleInput: function(e) {
    var that = this;
    that.setData({
      title: e.detail.value,
    });
  },
  bindAddressInput: function(e) {
    var that = this;
    that.setData({
      address: e.detail.value,
    });
  },
  bindNameInput: function(e) {
    var that = this;
    that.setData({
      name: e.detail.value,
    });
  },
  bindTelInput: function(e) {
    var that = this;
    that.setData({
      tel: e.detail.value,
    });
  },
  bindRemarkInput: function(e) {
    var that = this;
    that.setData({
      remark: e.detail.value,
    });
  },
  bindNumberInput: function(e) {
    var that = this;
    that.setData({
      peopleNumber: e.detail.value,
    });
  },
  switchChange: function(e) {
    var that = this;
    that.setData({
      noName: e.detail.value,
    })
  },
  getMap: function() {
    var that = this;
    var chooseAddress = function() {
      wx.chooseLocation({
        type: 'gcj02', //返回可以用于wx.openLocation的经纬度
        success: function(res) {
          var latitude = res.latitude
          var longitude = res.longitude
          that.setData({
            address: res.name + '(' + res.address + ')'
          })
        }
      })
    }
    wx.getSetting({
      success(res) {
        if (!res.authSetting['scope.userLocation']) {
          wx.authorize({
            scope: 'scope.userLocation',
            fail() {
              wx.openSetting()
            }
          })
        } else {
          chooseAddress()
        }
      }
    })
  },


  bindJiexiConfirm:function(e){
    var that=this;
    var tempjiexi = getJiexiRes(e.detail.value); 
    if(tempjiexi==false){
      wx.showModal({
        title: '解析失败',
        content: '请输入规定格式！',
        confirmColor: "#5677FC",
        showCancel: false
      })
    }else{
      this.setData({
        title: tempjiexi.title,
        remark: tempjiexi.remark,
        address: tempjiexi.address,
        name: tempjiexi.name,
        date: tempjiexi.date,
        time: tempjiexi.time,
      })
    }
  },


  ok: function() {
    var that = this;
    const formal = that.data.date + ' ' + that.data.time
    const execdate = getExecTime_real(formal);//获取会议通知时间
    const overtime=getOverTime(formal);//获取会议时间


    if (that.data.title == '') {
      wx.showModal({
        title: 'Error!',
        content: '会议标题必需填写',
        confirmColor: "#5677FC",
        showCancel: false
      })
    } else if (execdate <= formatTimeDay(new Date())){
      wx.showModal({
        title: 'Error!',
        content: '会议开始时间需在未来十分钟后！',
        confirmColor: "#5677FC",
        showCancel: false
      })
    }else {
      wx.showLoading({
        title: '创建中...',
      })
      that.setData({
        taskid: new Date().getTime().toString() + parseInt(Math.random() * 10000000) //创建时间+随机数
      })

      that.setData({
        execTime: execdate
      })
      that.setData({
        overTime: overtime
      })
      

      that.setData({
        taskType:1
      })
      

      api.link_creatjielongtask({
        data: {
          taskid: that.data.taskid, //用创建的时间作为接龙的id号
          title: that.data.title, //接龙标题
          date: that.data.date, //会议日期
          time: that.data.time, //会议时间
          address: that.data.address,
          name: that.data.name,
          tel: that.data.tel,
          remark: that.data.remark,
          peopleNumber: that.data.peopleNumber || 0,
          noName: that.data.noName,
          execTime:that.data.execTime,//会议触发时间，即会议时间前10分钟
          overTime:that.data.overTime,
          taskType:that.data.taskType,
        },
        success: function(res) {
          // wx.hideLoading();
          wx.redirectTo({
            url: '../enroll/enroll?taskid=' + that.data.taskid + '&isbool=false'
          })
        }, fail: err => {
          console.log('创建页面error');
        }
      })
    }
  }
})