package com.wep.configs;

import java.io.Serializable;

import org.hibernate.HibernateException;
import org.hibernate.Session;
import org.hibernate.engine.spi.SharedSessionContractImplementor;
import org.hibernate.id.IdentifierGenerator;
import org.hibernate.query.NativeQuery;

public class CustomUserIdGenerator implements IdentifierGenerator {

	private static final long serialVersionUID = 1L;

	@Override
    public Serializable generate(SharedSessionContractImplementor session, Object object)
			throws HibernateException {

		String prefix = "ECOM";
		Session hibernateSession = (Session) session;

		NativeQuery<?> countQuery = hibernateSession.createNativeQuery("SELECT COUNT(PAR_CODE) FROM GECOMUSERS");
		Number countResult = (Number) countQuery.uniqueResult();
		int count = countResult != null ? countResult.intValue() : 0;

		String generatedId = generateUniqueUserId(prefix, count, hibernateSession);
		return generatedId;
	}


	private String generateUniqueUserId(String prefix, int count, Session hibernateSession) {
		String generatedId;
		boolean isDuplicate = true;
		int id = count + 1;

		while (isDuplicate) {
			generatedId = prefix + String.format("%03d", id);
			NativeQuery<?> query = hibernateSession.createNativeQuery("SELECT PAR_CODE FROM GECOMUSERS WHERE PAR_CODE = :code");
			query.setParameter("code", generatedId);
			Object result = query.uniqueResult();

			if (result == null) {
				return generatedId;
			}

			id++;
		}

		return null;
	}
}
