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

import il.ac.bgu.cs.bp.samplebpjsproject.EncodeDecode;
import il.ac.bgu.cs.bp.samplebpjsproject.Message;
import il.ac.bgu.cs.bp.samplebpjsproject.Service;

@ServerEndpoint("/api")
public class Server {
	
	private Session session;
	private Service service;
	
    @OnOpen
    public void onOpen(Session session) throws IOException {
    	System.out.println("Client"+ session.getId() +" is now connected...");
		
    	this.session = session;
    	this.service = new Service(this.session, null);
    }
    
    @OnMessage
    public void onMessage(Session session, String message) throws IOException, DecodeException {
    	Message decoded_message = EncodeDecode.decode(message);
    	
    	switch (decoded_message.getType()) {
			case "init":
				this.service.init(decoded_message.getMessage());
				this.session.getBasicRemote().sendText(message);
				break;
			case "run":
				this.service.run();	
				break;
			default:
				break;
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
    
}
