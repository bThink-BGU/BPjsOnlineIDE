//package il.ac.bgu.cs.bp.samplebpjsproject;
//
//import java.io.IOException;
//import java.util.HashMap;
//import java.util.LinkedList;
//import java.util.List;
//import java.util.Map;
//import java.util.concurrent.ExecutorService;
//
////<<<<<<< HEAD
////import org.w3c.dom.css.Counter;
////=======
//import org.mozilla.javascript.NativeContinuation;
//import org.w3c.dom.css.Counter;
////>>>>>>> 60114b7b8f25d8578eba4643c18b1cd455906bf4
//
//import com.bpjs.onlineide.Server;
//
//import il.ac.bgu.cs.bp.bpjs.internal.ExecutorServiceMaker;
//import il.ac.bgu.cs.bp.bpjs.internal.Pair;
//import il.ac.bgu.cs.bp.bpjs.model.BThreadSyncSnapshot;
//
///**
// * Simple class running a BPjs program that selects "hello world" events.
// * @author michael
// */
//public class HelloWorld {
//
//	private static Service service;
//	private static Step currStep;
//	private static StepMessage currStepMess;
//
//    public static void main(String[] args) throws InterruptedException {
//
//    	ExecutorService execSvc = ExecutorServiceMaker.makeWithName("executor");
//
//
//    	service = new Service(null, execSvc);
//
//    	String code = "//*****Hello BPjs World*****\r\n" +
//    			"\r\n" +
//    			"bp.registerBThread(function() {\r\n" +
//    			"    bp.sync({\r\n" +
//    			"        request: bp.Event(\"OFEK1\")});\r\n" +
//    			"    bp.sync({\r\n" +
//    			"        request: bp.Event(\"OFEK2\")});\r\n" +
//    			"})";
//
//    	service.init(code);
//
//
//
//    	currStepMess = new StepMessage(null, null, null, null, null, null, null, null);
//
//    	int counter = 0;
//
//    	try {
//
////    		do {
////    			stepMessage = service.step(stepMessage);
////    		} while(counter++ < 3);
//
//    		currStepMess = service.step(currStepMess);
//    		currStepMess = service.step(currStepMess);
////    		StepMessage stepMessage2 = service.step(stepMessage);
////    		stepMessage = service.step(stepMessage);
////    		stepMessage = service.step(stepMessage);
////    		stepMessage = service.step(stepMessage);
////    		stepMessage = service.step(stepMessage);
//
//
////    		NativeContinuation nc1 = NC(currStepMess);
////    		NativeContinuation nc2 = NC(currStepMess);
////    		NativeContinuation nc3 = NC(currStepMess);
////
////    		Object imp1 = nc1.getImplementation();
////    		Object imp2 = nc2.getImplementation();
//
//
//    		System.out.println("-----------------------------");
//    		System.out.println(currStepMess.toString());
//    		System.out.println("-----------------------------");
////
////    		System.out.println("first step done\n");
////    		System.out.println("-----------------------------");
////    		System.out.println("|" + st1.bpss + "|");
////    		System.out.println("-----------------------------");
////
////    		StepMessage st2 = service.step(st1);
////
////    		System.out.println("second step done\n");
////    		System.out.println(st2.toString());
////
//
//
//
//		} catch (ClassNotFoundException | InterruptedException | IOException e) {
//			// TODO Auto-generated catch block
//			e.printStackTrace();
//			System.out.println("here");
//		}
//
//    }
//
//    private static NativeContinuation NC(StepMessage stepMessage) throws ClassNotFoundException, IOException, InterruptedException {
//    	Step s = Step.Deserialize(service.getExecSvc(), service.getBprog(), stepMessage.getBpss());
//		currStep = s.step();
//		currStepMess = currStep.toStepMessage();
//
//		for(BThreadSyncSnapshot ss: currStep.getBpss().getBThreadSnapshots()) {
//        	NativeContinuation nc = ((NativeContinuation)ss.getContinuation());
//        	return nc;
//        }
//		return null;
//    }
//}
