package com.wep.auditusers;

import java.util.List;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.HttpStatusCode;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;
import org.json.JSONException;
import org.json.JSONObject;

@RestController
@CrossOrigin(maxAge = 3600)
@RequestMapping("/AuditUsers")
public class AuditUsersController {
	@Autowired
	private final AuditUsersApplicationService service;

	public AuditUsersController(AuditUsersApplicationService service) {
		this.service = service;
	}

	
	@GetMapping("/userByID/{userId}")
    public ResponseEntity<Object> getAuditUsersById(@PathVariable String userId) {
        AuditUsers user = service.getUserWithId(userId);
        if (user == null) {  
        	String errorMessage = "User with ID " + userId + " not found.";
        	 return ResponseEntity.status(HttpStatus.NOT_FOUND).body(errorMessage);
        }
        return ResponseEntity.ok(user);
    }
	
	
	@GetMapping("/getAllAuditUsers")
    public ResponseEntity<List<AuditUsers>> getAllUser() {
        List<AuditUsers> AuditUsers = service.getAllUser();
        return ResponseEntity.ok(AuditUsers);
    }

	
    @PostMapping("/deleteUser/{userId}")
    public ResponseEntity<String> deleteUser(@PathVariable String userId) {
        boolean deleted = service.deleteUser(userId);
        if (deleted) {
            String message = "User with ID " + userId + " deleted successfully.";
            return ResponseEntity.ok(message);
        } else {
            String errorMessage = "User with ID " + userId + " not found.";
            return ResponseEntity.status(HttpStatus.NOT_FOUND).body(errorMessage);
        }
    }
    
    
    @PostMapping("/deactivateUser/{userId}")
    public ResponseEntity<String> deactivateUser(@PathVariable String userId) {
        boolean deleted = service.deactivateUser(userId);
        if (deleted) {
            String message = "User with ID " + userId + " deactivated successfully.";
            return ResponseEntity.ok(message);
        } else {
            String errorMessage = "User with ID " + userId + " not found.";
            return ResponseEntity.status(HttpStatus.NOT_FOUND).body(errorMessage);
        }
    }

}
