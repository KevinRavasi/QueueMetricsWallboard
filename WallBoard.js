  var ReactDOM = require('react-dom');                //import required npm modules
  var React = require('react');
  var DataGrid = require('react-datagrid')
  var agents = [];
  var calls = [];

  var agentsColumns = [                               //agents table column definition
  { name : 'agent', title: 'Agent', prop: 'agent'  },
  { name: 'lastLogon', title: 'Last Logon', prop: 'lastLogon' },
  { name: 'queues', title: 'Queues', prop: 'queues' },
  { name: 'intern', title: 'Intern', prop: 'intern' },
  { name: 'breaks', title: 'Breaks', prop: 'breaks'   }
  ];

  var callsColumns = [                                //calls table column definition
  { name: 'queue', title: 'Queue', prop: 'queue'  },
  { name: 'callId', title: 'CallID', prop: 'callId' },
  { name: 'agent', title: 'Agent', prop: 'agent' },
  { name: 'caller', title: 'Caller', prop: 'caller' },
  { name: 'callTime', title: 'Call Time', prop: 'callTime'   },
  { name: 'answerTime', title: 'Answer Time', prop: 'answerTime'   },
  { name: 'answerDelay', title: 'Answer Delay', prop: 'answerDelay'   },
  { name: 'conversationTime', title: 'Conversation Time', prop: 'conversationTime' }
  ];

  var proxyAddress = getParameter("proxyAddress");                  //get parameters from WallBoard.html
  var proxyPort = getParameter("proxyPort");
  var queuemetricsAddress = getParameter("queuemetricsAddress");
  var queuemetricsPort = getParameter("queuemetricsPort");
  var username = getParameter("username");
  var password = getParameter("password");
  var queues = getParameter("queues");
  var xmlhttp = new XMLHttpRequest();                               //create a new XMLHttpRequest

  if((proxyAddress=="-")||(proxyPort=="-"))                         //check if proxy server is used
  {

    var url = encodeURI("http://"+queuemetricsAddress+":"+queuemetricsPort+"/queuemetrics/QmRealtime/jsonStatsApi.do?queues="+queues+"&block=RealtimeDO.RtCallsRaw&block=RealtimeDO.RTAgentsLoggedIn");
    
  }

  else{

    var url = encodeURI("http://"+proxyAddress+":"+proxyPort+"/"+queuemetricsAddress+":"+queuemetricsPort+"/queuemetrics/QmRealtime/jsonStatsApi.do?queues="+queues+"&block=RealtimeDO.RtCallsRaw&block=RealtimeDO.RTAgentsLoggedIn");

  }

  var agentsTable = ReactDOM.render(<DataGrid idProperty="agent" dataSource={agents} columns={agentsColumns}   />,document.getElementById("agents"));
  var callsTable = ReactDOM.render(<DataGrid idProperty="callId" dataSource={calls} columns={callsColumns}/>,document.getElementById("calls"));

  xmlhttp.onreadystatechange = function() {                         //if request is answered deploy retrieveData function
    if (xmlhttp.readyState == 4 && xmlhttp.status == 200) {
      var response = xmlhttp.responseText;
      response = clean(response);
      var response = JSON.parse(response);
      retrieveData(response);
    }
  };
  
  poll();         //start polling queuemetrics

  
  function retrieveData(response) {    //organizes the data retrieved from queuemetrics in two different arrays

    agents = agentCast(response["RealtimeDO"+String.fromCharCode(46)+"RTAgentsLoggedIn"]);
    calls = callCast(response["RealtimeDO"+String.fromCharCode(46)+"RtCallsRaw"]);
    agentsTable.setProps({dataSource: agents});
    callsTable.setProps({dataSource: calls});
    poll();                            // a new request is not issued until the previous one is succesful

  }


  function timeDifference(latest, earliest){   //returns a string containing the time difference between two timestamps, HH:MM:SS format

    var diff = latest - earliest;
    diff = diff - (diff%1);
    var secs_diff = diff % 60;
    diff = Math.floor(diff / 60);
    var mins_diff = diff % 60;
    diff = Math.floor(diff / 60);
    var hours_diff = diff % 24;
    diff = Math.floor(diff / 24);

    return ("0" + hours_diff).slice(-2) + ":" + ("0" + mins_diff).slice(-2) + ":" + ("0" + secs_diff).slice(-2)

  }


  function timeCast(obj){    //converts timestamps to normal time

    var date = new Date(obj*1000);

    if(obj == 0){
      return "-";
    }

    else{
      return date.toLocaleTimeString();
    }

  }
  

  function poll() {     // polls the queuemetrics server

    setTimeout(function(){sendRequest(xmlhttp)},3000);   // this function sends a JSON request then waits at least 3 seconds,

  }  



  function sendRequest(xmlhttp){  //sends the XMLHttp Request

    xmlhttp.open("GET", url, true, username, password);
    xmlhttp.setRequestHeader("Authorization", "basic " + btoa(username + ":" + password) );
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

        var answerDelayVar = timeDifference(arr[i][3], arr[i][2]);       //calculates answer delay
        var conversationTimeVar = timeDifference((Date.now()/1000), arr[i][3]);         //calculates conversation time

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
    return attrib.toString();

  }