package com.chakri.fundly.service;

import io.jsonwebtoken.Claims;
import io.jsonwebtoken.Jwts;
import io.jsonwebtoken.io.Decoders;
import io.jsonwebtoken.security.Keys;
import org.springframework.security.core.userdetails.UserDetails;
import org.springframework.stereotype.Service;

import javax.crypto.KeyGenerator;
import javax.crypto.SecretKey;
import java.security.NoSuchAlgorithmException;
import java.util.Base64;
import java.util.Date;
import java.util.HashMap;
import java.util.Map;
import java.util.function.Function;

@Service
public class JWTService {

    // This will hold the Base64-encoded secret key used for signing/verifying JWTs
    String secretKey = "";

    // Constructor: generates a new secret key when the service starts
    public JWTService() {
        try {
            // Generate a random key using HMAC SHA-256
            KeyGenerator keyGenerator = KeyGenerator.getInstance("HmacSHA256");
            SecretKey sk = keyGenerator.generateKey();

            // Convert secret key into a Base64-encoded string (so it can be stored as plain text)
            secretKey = Base64.getEncoder().encodeToString(sk.getEncoded());

        } catch (NoSuchAlgorithmException e) {
            // If HmacSHA256 is not available (unlikely), throw runtime error
            throw new RuntimeException(e);
        }
    }

    // Method to generate a new JWT token for a given username
    public String generateToken(String username) {

        // Claims are extra data you can store in the token (currently empty map)
        Map<String, Object> claims = new HashMap<>();

        // Build the token
        return Jwts.builder()
                .claims()                                  // Start adding claims
                .add(claims)                               // Add the claims map (empty here)
                .subject(username)                         // Set "subject" → username
                .issuedAt(new Date(System.currentTimeMillis())) // Set issue time = now
                .expiration(new Date(System.currentTimeMillis() + 1000 * 60 * 60 * 24))
                // Expiration = now + 24 hours
                .and()
                .signWith(getKey())                        // Sign with secret key
                .compact();                                // Build the final JWT string
    }

    // Converts the Base64-encoded secretKey back into a SecretKey object
    public SecretKey getKey() {
        byte[] keyBytes = Decoders.BASE64.decode(secretKey);
        return Keys.hmacShaKeyFor(keyBytes);
    }

    // Extracts the username (subject) from a JWT token
    public String extractUserName(String token) {
        return extractClaim(token, Claims::getSubject);
    }

    // Generic method: extract any claim from token using a resolver function
    private <T> T extractClaim(String token, Function<Claims, T> claimsResolver) {
        final Claims claims = extractAllClaims(token); // Get all claims first
        return claimsResolver.apply(claims);           // Apply resolver (like getSubject or getExpiration)
    }

    // Extracts all claims (payload) from the token
    private Claims extractAllClaims(String token) {
        return Jwts.parser()
                .verifyWith(getKey())                   // Verify token with the secret key
                .build()
                .parseSignedClaims(token)               // Parse token
                .getPayload();                          // Return claims (payload part)
    }

    // Validate token: check username match + not expired
    public boolean validateToken(String token, UserDetails userDetails) {
        final String userName = extractUserName(token); // Get username from token
        return (userName.equals(userDetails.getUsername()) // Username must match
                && !isTokenExpired(token));             // Token must not be expired
    }

    // Check if token is expired
    private boolean isTokenExpired(String token) {
        return extractExpiration(token).before(new Date());
    }

    // Extract expiration date from token
    private Date extractExpiration(String token) {
        return extractClaim(token, Claims::getExpiration);
    }
}
