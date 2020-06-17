package tests;

import static org.junit.Assert.assertEquals;

import java.util.HashMap;
import java.util.Map;

import org.junit.Test;

import il.ac.bgu.cs.bp.samplebpjsproject.BThreadInfo;

public class BThreadInfoTest {
	
	@Test //13.1
	public void handleVarMap() {
		BThreadInfo bThread = new BThreadInfo("first", 0, 0, null);
		
		assertEquals(bThread.getLocalVars(), null);
		assertEquals(bThread.getLocalVals(), null);
		
		Map<Object, Object> map = new HashMap<>();
		map.put("x", 7);
		map.put("y", 8);
		
		bThread = new BThreadInfo("second", 0, 0, map);
		
		assertEquals(bThread.getLocalVars().size(), 2);
		assertEquals(bThread.getLocalVals().size(), 2);
	}
}
