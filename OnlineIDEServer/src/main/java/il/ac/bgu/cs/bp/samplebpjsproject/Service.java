package il.ac.bgu.cs.bp.samplebpjsproject;

import static java.util.Collections.reverseOrder;

import java.io.IOException;
import java.util.ArrayList;
import java.util.List;
import java.util.Optional;
import java.util.Set;
import java.util.concurrent.ExecutorService;

import javax.websocket.Session;

import il.ac.bgu.cs.bp.bpjs.exceptions.BPjsRuntimeException;
import il.ac.bgu.cs.bp.bpjs.execution.BProgramRunner;
import il.ac.bgu.cs.bp.bpjs.internal.ExecutorServiceMaker;
import il.ac.bgu.cs.bp.bpjs.model.BEvent;
import il.ac.bgu.cs.bp.bpjs.model.BProgram;
import il.ac.bgu.cs.bp.bpjs.model.BProgramSyncSnapshot;
import il.ac.bgu.cs.bp.bpjs.model.StringBProgram;
import il.ac.bgu.cs.bp.bpjs.model.eventselection.EventSelectionResult;

public class Service {

	private String code;
	private BProgram bprog;
	private final ExecutorService execSvc;
	private RunLogger runLogger;
	private BProgramRunner rnr; 
	
	private Thread thread;
	
	public Service(Session session, ExecutorService execSvc) {
		this.execSvc = execSvc;
		this.runLogger = new RunLogger(session);
		
		initThread();
	}
	
	private void initThread() {
		this.thread = new Thread(new Runnable() {
			
			@Override
			public void run() {
				rnr = new BProgramRunner(bprog);
				
				// Print program events to the console		
				rnr.addListener(new SendBProgramRunnerListener(runLogger));

				// go!
				try {
					rnr.run();
				} catch(Exception e) {
					runLogger.sendBpStream("error", e.getMessage());
					System.out.println(e.getMessage());
				}
				
			}
		});
	}

	public RunLogger getRunLogger() {
		return runLogger;
	}

	public void setRunLogger(RunLogger runLogger) {
		this.runLogger = runLogger;
	}

	public void init(String code) {
		this.code = code;
		this.bprog = new StringBProgram(code);
	}

	public StepMessage step(StepMessage step) throws InterruptedException, IOException, ClassNotFoundException {
		Step s = Step.Deserialize(execSvc, bprog, step.getBpss());
		Step tmpStep = s.step();
		if(tmpStep == null) { // The program was ended
			return new StepMessage(null, null, null, null, null, null, null, null);
		}
		return tmpStep.toStepMessage();
	}

	public void run() {
		this.thread.start();
		if(!this.thread.isInterrupted())
			initThread();
	}	
	
	public void Stop() {
		rnr.halt();
		initThread();
	}
	
	public void addExternalEvent(String e) {
		this.bprog.enqueueExternalEvent(new BEvent(e));
	}

	public String getCode() {
		return code;
	}

	public void setCode(String code) {
		this.code = code;
	}

	public BProgram getBprog() {
		return bprog;
	}

	public void setBprog(BProgram bprog) {
		this.bprog = bprog;
	}

	public ExecutorService getExecSvc() {
		return execSvc;
	}
}
