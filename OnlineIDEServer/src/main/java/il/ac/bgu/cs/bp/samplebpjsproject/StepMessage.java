package il.ac.bgu.cs.bp.samplebpjsproject;

import java.util.List;
import java.util.Map;

import il.ac.bgu.cs.bp.bpjs.model.BEvent;
import il.ac.bgu.cs.bp.bpjs.model.BProgramSyncSnapshot;

public class StepMessage {
	private String type;
	private byte[] continuation;
	private Map<String,Object> bpStack;
	private List<String> reqList;
	private List<String> waitList;
	private List<String> blockList;
	private String selectedEvent;
	
	
	public StepMessage(byte[] continuation, Map<String, Object> bpStack, List<String> reqList, List<String> wait, 
			List<String> block, String selectedEvent) {
		this.type = "step";
		this.continuation = continuation;
		this.bpStack = bpStack;
		this.reqList = reqList;
		this.waitList = waitList;
		this.blockList = blockList;
		this.selectedEvent = selectedEvent;
	}
	
	public byte[] getContinuation() {
		return this.continuation;
	}
}
