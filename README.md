# QueueMetricsWallboard

A simple React wallboard for the QueueMetrics call center solution software, intended to be used with Google Chrome 
web browser.

http://www.queuemetrics.com/

![alt tag](https://github.com/KevinRavasi/QueueMetricsWallboard/blob/master/ScreenShot.png)

This wallboard constantly polls QueueMetrics for data using some of the QueueMetrics json calls listed at
http://manuals.loway.ch/QM_JSON_manual-chunked/ch02.html
auto-updating and auto-scrolling endlessly.

QueueMetricsWallboard uses a Browserify created bundle file named "Bundle.js". This bundle is a babelify
interpretation of Wallboard.js which requires a series of npm modules such as "react", "react-dom", "react-data-components" and "corsproxy".

To use the wallboard go to

https://github.com/KevinRavasi/QueueMetricsWallboard

and press the "Download Zip" button and extract it anywhere.

Due to the Cross-origin resource sharing (CORS) mechanism, in order to view the wallBoard correctly, 
corsproxy, or another equivalent CORS proxy, must be installed on your system.

https://www.npmjs.com/package/corsproxy

the best way to insall corsproxy is through npm package manager. 
If you don't have node.js and npm on your system you should install them from here:

https://nodejs.org/en/download/

After installing npm you are ready to install corsproxy, just open a command prompt and type:

npm install -g corsproxy

When the installation is done, you can run corsproxy, by typing in the same command prompt the following command:

corsproxy

this is what it should look like.

![alt tag](https://github.com/KevinRavasi/QueueMetricsWallboard/blob/master/CorsProxy.png)

Now to setup the wallboard edit the "proxyAddress", "proxyPort", "queuemetricsAddress", "queuemetricsPort", "username", "password" and "queues" parameters in the last script tag of the WallBoard.html file, with the correct addresses and ports of your proxy and queuemetrics system, together with the correct username and password for the robot user and the list of queues you want to monitor.

the correct format for the queues string is the following: "300|301|302" (if you want to monitor queue 300, 301 and 302 for example). To monitor all queues just type "*".

 example:
 script src="Bundle.js" proxyAddress="127.0.0.1" proxyPort="1337" queuemetricsAddress="192.168.1.15" queuemetricsPort="8080"
	username="robot" password = "robot" queues = "300|301|302"

now you can open WallBoard.html and it should work correctly.

Alternatively you can avoid using corsproxy, by opening chrome.exe from the command prompt with the 
--disable-web-security option
appended. In that case you should change both proxyAddress and proxyPort parameters in WallBoard.html to "-".
this approach is not reccomended and should be used only for development purposes.

EDITING THE SOURCE CODE

to edit the bundle file you must follow the procedure listed below.

prerequisites:

- npm must be already installed on your machine.

procedure:

- navigate to the project folder

- execute the following commands:
 
    npm install -g babel-cli
  
    npm install -g browserify

    npm install react-datagrid --save

    npm install react react-dom babelify babel-preset-es2015 babel-preset-react 

- modify WallBoard.js to your liking.

- update the bundle file with the following command:

    browserify WallBoard.js -o Bundle.js -t [ babelify --presets [ es2015 react ] ]

- add "-d" if you want Browserify to create a debug map.

Credits

this project utilizes the following third party stylesheets for data table formatting:

  https://maxcdn.bootstrapcdn.com/bootstrap/3.3.2/css/bootstrap.min.css
  
  https://maxcdn.bootstrapcdn.com/font-awesome/4.3.0/css/font-awesome.min.css

and the following third party React component library:
  
  https://github.com/zippyui/react-datagrid
  
