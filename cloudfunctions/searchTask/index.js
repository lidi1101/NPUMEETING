// 云函数入口文件
const cloud=require('wx-server-sdk')
cloud.init({
  env:'lidi-npu-meeting-1-putof'
})
const db = cloud.database()
const _ = db.command
const MSGID = 'T2Dm6bQ5MjUlPKWBW0ye_nmbkaPAK4WJPSMyp--4O6M';//订阅消息ID

//生成日期格式
const formatTimeDay = date => {
  const year = date.getFullYear()
  const month = date.getMonth() + 1
  const day = date.getDate()
  const hour = date.getHours()+8
  const minute = date.getMinutes()
  const second = date.getSeconds()

  return [year, month, day].map(formatNumber).join('/') + ' ' + [hour, minute, second].map(formatNumber).join(':')
}
const formatNumber = n => {
  n = n.toString()
  return n[1] ? n : '0' + n
}

exports.main =async (event,context)=>{
  const execTasks = [];//待提醒会议任务栈

  //1.查找数据库中是否有任务存在
  let taskRes = await db.collection('link_task').where({
    taskType: _.or(_.eq(0), _.eq(1))  // taskType=0||1
  }).limit(100).get()
  let tasks = taskRes.data;

  //2.查询是否到达会议通知触发时间
  let now = formatTimeDay(new Date());

  try {
    for (let i = 0; i < tasks.length; i++) {
      if (tasks[i].taskType == 1) {

        if (tasks[i].execTime <= now) { // 如果任务未提醒过，且到了提醒时间
          execTasks.push(tasks[i]); // 存入待执行任务栈
          // 修改状态，避免多次触发
          await db.collection('link_task').where({
            taskid: tasks[i].taskid
          }).update({
            data: {
              taskType: 0
            }
          })
        }
      } else if (tasks[i].taskType == 0) {
        if (tasks[i].overTime <= now) {// 如果任务提醒过，且会议已结束
          //修改状态
          await db.collection('link_task').where({
            taskid: tasks[i].taskid
          }).update({
            data: {
              taskType: 2
            }
          })
        }
      }
    }
  } catch (e) {
    console.error(e)
  }

  //3.处理任务
  for (let i = 0; i < execTasks.length; i++) {
    let activity = execTasks[i];
    var sentremark = activity.remark;
    if (sentremark==''){
      sentremark='详情点击进入小程序查看';
    }
    console.log(sentremark);
    let msgData = {
      "thing1": {
        "value": activity.title
      },
      "time2": {
        "value": activity.overTime
      },
      "thing3": {
        "value": sentremark
      },
    };

    // 根据会议id，获取参与用户信息，获取到用户的 openids，不止一个
    const openids = []
    //在link_user数据库中根据taskid 查找，条件taskid==taskid
    let find_tasks = await db.collection('link_user').where({
      taskid: activity.taskid
    }).get()
    let res_tasks = find_tasks.data;
    //openid不为空，存入
    for (let i = 0; i < res_tasks.length; i++) {
      if (res_tasks[i].openid) {
        openids.push(res_tasks[i].openid);
      }
    }

    for (let i = openids.length - 1; i >= 0; i--) {
      let cur_openid = openids[i]; //用户openid
      try {
        await cloud.openapi.subscribeMessage.send({
          touser: cur_openid,
          page: '../../link/index/index',
          data: msgData,
          templateId: MSGID,
        });
        openids.pop();
      } catch (e) {
        console.log("消息推送失败，line110")
        console.log(e);
        return e;
      }
    }
  }
}