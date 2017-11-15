pragma solidity ^0.4.11;

contract MetaCoin {

    address govtId; //can be used as govtID
    string country;
    struct Permission{
        bool access;
        uint time;
    }
    struct Citizen{
        address owner;
        bytes32 name;
        bytes32 dob;    
        uint phoneNo;
        bytes32 addr1;
        uint8 pincode;
        bytes32 emailId;
        uint8 aadharNo;
        uint panNo;
        uint voterNo;
        uint passportNo;
        string detailsHash;
        
        mapping (address => Permission) aadharR;
        mapping (address => Permission) aadharRW;
        mapping (address => Permission) panR;
        mapping (address => Permission) panRW;
        mapping (address => Permission) voterR;
        mapping (address => Permission) voterRW;
        mapping (address => Permission) passportR;
        mapping (address => Permission) passportRW;
        
        bool aadharV;
        bool panV;
        bool voterV;
        bool passportV;
        bool localV;
        bool globalV;

    }
    
    //government variables
    mapping(address=>Citizen) citizens;
    mapping(address=>bool) aadharAuthorization;
    mapping(address=>bool) panAuthorization;
    mapping(address=>bool) voterAuthorization;
    mapping(address=>bool) passportAuthorization;

    struct Authority{
      bytes32 name;
      //uint8 type;
      bool isVerified;
    }

    mapping(address=>Authority) authorities;
    uint8 authCount;
    //uint8 approvedAuthorityTracker;
    address[2] customerAuthentication;
    //event E_AuthoritySet(string indexed _authority,address indexed _addr);
    uint8 i;

    function MetaCoin(string _country) {
        govtId=msg.sender;
        country=_country;
        authCount=0;
        i=0;

    }

    //Modifier to place a constraint on the user calling a function
       modifier onlyOwner() {
        if (msg.sender != govtId) {
            throw;
        }
        _;     
    }

    //government functions 
    function  setAuthorization (address _authority, uint8 _type) public onlyOwner returns (bool success) {
          if(_type==1){
              aadharAuthorization[_authority]=true;
              //E_AuthoritySet("Aadhar",_authority);
              return true;
          }else if (_type==2){
              panAuthorization[_authority]=true;
              return true;
          }else if (_type==3){
              voterAuthorization[_authority]=true;    
              return true;
          }else if (_type==4){
              passportAuthorization[_authority]=true;
              return true;
          }else
           return false;
      }
      
    function  revokeAuthorization (address _authority, uint8 _type) public onlyOwner returns (bool success){
          if(_type==1){
              aadharAuthorization[_authority]=false;
              return true;
          }else if (_type==2){
              panAuthorization[_authority]=false;
              return true;
          }else if (_type==3){
              voterAuthorization[_authority]=false;    
              return true;
          }else if (_type==4){
              passportAuthorization[_authority]=false;
              return true;
          }else
           return false;
      }


    function  revokeKyc(address _target) onlyOwner returns (bool success){
        citizens[_target].aadharV=false;
        citizens[_target].panV=false;
        citizens[_target].voterV=false;
        citizens[_target].passportV=false;
        citizens[_target].localV=false;
          citizens[_target].globalV=false;
          return true;
    }

    /////////////////////////////////////////////////////////////////////////////////////////////
    function createAuthority(bytes32 _name, uint8 _type) returns (bool success){
      authorities[msg.sender].name=_name;
      //authorities[msg.sender].type=_type;
      //authorityAuthorizationTracker[authCount]=msg.sender;
      //authCount+=1;

    }
    
    function performCitizenAuthorization(address _customer,uint8 _type) returns (bool success){
      if(_type==1){
              citizens[_customer].aadharV=true;
              setLocalV(_customer);
              return true;
          }else if (_type==2){
              citizens[_customer].panV=true;
              setLocalV(_customer);
              return true;
          }else if (_type==3){
              citizens[_customer].voterV=true;
              setLocalV(_customer);
              return true;
          }else if (_type==4){
              citizens[_customer].passportV=true;
              setGlobalV(_customer);
              return true;
          }else
           return false;   
    }
    
    function getPendingCitizenAuthorization(address _authority, uint8 _type) constant returns (address[2] RcustomerAuthentication){
      RcustomerAuthentication = customerAuthentication;

    }

    /////////////////////////////////////////////////////////////////////////////////////////////
      
      //Citizen Functions ///////////////////////////////////////////////////////////////////////////////////////
      
      /* function createCitizen (bytes32 _name, bytes32 _dob, uint _phoneNo, bytes32 _addr1, uint8 _pincode, bytes32 _emailId) public returns (bool success){
          citizens[msg.sender].owner=msg.sender;    
          citizens[msg.sender].name=_name;
          citizens[msg.sender].dob=_dob;
          citizens[msg.sender].phoneNo=_phoneNo;
          citizens[msg.sender].addr1=_addr1;
          citizens[msg.sender].pincode=_pincode;
          citizens[msg.sender].emailId=_emailId;
          invalidateKyc(msg.sender);
          customerAuthentication[i]=msg.sender;
          i+=1;
          return true;
      } */
      function putCitizenHash(string _hash) public returns (bool success) {
        citizens[msg.sender].owner=msg.sender;
        citizens[msg.sender].detailsHash=_hash;
        invalidateKyc(msg.sender);
          customerAuthentication[i]=msg.sender;
          i+=1;
        return true;
      }
      function getCitizenDetailsHash(address _citizen) public returns (string RcitizenDetailsHash){
         RcitizenDetailsHash = citizens[_citizen].detailsHash;
         return RcitizenDetailsHash;
      }



      function addAadhar (uint8 _aadharNo) public returns (bool success){
          citizens[msg.sender].aadharNo=_aadharNo;
          citizens[msg.sender].aadharV=false;
          citizens[msg.sender].localV=false;
          citizens[msg.sender].globalV=false;
          return true;
      }

      function addPan (uint _panNo) public returns (bool success){
          citizens[msg.sender].panNo=_panNo;
          citizens[msg.sender].panV=false;
          citizens[msg.sender].localV=false;
          citizens[msg.sender].globalV=false;
          return true;
    }

    function addVoter (uint _voterNo) public returns (bool success){
          citizens[msg.sender].voterNo=_voterNo;
          citizens[msg.sender].voterV=false;
          citizens[msg.sender].localV=false;
          citizens[msg.sender].globalV=false;
          return true;
    }

    function addPassport (uint _passportNo) public returns (bool success){
          citizens[msg.sender].passportNo=_passportNo;
          citizens[msg.sender].passportV=false;
          citizens[msg.sender].localV=false;
          citizens[msg.sender].globalV=false;
          return true;
    }

    function  invalidateKyc(address _target) private{
        citizens[_target].aadharV=false;
        citizens[_target].panV=false;
        citizens[_target].voterV=false;
        citizens[_target].passportV=false;
        citizens[_target].localV=false;
          citizens[_target].globalV=false;
    }
    function  grantReadAccess(address _authority, uint8 _type,uint8) public returns (bool success){
          if(_type==1){
              citizens[msg.sender].aadharR[_authority].access=true;
              citizens[msg.sender].aadharR[_authority].time=now+86400;
              return true;
          }else if (_type==2){
              citizens[msg.sender].panR[_authority].access=true;
              citizens[msg.sender].panR[_authority].time=now+86400;
              return true;
          }else if (_type==3){
              citizens[msg.sender].voterR[_authority].access=true;
              citizens[msg.sender].voterR[_authority].time=now+86400;
              return true;
          }else if (_type==4){
              citizens[msg.sender].passportR[_authority].access=true;
              citizens[msg.sender].passportR[_authority].time=now+86400;
              return true;
          }else
           return false;
      }

  function  grantReadWriteAccess(address _authority, uint8 _type) public returns (bool success){
          if(_type==1){
              citizens[msg.sender].aadharRW[_authority].access=true;
              citizens[msg.sender].aadharRW[_authority].time=now+86400;
              return true;
          }else if (_type==2){
              citizens[msg.sender].panRW[_authority].access=true;
              citizens[msg.sender].panRW[_authority].time=now+86400;
              return true;
          }else if (_type==3){
              citizens[msg.sender].voterRW[_authority].access=true;
              citizens[msg.sender].voterRW[_authority].time=now+86400;
              return true;
          }else if (_type==4){
              citizens[msg.sender].passportRW[_authority].access=true;
              citizens[msg.sender].passportRW[_authority].time=now+86400;
              return true;
          }else
           return false;
      }

  function getCitizenDetails(address _citizen) constant returns ( bytes32 Rname, bytes32 Rdob, uint RphoneNo, bytes32 Raddr1, uint8 Rpincode, bytes32 RemailId) {      
       //put restrictions
       Rname= citizens[_citizen].name;
       Rdob= citizens[_citizen].dob;
       RphoneNo= citizens[_citizen].phoneNo;
       Raddr1= citizens[_citizen].addr1;
       Rpincode= citizens[_citizen].pincode;
       RemailId= citizens[_citizen].emailId;

  }
  
  function getCitizenAadhar(address _citizen) constant returns (uint8 Raadhar){
      if((citizens[_citizen].aadharR[msg.sender].access==true && (citizens[_citizen].aadharR[msg.sender].time>now)) || citizens[_citizen].owner==msg.sender){
          
      }
      Raadhar=citizens[_citizen].aadharNo;
     // return Raadhar;
  }

function getCitizenPan(address _citizen) constant returns (uint Rpan){
      if(citizens[_citizen].panR[msg.sender].access==true && (citizens[_citizen].panR[msg.sender].time>now)){
          Rpan=citizens[_citizen].panNo;
      }
  }
function getCitizenVoter(address _citizen) constant returns (uint Rvoterno){
      if(citizens[_citizen].voterR[msg.sender].access==true && (citizens[_citizen].voterR[msg.sender].time>now)){
          Rvoterno=citizens[_citizen].voterNo;
      }
  }

function getCitizenPassport(address _citizen) constant returns (uint Rpassport){
      if(citizens[_citizen].passportR[msg.sender].access==true && (citizens[_citizen].passportR[msg.sender].time>now)){
          Rpassport=citizens[_citizen].passportNo;
      }
  }

function putCitizenAadhar(address _citizen,uint8 _aadhar) returns (bool success){
      /* if(citizens[_citizen].aadharRW[msg.sender].access==true && (citizens[_citizen].aadharRW[msg.sender].time>now)
          && aadharAuthorization[msg.sender]) {    
          citizens[_citizen].aadharNo=_aadhar;
          citizens[_citizen].aadharV=true;
          setLocalV(_citizen);
      return true;
      }else {
          return false;
      } */
      citizens[_citizen].aadharNo=_aadhar;
          citizens[_citizen].aadharV=true;
          setLocalV(_citizen);
      return true;
  }
  function putCitizenPan(address _citizen,uint _pan) returns (bool success){
      if(citizens[_citizen].panRW[msg.sender].access==true && (citizens[_citizen].panRW[msg.sender].time>now)
          && panAuthorization[msg.sender]) {    
          citizens[_citizen].panNo=_pan;
          citizens[_citizen].panV=true;
          setLocalV(_citizen);
      return true;
      }else {
          return false;
      }
  }
  function putCitizenVoter(address _citizen,uint _voter) returns (bool success){
      if(citizens[_citizen].voterRW[msg.sender].access==true && (citizens[_citizen].voterRW[msg.sender].time>now)
          && aadharAuthorization[msg.sender]) {    
          citizens[_citizen].voterNo=_voter;
          citizens[_citizen].voterV=true;
          setLocalV(_citizen);
      return true;
      }else {
          return false;
      }
  }
function putCitizenPassport(address _citizen,uint _passport) returns (bool success){
      if(citizens[_citizen].passportRW[msg.sender].access==true && (citizens[_citizen].passportRW[msg.sender].time>now)
          && passportAuthorization[msg.sender]) {    
          citizens[_citizen].passportNo=_passport;
          citizens[_citizen].passportV=true;
          setGlobalV(_citizen);
      return true;
      }else {
          return false;
      }
  }

function setLocalV(address _citizen) private {
     if(citizens[_citizen].aadharV && citizens[_citizen].panV && citizens[_citizen].voterV ){
         citizens[_citizen].localV=true;
     }
 } 
function setGlobalV(address _citizen) private {
     if(citizens[_citizen].localV && citizens[_citizen].passportV) {
         citizens[_citizen].globalV=true;
     }
 } 

function getLocalV(address _citizen) public constant returns (bool RlocalV) {
   RlocalV = citizens[_citizen].localV;
   return RlocalV;
  } 
function getGlobalV(address _citizen) public constant returns (bool RglobalV) {
    RglobalV = citizens[_citizen].globalV;
    return RglobalV;
  }



}

// extreme scenarios --- 

//goverment function whenever there is change in citizen ship status


//presentation // limitations , future perspective