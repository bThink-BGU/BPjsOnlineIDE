package il.ac.bgu.cs.bp.samplebpjsproject;

import java.util.LinkedList;
import java.util.List;


public class RunLogger {

	List<String> bpStream;
	int id;
	
	public RunLogger() {
		this.bpStream = new LinkedList<String>();
	}
		
	public void addBpStream(String type, String bpst) {
		this.bpStream.add(bpst);
	}
	
	public String sendBpStream() {
		String str = "";
		for(String s : this.bpStream) {
			str += s + '\n';
		}
		this.bpStream.clear();
		return str;
	}
}
