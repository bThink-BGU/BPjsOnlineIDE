package il.ac.bgu.cs.bp.samplebpjsproject;

import java.io.File;
import java.io.FileNotFoundException;
import java.io.PrintStream;
import java.util.concurrent.ExecutorService;

import javax.websocket.Session;

import il.ac.bgu.cs.bp.bpjs.execution.BProgramRunner;
import il.ac.bgu.cs.bp.bpjs.execution.listeners.PrintBProgramRunnerListener;
import il.ac.bgu.cs.bp.bpjs.model.BProgram;
import il.ac.bgu.cs.bp.bpjs.model.BProgramSyncSnapshot;
import il.ac.bgu.cs.bp.bpjs.model.StringBProgram;

public class Service {

	public String code;
	private BProgram bprog;
	private PrintStream aStream;
	private final ExecutorService execSvc;
	
	
	private RunLogger runLogger;
	
	
	public Service(Session session, ExecutorService execSvc) {
		this.execSvc = execSvc;
		this.runLogger = new RunLogger(session);
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

	
	// need to delete only for checking
//	public void init(BProgram bprog) {
//		this.code = bprog.toString();
//		this.bprog = bprog;
//		String pathname = "output.txt";
//		File file = new File(pathname);
//		try {
//			this.aStream = new PrintStream(file);
//		} catch (FileNotFoundException e) {
//			e.printStackTrace();
//		}
//	}

	public Step step(BProgramSyncSnapshot snapshot) throws InterruptedException {
		return Step.step(execSvc, bprog, snapshot);
	}
	
	
	// stub only, until we will know how to use step in BPjs
	public String step() {
		return "stub";
	}

	public RunLogger run() {
		BProgramRunner rnr = new BProgramRunner(this.bprog);
	
		// Print program events to the console		
		rnr.addListener(new SendBProgramRunnerListener(runLogger));

		// go!
		rnr.run();
		return runLogger;
	}
}
