package com.wep.mail;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.stereotype.Controller;
import org.springframework.ui.Model;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RestController;

@RestController
public class MailController {
	@Autowired
	private MailApplicationService mailService;

	@GetMapping("/sendEmailForm")
	public String showForm(Model model) {
		model.addAttribute("email", new MailStructure());
		return "sendEmailForm";
	}

	@PostMapping("/sendEmail")
    public ResponseEntity<String> sendEmail(@RequestBody CustomMailStructure customMailStructure) {
        // You can perform validation or additional processing here
         mailService.buildEmailBody(customMailStructure);
        return ResponseEntity.ok("Mail Send Successfully");
    }
	
	
}
