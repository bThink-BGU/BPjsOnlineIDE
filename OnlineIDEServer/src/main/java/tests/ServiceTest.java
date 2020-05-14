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
import il.ac.bgu.cs.bp.samplebpjsproject.StepMessage;

public class ServiceTest {

	private Service service;
	
	@Before
	public void initService() {
		ExecutorService execSvc = ExecutorServiceMaker.makeWithName("executor");
		this.service = new Service(null, execSvc);
	}
	
	@Test //9.1
	public void init() {
		this.service.init("code");
		assertEquals(this.service.getCode(), "code");
	}
	
	@Test //9.2
	public void run() {
		// TODO - maybe it can be checked by a stub server
	}
	
	@Test //9.3
	public void firstStep() {  	
		
		String code = "PHILOSOPHER_COUNT = 5;\r\n" + 
				"\r\n" + 
				"function addPhil(philNum) {\r\n" + 
				"	bp.registerBThread(\"Phil\"+philNum, function() {\r\n" + 
				"		while (true) {\r\n" + 
				"			// Request to pick the right stick\r\n" + 
				"			bp.sync({request: bp.Event(\"Pick\"+philNum+\"R\")});\r\n" + 
				"			// Request to pick the left stick\r\n" + 
				"			bp.sync({request: bp.Event(\"Pick\"+philNum+\"L\")});\r\n" + 
				"			// Request to release the left stick\r\n" + 
				"			bp.sync({request: bp.Event(\"Rel\"+philNum+\"L\")});\r\n" + 
				"			// Request to release the right stick\r\n" + 
				"			bp.sync({request: bp.Event(\"Rel\"+philNum+\"R\")});\r\n" + 
				"		}\r\n" + 
				"	});\r\n" + 
				"};\r\n" + 
				"\r\n" + 
				"function addStick(i) {\r\n" + 
				"	var j = (i%PHILOSOPHER_COUNT)+1;\r\n" + 
				"\r\n" + 
				"	bp.registerBThread(\"Stick\"+i, function () {\r\n" + 
				"		var pickMe = bp.EventSet(\"pick\"+i, function(e) {\r\n" + 
				"			return (e.name === \"Pick\"+i+\"R\"\r\n" + 
				"				|| e.name === \"Pick\"+j+\"L\");\r\n" + 
				"		});\r\n" + 
				"		var releaseMe = [bp.Event(\"Rel\"+i+\"R\"),\r\n" + 
				"					bp.Event(\"Rel\"+j+\"L\")];\r\n" + 
				"\r\n" + 
				"		while (true) {\r\n" + 
				"			var e = bp.sync({waitFor: pickMe,\r\n" + 
				"					block: releaseMe});\r\n" + 
				"\r\n" + 
				"			var wt = (e.name === \"Pick\"+i+\"R\") ?\r\n" + 
				"					\"Rel\"+i+\"R\" : \"Rel\"+j+\"L\";\r\n" + 
				"			bp.sync({waitFor: bp.Event(wt),\r\n" + 
				"				block: releaseMe});\r\n" + 
				"		}\r\n" + 
				"	});\r\n" + 
				"}\r\n" + 
				"\r\n" + 
				"if (!PHILOSOPHER_COUNT) PHILOSOPHER_COUNT = 5;\r\n" + 
				"\r\n" + 
				"for (var i=1; i<=PHILOSOPHER_COUNT; i++) {\r\n" + 
				"	addStick(i);\r\n" + 
				"	addPhil(i);\r\n" + 
				"}";
		
		service.setCode(code);
		service.setBprog(new StringBProgram(code));
		
    	StepMessage stepMessage = new StepMessage(null, null, null, null, null, null, null);
    	
    	try {
			StepMessage nextStepMessage = this.service.step(stepMessage);
			
			assertEquals(nextStepMessage.getVars().size(), 4);
			assertEquals(nextStepMessage.getVars().toString(), 
					"[PHILOSOPHER_COUNT, i, addStick, addPhil]");
			
			assertEquals(nextStepMessage.getVals().size(), 4);
			
			assertEquals(nextStepMessage.getReqList().size(), 5);
			assertTrue(nextStepMessage.getReqList().contains("[BEvent name:Pick4R]"));
			assertTrue(nextStepMessage.getReqList().contains("[BEvent name:Pick3R]"));
			assertTrue(nextStepMessage.getReqList().contains("[BEvent name:Pick1R]"));
			assertTrue(nextStepMessage.getReqList().contains("[BEvent name:Pick5R]"));
			assertTrue(nextStepMessage.getReqList().contains("[BEvent name:Pick2R]"));
			
			assertEquals(nextStepMessage.getSelectableEvents().size(), 5);
			assertTrue(nextStepMessage.getSelectableEvents().contains("[BEvent name:Pick4R]"));
			assertTrue(nextStepMessage.getSelectableEvents().contains("[BEvent name:Pick3R]"));
			assertTrue(nextStepMessage.getSelectableEvents().contains("[BEvent name:Pick1R]"));
			assertTrue(nextStepMessage.getSelectableEvents().contains("[BEvent name:Pick5R]"));
			assertTrue(nextStepMessage.getSelectableEvents().contains("[BEvent name:Pick2R]"));
			
			assertEquals(nextStepMessage.getWaitList().size(), 10);			
			assertTrue(nextStepMessage.getWaitList().contains("[JsEventSet: pick2]"));
			assertTrue(nextStepMessage.getWaitList().contains("[JsEventSet: pick5]"));
			assertTrue(nextStepMessage.getWaitList().contains("[JsEventSet: pick1]"));
			assertTrue(nextStepMessage.getWaitList().contains("[JsEventSet: pick4]"));
			assertTrue(nextStepMessage.getWaitList().contains("[JsEventSet: pick3]"));
			
			assertEquals(nextStepMessage.getBlockList().size(), 10);
			assertTrue(nextStepMessage.getBlockList().contains("anyOf([BEvent name:Rel2R],[BEvent name:Rel3L])"));
			assertTrue(nextStepMessage.getBlockList().contains("anyOf([BEvent name:Rel1L],[BEvent name:Rel5R])"));
			assertTrue(nextStepMessage.getBlockList().contains("anyOf([BEvent name:Rel1R],[BEvent name:Rel2L])"));
			assertTrue(nextStepMessage.getBlockList().contains("anyOf([BEvent name:Rel4R],[BEvent name:Rel5L])"));
			assertTrue(nextStepMessage.getBlockList().contains("anyOf([BEvent name:Rel3R],[BEvent name:Rel4L])"));
			
			assertEquals(nextStepMessage.getSelectedEvent(), null);
			
		} catch (ClassNotFoundException | InterruptedException | IOException e) {
			// TODO Auto-generated catch block
			e.printStackTrace();
		}
	}
	
