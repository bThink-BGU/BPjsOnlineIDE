package il.ac.bgu.cs.bp.samplebpjsproject;

import il.ac.bgu.cs.bp.bpjs.internal.Pair;

import java.util.LinkedList;
import java.util.List;
import java.util.Map;
import java.util.Map.Entry;

public class StepMessage {
	private final String type;
	private final byte[] bpss;
	private List<Object> globalVars;
	private List<Object> globalVals;
	private List<BthreadInfo> bThreads;
	private final List<String> reqList;
	private final List<String> selectableEvents;
	private final List<String> waitList;
	private final List<String> blockList;
	private final String selectedEvent;
	
	
	public StepMessage(byte[] bpss, Map<Object, Object> globalVariables, List<BthreadInfo> bThreads, List<String> reqList, 
			List<String> selectableEvents, List<String> wait, List<String> block, String selectedEvent) {
		this.type = "step";
		this.bpss = bpss;
		this.reqList = reqList;
		this.selectableEvents = selectableEvents;
		this.waitList = wait;
		this.blockList = block;
		this.selectedEvent = selectedEvent;
		
		handleGloablVarMap(globalVariables);
	}

	private void handleGloablVarMap(Map<Object, Object> variables) {
		if (variables == null) {
			this.globalVars = null;
			this.globalVals = null;
		}
		else {
			this.globalVars = new LinkedList<>();
			this.globalVals = new LinkedList<>();
			for (Map.Entry<Object, Object> entry : variables.entrySet()) { 
				this.globalVars.add(entry.getKey());
		        this.globalVals.add(entry.getValue());
		    } 
		}
	}
	
//	private void handleLocalVarMap(Map<String, Map<Object, Object>> variables) {
//		if (variables == null) {
//			this.localVars = null;
//			this.localVals = null;
//		}
//		else {
//			this.bThreadNames = new LinkedList<>();
//			this.localVars = new LinkedList<>();
//			this.localVals = new LinkedList<>();
//			for (Entry<String, Map<Object, Object>> entry: variables.entrySet()) {
//				this.bThreadNames.add(entry.getKey());
//				List<Object> vars = new LinkedList<>();
//				List<Object> vals = new LinkedList<>();
//				for(Entry<Object, Object> entry2: entry.getValue().entrySet()) {
//					vars.add(entry2.getKey());
//					vals.add(entry2.getValue());
//				}
//				this.localVars.add(vars);
//				this.localVals.add(vals);
//		    } 
//		}
//	}
	
	
	
	public String toString() {
		return "|" + bpss + "|\n|" + "|" + globalVars + "|\n|" + "|" + globalVals + "|\n|" + "|" + 
				"|\n|" + "|" + reqList + "|\n|" + "|" + selectableEvents + "|\n|" + "|" + waitList + "|\n|" + "|" + blockList + 
				"|\n|" + selectedEvent + "|";
	}

	

	public String getType() {
		return type;
	}

	public byte[] getBpss() {
		return bpss;
	}

	public List<String> getReqList() {
		return reqList;
	}

	public List<String> getSelectableEvents() {
		return selectableEvents;
	}

	public List<String> getWaitList() {
		return waitList;
	}

	public List<String> getBlockList() {
		return blockList;
	}

	public String getSelectedEvent() {
		return selectedEvent;
	}
	
	
}
