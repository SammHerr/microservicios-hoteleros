package com.hotelplatform.apigateway.config;

import java.util.List;

import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;
import org.springframework.http.HttpMethod;
import org.springframework.security.config.annotation.web.builders.HttpSecurity;
import org.springframework.security.config.http.SessionCreationPolicy;
import org.springframework.security.web.SecurityFilterChain;
import org.springframework.security.web.authentication.UsernamePasswordAuthenticationFilter;
import org.springframework.web.cors.CorsConfiguration;
import org.springframework.web.cors.CorsConfigurationSource;
import org.springframework.web.cors.UrlBasedCorsConfigurationSource;

import com.hotelplatform.apigateway.security.JwtAuthenticationFilter;

@Configuration
public class SecurityConfig {

    private final JwtAuthenticationFilter jwtAuthenticationFilter;

    public SecurityConfig(
            JwtAuthenticationFilter jwtAuthenticationFilter
    ) {
        this.jwtAuthenticationFilter = jwtAuthenticationFilter;
    }

    /**
     * Configura la seguridad del API Gateway.
     */
    @Bean
    public SecurityFilterChain securityFilterChain(
            HttpSecurity http
    ) throws Exception {

        http
                /*
                 * La aplicación utiliza JWT y no sesiones basadas
                 * en formularios, por lo que CSRF se deshabilita.
                 */
                .csrf(csrf -> csrf.disable())

                /*
                 * Aplica la configuración CORS definida en el bean
                 * corsConfigurationSource.
                 */
                .cors(cors -> cors
                        .configurationSource(corsConfigurationSource())
                )

                /*
                 * Cada petición debe autenticarse de manera independiente.
                 */
                .sessionManagement(session -> session
                        .sessionCreationPolicy(
                                SessionCreationPolicy.STATELESS
                        )
                )

                /*
                 * Configuración de rutas públicas y protegidas.
                 */
                .authorizeHttpRequests(auth -> auth

                        /*
                         * Permite las solicitudes preflight del navegador.
                         */
                        .requestMatchers(HttpMethod.OPTIONS, "/**")
                        .permitAll()

                        /*
                         * Rutas públicas.
                         */
                        .requestMatchers(
                                "/api/auth/**",
                                "/actuator/**",
                                "/swagger-ui/**",
                                "/swagger-ui.html",
                                "/v3/api-docs/**",
                                "/webjars/**",
                                "/favicon.ico",
                                "/error"
                        )
                        .permitAll()

                        /*
                         * El resto de endpoints requiere JWT.
                         */
                        .anyRequest()
                        .authenticated()
                )

                /*
                 * Ejecuta la validación JWT antes del filtro estándar
                 * de Spring Security.
                 */
                .addFilterBefore(
                        jwtAuthenticationFilter,
                        UsernamePasswordAuthenticationFilter.class
                );

        return http.build();
    }

    /**
     * Permite que el frontend de desarrollo se comunique
     * con el API Gateway.
     */
    @Bean
    public CorsConfigurationSource corsConfigurationSource() {

        CorsConfiguration configuration =
                new CorsConfiguration();

        /*
         * Origen permitido durante el desarrollo local.
         */
        configuration.setAllowedOrigins(
                List.of("http://localhost:5173")
        );

        /*
         * Métodos HTTP utilizados por la plataforma.
         */
        configuration.setAllowedMethods(
                List.of(
                        "GET",
                        "POST",
                        "PUT",
                        "PATCH",
                        "DELETE",
                        "OPTIONS"
                )
        );

        /*
         * Permite encabezados como Authorization y Content-Type.
         */
        configuration.setAllowedHeaders(
                List.of("*")
        );

        /*
         * Permite al frontend leer estos encabezados de respuesta.
         */
        configuration.setExposedHeaders(
                List.of("Authorization")
        );

        /*
         * El JWT se envía mediante Authorization y no mediante cookies.
         */
        configuration.setAllowCredentials(false);

        /*
         * Guarda la respuesta preflight durante una hora.
         */
        configuration.setMaxAge(3600L);

        UrlBasedCorsConfigurationSource source =
                new UrlBasedCorsConfigurationSource();

        /*
         * Aplica esta configuración a todas las rutas del gateway.
         */
        source.registerCorsConfiguration(
                "/**",
                configuration
        );

        return source;
    }
}