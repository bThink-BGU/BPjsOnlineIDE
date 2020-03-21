package com.bpjs.onlineide;

import java.io.IOException;

import javax.json.Json;
import javax.websocket.DecodeException;
import javax.websocket.OnClose;
import javax.websocket.OnError;
import javax.websocket.OnMessage;
import javax.websocket.OnOpen;
import javax.websocket.Session;
import javax.websocket.server.ServerEndpoint;

import org.json.simple.JSONObject;

import com.google.gson.Gson;

import il.ac.bgu.cs.bp.samplebpjsproject.Service;

@ServerEndpoint("/api")
public class Server {
	
	private Session session;
	private static Gson gson = new Gson();
	
	private static class Message {
		String type;
		String message;
	}
	
    @OnOpen
    public void onOpen(Session session) throws IOException {
    	System.out.println("Client"+ session.getId() +" is now connected...");
		
    	this.session = session;
    }
    
    @OnMessage
    public void onMessage(Session session, String message) throws IOException, DecodeException {
    	Message decoded_message = gson.fromJson(message, Message.class);
    	
    	System.out.println("Recieved from client "+session.getId()+":\n" + decoded_message.message);  	
         	
    	Service service = new Service(session, null);
    	
    	if(decoded_message.type.equals("init"))
    		service.init(decoded_message.message);
    	else if (decoded_message.type.equals("run"))
    		service.run();	
    	
    }
    
    @OnClose
    public void onClose(Session session) throws IOException {
    	System.out.println("Client"+ session.getId() +" is now disconnected...");
    }
    
    @OnError
    public void onError(Throwable t) {
    	t.printStackTrace();
    }
    
}
