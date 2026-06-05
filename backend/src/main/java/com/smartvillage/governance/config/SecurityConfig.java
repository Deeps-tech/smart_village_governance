package com.smartvillage.governance.config;

import com.smartvillage.governance.security.JwtAuthenticationFilter;
import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;
import org.springframework.http.HttpMethod;
import org.springframework.security.authentication.AuthenticationManager;
import org.springframework.security.config.annotation.authentication.configuration.AuthenticationConfiguration;
import org.springframework.security.config.annotation.method.configuration.EnableMethodSecurity;
import org.springframework.security.config.annotation.web.builders.HttpSecurity;
import org.springframework.security.config.annotation.web.configuration.EnableWebSecurity;
import org.springframework.security.config.http.SessionCreationPolicy;
import org.springframework.security.crypto.bcrypt.BCryptPasswordEncoder;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.security.web.SecurityFilterChain;
import org.springframework.security.web.authentication.UsernamePasswordAuthenticationFilter;
import org.springframework.web.cors.CorsConfiguration;
import org.springframework.web.cors.CorsConfigurationSource;
import org.springframework.web.cors.UrlBasedCorsConfigurationSource;

import java.util.Arrays;
import java.util.Collections;

@Configuration
@EnableWebSecurity
@EnableMethodSecurity
public class SecurityConfig {

    private final JwtAuthenticationFilter jwtAuthenticationFilter;

    public SecurityConfig(JwtAuthenticationFilter jwtAuthenticationFilter) {
        this.jwtAuthenticationFilter = jwtAuthenticationFilter;
    }

    @Bean
    public PasswordEncoder passwordEncoder() {
        return new BCryptPasswordEncoder();
    }

    @Bean
    public AuthenticationManager authenticationManager(AuthenticationConfiguration authenticationConfiguration)
            throws Exception {
        return authenticationConfiguration.getAuthenticationManager();
    }

    @Bean
    public SecurityFilterChain filterChain(HttpSecurity http) throws Exception {
        http
            .cors(cors -> cors.configurationSource(corsConfigurationSource()))
            .csrf(csrf -> csrf.disable())
            .sessionManagement(session -> session.sessionCreationPolicy(SessionCreationPolicy.STATELESS))
            .authorizeHttpRequests(auth -> auth
                // Auth & Swagger/Error APIs
                .requestMatchers("/api/auth/**").permitAll()
                .requestMatchers("/error").permitAll()
                .requestMatchers("/swagger-ui/**", "/v3/api-docs/**", "/swagger-resources/**").permitAll()
                // Dashboard metric APIs are accessible by authenticated users
                .requestMatchers("/api/dashboard/**").authenticated()
                
                // Citizens CRUD
                .requestMatchers(HttpMethod.GET, "/api/citizens/**").hasAnyRole("SUPER_ADMIN", "VILLAGE_OFFICER")
                .requestMatchers("/api/citizens/**").hasRole("SUPER_ADMIN")
                
                // Grievances
                .requestMatchers(HttpMethod.POST, "/api/grievances").hasRole("CITIZEN")
                .requestMatchers(HttpMethod.PUT, "/api/grievances/*/assign").hasAnyRole("SUPER_ADMIN", "VILLAGE_OFFICER")
                .requestMatchers(HttpMethod.PUT, "/api/grievances/*/status").hasAnyRole("SUPER_ADMIN", "VILLAGE_OFFICER")
                .requestMatchers(HttpMethod.PUT, "/api/grievances/*/resolve").hasAnyRole("SUPER_ADMIN", "VILLAGE_OFFICER")
                .requestMatchers(HttpMethod.GET, "/api/grievances/**").authenticated()
                
                // Schemes
                .requestMatchers(HttpMethod.POST, "/api/schemes").hasAnyRole("SUPER_ADMIN", "VILLAGE_OFFICER")
                .requestMatchers(HttpMethod.POST, "/api/schemes/*/apply").hasRole("CITIZEN")
                .requestMatchers(HttpMethod.PUT, "/api/schemes/*/approve").hasAnyRole("SUPER_ADMIN", "VILLAGE_OFFICER")
                .requestMatchers(HttpMethod.PUT, "/api/schemes/*/reject").hasAnyRole("SUPER_ADMIN", "VILLAGE_OFFICER")
                .requestMatchers(HttpMethod.GET, "/api/schemes/**").authenticated()
                
                // Infrastructure
                .requestMatchers(HttpMethod.POST, "/api/infrastructure/**").hasAnyRole("SUPER_ADMIN", "VILLAGE_OFFICER")
                .requestMatchers(HttpMethod.PUT, "/api/infrastructure/**").hasAnyRole("SUPER_ADMIN", "VILLAGE_OFFICER")
                .requestMatchers(HttpMethod.GET, "/api/infrastructure/**").authenticated()
                
                // Budget
                .requestMatchers(HttpMethod.POST, "/api/budgets/**").hasRole("SUPER_ADMIN")
                .requestMatchers(HttpMethod.GET, "/api/budgets/report").hasAnyRole("SUPER_ADMIN", "VILLAGE_OFFICER")
                .requestMatchers(HttpMethod.GET, "/api/budgets/**").hasAnyRole("SUPER_ADMIN", "VILLAGE_OFFICER")
                
                // Announcements
                .requestMatchers(HttpMethod.POST, "/api/announcements/**").hasAnyRole("SUPER_ADMIN", "VILLAGE_OFFICER")
                .requestMatchers(HttpMethod.PUT, "/api/announcements/**").hasAnyRole("SUPER_ADMIN", "VILLAGE_OFFICER")
                .requestMatchers(HttpMethod.DELETE, "/api/announcements/**").hasAnyRole("SUPER_ADMIN", "VILLAGE_OFFICER")
                .requestMatchers(HttpMethod.GET, "/api/announcements/**").authenticated()
                
                .anyRequest().authenticated()
            );

        http.addFilterBefore(jwtAuthenticationFilter, UsernamePasswordAuthenticationFilter.class);

        return http.build();
    }

    @Bean
    public CorsConfigurationSource corsConfigurationSource() {
        CorsConfiguration configuration = new CorsConfiguration();
        configuration.setAllowedOrigins(Collections.singletonList("*")); // Support any origins for hackathon presentation
        configuration.setAllowedMethods(Arrays.asList("GET", "POST", "PUT", "PATCH", "DELETE", "OPTIONS"));
        configuration.setAllowedHeaders(Arrays.asList("authorization", "content-type", "x-auth-token"));
        configuration.setExposedHeaders(Collections.singletonList("x-auth-token"));
        UrlBasedCorsConfigurationSource source = new UrlBasedCorsConfigurationSource();
        source.registerCorsConfiguration("/**", configuration);
        return source;
    }
}
