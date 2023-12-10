const mongo = require('mongoose');

const client_schema = new mongo.Schema({


  name: String,

  email: { 
    
    type: String, 
    
    unique: true 
  
  },

  password: String,

  profile_picture: String,

  contacts: [{ 
    
    type: mongo.Schema.Types.ObjectId, 
    
    ref: 'Contact' 
  
  }]

});


module.exports = mongo.model('Client', client_schema);
