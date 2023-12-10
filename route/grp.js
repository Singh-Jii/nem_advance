const exp = require('express');

const my_route = exp.Router();


const authen = require('../middleware/authen');

const Client = require('../model/client');

const Grp = require('../model/grp');


const msg = require('../model/msg');

const socket = require('../socket'); 

my_route.post('/create', authen, async (request, response) => {


  try {

    const { client_id } = request.client;


    const { grp_name, members } = request.body;

    const avail_grp = await Grp.findOne({ name: grp_name });

    if (avail_grp) {


      return response.status(400).json({ msg: 'Group name available' });

    }

    if (!members.includes(client_id)) {


      members.push(client_id);

    }

    const new_grp = new Grp({


      name: grp_name,

      members,


    });

    await new_grp.save();

    response.status(200).json({ msg: 'Group made' });


  } 
  
  catch (er) {


    console.log(er);

    response.status(500).json({ msg: 'error' });


  }


});

my_route.post('/send/:groupId', authen, async (request, response) => {


  try {

    const { client_id } = request.client;

    const { grp_id } = request.params;


    const { cntnt } = request.body;

    const grp = await Grp.findOne({ _id: grp_id, members: client_id });

    if (!grp) {


      return response.status(403).json({ msg: 'not a group member' });

    }

    const new_msg = new Msg({


      sender: client_id,

      cntnt,

      group: grp_id,


    });

    await new_msg.save();

    const grp_membr = grp.members;


    grp_membr.forEach((customer) => {


      const membr_sock = sock.get_client_sock(customer);

      if (membr_sock) {


        membr_sock.emit('new_group_message', new_msg);

      }


    });

    response.status(200).json({ msg: 'msg sent to group' });

  } 
  
  catch (er) {

    console.log(er);


    response.status(500).json({ msg: 'error' });


  }

});


module.exports = my_route;
