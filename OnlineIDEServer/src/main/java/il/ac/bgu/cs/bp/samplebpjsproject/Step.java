package il.ac.bgu.cs.bp.samplebpjsproject;

import java.util.ArrayList;
import java.util.Collections;
import java.util.List;
import java.util.Map;
import java.util.Set;
import java.util.concurrent.ExecutorService;
import java.util.stream.Collectors;

import il.ac.bgu.cs.bp.bpjs.bprogramio.BProgramSyncSnapshotCloner;
import il.ac.bgu.cs.bp.bpjs.model.BEvent;
import il.ac.bgu.cs.bp.bpjs.model.BProgram;
import il.ac.bgu.cs.bp.bpjs.model.BProgramSyncSnapshot;
import il.ac.bgu.cs.bp.bpjs.model.BThreadSyncSnapshot;
import il.ac.bgu.cs.bp.bpjs.model.FailedAssertion;
import il.ac.bgu.cs.bp.bpjs.model.eventsets.EventSet;

public class Step implements java.io.Serializable {
	private Map<String,Object> stack;
	private List<BEvent> request;
	private List<EventSet> wait;
	private List<EventSet> block;
	private BEvent selectedEvent;
	private Set<BThreadSyncSnapshot> threadSnapshots;
    private List<BEvent> externalEvents;
    private FailedAssertion violationRecord;
    
	
	public Step step(ExecutorService execSvc, BProgram bprog, boolean isFirst) throws InterruptedException {
		if(isFirst) {
			return new Step(bprog.setup().start(execSvc), null);
		}
		BProgramSyncSnapshot snapshot = 
				new BProgramSyncSnapshot(bprog, threadSnapshots, externalEvents, violationRecord);
		
		Set<BEvent> selectableEvents = bprog.getEventSelectionStrategy().selectableEvents(snapshot);
		ArrayList<BEvent> eventOrdered = new ArrayList<>(selectableEvents);
        Collections.shuffle(eventOrdered);
        BEvent e = eventOrdered.get(0);
        return new Step(BProgramSyncSnapshotCloner.clone(snapshot).triggerEvent(e, execSvc, Collections.emptyList()), e);
        
	}
	
	public Step() {}
	
	private Step(BProgramSyncSnapshot snapshot, BEvent e) {
		this.selectedEvent = e;
		this.stack = null;
		this.threadSnapshots = snapshot.getBThreadSnapshots();
		this.externalEvents = snapshot.getExternalEvents();
		this.violationRecord = snapshot.getFailedAssertion();
		this.wait = snapshot.getStatements().stream().map(s->s.getWaitFor()).collect(Collectors.toList());
		this.request = snapshot.getStatements().stream().map(s->s.getRequest()).flatMap(l->l.stream()).collect(Collectors.toList());
		this.block = snapshot.getStatements().stream().map(s->s.getBlock()).collect(Collectors.toList());
	}
	
	public StepMessage stepToMessage(byte[] continuation) {
		threadSnapshots.forEach(s->System.out.println(s.getContinuationProgramState().toString()));
//		int[] rows = threadSnapshots.stream().map(s->Map.copyOf(s.getName(),s.getContinuationProgramState().getFrameIndex()));
		return new StepMessage(continuation, stack, request.stream().map(r->r.toString()).collect(Collectors.toList()), wait.stream().map(r->r.toString()).collect(Collectors.toList()), block.stream().map(r->r.toString()).collect(Collectors.toList()), selectedEvent.toString());
	}
}
