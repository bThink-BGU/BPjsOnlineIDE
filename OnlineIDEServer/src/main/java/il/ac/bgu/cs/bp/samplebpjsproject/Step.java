package il.ac.bgu.cs.bp.samplebpjsproject;

import il.ac.bgu.cs.bp.bpjs.bprogramio.BProgramSyncSnapshotCloner;
import il.ac.bgu.cs.bp.bpjs.bprogramio.BProgramSyncSnapshotIO;
import il.ac.bgu.cs.bp.bpjs.exceptions.BPjsRuntimeException;
import il.ac.bgu.cs.bp.bpjs.internal.Pair;
import il.ac.bgu.cs.bp.bpjs.model.BEvent;
import il.ac.bgu.cs.bp.bpjs.model.BProgram;
import il.ac.bgu.cs.bp.bpjs.model.BProgramSyncSnapshot;
import il.ac.bgu.cs.bp.bpjs.model.BThreadSyncSnapshot;
import il.ac.bgu.cs.bp.bpjs.model.SyncStatement;
import il.ac.bgu.cs.bp.bpjs.model.eventsets.EventSet;

import java.io.IOException;
import java.lang.reflect.Field;
import java.sql.Time;
import java.util.*;
import java.util.concurrent.ExecutionException;
import java.util.concurrent.ExecutorService;
import java.util.concurrent.Executors;
import java.util.concurrent.Future;
import java.util.concurrent.TimeUnit;
import java.util.concurrent.TimeoutException;
import java.util.concurrent.atomic.AtomicBoolean;
import java.util.stream.Collectors;

import org.mozilla.javascript.Context;
import org.mozilla.javascript.NativeContinuation;
import org.mozilla.javascript.ScriptableObject;
import org.mozilla.javascript.Undefined;

public class Step {
    private final BProgramSyncSnapshot bpss;
    private final ExecutorService execSvc;
    private final BProgram bprog;
    private final Set<BEvent> selectableEvents;
    private final BEvent selectedEvent;
    
    private Step nextStep;

    private Step(ExecutorService execSvc, BProgram bprog, BProgramSyncSnapshot bProgramSyncSnapshot, BEvent selectedEvent) {
        this.execSvc = execSvc;
        this.bprog = bprog;
        this.selectedEvent = selectedEvent;
        this.bpss = bProgramSyncSnapshot;
        this.selectableEvents = bProgramSyncSnapshot == null ? null : bprog.getEventSelectionStrategy().selectableEvents(bProgramSyncSnapshot);
    }

    public static Step Deserialize(ExecutorService execSvc, BProgram bprog, byte[] bProgramSyncSnapshot)
            throws IOException, ClassNotFoundException {
        if (bProgramSyncSnapshot != null)
            return new Step(execSvc, bprog, new BProgramSyncSnapshotIO(bprog).deserialize(bProgramSyncSnapshot), null);
        else
            return new Step(execSvc, bprog, null, null);
    }

    public Step step() throws InterruptedException {
        if (bpss == null)
        	return new Step(execSvc, bprog, bprog.setup().start(execSvc), null);
        if(bpss.noBThreadsLeft()) // The program was finished
        	return null;
        ArrayList<BEvent> eventOrdered = new ArrayList<>(selectableEvents);
        Collections.shuffle(eventOrdered);
        if(eventOrdered.size() == 0)
        	return null;
        BEvent ev = eventOrdered.get(0);
        
        this.nextStep = new Step(null, null, null, new BEvent("timeout"));
        
        ExecutorService executor = Executors.newFixedThreadPool(1);
        Future<?> future = executor.submit(new Runnable() {
            @Override
            public void run() {
            	try {
            		nextStep = new Step(execSvc, bprog, BProgramSyncSnapshotCloner.clone(bpss).triggerEvent(ev, execSvc, Collections.emptyList()), ev);
				} catch (BPjsRuntimeException | InterruptedException e) {
					// TODO Auto-generated catch block
				}
            }
        });
      
        executor.shutdown();            //        <-- reject all further submissions
        try {
            future.get(500, TimeUnit.MILLISECONDS);  //     <-- wait 500ms to finish
        } catch (InterruptedException e) {    //    <-- possible error cases
            System.out.println("job was interrupted");
        } catch (ExecutionException e) {
            System.out.println("caught exception: " + e.getCause());
        } catch (TimeoutException e) {
        	future.cancel(true);              //     <-- interrupt the job
            System.out.println("timeout");
        }
        executor.shutdownNow();
        return this.nextStep;
    }

