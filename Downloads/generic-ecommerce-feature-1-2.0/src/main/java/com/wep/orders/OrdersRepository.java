package com.wep.orders;

import java.util.List;

import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;



@Repository
public interface OrdersRepository extends JpaRepository<Orders, Long> {

	@Query("SELECT o FROM Orders o WHERE userId = :userId")
	List<Orders> findOrdersByUserId(@Param("userId") String userId);

	@Query("SELECT o FROM Orders o WHERE userId = :userId AND billNo =:billNo")
	List<Orders> findOrdersByUserIdAndBillID(@Param("userId") String userId, @Param("billNo") String billNo);
}