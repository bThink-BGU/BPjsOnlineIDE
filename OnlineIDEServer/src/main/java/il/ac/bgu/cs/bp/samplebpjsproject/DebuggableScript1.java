package il.ac.bgu.cs.bp.samplebpjsproject;

import org.mozilla.javascript.debug.DebuggableScript;

public class DebuggableScript1 implements DebuggableScript {

	@Override
	public boolean isTopLevel() {
		// TODO Auto-generated method stub
		return false;
	}

	@Override
	public boolean isFunction() {
		// TODO Auto-generated method stub
		return false;
	}

	@Override
	public String getFunctionName() {
		// TODO Auto-generated method stub
		return null;
	}

	@Override
	public int getParamCount() {
		// TODO Auto-generated method stub
		return 0;
	}

	@Override
	public int getParamAndVarCount() {
		// TODO Auto-generated method stub
		return 0;
	}

	@Override
	public String getParamOrVarName(int index) {
		// TODO Auto-generated method stub
		return null;
	}

	@Override
	public String getSourceName() {
		// TODO Auto-generated method stub
		return null;
	}

	@Override
	public boolean isGeneratedScript() {
		// TODO Auto-generated method stub
		return false;
	}

	@Override
	public int[] getLineNumbers() {
		// TODO Auto-generated method stub
		return null;
	}

	@Override
	public int getFunctionCount() {
		// TODO Auto-generated method stub
		return 0;
	}

	@Override
	public DebuggableScript getFunction(int index) {
		// TODO Auto-generated method stub
		return null;
	}

	@Override
	public DebuggableScript getParent() {
		// TODO Auto-generated method stub
		return null;
	}

}
