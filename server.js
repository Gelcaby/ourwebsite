/*
 * @Author: @Guojufeng 
 * @Date: 2019-06-02 19:42:06 
 * @Last Modified by: @Guojufeng
 * @Last Modified time: 2019-06-02 21:39:56
 * 优化 - 加入消息类型和当前时间的响应
 */
const ws = require('nodejs-websocket');
const POST = 8081;
let count = 0;

const TYPE_LEAVE  = 0;
const TYPE_ENTRY  = 1;
const TYPE_SPEAK  = 2;

const server = ws.createServer((connect)=>{
  count++;
  connect.userName = `用户${count}`;
  broadcast({
    type: TYPE_ENTRY,
    msg: `${connect.userName}加入群聊。`
  });
  connect.on('text',(rst)=>{
    broadcast({
      type: TYPE_SPEAK,
      msg: `${connect.userName}: ${rst}`
    });
  });
  connect.on('close',(code,reason)=>{
    broadcast({
      type: TYPE_LEAVE,
      msg: `${connect.userName}退出了群聊。`
    });
    count--;
  });
  connect.on('error',()=>{
    console.log('哎呀，出错啦！刷新试试?');
  })
});
function broadcast(cont){
  let sendCont = {
    type: cont.type,
    msg: cont.msg,
    time: new Date().toLocaleTimeString()
  };
  server.connections.forEach((element)=>{
    element.send(JSON.stringify(sendCont));
  });
}


server.listen(POST,()=>{
  console.log(`${POST}服务器启动成功。`)
})
