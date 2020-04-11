# How to install the project?
1. Clone/Download the project from github
2. Open the OnlineIDEClient folder in Webstorm or any preferred IDE. Then, navigate to the my-app folder to the terminal
and run npm install. 
3. Run npm start and access the IDE through localhost:4200.
4. Open the OnlineIDEServer folder in eclipse or any preferred IDE. 
Then, run the project on a tomcat server (must be previously installed in the IDE - version 9 and above). 
Once the project is running you can press the "Run" button on the localhost:4200 window and the "Hello world" program should succeed.
# How to deploy the project to a tomcat server?
1. Run ng build --base-href=/onlineide/angular/ on Webstorm terminal
2. Copy the files in dist/my-app into webapp/angular folder in eclipse (create one if needed)
3. Access through http://localhost:8080/onlineide/angular/index.html on any web browser


