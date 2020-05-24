const api = require('../../../utils/apiCloud.js');
var app = getApp()

Page({
  data: {
    yijian:'',
    name:'',
    currentTab: 0,
    joinData: '',
    createData: '',
    groupData: '',
    showDialog: false,
    statusBarHeight: app.globalData.statusBarHeight < 50 ? 50 : app.globalData.statusBarHeight,
    scrollHeight: app.globalData.windowHeight - (app.globalData.statusBarHeight < 50 ? 50 : app.globalData.statusBarHeight),
    scrollTop: 0,
    enterGId: '',
    list: [{
      id: 'view',
      name: '使用说明',
      open: false,
      pages: ['如何创建会议', '如何报名会议', '如何删除或修改会议', '如何退出会议', '如何修改报名信息','分享会议与群会议', '关于智能解析'],
      pages_name:['create','join','edit','quit','editname','group','smart']
    }],
    SeeYiJianFlag:false,
  },
  kindToggle(e) {
    const id = e.currentTarget.id
    const list = this.data.list
    for (let i = 0, len = list.length; i < len; ++i) {
      if (list[i].id === id) {
        list[i].open = !list[i].open
      } else {
        list[i].open = false
      }
    }
    this.setData({
      list:list
    })
  },

  kindToggle2(e) {
    var that=this;
    var SeeYiJianFlag=that.data.SeeYiJianFlag;
    if(SeeYiJianFlag==true){
      SeeYiJianFlag=false;
    }
    else{
      SeeYiJianFlag=true
    }
    this.setData({
      SeeYiJianFlag: SeeYiJianFlag
    })
  },
  bindYiJianConfirm:function(e){
    var that = this;
    var yijian= e.detail.value;
    that.setData({
      yijian:yijian
    })
  },
  sendYiJianConfirm:function(){
    var that=this;
    api.link_sendyijian({
      data: {
        name: that.data.name,
        yijian:that.data.yijian,
      },
      success: function (res) {
        wx.showLoading();
        wx.hideLoading();
        setTimeout(() => {
          wx.showToast({
            title: '发送成功',
            icon: "success",
          });
          setTimeout(() => {
            wx.hideToast();
          }, 5000)
        }, 0);
        that.setData({
          yijian:''
        })
      }, fail: err => {
        console.log('发送意见error');
      }
    })
  },
  gotohelp:function(e){
    var that=this;
    var pagename=e.currentTarget.id;
    wx.navigateTo({
      url: '/pages/help/'+pagename+'/'+pagename,
    })
  },

  onShow: function() {
    var that = this;
    that.updateData();
    wx.showShareMenu({
      withShareTicket: true
    });
    wx.getUserInfo({
      success: (res) => {
        that.setData({
          name: res.userInfo.nickName
        })
      },
    });
  },
  updateData: function() {
    var that = this;
    api.link_myJoin({
      success: function(res) {
        wx.hideLoading();
        if (res.result.list.length > 0) {
          that.setData({
            joinData: res.result.list.reverse()
          })
        }
      }
    })
    api.link_myCreate({
      success: function(res) {
        wx.hideLoading();
        if (res.result.data.length > 0) {
          that.setData({
            createData: res.result.data.reverse()
          })
        }
      }
    })
    if (app.globalData.enterGId) {
      this.setData({
        enterGId: app.globalData.enterGId
      })
      api.link_getGIDTask({
        data: {
          groupid: app.globalData.enterGId,
        },
        success: function(res) {
          wx.hideLoading();
          if (res.result.list.length > 0) {
            that.setData({
              groupData: res.result.list.reverse()
            })
          }
        }
      })
    }
  },
  swichNav: function(e) {
    var that = this;
    this.onShow();
    that.setData({
      currentTab: e.target.dataset.current,
      scrollTop: 0
    })
  },
  creat: function() {
    var that = this;
    wx.navigateTo({
      url: '../create/create'
    })
  },
  gotoEnroll: function(e) {
    var that = this;
    wx.navigateTo({
      url: '../enroll/enroll?taskid=' + e.currentTarget.dataset.taskid + '&isbool=false'
    })
  }
})