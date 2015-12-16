# QueueMetricsWallboard

A simple React wallboard for the QueueMetrics call center solution software, intended to be used with Google Chrome 
web browser.

http://www.queuemetrics.com/

![alt tag](https://github.com/KevinRavasi/QueueMetricsWallboard/blob/master/ScreenShot.png)

Due to the CORS authorization system, in order to view the wallBoard correctly Chrome
must be launched with the --disable-web-security option appended.
This can be solved by adding the correct access-control-allow <origin> header in the server configuration.

This wallboard constantly polls QueueMetrics for data using some of the QueueMetrics json calls listed at
http://manuals.loway.ch/QM_JSON_manual-chunked/ch02.html
auto-updating and auto-scrolling endlessly.

To setup the wallboard edit the "address" and "port" parameters in the last <script> tag
<script src="Bundle.js" address="127.0.0.1" port="8080"></script>

QueueMetricsWallboard uses a Browserify created bundle file named "Bundle.js". This bundle is a babelify
interpretation of Wallboard.js which requires a series of npm modules such as "react", "react-dom", "react-data-components".

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
  
