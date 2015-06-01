# class-scorecard-app | Angular
This scorecard app is a pleasure for teachers. A teacher can enter a list of students with his or her test score and see a summary of his class performance. Summary includes Min, Max, and Average score. List supports CRUD operations on student's name and score.

List supports in-line editing of student name and score, such that changing a test score updates the model and class report statistics.

List validates user input and students with a score < 65 get highlighted to indicate a failing grade.

This app uses localstorage and is well tested and compatible on Chrome, Mozilla and IE8+.

To get this app up and runnnig, please follow the instructions in the sequence below:


* Install Node.js - For the app to create a server and download dependencies, download and install Node.js from https://nodejs.org/download/


* Once Node.js is installed in your system, go to terminal / command line / git bash (whatever you have in your system at present) and check for its installation by typing : 
$ node -v

This will give the node version and confirm the installation of Node.js in your system.
For this application, I developed using v0.10.26


* Now navigate to the root folder of this app by using terminal navigation commands like below:
$ cd ~/somepath/class-scorecard-app/


* Once you are succefully at the root folder of this app, Run the following commands to download npm and bower dependencies of the app.

$ npm install 

Above command will download the npm module dependencies like express and gulp plugins by reading the package.json file

$ bower install

Above command will download the javascript dependencies of application like angular, jquery, bootstrap, etc. by reading the bower.json file


* Once all the downloads are completed, you can start the application server by typing the following at the root folder where you see server.js:

$ npm start

or

$ node server.js

This will start the server at port 3000. You can open the link http://localhost:3000/ on your browser and the app will be up and running

That is all you require!!

Additional information:

You will notice gulp plugins, gulpfile.js and two index files at the root folder i.e. index.html and index.dev.html.

To further optimize the project, JS and CSS files are concatenated and minified.

index.html - This is the optimized copy of the web app
index.dev.html - This copy was used during development where all the js and css are being called individually
gulpfile.js - This file builds the optimized js and css builds in build/js and build/css respectively. It also watches for the changes and updates the minified files with latest save.