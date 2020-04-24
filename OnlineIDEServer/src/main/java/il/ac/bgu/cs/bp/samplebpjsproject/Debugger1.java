package il.ac.bgu.cs.bp.samplebpjsproject;

import org.mozilla.javascript.Context;
import org.mozilla.javascript.debug.DebugFrame;
import org.mozilla.javascript.debug.DebuggableScript;
import org.mozilla.javascript.debug.Debugger;

public class Debugger1 implements Debugger{

	@Override
	public void handleCompilationDone(Context cx, DebuggableScript fnOrScript, String source) {
		// TODO Auto-generated method stub
		
	}

	@Override
	public DebugFrame getFrame(Context cx, DebuggableScript fnOrScript) {
		// TODO Auto-generated method stub
		return null;
	}
	
}
