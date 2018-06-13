
// 1、搭建网络服务 (提供 网络请求服务 =>显示html页面)
var express = require("express");
var app = express();

app.use(express.static("public"))

app.get("/",function(req,res){
    res.send("hello")
})

app.listen(70,function(){
    console.log("server run at 10.9.151.144")
})


//2 搭建服务器端的socket
var io = require("socket.io").listen(8080)

var users  = {}
var number = 1
// 当有人连接的时候
io.on("connection",function(socket){
    //socket 是连接的用户的信息对象
    console.log("有人连接了"+socket)
    //console.log(socket)
    var ip = socket.client.conn.remoteAddress

    //判断 users里面有没有当前链接的用户
    if(!users[ip]){
        users[ip] = {
            username:"萌新"+number++,
            imgUrl:"images/3.jpg"
        }
    }
    //发送
    socket.send({
        msg:"hello !!!",
        userInfo:{
            username:"独孤",
            imgUrl:"images/2.jpg"
        }
    })

    //接收
    socket.on("message",function(msg){
        console.log(msg)
        //需要把接收到的消息广播给所有人
       
        socket.broadcast.send({
            userInfo:users[ip], //把用户信息和消息都广播出去
            msg
        })
    })

    //监听改名的事件
    socket.on("changeName",function(newName){
        //在  users 里面 通过ip 修改自己的昵称
        users[ip].username = newName;
    });

     //监听改图像的事件
    socket.on("changePic",function(newPic){
        //在  users 里面 通过ip 修改自己的昵称
        users[ip].imgUrl = newPic;
    })
})