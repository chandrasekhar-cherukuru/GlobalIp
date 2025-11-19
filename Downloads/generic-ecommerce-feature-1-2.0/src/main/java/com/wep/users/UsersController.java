package com.wep.users;

import java.util.List;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.HttpStatusCode;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import jakarta.transaction.Transactional;

import org.json.JSONException;
import org.json.JSONObject;

@RestController
@CrossOrigin(maxAge = 3600)
@RequestMapping("/users")
public class UsersController {
	@Autowired
	private final UsersApplicationService service;
	public UsersController(UsersApplicationService service) {
		this.service = service;
	
	}

	
	@GetMapping("/userByID/{userId}")
    public ResponseEntity<Object> getUsersById(@PathVariable String userId) {
        Users user = service.getUserWithId(userId);
        if (user == null) {  
        	String errorMessage = "User with ID " + userId + " not found.";
        	 return ResponseEntity.status(HttpStatus.NOT_FOUND).body(errorMessage);
        }
        return ResponseEntity.ok(user);
    }
		
	@GetMapping("/getAllUsers")
    public ResponseEntity<List<Users>> getAllUser() {
        List<Users> users = service.getAllUser();
        return ResponseEntity.ok(users);
    }

		
	@PostMapping("/addNewUserMobile")
	public ResponseEntity<UserSessionDTO> addNewUserMobile(@RequestParam String countryCode, @RequestParam String mobile1)
			throws JSONException {

		if (mobile1 == null || mobile1.isEmpty()) {
			String errorMsg = "Mobile cannot be null or empty";
			return ResponseEntity.status(HttpStatus.NOT_FOUND).body(new UserSessionDTO(errorMsg));
		}
		UserSessionDTO respUser = new UserSessionDTO();
		respUser = service.addNewUser(countryCode, mobile1);
		if (respUser == null || respUser.equals(null) || respUser.equals("")) {
			return ResponseEntity.status(HttpStatus.CONFLICT).body(respUser);
		}

		return ResponseEntity.status(HttpStatus.OK).body(respUser);
	}

		@Transactional
	@PostMapping("/addNewUserEmail")
	public ResponseEntity<UserSessionDTO> addNewUserEmail(@RequestParam String emailId, @RequestParam String password,@RequestParam String name, @RequestParam String phoneNo)
			throws JSONException {

		if (emailId == null || emailId.isEmpty()) {
			String errorMsg = "Email cannot be null";
			return ResponseEntity.status(HttpStatus.NOT_FOUND).body(new UserSessionDTO(errorMsg));
		}
		if (password == null || password.isEmpty()) {
			String errorMsg = "Password cannot be null";
			return ResponseEntity.status(HttpStatus.NOT_FOUND).body(new UserSessionDTO(errorMsg));
		}
		if (name == null || name.isEmpty()) {
			String errorMsg = "Password cannot be null";
			return ResponseEntity.status(HttpStatus.NOT_FOUND).body(new UserSessionDTO(errorMsg));
		}
		if (phoneNo == null || phoneNo.isEmpty()) {
			String errorMsg = "Password cannot be null";
			return ResponseEntity.status(HttpStatus.NOT_FOUND).body(new UserSessionDTO(errorMsg));
		}
		UserSessionDTO rep=service.addNewUserEmail(emailId, password, name, phoneNo);
		return ResponseEntity.status(HttpStatus.OK).body(rep);
	}
	
	
    @PostMapping("/updateUser/{userId}")
    public ResponseEntity<String> updateUser(@RequestBody Users reqUser, @PathVariable String userId) {
        String updatedUserResp = service.updateUserDetails(userId, reqUser);
        if (updatedUserResp != null) {
            return ResponseEntity.ok(updatedUserResp);
        } else {
            String errorMessage = "User with ID " + userId + " not found.";
            return ResponseEntity.status(HttpStatus.NOT_FOUND).body(errorMessage);
        }
    }

	
	@PostMapping("/addNewAddress/{userId}")
    public ResponseEntity<Boolean> addNewAddress(
    		@PathVariable String userId,
            @RequestBody Address reqAdd) {
		Users existingUser = service.getUserWithId(userId);
		if(existingUser.getUserId().equalsIgnoreCase(userId)) {
			service.addNewAddress(userId, reqAdd);
			return ResponseEntity.status(HttpStatus.ACCEPTED).body(true);
		}
		return ResponseEntity.status(HttpStatus.NOT_FOUND).body(false);
	}
	
