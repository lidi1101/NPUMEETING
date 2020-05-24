const wxRequest = (params, url, tip) => {
  // if (tip) {
  //   wx.showLoading({
  //     title: tip,
  //   })
  // }
  Math.ceil(Math.random() * 10) == 1 ? wx.showNavigationBarLoading() : ''
  wx.cloud.callFunction({
    // 要调用的云函数名称
    name: url,
    data: params.data || {},
    success: res => {
      params.success && params.success(res)
    },
    fail: err => {
      params.fail && params.fail(err)
    },
    complete: c => {
      params.complete && params.complete(c)
      wx.hideLoading()
      wx.hideNavigationBarLoading()
    }
  })
}


/**用户信息 */
const getopenid = (params) => {
  params.data ? params.data.NODEJS = 'getOpenid' : params.data = {
    NODEJS: 'getOpenid'
  }
  wxRequest(params, 'userInfo')
}
const addUser = (params) => {
  params.data ? params.data.NODEJS = 'addUser' : params.data = {
    NODEJS: 'addUser'
  }
  wxRequest(params, 'userInfo')
}
/*结束 */


/**群会议 */

const link_creatjielongtask = (params) => {
  params.data ? params.data.NODEJS = 'creatjielongtask' : params.data = {
    NODEJS: 'creatjielongtask'
  }
  wxRequest(params, 'link')
}
const link_editjielongtask = (params) => {
  params.data ? params.data.NODEJS = 'editjielongtask' : params.data = {
    NODEJS: 'editjielongtask'
  }
  wxRequest(params, 'link')
}
const link_getGIDTask = (params) => {
  params.data ? params.data.NODEJS = 'getGIDTask' : params.data = {
    NODEJS: 'getGIDTask'
  }
  wxRequest(params, 'link')
}
const link_getTaskJoiner = (params) => {
  params.data ? params.data.NODEJS = 'getTaskJoiner' : params.data = {
    NODEJS: 'getTaskJoiner'
  }
  wxRequest(params, 'link')
}
const link_getjielongtask = (params) => {
  params.data ? params.data.NODEJS = 'getjielongtask' : params.data = {
    NODEJS: 'getjielongtask'
  }
  wxRequest(params, 'link')
}
const link_isEnrolled = (params) => {
  params.data ? params.data.NODEJS = 'isEnrolled' : params.data = {
    NODEJS: 'isEnrolled'
  }
  wxRequest(params, 'link')
}
const link_joinjielongtask = (params) => {
  params.data ? params.data.NODEJS = 'joinjielongtask' : params.data = {
    NODEJS: 'joinjielongtask'
  }
  wxRequest(params, 'link')
}
const link_myCreate = (params) => {
  params.data ? params.data.NODEJS = 'myCreate' : params.data = {
    NODEJS: 'myCreate'
  }
  wxRequest(params, 'link')
}
const link_storeGId = (params) => {
  params.data ? params.data.NODEJS = 'storeGId' : params.data = {
    NODEJS: 'storeGId'
  }
  wxRequest(params, 'link')
}
const link_quitmeeting = (params) => {
  params.data ? params.data.NODEJS = 'quitmeeting' : params.data = {
    NODEJS: 'quitmeeting'
  }
  wxRequest(params, 'link')
}
const link_delmeeting = (params) => {
  params.data ? params.data.NODEJS = 'delmeeting' : params.data = {
    NODEJS: 'delmeeting'
  }
  wxRequest(params, 'link')
}
const link_viewjielongtask = (params) => {
  params.data ? params.data.NODEJS = 'viewjielongtask' : params.data = {
    NODEJS: 'viewjielongtask'
  }
  wxRequest(params, 'link')
}
const link_myJoin = (params) => {
  params.data ? params.data.NODEJS = 'myJoin' : params.data = {
    NODEJS: 'myJoin'
  }
  wxRequest(params, 'link')
}
const link_sendyijian = (params) => {
  params.data ? params.data.NODEJS = 'sendyijian' : params.data = {
    NODEJS: 'sendyijian'
  }
  wxRequest(params, 'link')
}

/**结束 */
module.exports = {
  getopenid,
  addUser,
  link_creatjielongtask,
  link_editjielongtask,
  link_getGIDTask,
  link_quitmeeting,
  link_delmeeting,
  link_getTaskJoiner,
  link_getjielongtask,
  link_isEnrolled,
  link_joinjielongtask,
  link_myCreate,
  link_storeGId,
  link_viewjielongtask,
  link_myJoin,
  link_sendyijian
}