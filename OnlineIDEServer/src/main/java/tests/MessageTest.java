package tests;

import static org.junit.Assert.assertEquals;

import java.util.concurrent.ExecutorService;

import org.junit.Before;
import org.junit.Test;

import il.ac.bgu.cs.bp.bpjs.internal.ExecutorServiceMaker;
import il.ac.bgu.cs.bp.samplebpjsproject.Message;
import il.ac.bgu.cs.bp.samplebpjsproject.Service;

public class MessageTest {
	
	@Test //11.1
	public void messageGettersSetters() {
		Message message = new Message("type", "message");
		
		assertEquals(message.getType(), "type");
		assertEquals(message.getMessage(), "message");
		
		message.setType("type2");
		message.setMessage("message2");
		
		assertEquals(message.getType(), "type2");
		assertEquals(message.getMessage(), "message2");
		
		message = new Message();
		
		assertEquals(message.getType(), "");
		assertEquals(message.getMessage(), "");
	}
	
}
