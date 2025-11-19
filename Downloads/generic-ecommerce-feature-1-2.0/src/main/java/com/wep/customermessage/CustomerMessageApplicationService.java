package com.wep.customermessage;

import java.time.LocalDateTime;
import java.util.List;
import java.util.regex.Matcher;
import java.util.regex.Pattern;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import com.wep.users.Users;
import com.wep.users.UsersRepository;

@Service
public class CustomerMessageApplicationService {

    @Autowired
    private final CustomerMessageRepository rep;
    @Autowired
    private final UsersRepository userrep;

    public CustomerMessageApplicationService(CustomerMessageRepository rep, UsersRepository userrep) {
        this.rep = rep;
        this.userrep = userrep;
    }

    public List<CustomerMessage> getAllMessages() {
        return rep.getAllMessages();
    }

    public CustomerMessage getMessageByID(Long messageId) {
        return rep.findById(messageId).orElse(null);
    }

    public List<CustomerMessage> findByNameContainingIgnoreCase(String name) {
        return rep.findByNameContainingIgnoreCase(name);
    }

    public String getUsersName(String userId) {
        String userName = "";
        Users user = userrep.findUserById(userId);
        if (null != user) {
            userName = user.getParName();
            if (userName == null) {
                return userId;
            }
        }
        return userName;
    }

    @Transactional
    public CustomerMessage addNewMessage(String userId, String name, String phoneNo, String messageReason, String reqMessage) {
        if (!isMessageValid(reqMessage)) {
            throw new IllegalArgumentException("Message is invalid");
        }
        CustomerMessage custMessage = new CustomerMessage();
        custMessage.setCustomerName(getUsersName(userId));
        custMessage.setUserID(userId);
        custMessage.setCustomerName(name);
        custMessage.setCustomerNo(phoneNo);
        custMessage.setMessageReason(messageReason);
        custMessage.setCustomerMessage(reqMessage);
        custMessage.setMessageDateTime(LocalDateTime.now());
        rep.save(custMessage);
        return custMessage;
    }

    @Transactional
    public boolean deleteMessage(Long messageId) {
        CustomerMessage msg = rep.findById(messageId).orElse(null);
        if (msg == null) {
            throw new IllegalArgumentException("Message not found");
        }
        rep.deleteById(messageId);
        return true;
    }

    private boolean isMessageValid(String message) {
        return message != null && !containsSpecialCharacter(message) && message.length() <= 50;
    }

    private boolean containsSpecialCharacter(String message) {
        if (message == null) {
            return false;
        }
        String specialCharPattern = "[!@#$%^&*()_+\\-\\[\\]{};:'\"\\\\|<>/]";
        Pattern pattern = Pattern.compile(specialCharPattern);
        Matcher matcher = pattern.matcher(message);
        return matcher.find();
    }
}
