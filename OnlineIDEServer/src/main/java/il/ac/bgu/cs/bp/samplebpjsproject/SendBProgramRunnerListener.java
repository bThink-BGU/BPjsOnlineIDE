package il.ac.bgu.cs.bp.samplebpjsproject;

import il.ac.bgu.cs.bp.bpjs.execution.listeners.BProgramRunnerListener;
import il.ac.bgu.cs.bp.bpjs.model.BEvent;
import il.ac.bgu.cs.bp.bpjs.model.BProgram;
import il.ac.bgu.cs.bp.bpjs.model.BThreadSyncSnapshot;
import il.ac.bgu.cs.bp.bpjs.model.FailedAssertion;

public class SendBProgramRunnerListener  implements BProgramRunnerListener {
	
	private RunLogger runLogg;
	
	
	public SendBProgramRunnerListener(RunLogger runLogg) {
		this.runLogg = runLogg;
	}

	@Override
	public void starting(BProgram bp) {
		this.runLogg.sendBpStream("run", "---:" + bp.getName() + " Starting"); // starting
	}

	@Override
	public void started(BProgram bp) {
		this.runLogg.sendBpStream("run", "---:" + bp.getName() + " Started"); // started
	}

	@Override
	public void superstepDone(BProgram bp) {
		this.runLogg.sendBpStream("run", "---:" + bp.getName() + " No Event Selected"); // superstepDone
	}

	@Override
	public void ended(BProgram bp) {
		this.runLogg.sendBpStream("run", "---:" + bp.getName() + " Ended"); // ended
	}

	@Override
	public void assertionFailed(BProgram bp, FailedAssertion theFailedAssertion) {
		this.runLogg.sendBpStream("run", 
				"---:" + bp.getName() + " B-thread " + theFailedAssertion.getBThreadName() + 
				" is in invalid state: " + theFailedAssertion.getMessage()); // assertionFailed
	}

	@Override
	public void bthreadAdded(BProgram bp, BThreadSyncSnapshot theBThread) {
		this.runLogg.sendBpStream("run", "  -:" + bp.getName() + " Added " + theBThread.getName()); // bthreadAdded
		
	}

	@Override
	public void bthreadRemoved(BProgram bp, BThreadSyncSnapshot theBThread) {
		this.runLogg.sendBpStream("run", "  -:" + bp.getName() + " Removed " + theBThread.getName()); // bthreadRemoved
	}
	    
	@Override
	public void bthreadDone(BProgram bp, BThreadSyncSnapshot theBThread) {
		this.runLogg.sendBpStream("run", "  -:" + bp.getName() + " Done " + theBThread.getName()); // bthreadDone
	}

	@Override
	public void eventSelected(BProgram bp, BEvent theEvent) {
		this.runLogg.sendBpStream("run", " --:" + bp.getName() + " Event " + theEvent.toString()); // eventSelected
	}

	@Override
	public void halted(BProgram bp) {
		this.runLogg.sendBpStream("run", "---:" + bp.getName() + " Halted");	// halted
	}

}
