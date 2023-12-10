const exp = require('express');

const mongo = require('mongoose');

const web = require('http');


const sock = require('socket.io');

const bp = require('body-parser');

const application = exp();


const db = web.createServer(application);

const my_sock_io = sock(db);

mongo.connect('mongodb://localhost:27017/whtsp', {


  useNewUrlParser: true,

  useUnifiedTopology: true


});

application.use(bp.urlencoded({ extended: true }));

application.use(bp.json());


const authen_route = require('./route/authen');


const cntct_route = require('./route/cntct');

const msg_route = require('./route/msg');


const grp_route = require('./route/grp');

application.use('/api/auth', authen_route);

application.use('/api/contacts', cntct_route);

application.use('/api/messages', msg_route);


application.use('/api/groups', grp_route);

application.use(exp.static(__dirname + '/public'));

my_sock_io.on('connection', (ele) => {


  console.log('Client connected');

  ele.on('disconnect', () => {


    console.log('Client disconnected');


  });


});


const my_port = process.env.my_port || 8080;


db.listen(my_port, () => {


  console.log(`${my_port}`);

  
});
