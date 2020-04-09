package il.ac.bgu.cs.bp.samplebpjsproject;

import java.io.IOException;
import java.lang.reflect.Field;
import java.util.*;
import java.util.concurrent.ExecutorService;
import java.util.stream.Collectors;

import il.ac.bgu.cs.bp.bpjs.bprogramio.BProgramSyncSnapshotCloner;
import il.ac.bgu.cs.bp.bpjs.bprogramio.BProgramSyncSnapshotIO;
import il.ac.bgu.cs.bp.bpjs.internal.Pair;
import il.ac.bgu.cs.bp.bpjs.model.BEvent;
import il.ac.bgu.cs.bp.bpjs.model.BProgram;
import il.ac.bgu.cs.bp.bpjs.model.BProgramSyncSnapshot;
import il.ac.bgu.cs.bp.bpjs.model.BThreadSyncSnapshot;
import il.ac.bgu.cs.bp.bpjs.model.FailedAssertion;
import il.ac.bgu.cs.bp.bpjs.model.eventsets.EventSet;
import org.mozilla.javascript.NativeContinuation;

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

		// the following map structure is:
		/*
		Key = bthread name
		Value.Left = Current row
		Value.Right = Map of stack variables, with the following structure: Key = variable name, Value = variable value (as json string)
		 */
		Map<String, Pair<Integer, Map<String, String>>> bThreadDebugData = new HashMap<>();
		bpss.getBThreadSnapshots().forEach(s-> {
			// to find the stack variables and the current line, you need to dig in the continuation object
			// to see how to work with this object, take a look at https://github.com/bThink-BGU/BPjs/blob/develop/src/main/java/il/ac/bgu/cs/bp/bpjs/model/internal/ContinuationProgramState.java
			Object continuation = ((NativeContinuation)s.getContinuation()).getImplementation();
			int lineNumber = -1;
			Map<String, String> variables = new HashMap<>();
			bThreadDebugData.put(s.getName(), new Pair<>(lineNumber, variables));
		});

		return new StepMessage(
				new BProgramSyncSnapshotIO(bprog).serialize(bpss),
				bThreadDebugData,
				null,
				requested.stream().map(r->r.toString()).collect(Collectors.toList()),
				selectableEvents.stream().map(e->e.toString()).collect(Collectors.toList()),
				wait.stream().map(r->r.toString()).collect(Collectors.toList()),
				blocked.stream().map(r->r.toString()).collect(Collectors.toList()),
				selectedEvent.toString());
	}

	private Object getValue( Object instance, String fieldName ) throws NoSuchFieldException, IllegalAccessException {
		Field fld = instance.getClass().getDeclaredField(fieldName);
		fld.setAccessible(true);
		return fld.get(instance);
	}
}
