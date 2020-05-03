package il.ac.bgu.cs.bp.samplebpjsproject;

import java.io.IOException;
import java.util.HashMap;
import java.util.LinkedList;
import java.util.List;
import java.util.Map;
import java.util.concurrent.ExecutorService;

import com.bpjs.onlineide.Server;

import il.ac.bgu.cs.bp.bpjs.internal.ExecutorServiceMaker;
import il.ac.bgu.cs.bp.bpjs.internal.Pair;

/**
 * Simple class running a BPjs program that selects "hello world" events.
 * @author michael
 */
public class HelloWorld {
    
    public static void main(String[] args) throws InterruptedException {
      	
    	
  
//    	ExecutorService execSvc = ExecutorServiceMaker.makeWithName("executor");
//
//    	
//    	Service service = new Service(null, execSvc);
//    	
//    	String code = "//*****Hello BPjs World*****\n\n" + 
//    			"bp.registerBThread(function(){\n" +
//    			"bp.sync({request:bp.Event(\"hello\")});\n" + 
//    			"bp.sync({request:bp.Event(\"world\")});\n" +
//    			"})";
//    	
//    	service.init(code);
//    	
//    	StepMessage stepMessage = new StepMessage(null, null, null, null, null, null, null, null);
//    	
//		
//    	try {
//    		
//    		
//    		StepMessage st1 = service.step(stepMessage);
//    		
//    		System.out.println("first step done\n");
//    		System.out.println(st1.toString());
//    		
//    		StepMessage st2 = service.step(st1);
//    		
//    		System.out.println("second step done\n");
//    		System.out.println(st2.toString());
//    		
//    		
//    		
//    		
//		} catch (ClassNotFoundException | InterruptedException | IOException e) {
//			// TODO Auto-generated catch block
//			e.printStackTrace();
//			System.out.println("here");
//		}
//    	
    }    
}
