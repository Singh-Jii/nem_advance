const exp = require('express');

const my_route = exp.Router();

const authen = require('../middleware/authen');


const Client = require('../model/client');


const cntct = require('../model/cntct');

my_route.post('/add', authen, async (request, response) => {


  try {


    const { client_id } = request.client;

    const { cntct_mail } = request.body;

    const cntct_client = await Client.findOne({ email: cntct_mail });

    if (!cntct_client) {


      return response.status(404).json({ msg: 'Contact client not available' });


    }

    const avail_client = await cntct.findOne({ client: client_id, cntct_list: cntct_client._id });


    if (avail_client) {


      return response.status(400).json({ msg: 'Contact present already' });


    }

    await cntct.findOneAndUpdate(

      { 
        
        client: client_id 
      
      },


      { 
        
        $push: { 
          
          cntct_list: cntct_client._id 
        
        } 
      
      },

      { 
        
        upsert: true 
      
      }


    );

    response.status(200).json({ msg: 'Contact prresent' });


  } 
  
  catch (er) {


    console.log(er);


    response.status(500).json({ msg: 'error' });


  }


});

+


my_route.post('/remove', authen, async (request, response) => {


  try {


    const { client_id } = request.client;


    const { cntct_mail } = request.body;

    const cntct_client = await Client.findOne({ email: cntct_mail });

    if (!cntct_client) {


      return response.status(404).json({ msg: 'Contact client not available' });


    }

    await cntct.findOneAndUpdate(


      { 
        
        client: client_id 
      
      
      },


      { 
        
        $pull: { 
          
          cntct_list: cntct_client._id 
        
        } 
      
      }


    );

    response.status(200).json({ msg: 'Contact deleted' });


  } 
  
  catch (er) {


    console.log(er);


    response.status(500).json({ msg: 'error' });


  }


});

my_route.get('/view', authen, async (request, response) => {


  try {


    const { client_id } = request.client;

    const client_cntcts = await cntct.findOne({ client: client_id }).populate('contact_list', 'name email');

    response.status(200).json({ cntcts: client_cntcts.cntct_list });


  } 
  
  catch (er) {


    console.log(er);

    response.status(500).json({ msg: 'error' });


  }


});


module.exports = my_route;
