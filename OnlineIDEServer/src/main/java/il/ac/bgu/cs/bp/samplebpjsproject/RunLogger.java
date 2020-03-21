package il.ac.bgu.cs.bp.samplebpjsproject;

import java.io.IOException;
import java.util.LinkedList;
import java.util.List;

import javax.websocket.Session;


public class RunLogger {

	Session session;
	int id;
	
	public RunLogger(Session session) {
		this.session = session;
	}
		
	public void addBpStream(String type, String bpst) {
		try {
			this.session.getBasicRemote().sendText("\n" + bpst);
		} catch (IOException e) {
			// TODO Auto-generated catch block
			e.printStackTrace();
		}
	}
}
