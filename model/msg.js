const mongo = require('mongoose');

const msg_schema = new mongo.Schema({


  sender: { 
    
    type: mongo.Schema.Types.ObjectId, 
    
    ref: 'Client' 
  
  },

  recipient: { 
    
    type: mongo.Schema.Types.ObjectId, 
    
    ref: 'Client' 
  
  },

  content: String,

  timestamp: { 
    
    type: Date, 
    
    default: Date.now 
  
  },


  attachments: [String]


});


module.exports = mongo.model('Msg', msg_schema);
