package il.ac.bgu.cs.bp.samplebpjsproject;

import java.io.IOException;
import java.util.HashMap;
import java.util.LinkedList;
import java.util.List;
import java.util.Map;
import java.util.concurrent.ExecutorService;

//import org.w3c.dom.css.Counter;

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
    	
    	String code = "let x = 1;\r\n" + 
    			"\r\n" + 
    			"bp.registerBThread(\"A\", function() {\r\n" + 
    			"    let y = x++;\r\n" + 
    			"    bp.sync({\r\n" + 
    			"        request: bp.Event(x)});\r\n" + 
    			"    bp.sync({\r\n" + 
    			"        request: bp.Event(y)});\r\n" + 
    			"})\r\n" + 
    			"\r\n" + 
    			"bp.registerBThread(\"B\", function() {\r\n" + 
    			"    let z = x++;\r\n" + 
    			"    bp.sync({\r\n" + 
    			"        request: bp.Event(x)});\r\n" + 
    			"    bp.sync({\r\n" + 
    			"        request: bp.Event(++z)});\r\n" + 
    			"})";
    	
    	service.init(code);
    	
    	
  	
    	StepMessage stepMessage = new StepMessage(null, null, null, null, null, null, null, null);
    	
    	int counter = 0;
    	
    	try {
    		
//    		do {
//    			stepMessage = service.step(stepMessage);
//    		} while(counter++ < 3);
    		
    		stepMessage = service.step(stepMessage);
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
