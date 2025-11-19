package com.wep.users;

import java.time.LocalDateTime;
import java.util.ArrayList;
import java.util.List;
import java.util.Random;
import java.util.UUID;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.mail.javamail.JavaMailSender;
import org.springframework.mail.javamail.MimeMessageHelper;
import org.springframework.scheduling.annotation.Scheduled;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import jakarta.mail.MessagingException;
import jakarta.mail.internet.MimeMessage;

@Service
public class UsersApplicationService {

	@Autowired
	private final UsersRepository rep;

	@Autowired
	private JavaMailSender javaMailSender;

	public UsersApplicationService(UsersRepository rep) {
		this.rep = rep;
	}

	public Users getUserWithId(String userId) {
		return rep.findUserById(userId);
	}

	public List<Users> getUsersByName(String name) {
		return rep.findUserByName(name);
	}

	public List<Users> getAllUser() {
		return rep.findAll();
	}

	@Transactional
	public UserSessionDTO addNewUser(String countryCode, String mobileNumber) {
		Users existingUser = rep.findUserByMobileAndActive(mobileNumber);
		String newOtpToken = generateRandomOtp();
		if (existingUser != null) {
			existingUser.setOtpToken(newOtpToken);
			existingUser.setMobile1(mobileNumber);
			String countryCodeWithPlus = "+" + countryCode.trim();
			existingUser.setCountryCode(countryCodeWithPlus);
			rep.save(existingUser);
			return new UserSessionDTO(existingUser.getUserId(), newOtpToken, countryCodeWithPlus, mobileNumber,
					existingUser.getParName(), existingUser.getEmail());
		} else {
			Users newUser = new Users(newOtpToken);
			newUser.setMobile1(mobileNumber);
			newUser.setOtpToken(newOtpToken);
			String countryCodeWithPlus = "+" + countryCode.trim();
			newUser.setCountryCode(countryCodeWithPlus);
			rep.save(newUser);
			return new UserSessionDTO(newUser.getUserId(), newOtpToken, countryCodeWithPlus, mobileNumber, null, null);
		}
	}

	// ⭐⭐⭐ FIXED METHOD - THIS IS THE IMPORTANT CHANGE ⭐⭐⭐
	@Transactional
	public UserSessionDTO addNewUserEmail(String emailId, String password, String name, String phoneNo) {
		// Check if the user with the requested email exists
		Users existingUser = rep.findUserByEmail(emailId);
		if (existingUser != null) {
			return new UserSessionDTO("User Already Registered with given Email.");
		} else {
			Users newUser = new Users();
			newUser.setEmail(emailId);
			newUser.setPassword(password);
			newUser.setParName(name);
			newUser.setMobile1(phoneNo);
			newUser.setAcType("CUSTOMER");              // ⭐ FIXED: Changed from "USER" to "CUSTOMER"
			newUser.setActive(1);                       // ⭐ ADDED: Set user as active
			newUser.setCompCode(1L);                    // ⭐ ADDED: Set company code
			newUser.setCreatedTime(LocalDateTime.now());
			newUser.setCreatedBy("ADMIN");
			rep.save(newUser);

			String userId = newUser.getUserId();
			String emailIdToShow = newUser.getEmail();
			String pass = newUser.getPassword();
			return new UserSessionDTO(userId, emailIdToShow, pass, "");
		}
	}
	// ⭐⭐⭐ END OF FIX ⭐⭐⭐

	private String generateRandomOtp() {
		Random random = new Random();
		int otp = random.nextInt(9000) + 1000;
		return String.format("%04d", otp);
	}

	public String addNewAddress(String userId, Address requestAddress) {
		Users existingUser = rep.findUserById(userId);
		if (existingUser.getAddress1() == null || existingUser.getAddress2() == null
				|| existingUser.getAddress3() == null) {
			String add1d = requestAddress.getAddrId();
			if (existingUser.getAddress1() == null && add1d.equals("1")) {
				existingUser.setAddress1(requestAddress.toString());
				rep.save(existingUser);
				return "Address 1 Saved Succesfully";
			}
			if (existingUser.getAddress2() == null && add1d.equals("2")) {
				if (existingUser.getAddress1() != null) {
					Address a1 = new Address(existingUser.getAddress1());
					if (a1.getAddrType().equalsIgnoreCase("P")) {
						requestAddress.setAddrType("S");
					}
				}
				if (existingUser.getAddress3() != null) {
					Address a3 = new Address(existingUser.getAddress3());
					if (a3.getAddrType().equalsIgnoreCase("P")) {
						requestAddress.setAddrType("S");
					}
				}
				existingUser.setAddress2(requestAddress.toString());
				rep.save(existingUser);
				return "Address 2 Saved Succesfully";
			}
			if (existingUser.getAddress3() == null && add1d.equals("3")) {
				if (existingUser.getAddress1() != null) {
					Address a1 = new Address(existingUser.getAddress1());
					if (a1.getAddrType().equalsIgnoreCase("P")) {
						requestAddress.setAddrType("S");
					}
				}
				if (existingUser.getAddress2() != null) {
					Address a2 = new Address(existingUser.getAddress2());
					if (a2.getAddrType().equalsIgnoreCase("P")) {
						requestAddress.setAddrType("S");
					}
				}
				existingUser.setAddress3(requestAddress.toString());
				rep.save(existingUser);
				return "Address 3 Saved Succesfully";
			}
		}
		return "Address Addition Failed";
	}

