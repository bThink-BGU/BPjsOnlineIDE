package il.ac.bgu.cs.bp.samplebpjsproject;

import java.io.IOException;
import java.util.HashMap;
import java.util.LinkedList;
import java.util.List;
import java.util.Map;
import java.util.concurrent.ExecutorService;

import org.w3c.dom.css.Counter;

import com.bpjs.onlineide.Server;

import il.ac.bgu.cs.bp.bpjs.internal.ExecutorServiceMaker;
import il.ac.bgu.cs.bp.bpjs.internal.Pair;

/**
 * Simple class running a BPjs program that selects "hello world" events.
 * @author michael
 */
public class HelloWorld {
    
    public static void main(String[] args) throws InterruptedException {
    	
    	
      	
    	
  
    	ExecutorService execSvc = ExecutorServiceMaker.makeWithName("executor");

    	
    	Service service = new Service(null, execSvc);
    	
    	String code = "var globalNumber = 3;\r\n" + 
    			"var globalStruct = { name:\"gs\", val:3.4 };\r\n" + 
    			"function foo(fooParam1, fooParam2) {\r\n" + 
    			"var fooVariable = \"fooVar\";\r\n" + 
    			"for(var i=0; i<3; i++) {\r\n" + 
    			" //put breakpoint here and see that for each of the three b-threads you know how to find all the vaiables(local/global)/params/line numbers/stacktrace, and anything else that you think that is relevant.\r\n" + 
    			"// note that i here overloads the i of b-threads bt0 and bt1.\r\n" + 
    			"bp.sync( {request:bp.Event(\"a\")} );\r\n" + 
    			"}\r\n" + 
    			"}\r\n" + 
    			"\r\n" + 
    			"function register(i) {\r\n" + 
    			"var tmp = 50;\r\n" + 
    			"bp.registerBThread(\"bt\"+i, function() {\r\n" + 
    			"var r = 20 + i;\r\n" + 
    			"foo(\"bt\"+i, i);\r\n" + 
    			"});\r\n" + 
    			"}\r\n" + 
    			"\r\n" + 
    			"register(0);\r\n" + 
    			"register(1);\r\n" + 
    			"bp.registerBThread(\"bt2\", function() {\r\n" + 
    			"foo(\"bt2\", 2);\r\n" + 
    			"//put breakpoint here and see that for this b-thread you know how to find all the vaiables(local/global)/params/line numbers/stacktrace, and anything else that you think that is relevant.  \r\n" + 
    			"  bp.sync( { request: bp.Event(\"b\") } );  \r\n" + 
    			"});";
    	
    	service.init(code);
    	
    	
  	
    	StepMessage stepMessage = new StepMessage(null, null, null, null, null, null, null);
    	
    	int counter = 0;
    	
    	try {
    		
    		do {
    			stepMessage = service.step(stepMessage);
    		} while(counter++ < 3);
    		
//    		stepMessage = service.step(stepMessage);
//    		stepMessage = service.step(stepMessage);
//    		stepMessage = service.step(stepMessage);
//    		stepMessage = service.step(stepMessage);
//    		stepMessage = service.step(stepMessage);
//    		stepMessage = service.step(stepMessage);
    		
    		
    		System.out.println("-----------------------------");
    		System.out.println(stepMessage.toString());
    		System.out.println("-----------------------------");
//    		
//    		System.out.println("first step done\n");
//    		System.out.println("-----------------------------");
//    		System.out.println("|" + st1.bpss + "|");
//    		System.out.println("-----------------------------");
//    		
//    		StepMessage st2 = service.step(st1);
//    		
//    		System.out.println("second step done\n");
//    		System.out.println(st2.toString());
//    		
    		
    		
    		
		} catch (ClassNotFoundException | InterruptedException | IOException e) {
			// TODO Auto-generated catch block
			e.printStackTrace();
			System.out.println("here");
		}
    	
    }    
}
