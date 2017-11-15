// Import the page's CSS. Webpack will know what to do with it.
import "../stylesheets/app.css";

// Import libraries we need.
import { default as Web3} from 'web3';
import { default as contract } from 'truffle-contract'

// Import our contract artifacts and turn them into usable abstractions.
import metacoin_artifacts from '../../build/contracts/MetaCoin.json'
const IPFS = require('ipfs');
const series = require('async/series');
var concatStream = require('concat-stream');
let fileMultihash;
// MetaCoin is our usable abstraction, which we'll use through the code below.
var MetaCoin = contract(metacoin_artifacts);

// The following code is simple to show off interacting with your contracts.
// As your needs grow you will likely need to change its form and structure.
// For application bootstrapping, check out window.addEventListener below.
var accounts;
var account;

var crazyAddress;

window.App = {
  start: function() {
    var self = this;

    // Bootstrap the MetaCoin abstraction for Use.
    MetaCoin.setProvider(web3.currentProvider);

    // Get the initial account balance so it can be displayed.
    web3.eth.getAccounts(function(err, accs) {
      if (err != null) {
        alert("There was an error fetching your accounts.");
        return;
      }

      if (accs.length == 0) {
        alert("Couldn't get any accounts! Make sure your Ethereum client is configured correctly.");
        return;
      }

      accounts = accs;
     // account = accounts[0];
     account = sessionStorage.getItem('account');

    });
  },

  storeMe: function() {
    // Create the IPFS node instance
      const node = new IPFS();

      series([
  (cb) => node.on('ready', cb),
  (cb) => node.version((err, version) => {
    if (err) { return cb(err) }
    console.log('Version:', version.version)
    cb()
  }),
  (cb) => node.files.add({
    path: 'hello.txt',
    content: Buffer.from('Hello World 101')
  }, (err, result) => {
    if (err) { return cb(err) }

    console.log('\nAdded file:', result[0].path, result[0].hash)
    fileMultihash = result[0].hash
    cb()
  }),
  (cb) => node.files.cat(fileMultihash, (err, stream) => {
    if (err) { return cb(err) }

    console.log('\nFile content:')
    stream.pipe(process.stdout)
    stream.on('end', process.exit)
  })
]);

    /*  node.on('ready', () => {
        // Your node is now ready to use \o/

        // stopping a node
        node.stop(() => {
          // node is now 'offline'
        })
      });*/
  },
  putCitizenHash : function(){
         const node = new IPFS();
          var name = document.getElementById("Name").value;
    var dob = document.getElementById("DOB").value;
    var address = document.getElementById("Addr").value;
    var pin = parseInt(document.getElementById("Pin").value);
    var phone = parseInt(document.getElementById("Phone").value);
    var email = document.getElementById("Email").value;
    var customerDetails={
        'name':name,
        'dob':dob,
        'address':address,
        'pin':pin,
        'phone':phone,
        'email':email,

    }

        series([
    (cb) => node.on('ready', cb),
    (cb) => node.version((err, version) => {
      if (err) { return cb(err) }
      console.log('Version:', version.version)
      cb()
    }),
    (cb) => node.files.add({
      path: 'hello.txt',
      content: Buffer.from(JSON.stringify(customerDetails))
    }, (err, result) => {
      if (err) { return cb(err) }

      console.log('\nAdded file:', result[0].path, result[0].hash)
      //fileMultihash = this.ipfsHashToBytes32(result[0].hash)
      fileMultihash = result[0].hash
      this.createCitizen((fileMultihash))
      cb()
    }),
    (cb) => node.files.cat(fileMultihash, (err, stream) => {
      if (err) { return cb(err) }

      console.log(stream.toString())
      stream.pipe(concatStream(function(buf){
    // buf is a Node Buffer instance which contains the entire data in stream
    // if your stream sends textual data, use buf.toString() to get entire stream as string
    var streamContent = buf.toString();
    console.log(streamContent);
  }));
      //stream.pipe(process.stdout)
     // stream.on('end', process.exit)
     //String returnString;
     //stream.on('data', returnString)
     stream.on('end', process.exit)
     //console.log(returnString)
    })
  ]);



  },
  setAuthorization: function() {
    var temp1 = document.getElementById("service1");
    var service1 = temp1.options[temp1.selectedIndex].value;
    var temp2 = document.getElementById("authority1");
    var authority1 = temp2.options[temp2.selectedIndex].value;
   // window.alert(authority1);
    var meta;
    MetaCoin.deployed().then(function(instance) {
    meta = instance;
    //contractAddress=meta.address;
    
    return meta.setAuthorization( service1 ,authority1, {from: account, gas:300000});

    }).then(function() {
      document.getElementById("success").style.display = "block";
    }).catch(function(e) {
      console.log(e);
    });
  },

  revokeAuthorization: function() {
    //window.alert(120309);
    var temp1 = document.getElementById("service2");
    //console.log(temp1);
    var service2 = temp1.options[temp1.selectedIndex].value;
    var temp2 = document.getElementById("authority2");
    var authority2 = temp2.options[temp2.selectedIndex].value;
    console.log(service2);
    console.log(authority2);
    var meta;
    MetaCoin.deployed().then(function(instance) {
    meta = instance;
  //  contractAddress=meta.userAddresss;
    return meta.revokeAuthorization(authority2, service2 , {from: account, gas:300000});

    }).then(function() {
        document.getElementById("success1").style.display = "block";
    }).catch(function(e) {
      console.log(e);
    });
  },

  revokeKYC: function() {
    var target = document.getElementById("userAddress").value;

    var meta;
    MetaCoin.deployed().then(function(instance) {
    meta = instance;
   // contractAddress=meta.address;
    return meta.revokeKyc(target , {from: account, gas:300000});

    }).then(function() {
    }).catch(function(e) {
      console.log(e);
    });
  },
  

  sendCoin: function() {

    var amount = parseInt(document.getElementById("amount").value);
    var receiver = document.getElementById("receiver").value;

 var meta;
    MetaCoin.deployed().then(function(instance) {
    meta = instance;
    //contractAddress=meta.address;
    //alert(receiver);
    return meta.setAuthorization(amount, receiver , {from: account, gas:300000});

    }).then(function() {
    }).catch(function(e) {
      console.log(e);
    });
  },

  putCitizenAadhar: function() {
    var aadharNo = parseInt(document.getElementById("AadharNumber").value);
  
    var meta;
    MetaCoin.deployed().then(function(instance) {
    meta = instance;
    //contractAddress=meta.address;
   // alert(receiver);
    return meta.putCitizenAadhar(crazyAddress, aadharNo, {from: account, gas:300000});
    }).then(function(success) {
      console.log(JSON.stringify(success));
    }).catch(function(e) {
      console.log(e);
    });
  },

    grantReadAccess: function() {

    var amount = parseInt(document.getElementById("amount").value);
    var receiver = document.getElementById("receiver").value;

 var meta;
    MetaCoin.deployed().then(function(instance) {
    meta = instance;
    //contractAddress=meta.address;
    //alert(receiver);
    return meta.setAuthorization(amount, receiver , {from: account, gas:300000});

    }).then(function() {
    }).catch(function(e) {
      console.log(e);
    });
  },

  grantReadWriteAccess: function() {

    var authorityaddress = parseInt(document.getElementById("authorityaddress").value);
    var type = 1;

 var meta;
    MetaCoin.deployed().then(function(instance) {
    meta = instance;
    //contractAddress=meta.address;
    
    return meta.grantReadWriteAccess(authorityaddress, type , {from: account, gas:300000});

    }).then(function(success) {
      console.log(success);
      document.getElementById("warning").style.display = "block";
    }).catch(function(e) {
      console.log(e);
    });
  },

  createCitizen: function(_hash) {

    var meta;
    MetaCoin.deployed().then(function(instance) {
    meta = instance;
    //contractAddress=meta.address;
    //alert(receiver);
    return meta.putCitizenHash(_hash, {from: account, gas:300000});
   // return meta.addAadhar(aadharNo);
   // return meta.addPan(pan);
   // return meta.addVoter(voterid);
   // return meta.addPassport(passport);

    }).then(function() {
      document.getElementById("success").style.display = "block";
    }).catch(function(e) {
      console.log(e);
    });
  },

  getCitizenDetails: function() {
   //window.alert(123);
   const node = new IPFS();
    var streamContent;

    var meta;
     this.getCitizenAadhar();
    MetaCoin.deployed().then(function(instance) {
    meta = instance;
    //contractAddress=meta.address;
    //alert(receiver);
    return meta.getCitizenDetailsHash.call(account, {from: account, gas:3000000});

    }).then(function(success) {
     // alert(JSON.stringify(success));
      //ipfsUserHash=success;
      var qr =new QRCode(document.getElementById("qrcode"),success);
      node.files.cat(success, (err, stream) => {
      if (err) { return cb(err) }

     
      stream.pipe(concatStream(function(buf){
    // buf is a Node Buffer instance which contains the entire data in stream
    // if your stream sends textual data, use buf.toString() to get entire stream as string
     streamContent = JSON.parse(buf.toString());
    //console.log(streamContent);
    //console.log( streamContent.name);
    
    document.getElementById("PName").value = streamContent.name;
    document.getElementById("PDOB").value = streamContent.dob;
    document.getElementById("PAddr").value = streamContent.address;
    document.getElementById("PPhone").value = streamContent.phone;
    document.getElementById("PEmail").value = streamContent.email;
    document.getElementById("PPin").value = streamContent.pin; 
   

    
    }));

     stream.on('end', process.exit)

    });

     // console.log( streamContent.name);
        
    }).catch(function(e) {
      console.log(e);
    }); 
  },
  getCitizenHashForQr: function(acc) {
   //window.alert(123);
   const node = new IPFS();
    var streamContent;

    var meta;
    MetaCoin.deployed().then(function(instance) {
    meta = instance;
    //contractAddress=meta.address;
    //alert(receiver);
    return meta.getCitizenDetailsHash.call(account, {from: account, gas:3000000});

    }).then(function(success) {
     // alert(JSON.stringify(success));
     return success;

     // console.log( streamContent.name);
        
    }).catch(function(e) {
      console.log(e);
    }); 
  },
  getCitizenAadhar: function () {
    //alert('adfaf');
    var meta;
    MetaCoin.deployed().then(function(instance) {
    meta = instance;
    //contractAddress=meta.address;
    //alert(receiver);
    return meta.getCitizenAadhar.call(account, {from: account, gas:3000000});

    }).then(function(success) {
    //alert(success);
    document.getElementById("PAadhar").value = success;
     
    }).catch(function(e) {
      console.log(e);
    });

  },

   getCitizenDetailsforauth: function(acc) {
  //  window.alert(123);
   const node = new IPFS();

   crazyAddress=acc;
    var streamContent;

    var meta;
    MetaCoin.deployed().then(function(instance) {
    meta = instance;
    //contractAddress=meta.address;
    //alert(receiver);
    return meta.getCitizenDetailsHash.call(acc, {from: account, gas:3000000});

    }).then(function(success) {
      //alert(JSON.stringify(success));
      node.files.cat(success, (err, stream) => {
      if (err) { return cb(err) }

     
      stream.pipe(concatStream(function(buf){
    // buf is a Node Buffer instance which contains the entire data in stream
    // if your stream sends textual data, use buf.toString() to get entire stream as string
     streamContent = JSON.parse(buf.toString());
    //console.log(streamContent);
    //console.log( streamContent.name);
    
    document.getElementById("Name").value = streamContent.name;
    document.getElementById("DOB").value = streamContent.dob;
    document.getElementById("Addr").value = streamContent.address;
    document.getElementById("Phone").value = streamContent.phone;
    document.getElementById("Email").value = streamContent.email;
    document.getElementById("Pin").value = streamContent.pin; 
    
    }));
     stream.on('end', process.exit)
    });

     // console.log( streamContent.name);
        
    }).catch(function(e) {
      console.log(e);
    }); 
  },

  getPendingCitizens: function() {
 // window.alert(123);
    var meta;
    var type = 1;
    var authorityaddress = '0x143a18228298e7a38427861a2840dbf061e3fc49';
    MetaCoin.deployed().then(function(instance) {
    meta = instance;
    //contractAddress=meta.address;
    //alert(receiver);
    return meta.getPendingCitizenAuthorization(authorityaddress, type, {from: account, gas:300000});

    }).then(function(RcustomerAuthentication) {
      //var arr[] = JSON.stringify(RcustomerAuthentication);
      //alert(RcustomerAuthentication);
      document.getElementById("cit1").innerHTML = RcustomerAuthentication[0];
   
   document.getElementById("cit2").innerHTML = RcustomerAuthentication[1];
    //document.getElementById("PAddr").value = web3.toUtf8(success[3]);
    //document.getElementById("PPin").value = success[4];
    //document.getElementById("PPhone").value = web3.toUtf8(success[2]);
    //document.getElementById("PEmail").value = web3.toUtf8(success[5]);
     
    }).catch(function(e) {
      console.log(e);
    });
  }

};

window.addEventListener('load', function() {
  // Checking if Web3 has been injected by the browser (Mist/MetaMask)
  if (typeof web3 !== 'undefined') {
    console.warn("Using web3 detected from external source. If you find that your accounts don't appear or you have 0 MetaCoin, ensure you've configured that source properly. If using MetaMask, see the following link. Feel free to delete this warning. :) http://truffleframework.com/tutorials/truffle-and-metamask")
    // Use Mist/MetaMask's provider
    window.web3 = new Web3(web3.currentProvider);
  } else {
    console.warn("No web3 detected. Falling back to http://localhost:8545. You should remove this fallback when you deploy live, as it's inherently insecure. Consider switching to Metamask for development. More info here: http://truffleframework.com/tutorials/truffle-and-metamask");
    // fallback - use your fallback strategy (local node / hosted node + in-dapp id mgmt / fail)
    window.web3 = new Web3(new Web3.providers.HttpProvider("http://localhost:8545"));
  }

  App.start();
});