	public String updateExistingAddress(String userId, Address requestAddress) {
		Users existingUser = rep.findUserById(userId);
		if (existingUser.getAddress1() != null || existingUser.getAddress2() != null
				|| existingUser.getAddress3() != null) {
			String[] reqAddressArray = splitStringIntoEight(requestAddress.toString(), "@");

			String[] existingAddress1Array = {};
			if (existingUser.getAddress1() != null) {
				existingAddress1Array = splitStringIntoEight(existingUser.getAddress1().toString(), "@");
			}
			String[] existingAddress2Array = {};
			if (existingUser.getAddress2() != null) {
				existingAddress2Array = splitStringIntoEight(existingUser.getAddress2().toString(), "@");
			}
			String[] existingAddress3Array = {};
			if (existingUser.getAddress3() != null) {
				existingAddress3Array = splitStringIntoEight(existingUser.getAddress3().toString(), "@");
			}

			if (existingUser.getAddress1() != null && existingAddress1Array[0].equals(reqAddressArray[0])) {
				existingAddress1Array[0] = reqAddressArray[0];
				existingAddress1Array[1] = reqAddressArray[1];
				existingAddress1Array[2] = reqAddressArray[2];
				existingAddress1Array[3] = reqAddressArray[3];
				existingAddress1Array[4] = reqAddressArray[4];
				existingAddress1Array[5] = reqAddressArray[5];
				existingAddress1Array[6] = reqAddressArray[6];
				existingAddress1Array[7] = reqAddressArray[7];
				existingAddress1Array[8] = reqAddressArray[8];
				existingAddress1Array[9] = reqAddressArray[9];
				existingAddress1Array[10] = existingAddress1Array[10];
				existingAddress1Array[11] = reqAddressArray[11];
				String reqTobeMerge = mergeStrings(existingAddress1Array, "@");
				existingUser.setAddress1(reqTobeMerge);
				rep.save(existingUser);
				return "Address 1 Updated Succesfully";
			}
			if (existingUser.getAddress2() != null && existingAddress2Array[0].equals(reqAddressArray[0])) {
				existingAddress2Array[0] = reqAddressArray[0];
				existingAddress2Array[1] = reqAddressArray[1];
				existingAddress2Array[2] = reqAddressArray[2];
				existingAddress2Array[3] = reqAddressArray[3];
				existingAddress2Array[4] = reqAddressArray[4];
				existingAddress2Array[5] = reqAddressArray[5];
				existingAddress2Array[6] = reqAddressArray[6];
				existingAddress2Array[7] = reqAddressArray[7];
				existingAddress2Array[8] = reqAddressArray[8];
				existingAddress2Array[9] = reqAddressArray[9];
				existingAddress2Array[10] = existingAddress2Array[10];
				existingAddress2Array[11] = reqAddressArray[11];
				String reqTobeMerge = mergeStrings(existingAddress2Array, "@");
				existingUser.setAddress2(reqTobeMerge);
				rep.save(existingUser);
				return "Address 2 Updated Succesfully";
			}
			if (existingUser.getAddress3() != null && existingAddress3Array[0].equals(reqAddressArray[0])) {
				existingAddress3Array[0] = reqAddressArray[0];
				existingAddress3Array[1] = reqAddressArray[1];
				existingAddress3Array[2] = reqAddressArray[2];
				existingAddress3Array[3] = reqAddressArray[3];
				existingAddress3Array[4] = reqAddressArray[4];
				existingAddress3Array[5] = reqAddressArray[5];
				existingAddress3Array[6] = reqAddressArray[6];
				existingAddress3Array[7] = reqAddressArray[7];
				existingAddress3Array[8] = reqAddressArray[8];
				existingAddress3Array[9] = reqAddressArray[9];
				existingAddress3Array[10] = existingAddress3Array[10];
				existingAddress3Array[11] = reqAddressArray[11];
				String reqTobeMerge = mergeStrings(existingAddress3Array, "@");
				existingUser.setAddress3(reqTobeMerge);
				rep.save(existingUser);
				return "Address 3 Updated Succesfully";
			}
		}
		return "Address Updating Failed";
	}

