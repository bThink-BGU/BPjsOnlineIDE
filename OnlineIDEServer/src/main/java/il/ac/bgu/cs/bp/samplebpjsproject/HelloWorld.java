package il.ac.bgu.cs.bp.samplebpjsproject;

import java.io.IOException;
import java.util.Collections;
import java.util.HashMap;
import java.util.LinkedList;
import java.util.List;
import java.util.Map;
import java.util.concurrent.ExecutionException;
import java.util.concurrent.ExecutorService;
import java.util.concurrent.Executors;
import java.util.concurrent.Future;
import java.util.concurrent.TimeUnit;
import java.util.concurrent.TimeoutException;

//<<<<<<< HEAD
//import org.w3c.dom.css.Counter;
//=======
import org.mozilla.javascript.NativeContinuation;
import org.w3c.dom.css.Counter;
//>>>>>>> 60114b7b8f25d8578eba4643c18b1cd455906bf4

import com.bpjs.onlineide.Server;

import il.ac.bgu.cs.bp.bpjs.bprogramio.BProgramSyncSnapshotCloner;
import il.ac.bgu.cs.bp.bpjs.exceptions.BPjsRuntimeException;
import il.ac.bgu.cs.bp.bpjs.internal.ExecutorServiceMaker;
import il.ac.bgu.cs.bp.bpjs.internal.Pair;
import il.ac.bgu.cs.bp.bpjs.model.BThreadSyncSnapshot;


/**
 * Simple class running a BPjs program that selects "hello world" events.
 * @author michael
 */
public class HelloWorld {

	private static Service service;
	private static Step currStep;
	private static StepMessage currStepMess;

    public static void main(String[] args) throws InterruptedException, ClassNotFoundException, IOException {
        
    	ExecutorService execSvc = ExecutorServiceMaker.makeWithName("executor");
    	Service service = new Service(null, execSvc);
    	service.init("bp.registerBThread(\"welcome\", function() {\r\n" + 
    			"    bp.sync({\r\n" + 
    			"        request: bp.Eve\r\n" + 
    			"    while (true) {}\r\n" + 
    			"    bp.sync({\r\n" + 
    			"        request: bp.Event(\"world\")});\r\n" + 
    			"})");
    	StepMessage stepMessage = new StepMessage(null, null, null, null, null, null, null, null);
    	stepMessage = service.step(stepMessage);
    	System.out.println(stepMessage.toString());
    	service.step(stepMessage);
    	stepMessage = service.step(stepMessage);
    	System.out.println(stepMessage.toString());
    }
    
//    public static void main(String[] args) throws InterruptedException {
//        ExecutorService executor = Executors.newFixedThreadPool(1);
//
//        Future<?> future = executor.submit(new Runnable() {
//            @Override
//            public void run() {
//                while(true) {}            //        <-- your job
//            }
//        });
//
//        executor.shutdown();            //        <-- reject all further submissions
//        try {
//            future.get(500, TimeUnit.MILLISECONDS);  //     <-- wait 500ms to finish
//        } catch (InterruptedException e) {    //    <-- possible error cases
//            System.out.println("job was interrupted");
//        } catch (ExecutionException e) {
//            System.out.println("caught exception: " + e.getCause());
//        } catch (TimeoutException e) {
//            future.cancel(true);              //     <-- interrupt the job
//            System.out.println("timeout");
//        }
//        executor.shutdownNow();
//        System.out.println("finish");
//    }
   
}
