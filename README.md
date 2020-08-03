## BPjsOnlineIDE: An Online Environment For The BPjs Language

BPjs is a library for executing behavioral programs written in Javascript. It can be used from the commandline, or embedded in a Java application.<br/>
BPjs is an open source project, maintained by a research group in Ben-Gurion University of the Negev, Israel.<br/>

* The BPjs GitHub repository: https://github.com/bThink-BGU/BPjs
* The BPjs Website: https://bpjs.readthedocs.io/en/latest/
* Project website: https://amirdi6.wixsite.com/bpjsonlineide

## Project Prerequisites:
#### Client:
* Node.js 12.16.2 (includes npm version 6.14.4) or above.<br/>
Download from https://nodejs.org/en/.<br/>
* Preferably a WebStorm IDE from Jetbrains.<br/>
It is possible to run the project from the command line and edit it with any text editor (more on that in the "Running The Project" section.)<br/>
Download WebStrom from https://www.jetbrains.com/webstorm/download/#section=windows.<br/>
#### Server:
* Java jdk-11.0.5 and above.<br/>
Download from https://www.oracle.com/java/technologies/javase/jdk11-archive-downloads.html.<br/>
Installation guide: https://www.youtube.com/watch?v=LlLRjFptXAY.<br/>
* Apache-maven-3.6.3 and above.<br/>
Download from https://maven.apache.org/download.cgi.<br/>
Installation guide: https://maven.apache.org/install.html.<br/>
* An Apache-tomcat-9.0.30 server.<br/>
Download from https://tomcat.apache.org/download-90.cgi.<br/>
* Preferably an IntelliJ IDEA IDE (though any IDE with Maven and Jave EE support will do).<br/>
Just like the client side, is possible to build and run the project from the command line and edit it with any text editor.<br/>
More on that in the "Running The Project" section.<br/>
Download IntelliJ from https://www.jetbrains.com/idea/download/#section=windows.<br/>
## Installing And Building The Project For The First Time:
__First, clone/download the project from the git repository.<br/>__
#### Client:
Through the terminal (cmd or the terminal on the IDE itself), navigate to the BPjsOnlineIDE\OnlineIDEClient\my-app folder.<br/>
Then, run the 'npm install' command and all the dependencies should install automatically.<br/>
When the installation is finished, you can run the project as explained in the "Running The Project" section.<br/>
#### Server:
If you are indending to run and build the server from the command line, and edit the code via some text editor (not an IDE),
skip this section and go to the next one - it has a detailed explanation.<br/>
If you are using IntelliJ, these are the steps you should take:<br/>
1. Import the OnlineIDEServer folder as a Maven project.<br/>
2. Run -> Edit Configurations -> + sign -> Tomcat Server -> Local<br/>
3. Click 'Configure' and navigate to your Apache server folder.<br/>
4. Click on the 'Deployment' tab -> + sign -> Artifact -> OnlineIDEServer:war<br/>
5. __IMPORTANT:__ Change the 'Application context' from /OnlineIDEServer_war to /OnlineIDEServer.<br/>
The client accesses the server on that address (at least when developing).<br/>
Check that the server address is http://localhost:8080/OnlineIDEServer/ and you're good to go!
More information about Tomcat and IntelliJ here https://www.jetbrains.com/help/idea/run-debug-configuration-tomcat-server.html#.
## Running The Project:
#### Client:
Through the terminal (cmd or the terminal on the IDE itself), navigate to the BPjsOnlineIDE\OnlineIDEClient\my-app folder.<br/>
Then, run the 'npm start' command and access the client side on localhost:4200 on any browser.<br/>
Npm comes with a 'Nodemon' service built in it, so the node server will automatically restart when file 
changes in the package directory are detected. 
#### Server:
After installing and building the server for the first time like explained in the previous section, running it on any IDE should be pretty straightforward. Just choose the 'Run on server' (exact name might differ from one IDE to another) and the server should be up and running on localhost:8080/OnlineIDEServer/.<br/>
Just don't forget to ctrl+F10 (update server) every time you update your code...<br/>

**If you want to run the server from the terminal, follow these steps:**
1. If you haven't built the server already (no 'target' folder in BPjsOnlineIDE\OnlineIDEServer), navigate to that folder through the terminal and run 'mvn install'. After that's done, a 'target' folder should appear.<br/>
2. Copy the 'OnlineIDEServer' folder from the 'target' folder into the apache-tomcat-9.0.30\webapps folder (version number is redundant).<br/>
3. Open the terminal in apache-tomcat-9.0.30\bin and run the 'startup' command. After that, the server should be up and running on localhost:8080/OnlineIDEServer/. Run the 'shutdown' command to terminate.<br/>
**Please note**: If you choose to edit the code through an the Intellij IDE (or most modern ones), the code will be built automatically every time you update (ctrl+F10) the code (depends on the settings). If you choose to work through a command line only, you will have to do steps 1-3 manually every time you want to test updated code.<br/>

