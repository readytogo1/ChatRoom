

const http = require('http');
const express = require('express');
const socketIO = require('socket.io').Server;
const { Socket } = require('dgram');

const app = new express();
const server = http.createServer(app);
const io = new socketIO(server);
var sockets={};
const history=[];
app.use(express.static('web'));

io.on('connection',socket=>{
    console.log('a user connected');
    
    const name = socket.handshake.query.name;
    sockets[name] = socket;
    socket.on('sendMessage',(content)=>{
        console.log('receive a message',name,content);
        const message = {
            time:Date.now(),
            sender:name,
            content
        };
        history.push(message);
        socket.broadcast.emit('receiveMessage',message);
    });
    io.sockets.emit('online',Object.keys(sockets));
    
    socket.on('disconnect',(reason)=>{
        delete sockets[name];
        console.log('a user disconnect:',name,reason);
        io.sockets.emit('online',Object.keys(sockets));
    });
    //io.sockets.emit('online',Object.keys(sockets));

    socket.on('gethistory',(fn)=>{
        fn(history);
    });
});

io.use((socket,next)=>{
    console.log('a client is coming');
    const name=socket.handshake.query.name;
    const password=socket.handshake.query.password;
    const verify = socket.handshake.query.verify;
    console.log(verify);

    if(verify){
        socket.on('historyrecord',(history)=>{
            socket.emit('firsthistory',history);
        })
        next();
        return;
    }
    if(!name){
        console.log('拒接连接：没有账户名');
        next(new Error('empty'));
        return;
    }
    if(password!=='111'){
        console.log('拒绝连接：密码错误');
        next(new Error('error'));
        return;
    }
    next();
});


server.listen(9998);

