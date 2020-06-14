package il.ac.bgu.cs.bp.samplebpjsproject;

import java.io.IOException;

import javax.websocket.Session;


public class RunLogger {

	Session session;
	int id;
	
	public RunLogger(Session session) {
		this.session = session;
	}
		
	public void sendBpStream(String type, String bpst) {
		Message message = new Message(type, bpst);
		try {
			this.session.getBasicRemote().sendText("\n" + EncodeDecode.encode(message));
		} catch (IOException e) {
			// TODO Auto-generated catch block
			e.printStackTrace();
		}
	}
}
