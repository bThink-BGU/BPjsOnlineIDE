package il.ac.bgu.cs.bp.samplebpjsproject;

import java.io.IOException;
import java.util.ArrayList;
import java.util.Collections;
import java.util.List;
import java.util.Map;
import java.util.Set;
import java.util.concurrent.ExecutorService;
import java.util.stream.Collectors;

import il.ac.bgu.cs.bp.bpjs.bprogramio.BProgramSyncSnapshotCloner;
import il.ac.bgu.cs.bp.bpjs.bprogramio.BProgramSyncSnapshotIO;
import il.ac.bgu.cs.bp.bpjs.model.BEvent;
import il.ac.bgu.cs.bp.bpjs.model.BProgram;
import il.ac.bgu.cs.bp.bpjs.model.BProgramSyncSnapshot;
import il.ac.bgu.cs.bp.bpjs.model.BThreadSyncSnapshot;
import il.ac.bgu.cs.bp.bpjs.model.FailedAssertion;
import il.ac.bgu.cs.bp.bpjs.model.eventsets.EventSet;

public class Step {
	private final BProgramSyncSnapshot bpss;
	private final ExecutorService execSvc;
	private final BProgram bprog;
	private final Set<BEvent> selectableEvents;
	private final BEvent selectedEvent;

	public Step step() throws InterruptedException {
		if(bpss == null) { // Init state
			return new Step(execSvc, bprog, bprog.setup().start(execSvc), null);
		}
		ArrayList<BEvent> eventOrdered = new ArrayList<>(selectableEvents);
        Collections.shuffle(eventOrdered);
        BEvent e = eventOrdered.get(0);
        return new Step(execSvc, bprog, BProgramSyncSnapshotCloner.clone(bpss).triggerEvent(e, execSvc, Collections.emptyList()), e);
        
	}

	public Step(ExecutorService execSvc, BProgram bprog, BProgramSyncSnapshot bProgramSyncSnapshot, BEvent selectedEvent) {
		this.execSvc = execSvc;
		this.bprog = bprog;
		this.bpss = bProgramSyncSnapshot;
		this.selectedEvent = selectedEvent;
		if (bProgramSyncSnapshot != null) {
			this.selectableEvents = bprog.getEventSelectionStrategy().selectableEvents(bpss);
		} else {
			this.selectableEvents = null;
		}
	}

	public Step(ExecutorService execSvc, BProgram bprog, byte[] bProgramSyncSnapshot) throws IOException, ClassNotFoundException {
		this.execSvc = execSvc;
		this.bprog = bprog;
		this.selectedEvent = null; // We don't need it when deserializing, only after calling step
		if (bProgramSyncSnapshot != null) {
			this.bpss = new BProgramSyncSnapshotIO(bprog).deserialize(bProgramSyncSnapshot);
			this.selectableEvents = bprog.getEventSelectionStrategy().selectableEvents(bpss);
		} else {
			this.bpss = null;
			this.selectableEvents = null;
		}
	}
	
	public StepMessage toStepMessage() throws IOException {
		List<EventSet> wait = bpss.getStatements().stream().map(s->s.getWaitFor()).collect(Collectors.toList());
		List<EventSet> blocked = bpss.getStatements().stream().map(s->s.getBlock()).collect(Collectors.toList());
		List<BEvent> requested = bpss.getStatements().stream().map(s->s.getRequest()).flatMap(l->l.stream()).collect(Collectors.toList());
		bpss.getBThreadSnapshots().forEach(s->System.out.println(s.getContinuationProgramState().toString()));
//		int[] rows = threadSnapshots.stream().map(s->Map.copyOf(s.getName(),s.getContinuationProgramState().getFrameIndex()));
		return new StepMessage(
				new BProgramSyncSnapshotIO(bprog).serialize(bpss),
				null,
				requested.stream().map(r->r.toString()).collect(Collectors.toList()),
				selectableEvents.stream().map(e->e.toString()).collect(Collectors.toList()),
				wait.stream().map(r->r.toString()).collect(Collectors.toList()),
				blocked.stream().map(r->r.toString()).collect(Collectors.toList()),
				selectedEvent.toString());
	}
}
