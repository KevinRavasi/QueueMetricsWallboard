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

Now to setup the wallboard edit the "proxyAddress", "proxyPort", "queuemetricsAddress" and "queuemetricsPort" parameters in the last script tag of the WallBoard.html file.

"<script src="Bundle.js" proxyAddress="127.0.0.1" proxyPort="1337" queuemetricsAddress="10.0.0.122" queuemetricsPort="8080"></script>"

now you can open WallBoard.html and it should work correctly.

Alternatively you can avoid using corsproxy, by opening chrome.exe from the command prompt with the --disable-web-security option
appended. In that case you should change both proxyAddress and proxyPort parameters in WallBoard.html to "-".

EDITING THE SOURCE CODE

to edit the bundle file you must follow the procedure listed below.

prerequisites:

- npm must be already installed on your machine.

procedure:

- navigate to the project folder

- execute the following commands:
 
    npm install -g babel-cli
  
    npm install -g browserify

    npm install react react-dom babelify babel-preset-es2015 babel-preset-react react-data-components

- modify WallBoard.js or DataTable.js to your liking.

- update the bundle file with the following command:

    browserify WallBoard.js -o Bundle.js -t [ babelify --presets [ es2015 react ] ]

- add "-d" if you want Browserify to create a debug map.

Credits

this project utilizes the following third party stylesheets for data table formatting:

  https://maxcdn.bootstrapcdn.com/bootstrap/3.3.2/css/bootstrap.min.css
  
  https://maxcdn.bootstrapcdn.com/font-awesome/4.3.0/css/font-awesome.min.css

and the following third party React component library:
  
  https://github.com/carlosrocha/react-data-components
  
