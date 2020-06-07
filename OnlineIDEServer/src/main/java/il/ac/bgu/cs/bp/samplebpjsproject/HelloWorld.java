package il.ac.bgu.cs.bp.samplebpjsproject;

import java.io.IOException;
import java.util.concurrent.ExecutorService;
import il.ac.bgu.cs.bp.bpjs.internal.ExecutorServiceMaker;


/**
 * Simple class running a BPjs program that selects "hello world" events.
 * @author michael
 */
public class HelloWorld {

	private static Service service;

    public static void main(String[] args) throws InterruptedException, ClassNotFoundException, IOException {
        
    	ExecutorService execSvc = ExecutorServiceMaker.makeWithName("executor");
    	service = new Service(null, execSvc);
    	service.init("bp.registerBThread(\"welcome\", function() {\r\n" + 
    			"    let i = 0;\r\n" + 
    			"    while(true) {\r\n" + 
    			"       bp.sync({\r\n" + 
    			"        request: bp.Event(i++)});\r\n" + 
    			"    }\r\n" + 
    			"})");

    	service.run();
    }
   
}
