package il.ac.bgu.cs.bp.samplebpjsproject;

import java.util.List;
import java.util.Map;

import il.ac.bgu.cs.bp.bpjs.model.BEvent;
import il.ac.bgu.cs.bp.bpjs.model.BProgramSyncSnapshot;

public class StepMessage {
	
	private String type;
	private Map<String,?> stack;
	private List<String> request;
	private List<String> wait;
	private List<String> block;
	private String selectedEvent;
	
	
	public StepMessage(Map<String, ?> stack, List<String> request, List<String> wait, List<String> block,
			String selectedEvent) {
		this.type = "nextStep";
		this.stack = stack;
		this.request = request;
		this.wait = wait;
		this.block = block;
		this.selectedEvent = selectedEvent;
	}
}
