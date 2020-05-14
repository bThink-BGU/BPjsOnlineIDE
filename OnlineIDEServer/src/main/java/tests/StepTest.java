package tests;

import static org.junit.Assert.assertEquals;
import static org.junit.Assert.assertTrue;

import java.io.IOException;
import java.util.concurrent.ExecutorService;

import org.junit.Before;
import org.junit.Test;

import il.ac.bgu.cs.bp.bpjs.internal.ExecutorServiceMaker;
import il.ac.bgu.cs.bp.bpjs.model.StringBProgram;
import il.ac.bgu.cs.bp.samplebpjsproject.Service;
import il.ac.bgu.cs.bp.samplebpjsproject.Step;
import il.ac.bgu.cs.bp.samplebpjsproject.StepMessage;

public class StepTest {
	
	private Service service;

	@Before
	public void initService() {
		ExecutorService execSvc = ExecutorServiceMaker.makeWithName("executor");
		service = new Service(null, execSvc);
		
		String code = "var globalNumber = 3;\r\n" + 
				"var globalStruct = { name:\"gs\", val:3.4 };\r\n" + 
				"function foo(fooParam1, fooParam2) {\r\n" + 
				"var fooVariable = \"fooVar\";\r\n" + 
				"for(var i=0; i<3; i++) {\r\n" + 
				" //put breakpoint here and see that for each of the three b-threads you know how to find all the vaiables(local/global)/params/line numbers/stacktrace, and anything else that you think that is relevant.\r\n" + 
				"// note that i here overloads the i of b-threads bt0 and bt1.\r\n" + 
				"bp.sync( {request:bp.Event(\"a\")} );\r\n" + 
				"}\r\n" + 
				"}\r\n" + 
				"\r\n" + 
				"function register(i) {\r\n" + 
				"var tmp = 50;\r\n" + 
				"bp.registerBThread(\"bt\"+i, function() {\r\n" + 
				"var r = 20 + i;\r\n" + 
				"foo(\"bt\"+i, i);\r\n" + 
				"});\r\n" + 
				"}\r\n" + 
				"\r\n" + 
				"register(0);\r\n" + 
				"register(1);\r\n" + 
				"bp.registerBThread(\"bt2\", function() {\r\n" + 
				"foo(\"bt2\", 2);\r\n" + 
				"//put breakpoint here and see that for this b-thread you know how to find all the vaiables(local/global)/params/line numbers/stacktrace, and anything else that you think that is relevant.  \r\n" + 
				"  bp.sync( { request: bp.Event(\"b\") } );  \r\n" + 
				"});";
		
		service.setCode(code);
		service.setBprog(new StringBProgram(code));
	}
	
	@Test
	public void firstStep() {
		StepMessage stepMessage = new StepMessage(null, null, null, null, null, null, null);
		Step step = getStep(stepMessage);
		try {
			Step nextStep = step.step();
			
			assertEquals(nextStep.getBprog(), service.getBprog());
			assertEquals(nextStep.getExecSvc(), service.getExecSvc());
			assertEquals(nextStep.getSelectableEvents().size(), 1);
			assertTrue(nextStep.getSelectableEvents().toString().equals("[[BEvent name:a]]"));
			assertEquals(nextStep.getSelectedEvent(), null);
			
		} catch (InterruptedException e) {
			// TODO Auto-generated catch block
			e.printStackTrace();
		}
	}
	
	@Test
	public void step() {
		StepMessage stepMessage = new StepMessage(null, null, null, null, null, null, null);
		Step step = getStep(stepMessage);
		
		int counter = 0;
		
		try {			
			
			do {
				step = step.step();
			} while(counter++ < 3);
		
			assertEquals(step.getBprog(), service.getBprog());
			assertEquals(step.getExecSvc(), service.getExecSvc());
			assertEquals(step.getSelectableEvents().size(), 1);
			assertTrue(step.getSelectableEvents().toString().equals("[[BEvent name:b]]"));
			assertEquals(step.getSelectedEvent().getName(), "a");
			
			
		} catch (InterruptedException e) {
			// TODO Auto-generated catch block
			e.printStackTrace();
		}
	}
	
	@Test
	public void lastStep() {
		StepMessage stepMessage = new StepMessage(null, null, null, null, null, null, null);
		Step step = getStep(stepMessage);
		
		int counter = 0;
		
		try {			
			
			do {
				step = step.step();
			} while(counter++ < 4);
			
			step = step.step(); // last step
		
			assertEquals(step, null);
			
			
		} catch (InterruptedException e) {
			// TODO Auto-generated catch block
			e.printStackTrace();
		}
	}
	
	@Test
	public void toStepMessage() {
		StepMessage stepMessage = new StepMessage(null, null, null, null, null, null, null);
		Step step = getStep(stepMessage);
		
		int counter = 0;
		
		try {			
			
			do {
				step = step.step();
			} while(counter++ < 3);
			
			stepMessage = step.toStepMessage();
			
			assertEquals(stepMessage.getVars().size(), 4);
			assertEquals(stepMessage.getVars().toString(), 
					"[globalStruct, globalNumber, foo, register]");
			
			assertEquals(stepMessage.getVals().size(), 4);
			
			
			assertEquals(stepMessage.getReqList().size(), 1);
			assertTrue(stepMessage.getReqList().contains("[BEvent name:b]"));
			
			assertEquals(stepMessage.getSelectableEvents().size(), 1);
			assertTrue(stepMessage.getSelectableEvents().contains("[BEvent name:b]"));
			
			assertEquals(stepMessage.getWaitList().size(), 1);
			assertTrue(stepMessage.getWaitList().contains("{none}"));
			
			assertEquals(stepMessage.getBlockList().size(), 1);
			assertTrue(stepMessage.getBlockList().contains("{none}"));			
			
			assertEquals(stepMessage.getSelectedEvent(), "[BEvent name:a]");
			
		} catch (InterruptedException | IOException e) {
			// TODO Auto-generated catch block
			e.printStackTrace();
		}
	}
	
	public Step getStep(StepMessage stepMessage) {
		try {
			return Step.Deserialize(this.service.getExecSvc(), this.service.getBprog(), stepMessage.getBpss());
		} catch (ClassNotFoundException | IOException e) {
			// TODO Auto-generated catch block
			e.printStackTrace();
		}
		return null;
	}
	
	
	
}
