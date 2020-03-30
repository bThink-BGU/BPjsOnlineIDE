# How to install the project?
1. Clone/Download the project from github
2. Open the OnlineIDEClient folder in Webstorm or any preferred IDE. Then, navigate to the my-app folder to the terminal
and run npm install. 
Once the installation is finished, run npm start and access the IDE through localhost:4200.
3. Open the OnlineIDEServer folder in eclipse or any preferred IDE. Then, run the project on a tomcat server 
(must be previously installed in the IDE) and once the project is running you can press the "Run" button on 
the localhost:4200 window and the "Hello world" program should succeed.
# How to deploy the project to a tomcat server?
1. Run ng build --base-href=/onlineide/angular/ on Webstorm terminal
2. Copy the files in dist/my-app into webapp/angular folder in eclipse (create one if needed)
3. Access through http://localhost:8080/onlineide/angular/index.html on any web browser
# How did we modify the ace-builds package?
To be suitable for our project and for development in a typescript environment on angular,
we modified the ace-builds package a bit. Here are the changes we've made:

1. Added this css class to the ace.js file in src-noconflict in order to enable breakpoint visuals:

.ace_gutter-cell.ace_breakpoint{
  border-radius: 20px 0px 0px 20px;
  box-shadow: 0px 0px 1px 1px red inset;
}

2. Added the following declarations to the ace.d.ts file:

screenToTextCoordinates(x, y);
To the VirtualRenderer interface in order to calculate the click event coordinates.

on(name: 'guttermousedown', callback: (e: Event) => void): Function;
To the Editor interface to enable a gutter click event.

