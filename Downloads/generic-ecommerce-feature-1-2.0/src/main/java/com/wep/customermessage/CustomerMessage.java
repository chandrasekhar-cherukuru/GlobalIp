package com.wep.customermessage;

import java.time.LocalDateTime;

import jakarta.persistence.Column;
import jakarta.persistence.Entity;
import jakarta.persistence.GeneratedValue;
import jakarta.persistence.GenerationType;
import jakarta.persistence.Id;
import jakarta.persistence.Lob;
import jakarta.persistence.Table;

@Entity
@Table(name="GCONTACT_US")
public class CustomerMessage {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    @Column(name="ID")
    Integer  messageId;
    
    @Column(name="CUST_NAME")
    public String customerName;
    
    @Column(name="CUST_NO")
    public String customerNo;
    
    @Column(name="CUST_ID")
    public String userID;
    
    @Column(name="REASON")
    public String messageReason;
    
    @Lob
    @Column(name="CUST_MESSAGE" , length = 10000)
    public String customerMessage;
    
    @Column(name="MSG_DATE")
    public LocalDateTime messageDateTime;

    public Integer getMessageId() { return messageId; }
    public void setMessageId(Integer  messageId) { this.messageId = messageId; }
    public String getCustomerName() { return customerName; }
    public void setCustomerName(String customerName) { this.customerName = customerName; }
    public String getUserID() { return userID; }
    public void setUserID(String userID) { this.userID = userID; }
    public String getMessageReason() { return messageReason; }
    public void setMessageReason(String messageReason) { this.messageReason = messageReason; }
    public String getCustomerNo() { return customerNo; }
    public void setCustomerNo(String customerNo) { this.customerNo = customerNo; }
    public String getCustomerMessage() { return customerMessage; }
    public void setCustomerMessage(String customerMessage) { this.customerMessage = customerMessage; }
    public LocalDateTime getMessageDateTime() { return messageDateTime; }
    public void setMessageDateTime(LocalDateTime messageDateTime) { this.messageDateTime = messageDateTime; }
}