	@PostMapping("/updateAddress/{userId}")
    public ResponseEntity<Boolean> updateAddress(@PathVariable String userId,
            @RequestBody Address reqAddress) {
		Users existingUser = service.getUserWithId(userId);
		if(null!=existingUser) {
			service.updateExistingAddress(userId, reqAddress);
			return ResponseEntity.status(HttpStatus.ACCEPTED).body(true);
		}
		return ResponseEntity.status(HttpStatus.NOT_FOUND).body(false);
	}
	
	
	
//    @PostMapping("/deleteUser/{userId}")
//    public ResponseEntity<String> deleteUser(@PathVariable String userId) {
//        boolean deleted = service.deleteUser(userId);
//        if (deleted) {
//            String message = "User with ID " + userId + " deleted successfully.";
//            return ResponseEntity.ok(message);
//        } else {
//            String errorMessage = "User with ID " + userId + " not found.";
//            return ResponseEntity.status(HttpStatus.NOT_FOUND).body(errorMessage);
//        }
//    }
//    
   
    @GetMapping("/getAllUsersByName/{name}")
    public ResponseEntity<?> getAllUserByName(@PathVariable String name) {
        List<Users> users = service.getUsersByName(name);
        if (users.isEmpty()) {
            String errorMessage = "No users found with name: " + name;
            return ResponseEntity.status(HttpStatus.NOT_FOUND).body(errorMessage);
        }
        return ResponseEntity.ok(users);
    }
    
    
    @GetMapping("/getAllAddresses/{userId}")
    public ResponseEntity<List<Address>> getAllAddress(@PathVariable String userId) {
    	List<Address> address = service.getAllAddress(userId);
//        if (address.isEmpty()) {
//            return ResponseEntity.status(HttpStatus.NOT_FOUND).body(null);
//        }
        return ResponseEntity.ok(address);
    }
    
    
	@PostMapping("/addrChange/{userId}/{addrId}")
	public ResponseEntity<String> changeAddressType(@PathVariable String userId, @PathVariable String addrId) {
		if (null != userId && null != addrId) {
			String deleted = service.changeAddressType(userId, addrId);
			if (!deleted.isEmpty()) {
				String message = userId + "'s Address ID " + addrId + " changed successfully.";
				return ResponseEntity.ok(message);
			} else {
				String errorMessage = "User with ID " + userId + " not found.";
				return ResponseEntity.status(HttpStatus.NOT_FOUND).body(errorMessage);
			}
		}
		return ResponseEntity.status(HttpStatus.NOT_FOUND).body("User Id or AddrId is Invalid");
	}
	
	 @PostMapping("/deleteAddress")
	    public ResponseEntity<String> deleteUser( @RequestParam(name = "userId") String userId,
	            @RequestParam(name = "addrId") String addrId) {
	        String deleted = service.deleteAddress(userId, addrId);
	        if (deleted.contains("Deleted")) {
	            String message = "Address with ID " + addrId + " deleted successfully.";
	            return ResponseEntity.ok(message);
	        } else {
	            String errorMessage = "Address with ID " + addrId + " not found.";
	            return ResponseEntity.status(HttpStatus.NOT_FOUND).body(errorMessage);
	        }
	    }
	 
	@PostMapping("/loginUser")
public ResponseEntity<?> loginUser(@RequestBody LoginRequest request) {
    try {
        Users user = service.login(request.getEmail(), request.getPassword(), request.getUserType());
        return ResponseEntity.ok(user);
    } catch (RuntimeException e) {
        return ResponseEntity.status(401).body(e.getMessage());
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
	   
	   @PostMapping("/forgotPassword")
	    public ResponseEntity<String> forgotPassword(@RequestParam String email) {
	        service.forgotPassword(email);
	        return ResponseEntity.ok("Password reset instructions sent to email: " + email);
	    }
	   
	   @PostMapping("/resetPassword")
	    public ResponseEntity<String> resetPassword(@RequestParam String email,
	                                                @RequestParam String token,
	                                                @RequestParam String newPassword) {
	        boolean passwordResetSuccessful = service.verifyTokenAndResetPassword(email, token, newPassword);
	        if (passwordResetSuccessful) {
	            return ResponseEntity.ok("Password reset successfully for email: " + email);
	        } else {
	            return ResponseEntity.badRequest().body("Invalid email or token.");
	        }
	    }
	   
}