	@Test //9.4
	public void step() {
		
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
		StepMessage stepMessage = new StepMessage(null, null, null, null, null, null, null);
    	
		int counter = 0; 
		
    	try {
    		
    		do {
    			stepMessage = this.service.step(stepMessage);
    		} while(counter++ < 3);
				
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
			
		} catch (ClassNotFoundException | InterruptedException | IOException e) {
			// TODO Auto-generated catch block
			e.printStackTrace();
		}
	}
	
	@Test //8.5
	public void lastStep() {
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
		StepMessage stepMessage = new StepMessage(null, null, null, null, null, null, null);
		
		int counter = 0;
		
		try {
    		
    		do {
    			stepMessage = this.service.step(stepMessage);
    		} while(counter++ < 4);
    		
    		stepMessage = this.service.step(stepMessage); // last step
				
    		assertEquals(stepMessage.getBpss(), null);
    		assertEquals(stepMessage.getVars(), null);
			assertEquals(stepMessage.getVals(), null);
			assertEquals(stepMessage.getReqList(), null);
			assertEquals(stepMessage.getSelectableEvents(), null);
			assertEquals(stepMessage.getWaitList(), null);
			assertEquals(stepMessage.getBlockList(), null);
			assertEquals(stepMessage.getSelectedEvent(), null);
			
		} catch (ClassNotFoundException | InterruptedException | IOException e) {
			// TODO Auto-generated catch block
			e.printStackTrace();
		}
	}
}
