package com.wep.returnRequest;
import java.util.Date;
import jakarta.persistence.Temporal;
import jakarta.persistence.TemporalType;
import com.wep.orders.Orders;

import jakarta.persistence.Column;
import jakarta.persistence.Entity;
import jakarta.persistence.Id;
import jakarta.persistence.JoinColumn;
import jakarta.persistence.OneToOne;
import jakarta.persistence.Table;
import jakarta.validation.constraints.NotBlank;

@Entity
@Table(name="return_request")
public class ReturnRequest {

    @Id
    private String id;

    @OneToOne
    @JoinColumn(name = "order_id", referencedColumnName = "SER_NO")
    private Orders order;

    @NotBlank
    @Column(name = "return_reason")
    private String returnReason;

    @Column(name = "comment")
    private String comment;

    @NotBlank
    @Column(name = "account_number")
    private String accountNumber;

    @NotBlank
    @Column(name = "account_holder_name")
    private String accountHolderName;

    @NotBlank
    @Column(name = "bank_name")
    private String bankName;

    @NotBlank
    @Column(name = "ifsc_code")
    private String ifscCode;

    @Column(name = "refund_initiated")
    private boolean refundInitiated;

    @Column(name = "refund_confirmed")
    private boolean refundConfirmed;

    @Temporal(TemporalType.TIMESTAMP)
    @Column(name = "return_initiate_date")
    private Date returnInitiateDate;

    @Temporal(TemporalType.TIMESTAMP)
    @Column(name = "return_confirm_date")
    private Date returnConfirmDate;
    
    @Column(name = "status")
    private String status;

	

	public ReturnRequest() {

	}

	public String getId() {
		return id;
	}

	public void setId(String id) {
		this.id = id;
	}

	public Orders getOrder() {
		return order;
	}

	public void setOrder(Orders order) {
		this.order = order;
	}

	public String getReturnReason() {
		return returnReason;
	}

	public void setReturnReason(String returnReason) {
		this.returnReason = returnReason;
	}

	public String getComment() {
		return comment;
	}

	public void setComment(String comment) {
		this.comment = comment;
	}

	public String getAccountNumber() {
		return accountNumber;
	}

	public void setAccountNumber(String accountNumber) {
		this.accountNumber = accountNumber;
	}

	public String getAccountHolderName() {
		return accountHolderName;
	}

	public void setAccountHolderName(String accountHolderName) {
		this.accountHolderName = accountHolderName;
	}

	public String getBankName() {
		return bankName;
	}

	public void setBankName(String bankName) {
		this.bankName = bankName;
	}

	public String getIfscCode() {
		return ifscCode;
	}

	public void setIfscCode(String ifscCode) {
		this.ifscCode = ifscCode;
	}

	public boolean isRefundInitiated() {
		return refundInitiated;
	}

	public void setRefundInitiated(boolean refundInitiated) {
		this.refundInitiated = refundInitiated;
	}

	public boolean isRefundConfirmed() {
		return refundConfirmed;
	}

	public void setRefundConfirmed(boolean refundConfirmed) {
		this.refundConfirmed = refundConfirmed;
	}

	public Date getReturnInitiateDate() {
		return returnInitiateDate;
	}

	public void setReturnInitiateDate(Date returnInitiateDate) {
		this.returnInitiateDate = returnInitiateDate;
	}

	public Date getReturnConfirmDate() {
		return returnConfirmDate;
	}

	public void setReturnConfirmDate(Date returnConfirmDate) {
		this.returnConfirmDate = returnConfirmDate;
	}

	public String getStatus() {
		return status;
	}

	public void setStatus(String status) {
		this.status = status;
	}

	public ReturnRequest(String id, Orders order, @NotBlank String returnReason, String comment,
			@NotBlank String accountNumber, @NotBlank String accountHolderName, @NotBlank String bankName,
			@NotBlank String ifscCode, boolean refundInitiated, boolean refundConfirmed, Date returnInitiateDate,
			Date returnConfirmDate, String status) {
		super();
		this.id = id;
		this.order = order;
		this.returnReason = returnReason;
		this.comment = comment;
		this.accountNumber = accountNumber;
		this.accountHolderName = accountHolderName;
		this.bankName = bankName;
		this.ifscCode = ifscCode;
		this.refundInitiated = refundInitiated;
		this.refundConfirmed = refundConfirmed;
		this.returnInitiateDate = returnInitiateDate;
		this.returnConfirmDate = returnConfirmDate;
		this.status = status;
	}

	

	
    

	   
}
