package il.ac.bgu.cs.bp.samplebpjsproject;

import java.util.ArrayList;
import java.util.Collections;
import java.util.LinkedList;
import java.util.List;
import java.util.Map;
import java.util.Set;
import java.util.concurrent.ExecutorService;

import il.ac.bgu.cs.bp.bpjs.bprogramio.BProgramSyncSnapshotCloner;
import il.ac.bgu.cs.bp.bpjs.model.BEvent;
import il.ac.bgu.cs.bp.bpjs.model.BProgram;
import il.ac.bgu.cs.bp.bpjs.model.BProgramSyncSnapshot;

public class Step {
	public BProgramSyncSnapshot snapshot;
	public Map<String,?> stack;
	public List<BEvent> request;
	public List<BEvent> wait;
	public List<BEvent> block;
	public BEvent selectedEvent;
	
	public static Step step(ExecutorService execSvc, BProgram bprog, BProgramSyncSnapshot snapshot) throws InterruptedException {
		BProgramSyncSnapshot nextStep = null;
		if(snapshot == null) {
			nextStep = bprog.setup().start(execSvc); //first time
			return new Step(nextStep, null);
		}
		
		Set<BEvent> selectableEvents = bprog.getEventSelectionStrategy().selectableEvents(snapshot);
		ArrayList<BEvent> eventOrdered = new ArrayList<>(selectableEvents);
        Collections.shuffle(eventOrdered);
        BEvent e = eventOrdered.get(0);
        return new Step(BProgramSyncSnapshotCloner.clone(snapshot).triggerEvent(e, execSvc, Collections.emptyList()), e);
        
	}
	
	private Step(BProgramSyncSnapshot snapshot, BEvent e) {
		this.selectedEvent = e;
		this.snapshot = snapshot;
		this.stack = null;
		ArrayList<BEvent> requested = new ArrayList<>();
		snapshot.getStatements().forEach(s->requested.addAll(s.getRequest()));
		//...
	}
	
	private StepMessage stepToMessage() {
		return new StepMessage(this.stack, bEventToStringList(this.request), bEventToStringList(this.wait), 
				bEventToStringList(this.request), this.selectedEvent.getName());
	}
	
	private List<String> bEventToStringList(List<BEvent> bList) {
		List<String> bEvents = new LinkedList<>();
		for (BEvent b : bList)
			bEvents.add(b.getName());	
		return bEvents;
	}	
}
