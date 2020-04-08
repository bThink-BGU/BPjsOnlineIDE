package il.ac.bgu.cs.bp.samplebpjsproject;

import java.util.List;
import java.util.Map;

public class StepMessage {
	public final String type;
	public final byte[] bpss;
	public final Map<String,Object> bpStack;
	public final List<String> reqList;
	public final List<String> selectableEvents;
	public final List<String> waitList;
	public final List<String> blockList;
	public final String selectedEvent;
	
	
	public StepMessage(byte[] bpss, Map<String, Object> bpStack, List<String> reqList, List<String> selectableEvents, List<String> wait,
					   List<String> block, String selectedEvent) {
		this.type = "step";
		this.bpss = bpss;
		this.bpStack = bpStack;
		this.reqList = reqList;
		this.selectableEvents = selectableEvents;
		this.waitList = wait;
		this.blockList = block;
		this.selectedEvent = selectedEvent;
	}
}
