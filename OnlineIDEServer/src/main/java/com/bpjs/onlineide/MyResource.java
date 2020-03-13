package com.bpjs.onlineide;


import javax.servlet.http.HttpServletRequest;
import javax.servlet.http.HttpServletResponse;
import javax.servlet.http.HttpSession;
import javax.ws.rs.Consumes;
import javax.ws.rs.GET;
import javax.ws.rs.POST;
import javax.ws.rs.Path;
import javax.ws.rs.Produces;
import javax.ws.rs.core.Context;
import javax.ws.rs.core.MediaType;

import org.json.simple.JSONObject;

import il.ac.bgu.cs.bp.samplebpjsproject.Service;

/**
 * Root resource (exposed at "myresource" path)
 */
@Path("myresource")
public class MyResource {
	
    @POST
    @Path("/init")
    @Consumes(MediaType.TEXT_PLAIN)
    public void init(String code, @Context HttpServletRequest req,
    		@Context HttpServletResponse res) {
        HttpSession session = req.getSession(true);
        
        res.addHeader("Vary", "Origin");
        res.addHeader("Access-Control-Allow-Origin", req.getHeader("Origin"));
        res.addHeader("Access-Control-Allow-Credentials", "true");
        
        if(session.getAttribute("service") == null) {
        	Service service = new Service(null);
        	session.setAttribute("service", service);
        }
        Service service = (Service) session.getAttribute("service");
        service.init(code);
    }
    
    
    /**
     * Method handling HTTP POST requests. The returned object will be sent
     * to the client as "text/plain" media type.
     *
     * @return String that will be returned as a text/plain response.
     */
    @GET
    @Path("/run")
    @Produces(MediaType.TEXT_PLAIN)
    public String run(@Context HttpServletRequest req,
    		@Context HttpServletResponse res) {
        HttpSession session = req.getSession(true);
        
        res.addHeader("Vary", "Origin");
        res.addHeader("Access-Control-Allow-Origin", req.getHeader("Origin"));
        res.addHeader("Access-Control-Allow-Credentials", "true");
        
        
        Service service = (Service) session.getAttribute("service");
    	if(service == null) {
    		return "Error";
    	}
    	service.run();
    	return service.getRunLogger().sendBpStream(); 	
    }
    
}
