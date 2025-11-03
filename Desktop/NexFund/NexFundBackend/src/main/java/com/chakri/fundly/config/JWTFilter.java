package com.chakri.fundly.config;

import com.chakri.fundly.service.JWTService;
import com.chakri.fundly.service.MyUserDetailsService;
import jakarta.servlet.FilterChain;
import jakarta.servlet.ServletException;
import jakarta.servlet.http.HttpServletRequest;
import jakarta.servlet.http.HttpServletResponse;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.context.ApplicationContext;
import org.springframework.context.annotation.Configuration;
import org.springframework.security.authentication.UsernamePasswordAuthenticationToken;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.security.core.userdetails.UserDetails;
import org.springframework.security.web.authentication.WebAuthenticationDetailsSource;
import org.springframework.web.filter.OncePerRequestFilter;

import java.io.IOException;

@Configuration
public class JWTFilter extends OncePerRequestFilter {
    @Autowired
    private JWTService jwtService;

    @Autowired
    ApplicationContext context;


    @Override
    protected void doFilterInternal(HttpServletRequest request, HttpServletResponse response, FilterChain filterChain) throws ServletException, IOException {

        //from client we get Bearer and token
        //Bearer eyJhbGciOiJIUzI1NiJ9.eyJzdWIiOiJoYW51bWEiLCJpYXQiOjE3NTczMzQ2NTIsImV4cCI6MTc1NzMzNDc2MH0.P5hdwd6c54f0EQ1dj_ElI_1oZu-a3lrEe05UUORG3rw
        String authHeader = request.getHeader("Authorization");
        String token = null;
        String username = null;

        //check if there is token(header)
        if(authHeader != null && authHeader.startsWith("Bearer ")){
            token = authHeader.substring(7);
            username = jwtService.extractUserName(token);
        }

        if(username != null && SecurityContextHolder.getContext().getAuthentication() == null){

            UserDetails userDetails = context.getBean(MyUserDetailsService.class).loadUserByUsername(username);
            if(jwtService.validateToken(token, userDetails)){
                UsernamePasswordAuthenticationToken authToken =
                        new UsernamePasswordAuthenticationToken(userDetails, null, userDetails.getAuthorities());
                //now auth token knows about user details but it has no idea about request object
                authToken.setDetails(new WebAuthenticationDetailsSource().buildDetails(request));
                SecurityContextHolder.getContext().setAuthentication(authToken);
            }
        }
        //continue the chain
        filterChain.doFilter(request, response);
    }
}
