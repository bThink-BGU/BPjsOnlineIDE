package il.ac.bgu.cs.bp.samplebpjsproject;

import java.util.LinkedList;
import java.util.List;
import java.util.Map;
import java.util.Map.Entry;

public class BThreadInfo {
	
	private String bThreadName;
	private int firstLinePC;
	private int localShift;
	private List<Object> localVars;
	private List<Object> localVals;
	
	public BThreadInfo(String bThreadName, int firstLinePC, int localShift, Map<Object, Object> variables) {
		this.bThreadName = bThreadName;
		this.firstLinePC = firstLinePC;
		this.localShift = localShift;
		handleVarMap(variables);
	} 
	
	private void handleVarMap(Map<Object, Object> variables) {
		if (variables == null) {
			this.localVars = null;
			this.localVals = null;
		}
		else {
			this.localVars = new LinkedList<>();
			this.localVals = new LinkedList<>();
			for (Entry<Object, Object> entry : variables.entrySet()) { 
				this.localVars.add(entry.getKey());
		        this.localVals.add(entry.getValue());
		    } 
		}
	}

	public List<Object> getLocalVars() {
		return localVars;
	}

	public List<Object> getLocalVals() {
		return localVals;
	}	
}
