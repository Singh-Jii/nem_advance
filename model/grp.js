const mongo = require('mongoose');


const grp_schema = new mongo.Schema({


  name: String,

  members: [{ 
    
    type: mongo.Schema.Types.ObjectId, 
    
    ref: 'Client' 
  
  }],

  msgs: [{ 
    
    type: mongo.Schema.Types.ObjectId, 
    
    ref: 'Msg' 
  
  }]


});


module.exports = mongo.model('Group', grp_schema);
