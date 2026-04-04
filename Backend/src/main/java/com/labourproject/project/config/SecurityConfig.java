package com.labourproject.project.config;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;
import org.springframework.security.config.annotation.web.builders.HttpSecurity;
import org.springframework.security.config.annotation.web.configuration.EnableWebSecurity;
import org.springframework.security.config.http.SessionCreationPolicy;
import org.springframework.security.crypto.bcrypt.BCryptPasswordEncoder;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.security.web.SecurityFilterChain;
import org.springframework.security.web.authentication.UsernamePasswordAuthenticationFilter;

import com.labourproject.project.security.JwtFilter;

@Configuration
@EnableWebSecurity
public class SecurityConfig {

    @Autowired
    private JwtFilter jwtFilter;

    @Bean
    public SecurityFilterChain filterChain(HttpSecurity http) throws Exception {

        http
                .csrf(csrf -> csrf.disable())

               
                .sessionManagement(session -> session
                        .sessionCreationPolicy(SessionCreationPolicy.STATELESS))

                .authorizeHttpRequests(auth -> auth

                        .requestMatchers("/api/auth/**").permitAll()
                        .requestMatchers("/api/categories/active").permitAll()
                        .requestMatchers("/api/categories/all").authenticated() 
                        .requestMatchers("/api/categories/toggle/**").hasRole("ADMIN")               
                        .requestMatchers("/api/jobs/create").hasRole("CUSTOMER")
                        .requestMatchers("/api/jobs/customer/**").hasRole("CUSTOMER")

                        .requestMatchers("/api/jobs/accept/**").hasRole("WORKER")
                        .requestMatchers("/api/jobs/my-assigned").hasRole("WORKER")

                        .requestMatchers("/api/jobs/status/**").hasRole("WORKER")
                        .requestMatchers("/api/jobs/pending").hasAnyRole("CUSTOMER", "WORKER")
                        .requestMatchers("/api/jobs/worker/feed").hasRole("WORKER")
                        
                        .requestMatchers("/api/quotes/submit/**").hasRole("WORKER")
                        .requestMatchers("/api/quotes/accept/**").hasRole("CUSTOMER")
                        .requestMatchers("/api/quotes/decline/**").hasRole("CUSTOMER")
                        .requestMatchers("/api/quotes/job/**").hasRole("CUSTOMER")

                        .requestMatchers("/api/ai/classify").hasRole("CUSTOMER")
                        .anyRequest().authenticated())

                .addFilterBefore(jwtFilter,
                        UsernamePasswordAuthenticationFilter.class);

        return http.build();
    }

    @Bean
    public PasswordEncoder passwordEncoder() {
        return new BCryptPasswordEncoder();
    }
}