const mongo = require('mongoose');


const cntct_schema = new mongo.Schema({


  client: { 
    
    type: mongo.Schema.Types.ObjectId, 
    
    ref: 'Client' 
  
  },

  cntct_list: [{ 
    
    type: mongo.Schema.Types.ObjectId, 
    
    ref: 'Client' 
  
  }]


});


module.exports = mongo.model('Contact', cntct_schema);
