package il.ac.bgu.cs.bp.samplebpjsproject;

import il.ac.bgu.cs.bp.bpjs.internal.Pair;

import java.util.LinkedList;
import java.util.List;
import java.util.Map;

public class StepMessage {
	private final String type;
	private final byte[] bpss;
//	public final Map<String, Pair<Integer, Map<Object, Object>>> bThreadDebugData;
//	public final Map<String,String> globalVariables;
	private List<Object> vars;
	private List<Object> vals;
	private final List<String> reqList;
	private final List<String> selectableEvents;
	private final List<String> waitList;
	private final List<String> blockList;
	private final String selectedEvent;
	
	
	public StepMessage(byte[] bpss, /*Map<String, Pair<Integer, Map<Object, Object>>> bThreadDebugData, Map<String, String> globalVariables,*/ 
			Map<Object, Object> variables, List<String> reqList, List<String> selectableEvents, List<String> wait, List<String> block, String selectedEvent) {
		this.type = "step";
		this.bpss = bpss;
//		this.bThreadDebugData = bThreadDebugData;
//		this.globalVariables = globalVariables;
		this.reqList = reqList;
		this.selectableEvents = selectableEvents;
		this.waitList = wait;
		this.blockList = block;
		this.selectedEvent = selectedEvent;
		handleVarMap(variables);
	}

	private void handleVarMap(Map<Object, Object> variables) {
		if (variables == null) {
			this.vars = null;
			this.vals = null;
		}
		else {
			this.vars = new LinkedList<>();
			this.vals = new LinkedList<>();
			for (Map.Entry<Object, Object> entry : variables.entrySet()) { 
		        this.vars.add(entry.getKey());
			 	this.vals.add(entry.getValue());
		    } 
		}
				
	}
	
	public String toString() {
		return "|" + bpss + "|\n|" + "|" + vars + "|\n|" + "|" + vals + "|\n|" + "|" + reqList + "|\n|" + "|" + 
	selectableEvents + "|\n|" + "|" + waitList + "|\n|" + "|" + blockList + "|\n|" + selectedEvent + "|";
	}

	public List<Object> getVars() {
		return vars;
	}

	public void setVars(List<Object> vars) {
		this.vars = vars;
	}

	public List<Object> getVals() {
		return vals;
	}

	public void setVals(List<Object> vals) {
		this.vals = vals;
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