    public StepMessage toStepMessage() throws IOException {
    	
    	if(this.execSvc == null && this.bprog == null && this.bpss == null && 
    			this.selectedEvent.name.equals("timeout")) // timeout
    		return new StepMessage(null, null, null, null, null, null, null, "timeout");
    	
        List<EventSet> wait = bpss.getStatements().stream().map(SyncStatement::getWaitFor).collect(Collectors.toList());
        List<EventSet> blocked = bpss.getStatements().stream().map(SyncStatement::getBlock).collect(Collectors.toList());
        List<BEvent> requested = bpss.getStatements().stream().map(SyncStatement::getRequest).flatMap(Collection::stream).collect(Collectors.toList());
        
        Map<Object, Object> globalVariables = new HashMap<>();
        List<BThreadInfo> bThreads = new LinkedList<>();
       
        for(BThreadSyncSnapshot s: bpss.getBThreadSnapshots()) { 	       	 	
        	NativeContinuation nc = ((NativeContinuation)s.getContinuation());
        	Object localShift = getLocalShift(nc.getImplementation());
        	Object firstLinePC = getfirstLinePC(nc.getImplementation());
        	Map<Object, Object> variables = s.getContinuationProgramState().getVisibleVariables();
	       	getGlobalValues(nc, variables, globalVariables);
	       	Map<Object, Object> localVariables = new HashMap<>();
	       	for(Object var: variables.keySet())
	       		if(!globalVariables.containsKey(var))
	       			localVariables.put(var, variables.get(var));
	       	bThreads.add(new BThreadInfo(s.getName(), (int)firstLinePC, (int)localShift, localVariables));
        }
        
        return new StepMessage(
                new BProgramSyncSnapshotIO(bprog).serialize(bpss),
                globalVariables,
                bThreads,
                requested.stream().map(BEvent::toString).collect(Collectors.toList()),
                selectableEvents.stream().map(BEvent::toString).collect(Collectors.toList()),
                wait.stream().map(Object::toString).collect(Collectors.toList()),
                blocked.stream().map(Object::toString).collect(Collectors.toList()),
                selectedEvent == null ? null : selectedEvent.toString());
    }


    private Object getfirstLinePC(Object implementation) {
    	Object firstLinePC = -1;
    	try {
    		Object idata = getValue(implementation, "idata");
    		firstLinePC = getValue(idata, "firstLinePC");
		} catch (NoSuchFieldException | IllegalAccessException e) {
			// TODO Auto-generated catch block
			e.printStackTrace();
		}
		return firstLinePC;
		
	}

	private Object getLocalShift(Object implementation) {
    	Object localShift = -1;
    	try {
    		localShift = getValue(implementation, "localShift");
		} catch (NoSuchFieldException | IllegalAccessException e) {
			// TODO Auto-generated catch block
			e.printStackTrace();
		}
		return localShift;
	}

	private Object getValue(Object instance, String fieldName) throws NoSuchFieldException, IllegalAccessException {
        Field fld = instance.getClass().getDeclaredField(fieldName);
        fld.setAccessible(true);
        return fld.get(instance);
    }

	@Override
	public String toString() {
		return "Step [bpss=" + bpss + ", execSvc=" + execSvc + ", bprog=" + bprog + ", selectableEvents="
				+ selectableEvents + ", selectedEvent=" + selectedEvent + "]";
	}

	public ExecutorService getExecSvc() {
		return execSvc;
	}

	public BProgram getBprog() {
		return bprog;
	}

	public Set<BEvent> getSelectableEvents() {
		return selectableEvents;
	}

	public BEvent getSelectedEvent() {
		return selectedEvent;
	}
	
	private void getGlobalValues(NativeContinuation nc,  Map<Object, Object> variables, Map<Object, Object> globalVariables) {
        ScriptableObject current = nc;
        ScriptableObject currentScope = nc;
        try {
            Context.enter();
            while (current != null) {
            	for(Object o: current.getIds())
            		addVar(current, globalVariables, o, variables.get(o));
                if (current.getPrototype() != null)
                    current = (ScriptableObject) current.getPrototype();
                else { // go to the next 
                    current = (ScriptableObject) currentScope.getParentScope();
                    currentScope = current;
                }
            }
        } finally {
            Context.exit();
        }
    }
	
	private void addVar(ScriptableObject current, Map<Object, Object> variables, Object var, Object val) {
		if (!variables.containsKey(var) && !var.equals("bp")) {
            Object variableContent = current.get(var);
            if (variableContent instanceof Undefined) return;
            variables.put(var, val);
        }
	}

	public BProgramSyncSnapshot getBpss() {
		return bpss;
	}
	
	
}
