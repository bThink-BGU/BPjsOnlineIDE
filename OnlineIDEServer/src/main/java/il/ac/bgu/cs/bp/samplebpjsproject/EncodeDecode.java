package il.ac.bgu.cs.bp.samplebpjsproject;

import com.google.gson.Gson;

public class EncodeDecode {
	
	private static Gson gson = new Gson();
	
	public static String encode(Message message) {
		return gson.toJson(message);
	}
	
	public static Message decode(String message) {
		return gson.fromJson(message, Message.class);
	}
	
}
