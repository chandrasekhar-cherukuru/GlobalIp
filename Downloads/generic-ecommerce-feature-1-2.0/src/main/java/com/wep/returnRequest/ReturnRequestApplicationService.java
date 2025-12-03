package com.wep.returnRequest;

import java.util.Date;
import java.util.List;

import org.springframework.beans.factory.annotation.Autowired;

import com.wep.orders.OrdersRepository;
import org.springframework.stereotype.Service;
import com.wep.orders.Orders;

@Service
public class ReturnRequestApplicationService {
	 @Autowired
	    private ReturnRequestRepository returnRequestRepository;

	    @Autowired
	    private OrdersRepository ordersRepository;
	    
	    
	    public List<ReturnRequest> getAllReturnRequests() {
	        return returnRequestRepository.findAll();
	    }

	    public ReturnRequest createReturnRequest(Long orderId, ReturnRequestDTO returnRequestDTO) {
	        Orders order = ordersRepository.findById(orderId)
	                .orElseThrow(() -> new RuntimeException("Order not found"));

	        ReturnRequest returnRequest = new ReturnRequest();
	        returnRequest.setId(generateUniqueId()); // Implement this method to generate a unique ID
	        returnRequest.setOrder(order);
	        returnRequest.setReturnReason(returnRequestDTO.getReason());
	        returnRequest.setComment(returnRequestDTO.getComment());
	        returnRequest.setAccountNumber(returnRequestDTO.getAccountNumber());
	        returnRequest.setAccountHolderName(returnRequestDTO.getAccountHolderName());
	        returnRequest.setBankName(returnRequestDTO.getBankName());
	        returnRequest.setIfscCode(returnRequestDTO.getIfscCode());
	        returnRequest.setReturnInitiateDate(new Date());
	        returnRequest.setRefundInitiated(true); 
	        returnRequest.setRefundConfirmed(false); 
	        returnRequest.setStatus("Return Requested");

	        returnRequestRepository.save(returnRequest);
	        return returnRequest;
	    }

	    private String generateUniqueId() {
	        // Implement your unique ID generation logic here
	        return java.util.UUID.randomUUID().toString();
	    }
	    
	    public ReturnRequest confirmReturnRequest(String returnRequestId) {
	        ReturnRequest returnRequest = returnRequestRepository.findById(returnRequestId)
	                .orElseThrow(() -> new RuntimeException("Return request not found"));

	        returnRequest.setReturnConfirmDate(new Date());
	        returnRequest.setRefundConfirmed(true);
	        returnRequest.setStatus("Return Confirmed");

	        return returnRequestRepository.save(returnRequest);
	    }
}
