const exp = require('express');

const my_route = exp.Router();

const bc = require('bcrypt');


const jot = require('jsonwebtoken');

const Client = require('../model/client');

my_route.post('/signup', async (request, response) => {


  try {

    const { name, email, password } = request.body;

    const avail_client = await Client.findOne({ email });


    if (avail_client) {


      return response.status(400).json({ msg: 'Client available already' });


    }

    const privacy = await bc.hash(password, 8);

    const new_client = new Client({


      name,

      email,

      password: privacy


    });

    await new_client.save();

    response.status(201).json({ msg: 'Client registration completed' });


  } 
  
  catch (er) {


    console.log(er);

    response.status(500).json({ msg: 'error' });


  }


});

my_route.post('/login', async (request, response) => {


  try {

    const { email, password } = request.body;

    const client = await Client.findOne({ email });

    if (!client) {


      return response.status(401).json({ msg: 'wrong information' });


    }

    const combine_pswrd = await bc.compare(password, client.password);

    if (!combine_pswrd) {

      return response.status(401).json({ msg: 'wrong information' });


    }


    const my_tok = jot.sign({ client_id: client._id }, 'secret_key', { expiresIn: '2h' });

    response.status(200).json({ my_tok, client_id: client._id });


  } 
  
  catch (er) {


    console.log(er);

    response.status(500).json({ msg: 'error' });


  }


});


module.exports = my_route;
