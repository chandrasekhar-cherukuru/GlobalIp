package com.wep.users;

import java.time.LocalDateTime;
import java.util.List;

import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Modifying;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;

@Repository
public interface UsersRepository extends JpaRepository<Users, String> {

    List<Users> findByForgotPasswordTokenNotNullAndCreatedTimeBefore(LocalDateTime time);

    @Query("SELECT u FROM Users u WHERE u.active = :active")
    Users findUserStatus(@Param("active") int active);

    @Query("SELECT MAX(userId) FROM Users u")
    String findLatestUserQuery();

    @Query("SELECT u FROM Users u WHERE u.parName LIKE %:parName%")
    List<Users> findUserByName(@Param("parName") String parName);

    @Query("SELECT u FROM Users u WHERE u.userId = :userId")
    Users findUserById(@Param("userId") String userId);

    @Query("SELECT u FROM Users u WHERE u.mobile1 = :mobile1")
    Users findUserByMobile1(@Param("mobile1") String mobile1);

    @Query("SELECT u FROM Users u WHERE u.mobile1 = :mobile1 AND u.active = 0")
    Users findUserByMobileAndActive(@Param("mobile1") String mobile1);

    @Query("SELECT u FROM Users u WHERE u.email = :email")
    Users findUserByEmail(@Param("email") String email);

    @Query("SELECT u FROM Users u WHERE u.email = :email AND u.password = :password AND u.acType = 'ADMIN'")
    Users findUserByEmailAdmin(@Param("email") String email, @Param("password") String password);

    // Generalized login query for any userType
    @Query("SELECT u FROM Users u WHERE u.email = :email AND u.password = :password AND LOWER(u.acType) = LOWER(:userType)")
    Users findUserByEmailAndType(@Param("email") String email, @Param("password") String password, @Param("userType") String userType);

    @Modifying
    @Query("UPDATE Users u SET u.address1=:address1 WHERE u.userId = :userId AND u.address1 LIKE '1@%'")
    void updateAddress1(@Param("address1") String address1, @Param("userId") String userId);

    @Modifying
    @Query("UPDATE Users u SET u.address2=:address2 WHERE u.userId = :userId AND u.address2 LIKE '2@%'")
    void updateAddress2(@Param("address2") String address2, @Param("userId") String userId);

    @Modifying
    @Query("UPDATE Users u SET u.address3=:address3 WHERE u.userId = :userId AND u.address3 LIKE '3@%'")
    void updateAddress3(@Param("address3") String address3, @Param("userId") String userId);

    Users findByEmail(String email);

	@Query("SELECT u FROM Users u WHERE TRIM(u.email) = TRIM(:email) AND TRIM(u.password) = TRIM(:password) AND LOWER(u.acType) = LOWER(:userType)")
    Users findByEmailAndPassword(@Param("email") String email, @Param("password") String password, @Param("userType") String userType);

}
