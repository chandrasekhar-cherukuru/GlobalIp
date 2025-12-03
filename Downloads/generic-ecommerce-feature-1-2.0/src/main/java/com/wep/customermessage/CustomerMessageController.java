package com.wep.customermessage;

import java.util.List;

import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;
import org.springframework.web.server.ResponseStatusException;

@RestController
@CrossOrigin(maxAge = 3600)
@RequestMapping("/customerMessage")
public class CustomerMessageController {

    private final CustomerMessageApplicationService service;

    public CustomerMessageController(CustomerMessageApplicationService service) {
        this.service = service;
    }

    @GetMapping("/{messageId}")
    public CustomerMessage getProductById(@PathVariable Long messageId) {
        return service.getMessageByID(messageId);
    }

    @GetMapping("/allMessageList")
    public List<CustomerMessage> getAllMessages() {
        return service.getAllMessages();
    }

    @GetMapping("/searchByName")
    public List<CustomerMessage> findByCustomerContainingIgnoreCase(@RequestParam String name) {
        return service.findByNameContainingIgnoreCase(name);
    }

    @PostMapping("/add")
    public ResponseEntity<CustomerMessage> addNewMessage(@RequestBody CustomerMessage request) {
        try {
            CustomerMessage custMessage = service.addNewMessage(
                    request.getUserID(),
                    request.getCustomerName(),
                    request.getCustomerNo(),
                    request.getMessageReason(),
                    request.getCustomerMessage()
            );
            return ResponseEntity.status(HttpStatus.CREATED).body(custMessage);
        } catch (IllegalArgumentException e) {
            throw new ResponseStatusException(HttpStatus.BAD_REQUEST, "Message is invalid", e);
        } catch (Exception e) {
            throw new ResponseStatusException(HttpStatus.INTERNAL_SERVER_ERROR, "An error occurred while processing the request", e);
        }
    }

    @PostMapping("/deleteMessage/{messageId}")
    public ResponseEntity<String> deleteMessage(@PathVariable Long messageId) {
        boolean deleted = service.deleteMessage(messageId);
        if (deleted) {
            String message = "Message with ID " + messageId + " deleted successfully.";
            return ResponseEntity.ok(message);
        } else {
            String errorMessage = "Message with ID " + messageId + " not found.";
            return ResponseEntity.status(HttpStatus.NOT_FOUND).body(errorMessage);
        }
    }
}
