package il.ac.bgu.cs.bp.samplebpjsproject;

import il.ac.bgu.cs.bp.bpjs.internal.Pair;

import java.util.List;
import java.util.Map;

public class StepMessage {
	public final String type;
	public final byte[] bpss;
//	public final Map<String, Pair<Integer, Map<Object, Object>>> bThreadDebugData;
//	public final Map<String,String> globalVariables;
	public final Map<Object,Object> variables;
	public final List<String> reqList;
	public final List<String> selectableEvents;
	public final List<String> waitList;
	public final List<String> blockList;
	public final String selectedEvent;
	
	
	public StepMessage(byte[] bpss, /*Map<String, Pair<Integer, Map<Object, Object>>> bThreadDebugData, Map<String, String> globalVariables,*/ 
			Map<Object, Object> variables, List<String> reqList, List<String> selectableEvents, List<String> wait, List<String> block, String selectedEvent) {
		this.type = "step";
		this.bpss = bpss;
		this.variables= variables;
//		this.bThreadDebugData = bThreadDebugData;
//		this.globalVariables = globalVariables;
		this.reqList = reqList;
		this.selectableEvents = selectableEvents;
		this.waitList = wait;
		this.blockList = block;
		this.selectedEvent = selectedEvent;
	}
}