	public static String mergeStrings(String[] strings, String separator) {
		if (strings == null || strings.length == 0) {
			return "";
		}
		StringBuilder merged = new StringBuilder(strings[0]);
		for (int i = 1; i < strings.length; i++) {
			merged.append(separator).append(strings[i]);
		}
		return merged.toString();
	}

	public static String[] splitStringIntoEight(String input, String delimiter) {
		if (input == null || input.isEmpty()) {
			return null;
		}
		String[] splitStrings = input.split(delimiter, 12);
		return splitStrings;
	}

	public String updateUserDetails(String userId, Users requestedUser) {
		Users existingUser = getUserWithId(userId);
		if (null != existingUser) {
			existingUser.setParName(requestedUser.getParName() != null ? requestedUser.getParName() : existingUser.getParName());
			existingUser.setEmail(requestedUser.getEmail() != null ? requestedUser.getEmail() : existingUser.getEmail());
			existingUser.setMobile1(requestedUser.getMobile1() != null ? requestedUser.getMobile1() : existingUser.getMobile1());
			existingUser.setMobile2(requestedUser.getMobile2() != null ? requestedUser.getMobile2() : existingUser.getMobile2());
			existingUser.setPan(requestedUser.getPan() != null ? requestedUser.getPan() : existingUser.getPan());
			existingUser.setCountryCode(requestedUser.getCountryCode() != null ? requestedUser.getCountryCode() : existingUser.getCountryCode());
			existingUser.setModifiedTime(LocalDateTime.now());
			existingUser.setModifiedBy("ADMIN");
			existingUser.setActive(requestedUser.getActive());
			rep.save(existingUser);
			return "User Data Updated Successfully";
		}
		return "User Data Updation Failed";
	}

	public List<Address> getAllAddress(String userId) {
		Users u = rep.findById(userId).orElse(null);
		List<Address> addresses = new ArrayList<>();
		if (u != null) {
			if (u.getAddress1() != null) {
				addresses.add(new Address(u.getAddress1()));
			}
			if (u.getAddress2() != null) {
				addresses.add(new Address(u.getAddress2()));
			}
			if (u.getAddress3() != null) {
				addresses.add(new Address(u.getAddress3()));
			}
		}
		return addresses;
	}

	public String changeAddressType(String userId, String addrId) {
		String primaryAddrID = "";
		Users u = rep.findById(userId).orElse(null);
		List<Address> listAddress = getAllAddress(userId);
		if (null != u) {
			for (Address address : listAddress) {
				if (address.getAddrId().equalsIgnoreCase(addrId)) {
					address.setAddrType("P");
					primaryAddrID = addrId;
				}
			}
		}
		saveAddressSecondary(u, listAddress);
		saveAddress(u, primaryAddrID, listAddress);
		return "Address Changed Successfully";
	}

	private void saveAddressSecondary(Users u, List<Address> listAddress) {
		for (Address address : listAddress) {
			if (address.getAddrId().equalsIgnoreCase("1")) {
				String[] reqAddressArray = splitStringIntoEight(address.toString(), "@");
				reqAddressArray[10] = "S";
				String reqTobeMerge = mergeStrings(reqAddressArray, "@");
				u.setAddress1(reqTobeMerge);
				rep.save(u);
			}
			if (address.getAddrId().equalsIgnoreCase("2")) {
				String[] reqAddressArray = splitStringIntoEight(address.toString(), "@");
				reqAddressArray[10] = "S";
				String reqTobeMerge = mergeStrings(reqAddressArray, "@");
				u.setAddress2(reqTobeMerge);
				rep.save(u);
			}
			if (address.getAddrId().equalsIgnoreCase("3")) {
				String[] reqAddressArray = splitStringIntoEight(address.toString(), "@");
				reqAddressArray[10] = "S";
				String reqTobeMerge = mergeStrings(reqAddressArray, "@");
				u.setAddress3(reqTobeMerge);
				rep.save(u);
			}
		}
	}

