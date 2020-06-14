package tests;

import static org.junit.Assert.assertEquals;

import java.util.HashMap;
import java.util.LinkedList;
import java.util.List;
import java.util.Map;

import org.junit.Test;

import il.ac.bgu.cs.bp.samplebpjsproject.BThreadInfo;
import il.ac.bgu.cs.bp.samplebpjsproject.EncodeDecode;
import il.ac.bgu.cs.bp.samplebpjsproject.Message;
import il.ac.bgu.cs.bp.samplebpjsproject.StepMessage;

public class EncodedDecodedTest {
	
	@Test //12.1
	public void encodeDecodeMessage() {
		Message message = new Message("type", "message");
		String mess = EncodeDecode.encode(message);
		Message newMessage = EncodeDecode.decode(mess);
		
		assertEquals(message.getType(), newMessage.getType());
		assertEquals(message.getMessage(), newMessage.getMessage());
	}
	
	@Test //12.2
	public void encodeDecodeStepMessage() {
		Map<Object, Object> map = new HashMap<>();
		map.put("x", 7);
		List<BThreadInfo> bThreads = new LinkedList<>();
		StepMessage stepMessage = new StepMessage(null, map, new LinkedList<>(), new LinkedList<>(), 
				new LinkedList<>(), new LinkedList<>(), new LinkedList<>(), "e");
		String mess = EncodeDecode.encode(stepMessage);
		StepMessage newStepMessage = EncodeDecode.decodeStepMessage(mess);
		
		assertEquals(stepMessage.getSelectedEvent(), newStepMessage.getSelectedEvent());
	}
}
