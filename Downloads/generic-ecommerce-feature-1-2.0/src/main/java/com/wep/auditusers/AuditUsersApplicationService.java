package com.wep.auditusers;

import java.util.ArrayList;
import java.util.List;
import java.util.Random;

import org.modelmapper.ModelMapper;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import com.wep.orders.OrderStatus;
import com.wep.orders.Orders;
import com.wep.orders.OrdersRepository;


@Service
public class AuditUsersApplicationService {

	@Autowired
	private final AuditUsersRepository rep;
	@Autowired
	private final ModelMapper modelMapper;
	@Autowired
	private final OrdersRepository orderRep;
	

	public AuditUsersApplicationService(AuditUsersRepository rep, ModelMapper modelMapper, OrdersRepository orderRep) {
		this.rep = rep;
		this.modelMapper=modelMapper;
		this.orderRep=orderRep;
	}


	public AuditUsers getUserWithId(String userId) {
		return rep.findUserById(userId);
	}
	
	
	public List<AuditUsers> getAuditUsersByName(String name) {
		return rep.findUserByName(name);
		
	}

	public List<AuditUsers> getAllUser() {
		return rep.findAll();
	}

	public AuditUsers getUserWithMobile(String mobile) {
		return rep.findUserByMobile1(mobile);
	}
	
	@Transactional
	public boolean deleteUser(String userId) {
		// Check if the user with the specified userId exists
		AuditUsers userToDelete = rep.findUserById(userId);
		if (userToDelete == null) {
			throw new IllegalArgumentException("User not found");

		}
		// If the user exists, proceed with deletion
		rep.delete(userToDelete);
		List<Orders> userOrders = orderRep.findOrdersByUserId(userId);
		userOrders.forEach(indiOrder -> indiOrder.setOrderStatus(OrderStatus.CANCELED)); //status?
		if (orderRep != null) {
			orderRep.saveAll(userOrders);
		}
		return true;
	}
	
	@Transactional
	public boolean deactivateUser(String userId) {
		// Check if the user with the specified userId exists
		AuditUsers userToDelete = rep.findUserById(userId);
		if (userToDelete == null) {
			throw new IllegalArgumentException("User not found");

		}
		// If the user exists, proceed with deletion
		userToDelete.setActive(1);
		return true;
	}
	
	
	
}
