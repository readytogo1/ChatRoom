const EventEmitter = require('events');
const myEmitter = new EventEmitter();

myEmitter.on('event',()=>{
    console.log('触发事件1');
});

myEmitter.on('event',()=>{
    console.log('触发事件2')
})

myEmitter.emit('event');

myEmitter.on('event2',(a,b)=>{
    console.log(a,b);
})

myEmitter.emit('event2','a','b');

myEmitter.on('event3',(fn)=>{
    fn('可以传入参数');
});

myEmitter.emit('event3',(a)=>{
    console.log(a);
});
