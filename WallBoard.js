  var ReactDOM = require('react-dom');                //import required npm modules
  var React = require('react');
  var DataTable = require('./DataTable');

  var agents = [];
  var calls = [];

  var agentsColumns = [                               //agents table column definition
    { title: 'Agent', prop: 'agent'  },
    { title: 'Last Logon', prop: 'lastLogon' },
    { title: 'Queues', prop: 'queues' },
    { title: 'Intern', prop: 'intern' },
    { title: 'Breaks', prop: 'breaks'   }
  ];


  var callsColumns = [                                //calls table column definition
    { title: 'Queue', prop: 'queue'  },
    { title: 'CallID', prop: 'callId' },
    { title: 'Agent', prop: 'agent' },
    { title: 'Caller', prop: 'caller' },
    { title: 'Call Time', prop: 'callTime'   },
    { title: 'Answer Time', prop: 'answerTime'   },
    { title: 'Answer Delay', prop: 'answerDelay'   },
    { title: 'Conversation Time', prop: 'conversationTime' }
  ];

  
  var proxyAddress = getParameter("proxyAddress");                  //get parameters from WallBoard.html
  var proxyPort = getParameter("proxyPort");
  var queuemetricsAddress = getParameter("queuemetricsAddress");
  var queuemetricsPort = getParameter("queuemetricsPort");

  var xmlhttp = new XMLHttpRequest();                               //create a new XMLHttpRequest

  if((proxyAddress=="-")||(proxyPort=="-"))                         //check if proxy server is used
  {

    var url = encodeURI("http://"+queuemetricsAddress+":"+queuemetricsPort+"/queuemetrics/QmRealtime/jsonStatsApi.do?queues=*&block=RealtimeDO.RtCallsRaw&block=RealtimeDO.RTAgentsLoggedIn");

  }

  else{
    
    var url = encodeURI("http://"+proxyAddress+":"+proxyPort+"/"+queuemetricsAddress+":"+queuemetricsPort+"/queuemetrics/QmRealtime/jsonStatsApi.do?queues=*&block=RealtimeDO.RtCallsRaw&block=RealtimeDO.RTAgentsLoggedIn");

  }

    

  xmlhttp.onreadystatechange = function() {                         //if request is answered deploy retrieveData function
      if (xmlhttp.readyState == 4 && xmlhttp.status == 200) {
          var response = xmlhttp.responseText;
          response = clean(response);
          var response = JSON.parse(response);
          retrieveData(response);
      }
  };
   
  

  sendRequest(xmlhttp);  //send the first request
  poll(xmlhttp);         //start polling queuemetrics
     
  
  function retrieveData(response) {    //organizes the data retrieved from queuemetrics in two different arrays
                
      agents = agentCast(response["RealtimeDO"+String.fromCharCode(46)+"RTAgentsLoggedIn"]);
      calls = callCast(response["RealtimeDO"+String.fromCharCode(46)+"RtCallsRaw"]);
   
  }


  function universalTimeCast(obj){   //universal time cast, no GMT, mainly used for subtraction between timestamps
  
      var date = new Date(obj*1000);
      
      if(obj == 0){
        return "-";
      }

      else{
        return date.getUTCHours() + ":" + date.getUTCMinutes()+":"+date.getUTCSeconds();
      }

  }


  function timeCast(obj){    //converts timestamps to normal time
  
      var date = new Date(obj*1000);
      
      if(obj == 0){
        return "-";
      }
      
      else{
        return date.getHours() + ":" + date.getMinutes()+":"+date.getSeconds();
      }

  }
  

  function poll() {     // polls the queuemetrics server
      
    setTimeout(function(){sendRequest(xmlhttp);poll();console.log("poll");},3000);   // this function recursevly calls itself ever 3 seconds, while rendering
                                                                                     // the table components
    
    ReactDOM.render(  //renders the agents table
      <DataTable
        className="agentsContainer"
        keys={[ 'agent','queue' ]}
        columns={agentsColumns}
        initialData={agents}
        initialPageLength={200}
        initialSortBy={{ prop: 'agent', order: 'descending' }}
        pageLengthOptions={[ 5, 20, 50 ]}
      />
    , 
    document.getElementById("agents"));
    

    ReactDOM.render(     //renders the calls table
      <DataTable
        className="callsContainer"
        keys={[ 'callId' ]}
        columns={callsColumns}
        initialData={calls}
        initialPageLength={200}
        initialSortBy={{ prop: 'queue', order: 'ascending' }}
        pageLengthOptions={[ 5, 20, 50 ]}
      />
    ,
    document.getElementById("calls"));
    
  }  
  

 
  function sendRequest(xmlhttp){  //sends the XMLHttp Request
    
    xmlhttp.open("GET", url, true,"robot","robot");
    xmlhttp.setRequestHeader("Authorization", "basic " + btoa("robot:robot"));
    xmlhttp.withCredentials = true;
    xmlhttp.send();
  
  }


  function clean(response){     //cleans the results from garbage characters
          
        response = response.replace(/&nbsp;/g,"-");
        
    return response;
  
  }


  function agentCast(arr){    // organizes the agents data extracting the right fields from the JSON response
      
    var obj = []; 

    for(var i = 1; i < arr.length;i++){ 
   
      obj.push({
            
            agent: arr[i][2],
            lastLogon: arr[i][3],
            queues: arr[i][4],
            intern: arr[i][5],
            breaks: arr[i][6],
      
      });
   
    }

    return obj;
       
  }


  function callCast(arr){      // organizes the calls data extracting the right fields from the JSON response
      
    var obj = []; 
    
    for(var i = 1; i < arr.length;i++){ 
      
      if(arr[i][3]!= 0){
      
        var answerDelayVar = universalTimeCast(arr[i][3] - arr[i][2]);       //calculates answer delay
        var conversationTimeVar = universalTimeCast((Date.now()/1000)-arr[i][3]);         //calculates conversation time
      
      }
      
      else{
      
        answerDelayVar = "-";
        conversationTimeVar = "-";
      
      }
      
      obj.push({
            
            queue: arr[i][0],
            callId: arr[i][1],
            agent: arr[i][5],
            caller: arr[i][6],
            callTime: timeCast(arr[i][2]),
            answerTime: timeCast(arr[i][3]),
            answerDelay : answerDelayVar,
            conversationTime : conversationTimeVar
      
      });

    }
    
    return obj;
       
  }


  function getParameter(attribute){           //retrieves the parameters set in WallBoard.html
  
    var scripts = document.getElementsByTagName('script');
    var lastScript = scripts[scripts.length-1];
    var scriptName = lastScript;
    var attrib = scriptName.getAttribute(attribute);
    return attrib;
  }