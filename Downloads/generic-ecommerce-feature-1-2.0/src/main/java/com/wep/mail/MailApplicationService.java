package com.wep.mail;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.mail.SimpleMailMessage;
import org.springframework.mail.javamail.JavaMailSender;
import org.springframework.stereotype.Service;

@Service
public class MailApplicationService {

	@Autowired
	private JavaMailSender javaMailSender;

	public void buildEmailBody(CustomMailStructure customMailStructure) {
		// Customize the email body as needed, including the additional information
		SimpleMailMessage message = new SimpleMailMessage();
		String messgeToAdmin = "Dear Rushabh,\n\n" + "You have received the following order from:-\n\n" + "User ID: "
				+ customMailStructure.getUserId() + "\n" + "Order ID: " + customMailStructure.getOrderId() + "\n\n"
				+ "Best regards,\nRushabh Novelty";
		message.setTo("itjainam@gmail.com");
		message.setSubject("Order Received from Mobile App");
		message.setText(messgeToAdmin);
		javaMailSender.send(message);
	}
}
