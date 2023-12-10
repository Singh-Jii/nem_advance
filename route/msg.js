const exp = require('express');

const my_route = exp.Router();


const authen = require('../middleware/authen');

const Msg = require('../model/msg');


const Client = require('../model/client');

const sock = require('../socket'); 


my_route.post('/send', authen, async (request, response) => {


  try {

    const { client_id } = request.client;


    const { rec_mail, cntnt } = request.body;

    const sender = await Client.findById(client_id);


    const rec = await Client.findOne({ email: rec_mail });

    if (!rec) {


      return response.status(404).json({ msg: 'Recipient not available' });


    }

    const new_msg = new Msg({


      sender: client_id,

      rec: rec._id,


      cntnt,


    });

    await new_msg.save();


    const rec_sock = sock.get_client_sock(rec._id);

    if (rec_sock) {


      rec_sock.emit('new_message', new_msg);


    }

    response.status(200).json({ msg: 'msg sent' });


  } 
  
  catch (er) {


    console.log(er);


    response.status(500).json({ msg: 'error' });


  }


});

my_route.get('/retrieve/:recipient_email', authen, async (request, response) => {


  try {


    const { client_id } = request.client;


    const rec_mail = request.params.rec_mail;

    const sender = await Client.findById(client_id);


    const rec = await Client.findOne({ email: rec_mail });

    if (!rec) {


      return response.status(404).json({ msg: 'Recipient not available' });


    }

    const msgs = await Msg.find({


      $or: [{ sender: client_id, rec: rec._id },{ sender: rec._id, rec: client_id },],


    }).sort({ timestamp: 1 });

    response.status(200).json({ msgs });


  } 
  
  catch (er) {


    console.log(er);


    response.status(500).json({ msg: 'error' });


  }


});


module.exports = my_route;
