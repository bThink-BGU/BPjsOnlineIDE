package com.bpjs.onlineide;

import java.io.IOException;
import java.util.concurrent.ExecutorService;

import javax.websocket.DecodeException;
import javax.websocket.OnClose;
import javax.websocket.OnError;
import javax.websocket.OnMessage;
import javax.websocket.OnOpen;
import javax.websocket.Session;
import javax.websocket.server.ServerEndpoint;

import il.ac.bgu.cs.bp.bpjs.internal.ExecutorServiceMaker;

import il.ac.bgu.cs.bp.samplebpjsproject.EncodeDecode;
import il.ac.bgu.cs.bp.samplebpjsproject.Message;
import il.ac.bgu.cs.bp.samplebpjsproject.Service;
import il.ac.bgu.cs.bp.samplebpjsproject.StepMessage;

@ServerEndpoint("/api")
public class Server {
	private final ExecutorService execSvc = ExecutorServiceMaker.makeWithName("executor");
	private Session session;
	private Service service;
	
    @OnOpen
    public void onOpen(Session session) throws IOException {
    	System.out.println("Client"+ session.getId() +" is now connected...");
		
    	this.session = session;
    	this.service = new Service(this.session, execSvc);
    }
    
    @OnMessage(maxMessageSize = 1024*1024)
    public void onMessage(Session session, String message) throws IOException, DecodeException {
    	Message decodedMessage = EncodeDecode.decode(message);
    	
    	switch (decodedMessage.getType()) {
			case "initRun":
			case "initStep":
				init(decodedMessage);
				break;
			case "run":
				try {
					run();
				}	
				catch(Exception e) {
					this.service.getRunLogger().sendBpStream("error", e.getMessage());
					System.out.println(e.getMessage());
				}
				break;
			case "step":
				try {
					step(EncodeDecode.decodeStepMessage(message));					
				}	
				catch(Exception e) {
					StepMessage nextStepMessage = new StepMessage(null, null, null, null, null, null, null, e.getMessage());
					this.session.getBasicRemote().sendText("\n" + EncodeDecode.encode(nextStepMessage));
					System.out.println(e.getMessage());
				}
				break;
			case "externalEvent":
				addExternalEvent(decodedMessage);
				break;
			default:
				break;
		}
    }
  
	private void step(StepMessage stepMessage) {
		StepMessage nextStepMessage;
		try {
			nextStepMessage = this.service.step(stepMessage);
			this.session.getBasicRemote().sendText("\n" + EncodeDecode.encode(nextStepMessage));
		} catch (ClassNotFoundException | InterruptedException | IOException e) {
			// TODO Auto-generated catch block
			e.printStackTrace();
			System.out.println("Error in step");
		}
	}

	@OnClose
    public void onClose(Session session) throws IOException {
    	System.out.println("Client"+ session.getId() +" is now disconnected...");
    }
    
    @OnError
    public void onError(Throwable t) {
    	t.printStackTrace();
    }    
    
    private void init(Message message) {
    	this.service.init(message.getMessage());
		try {
			this.session.getBasicRemote().sendText(EncodeDecode.encode(message));
		} catch (IOException e) {
			// TODO Auto-generated catch block
			e.printStackTrace();
		}
    }

	private void run() {
    	if(this.service != null)
			this.service.run();	
		else
			System.out.println("Not existing service");
	}
	
	  private void addExternalEvent(Message message) {
	    	if(this.service != null) {
				this.service.addExternalEvent(message.getMessage());
				try {
					this.session.getBasicRemote().sendText(EncodeDecode.encode(message));
				} catch (IOException e) {
					// TODO Auto-generated catch block
					e.printStackTrace();
				}					
			}
			else
				System.out.println("Not existing service");	
		}
}
