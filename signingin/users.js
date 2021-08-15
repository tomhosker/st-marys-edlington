const records = [
    { id: 1, username: "admin", password: "guest" }
];

exports.findById = function(id, cb){
  process.nextTick(function(){
    let idx = id-1;

    if(records[idx])
    {
      cb(null, records[idx]);
    }
    else
    {
      cb(new Error("User "+id+" does not exist."));
    }
  });
}

exports.findByUsername = function(username, cb){
  process.nextTick(function(){
    let record;

    for(let i = 0; i < records.length; i++)
    {
      record = records[i];
      if(record.username === username)
      {
        return cb(null, record);
      }
    }

    return cb(null, null);
  });
}
