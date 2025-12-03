package com.wep.auditusers;

import java.util.List;

import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;

@Repository
public interface AuditUsersRepository extends JpaRepository<AuditUsers, String> {

	

	@Query("SELECT u FROM AuditUsers u WHERE u.active = :active")
	AuditUsers findAuditUserstatus(@Param("active") int active);
	
	@Query("SELECT MAX(userId) FROM AuditUsers u")
	String findLatestUserQuery();
	
	@Query("SELECT u FROM AuditUsers u WHERE u.parName LIKE %:parName%")
	List<AuditUsers> findUserByName(@Param("parName") String parName);

	@Query("SELECT u FROM AuditUsers u WHERE u.userId = :userId")
	AuditUsers findUserById(@Param("userId") String userId);

	
	@Query("SELECT u FROM AuditUsers u WHERE u.mobile1 = :mobile1")
	AuditUsers findUserByMobile1(@Param("mobile1") String mobile1);
	
	@Query("SELECT u FROM AuditUsers u WHERE u.email = :email AND u.otpToken = :otpToken")
	AuditUsers findUserByEmail(@Param("email") String email, @Param("otpToken") String otpToken);

}