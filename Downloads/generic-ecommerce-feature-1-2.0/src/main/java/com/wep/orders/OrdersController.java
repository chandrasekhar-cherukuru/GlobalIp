package com.wep.orders;

import java.util.Date;
import java.util.List;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.PageRequest;
import org.springframework.data.domain.Pageable;
import org.springframework.format.annotation.DateTimeFormat;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;


@RestController
@CrossOrigin(maxAge = 3600)
@RequestMapping("/orders")
public class OrdersController {

	@Autowired
	private final OrdersApplicationService ordersService;

    public OrdersController(OrdersApplicationService ordersService) {
        this.ordersService = ordersService;
    }

    @GetMapping("/allOrdersList")
    public Page<Orders> getAllOrders(@RequestParam(defaultValue = "0") int page,
                                     @RequestParam(defaultValue = "10") int size) {
        Pageable pageable = PageRequest.of(page, size);
        return ordersService.getAllOrders(pageable);
    }

    @GetMapping("/{orderId}")
    public ResponseEntity<Orders> getOrderByID(@PathVariable Long orderId) {
        Orders order = ordersService.getOrderByID(orderId);
        if (order != null) {
            return ResponseEntity.ok(order);
        } else {
            return ResponseEntity.notFound().build();
        }
    }

    
    @GetMapping("/summary")
    public ResponseEntity<List<Bill>> getOrderSummaryByID(@RequestParam String userId) {
    	List<Bill> order = ordersService.mapOrdersList(userId);
        if (order != null) {
            return ResponseEntity.ok(order);
        } else {
            return ResponseEntity.notFound().build();
        }
    }
    
    
    @GetMapping("/summaryAll")
    public ResponseEntity<Page<Bill>> getOrderSummary(
            @RequestParam(defaultValue = "0") int page,
            @RequestParam(defaultValue = "10") int size) {
        Page<Bill> orderPage = ordersService.mapOrdersListForAllProducts(page, size);

        if (orderPage.hasContent()) {
            return ResponseEntity.ok(orderPage);
        } else {
            return ResponseEntity.notFound().build();
        }
    }
    
    @PutMapping("/status/{orderId}")
    public ResponseEntity<String> updateOrderStatus(@PathVariable Long orderId, @RequestParam String newStatus) {
        boolean isSuccess = ordersService.updateOrderStatus(orderId, newStatus);
        if (isSuccess) {
            return ResponseEntity.ok("Order status updated successfully.");
        } else {
            return ResponseEntity.status(HttpStatus.BAD_REQUEST).body("Failed to update order status. Invalid status or order ID.");
        }
    }
    
    @PutMapping("/payment-status/{orderId}")
    public ResponseEntity<String> updatePaymentStatus(@PathVariable Long orderId, @RequestParam String newStatus) {
        boolean isSuccess = ordersService.updatePaymentStatus(orderId, newStatus);
        if (isSuccess) {
            return ResponseEntity.ok("payment status updated successfully.");
        } else {
            return ResponseEntity.status(HttpStatus.BAD_REQUEST).body("Failed to update payment status. Invalid status or order ID.");
        }
    }
    
    @PostMapping("/changeDelStatus")
    public ResponseEntity<String> changeDelStatus(
            @RequestParam String userId,
            @RequestParam String billNo,
            @RequestParam OrderStatus status) {
        String orderstatus = ordersService.changeDelStatus(userId, billNo, status);
        if (!orderstatus.isEmpty()) {
            return ResponseEntity.ok(orderstatus);
        } else {
            return ResponseEntity.notFound().build();
        }
    }
    
}
