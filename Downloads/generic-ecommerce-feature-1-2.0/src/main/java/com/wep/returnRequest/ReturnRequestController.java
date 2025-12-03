package com.wep.returnRequest;

import java.util.List;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.PutMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;


@RestController
@RequestMapping("/api/return-request")
public class ReturnRequestController {

    private final ReturnRequestApplicationService returnRequestService;
    
    @Autowired
    public ReturnRequestController(ReturnRequestApplicationService returnRequestService) {
		this.returnRequestService = returnRequestService;
	}
    
    @GetMapping("/all")
    public ResponseEntity<List<ReturnRequest>> getAllReturnRequests() {
        List<ReturnRequest> returnRequests = returnRequestService.getAllReturnRequests();
        return ResponseEntity.ok(returnRequests);
    }
    @PutMapping("/confirm/{returnRequestId}")
    public ResponseEntity<ReturnRequest> confirmReturnRequest(@PathVariable String returnRequestId) {
        ReturnRequest updatedReturnRequest = returnRequestService.confirmReturnRequest(returnRequestId);
        return ResponseEntity.ok(updatedReturnRequest);
    }

	@PostMapping("/{orderId}")
    public ResponseEntity<ReturnRequest> createReturnRequest(@PathVariable Long orderId, @RequestBody ReturnRequestDTO returnRequestDTO) {
        ReturnRequest returnRequest = returnRequestService.createReturnRequest(orderId, returnRequestDTO);
        return ResponseEntity.ok(returnRequest);
    }
}