	public void saveAddress(Users u, String primaryAddrID, List<Address> listAddress) {
		switch (primaryAddrID) {
			case "1": {
				String[] reqAddressArray = splitStringIntoEight(listAddress.get(0).toString(), "@");
				String reqTobeMerge = mergeStrings(reqAddressArray, "@");
				u.setAddress1(reqTobeMerge);
				rep.save(u);
			}
			break;
			case "2": {
				String[] reqAddressArray = splitStringIntoEight(listAddress.get(1).toString(), "@");
				String reqTobeMerge = mergeStrings(reqAddressArray, "@");
				u.setAddress2(reqTobeMerge);
				rep.save(u);
			}
			break;
			case "3": {
				String[] reqAddressArray = splitStringIntoEight(listAddress.get(2).toString(), "@");
				String reqTobeMerge = mergeStrings(reqAddressArray, "@");
				u.setAddress3(reqTobeMerge);
				rep.save(u);
			}
			break;
			default:
				System.out.print("Wrong value");
		}
	}

	public Address getPrimaryAddress(String userId) {
		Users u = rep.findById(userId).orElse(null);
		if (u != null) {
			List<Address> listAddress = getAllAddress(userId);
			for (Address address : listAddress) {
				if ("P".equalsIgnoreCase(address.getAddrType())) {
					return address;
				}
			}
		}
		return null;
	}

	public String getPrimaryStringAddress(String userId) {
		Users u = rep.findById(userId).orElse(null);
		if (u != null) {
			List<Address> listAddress = getAllAddress(userId);
			for (Address address : listAddress) {
				if ("P".equalsIgnoreCase(address.getAddrType())) {
					return address.toString();
				}
			}
		}
		return null;
	}

	@Transactional
	public String deleteAddress(String userId, String addrId) {
		List<Address> listAddress = getAllAddress(userId);
		if (listAddress == null) {
			throw new IllegalArgumentException("Address not found");
		}
		for (Address address : listAddress) {
			if (address.getAddrId().equalsIgnoreCase(addrId)) {
				String tobeDeletedAddrId = address.getAddrId();
				Users u = getUserWithId(userId);
				if (tobeDeletedAddrId.equalsIgnoreCase("1")) {
					u.setAddress1(null);
					rep.save(u);
					return "Address 1 Deleted";
				}
				if (tobeDeletedAddrId.equalsIgnoreCase("2")) {
					u.setAddress2(null);
					rep.save(u);
					return "Address 2 Deleted";
				}
				if (tobeDeletedAddrId.equalsIgnoreCase("3")) {
					u.setAddress3(null);
					rep.save(u);
					return "Address 3 Deleted";
				}
			}
		}
		return "Something is wrong!!";
	}

	public void forgotPassword(String email) {
		Users user = rep.findByEmail(email);
		if (user != null) {
			String token = generateToken();
			user.setForgotPasswordToken(token);
			rep.save(user);
			sendResetPasswordEmail(user.getEmail(), token);
		}
	}

	public boolean verifyTokenAndResetPassword(String email, String token, String newPassword) {
		Users user = rep.findByEmail(email);
		if (user != null && user.getForgotPasswordToken() != null && user.getForgotPasswordToken().equals(token)) {
			user.setPassword(newPassword);
			user.setForgotPasswordToken(null);
			rep.save(user);
			return true;
		}
		return false;
	}

	private String generateToken() {
		return UUID.randomUUID().toString();
	}

	private void sendResetPasswordEmail(String email, String token) {
		try {
			MimeMessage message = javaMailSender.createMimeMessage();
			MimeMessageHelper helper = new MimeMessageHelper(message, true);
			helper.setTo(email);
			helper.setSubject("Password Reset Instructions");
			helper.setText("Dear User,\n\n"
					+ "Please click on the following link to reset your password: http://localhost:3000/reset?token=" + token);
			javaMailSender.send(message);
		} catch (MessagingException e) {
			e.printStackTrace();
		}
	}

	@Scheduled(fixedDelay = 30 * 60 * 1000)
	public void nullifyExpiredOtpTokens() {
		LocalDateTime thirtyMinutesAgo = LocalDateTime.now().minusMinutes(30);
		List<Users> usersWithExpiredOtp = rep.findByForgotPasswordTokenNotNullAndCreatedTimeBefore(thirtyMinutesAgo);
		usersWithExpiredOtp.forEach(user -> {
			user.setOtpToken(null);
			rep.save(user);
		});
	}

	@Transactional
	public Users login(String email, String password, String userType) {
		Users user = rep.findUserByEmailAndType(email, password, userType);
		if (user == null) {
			throw new RuntimeException("Invalid credentials");
		}
		return user;
	}

	@Transactional
	public boolean deactivateUser(String userId) {
		Users userToDelete = rep.findUserById(userId);
		System.out.println(userToDelete);
		if (userToDelete == null) {
			throw new IllegalArgumentException("User not found");
		}
		userToDelete.setActive(0);  // Changed to 0 for deactivate
		rep.save(userToDelete);
		return true;
	}
}
