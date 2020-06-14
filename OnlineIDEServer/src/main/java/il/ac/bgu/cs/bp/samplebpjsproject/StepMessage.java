package il.ac.bgu.cs.bp.samplebpjsproject;

import java.util.LinkedList;
import java.util.List;
import java.util.Map;

public class StepMessage {
	private final String type;
	private final byte[] bpss;
	private List<Object> globalVars;
	private List<Object> globalVals;
	private List<BThreadInfo> bThreads;
	private final List<String> reqList;
	private final List<String> selectableEvents;
	private final List<String> waitList;
	private final List<String> blockList;
	private final String selectedEvent;
	
	
	public StepMessage(byte[] bpss, Map<Object, Object> globalVariables, List<BThreadInfo> bThreads, List<String> reqList, 
			List<String> selectableEvents, List<String> wait, List<String> block, String selectedEvent) {
		this.type = "step";
		this.bpss = bpss;
		this.reqList = reqList;
		this.selectableEvents = selectableEvents;
		this.waitList = wait;
		this.blockList = block;
		this.selectedEvent = selectedEvent;
		this.bThreads = bThreads;
		
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
	
//	public String toString() {
//		String bThreadsString = "\nbThreadWasNull\n";
//		if(bThreads != null) {
//			bThreadsString = "";
//			for(BThreadInfo b: bThreads) {
//				bThreadsString += b.toString();
//			}
//		}
//		return "|" + bpss + "|\n|" + "|" + globalVars + "|\n|" + "|" + globalVals + "|\n|" + bThreadsString +
//				reqList + "|\n|" + "|" + selectableEvents + "|\n|" + "|" + waitList + "|\n|" + "|" + blockList +  "|\n|" + selectedEvent + "|";
//	}

	
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

	public List<Object> getGlobalVars() {
		return globalVars;
	}

	public void setGlobalVars(List<Object> globalVars) {
		this.globalVars = globalVars;
	}

	public List<Object> getGlobalVals() {
		return globalVals;
	}

	public void setGlobalVals(List<Object> globalVals) {
		this.globalVals = globalVals;
	}

	public List<BThreadInfo> getbThreads() {
		return bThreads;
	}
	
	
}
