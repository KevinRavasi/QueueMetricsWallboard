  var ReactDOM = require('react-dom');
  var React = require('react');
  var DataTable = require('./DataTable');

  var agents = [];
  var calls = [];

  var agentsColumns = [
    { title: 'Agent', prop: 'agent'  },
    { title: 'Last Logon', prop: 'lastLogon' },
    { title: 'Queues', prop: 'queues' },
    { title: 'Intern', prop: 'intern' },
    { title: 'Breaks', prop: 'breaks'   }
  ];


  var callsColumns = [
    { title: 'Queue', prop: 'queue'  },
    { title: 'CallID', prop: 'callId' },
    { title: 'Agent', prop: 'agent' },
    { title: 'Caller', prop: 'caller' },
    { title: 'Call Time', prop: 'callTime'   },
    { title: 'Answer Time', prop: 'answerTime'   },
    { title: 'Answer Delay', prop: 'answerDelay'   },
    { title: 'Conversation Time', prop: 'conversationTime' }
  ];

  
  var proxyAddress = getParameter("proxyAddress");
  var proxyPort = getParameter("proxyPort");
  var queuemetricsAddress = getParameter("queuemetricsAddress");
  var queuemetricsPort = getParameter("queuemetricsPort");
  var xmlhttp = new XMLHttpRequest();

  if((proxyAddress=="-")||(proxyPort=="-"))
  {

    var url = encodeURI("http://"+queuemetricsAddress+":"+queuemetricsPort+"/queuemetrics/QmRealtime/jsonStatsApi.do?queues=*&block=RealtimeDO.RtCallsRaw&block=RealtimeDO.RTAgentsLoggedIn");

  }
  else{
    
    var url = encodeURI("http://"+proxyAddress+":"+proxyPort+"/"+queuemetricsAddress+":"+queuemetricsPort+"/queuemetrics/QmRealtime/jsonStatsApi.do?queues=*&block=RealtimeDO.RtCallsRaw&block=RealtimeDO.RTAgentsLoggedIn");

  }

    

  xmlhttp.onreadystatechange = function() {
      if (xmlhttp.readyState == 4 && xmlhttp.status == 200) {
          var myArr = JSON.parse(xmlhttp.responseText);
          myFunction(myArr);
      }
  };
  
  

  sendRequest(xmlhttp);
  poll(xmlhttp);
     
  
  function myFunction(arr) {
                
      agents = agentCast(arr["RealtimeDO"+String.fromCharCode(46)+"RTAgentsLoggedIn"]);
      calls = callCast(arr["RealtimeDO"+String.fromCharCode(46)+"RtCallsRaw"]);
   
  }


  function universalTimeCast(obj){
  
      var date = new Date(obj*1000);
      
      if(obj == 0){
        return "-";
      }

      else{
        return date.getUTCHours() + ":" + date.getUTCMinutes()+":"+date.getUTCSeconds();
      }

  }


  function timeCast(obj){
  
      var date = new Date(obj*1000);
      
      if(obj == 0){
        return "-";
      }
      
      else{
        return date.getHours() + ":" + date.getMinutes()+":"+date.getSeconds();
      }

  }
  

  function poll() {
      
    setTimeout(function(){sendRequest(xmlhttp);poll();console.log("poll");},3000);
    
    ReactDOM.render(
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
    

    ReactDOM.render(
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
  

 
  


  function sendRequest(xmlhttp){
    
    xmlhttp.open("GET", url, true,"robot","robot");
    xmlhttp.setRequestHeader("Authorization", "basic " + btoa("robot:robot"));
    xmlhttp.withCredentials = true;
    xmlhttp.send();
  
  }

  function cleanArray(arr){
    
    for(var j=1;j<arr.length;j++){
     
      for(var i=0;i<arr.length;i++){
      
        if ( arr[i][j].toString().indexOf("&")>-1){
            arr[i][j] = "-";
        }

      }
    
    }
    
    return arr;
  
  }


  function agentCast(arr){
      
    var obj = []; 
    arr = cleanArray(arr); 
   
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


  function callCast(arr){
      
    var obj = []; 
    arr = cleanArray(arr); 
    
    for(var i = 1; i < arr.length;i++){ 
      
      if(arr[i][3]!= 0){
      
        var answerDelayVar = universalTimeCast(arr[i][3] - arr[i][2]);
        var conversationTimeVar = universalTimeCast((Date.now()/1000)-arr[i][3]);
      
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


  function getParameter(attribute){
  
    var scripts = document.getElementsByTagName('script');
    var lastScript = scripts[scripts.length-1];
    var scriptName = lastScript;
    var attrib = scriptName.getAttribute(attribute);
    return attrib;
  }