const dns = require('dns');

dns.lookup("db.rheosrxnlliifszdbrwv.supabase.co", (err, address, family) => {
  console.log("IP:", address);
  console.log("Family:", family);
});