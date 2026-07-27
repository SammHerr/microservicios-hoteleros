package com.hotelplatform.apigateway.security;

import java.io.IOException;
import java.util.Collections;

import org.springframework.http.HttpHeaders;
import org.springframework.http.MediaType;
import org.springframework.security.authentication.UsernamePasswordAuthenticationToken;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.stereotype.Component;
import org.springframework.web.filter.OncePerRequestFilter;

import jakarta.servlet.FilterChain;
import jakarta.servlet.ServletException;
import jakarta.servlet.http.HttpServletRequest;
import jakarta.servlet.http.HttpServletResponse;

@Component
public class JwtAuthenticationFilter extends OncePerRequestFilter {

    private final JwtUtil jwtUtil;

    public JwtAuthenticationFilter(JwtUtil jwtUtil) {
        this.jwtUtil = jwtUtil;
    }

    /**
     * Determina qué solicitudes pueden pasar sin validación JWT.
     */
    @Override
    protected boolean shouldNotFilter(HttpServletRequest request) {

        String path = request.getRequestURI();
        String method = request.getMethod();

        /*
         * Las solicitudes OPTIONS corresponden normalmente al preflight de CORS.
         * Deben permitirse para que el frontend pueda comunicarse con el Gateway.
         */
        boolean isCorsPreflight = "OPTIONS".equalsIgnoreCase(method);

        /*
         * Endpoints públicos de autenticación.
         */
        boolean isAuthenticationPath =
                path.startsWith("/api/auth");

        /*
         * Endpoints públicos para monitoreo básico.
         */
        boolean isActuatorPath =
                path.startsWith("/actuator");

        /*
         * Recursos necesarios para visualizar Swagger UI
         * y consultar la documentación OpenAPI.
         */
        boolean isSwaggerPath =
                path.startsWith("/swagger-ui") ||
                path.equals("/swagger-ui.html") ||
                path.startsWith("/v3/api-docs") ||
                path.startsWith("/webjars") ||
                path.equals("/favicon.ico");

        /*
         * Spring puede redirigir algunos errores a esta ruta.
         */
        boolean isErrorPath =
                path.equals("/error");

        return isCorsPreflight
                || isAuthenticationPath
                || isActuatorPath
                || isSwaggerPath
                || isErrorPath;
    }

    /**
     * Valida el token JWT de las solicitudes protegidas.
     */
    @Override
    protected void doFilterInternal(
            HttpServletRequest request,
            HttpServletResponse response,
            FilterChain filterChain
    ) throws ServletException, IOException {

        String authHeader = request.getHeader(HttpHeaders.AUTHORIZATION);

        /*
         * Verifica que exista el encabezado Authorization
         * y que utilice el esquema Bearer.
         */
        if (authHeader == null || !authHeader.startsWith("Bearer ")) {
            writeUnauthorizedResponse(
                    response,
                    "Token JWT requerido"
            );
            return;
        }

        /*
         * Elimina el prefijo "Bearer " para obtener únicamente el token.
         */
        String token = authHeader.substring(7);

        try {
            /*
             * Valida la firma, estructura y vigencia del token.
             * Si es válido, recupera el nombre del usuario.
             */
            String username =
                    jwtUtil.validateTokenAndGetUsername(token);

            /*
             * Registra al usuario autenticado en el contexto de seguridad
             * de Spring durante la solicitud actual.
             */
            UsernamePasswordAuthenticationToken authentication =
                    new UsernamePasswordAuthenticationToken(
                            username,
                            null,
                            Collections.emptyList()
                    );

            SecurityContextHolder
                    .getContext()
                    .setAuthentication(authentication);

            /*
             * Continúa con el resto de filtros y con el endpoint solicitado.
             */
            filterChain.doFilter(request, response);

        } catch (Exception exception) {

            /*
             * Elimina cualquier autenticación parcial antes de responder.
             */
            SecurityContextHolder.clearContext();

            writeUnauthorizedResponse(
                    response,
                    "Token JWT inválido o expirado"
            );
        }
    }

    /**
     * Construye una respuesta HTTP 401 uniforme.
     */
    private void writeUnauthorizedResponse(
            HttpServletResponse response,
            String message
    ) throws IOException {

        response.setStatus(HttpServletResponse.SC_UNAUTHORIZED);
        response.setCharacterEncoding("UTF-8");
        response.setContentType(
                MediaType.TEXT_PLAIN_VALUE
        );
        response.getWriter().write(message);
    }
}