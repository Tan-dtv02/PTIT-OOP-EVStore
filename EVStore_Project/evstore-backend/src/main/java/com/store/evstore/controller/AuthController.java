package com.store.evstore.controller;

import com.store.evstore.config.JwtUtils;
import com.store.evstore.dto.LoginRequest;
import com.store.evstore.dto.TokenResponse;
import com.store.evstore.service.AuthService;
import lombok.RequiredArgsConstructor;
import org.springframework.web.bind.annotation.*;

import java.util.Map;

@RestController
@RequestMapping("/api/auth")
@RequiredArgsConstructor
public class AuthController {

    private final AuthService authService;
    private final JwtUtils jwtUtils;

    @PostMapping("/login")
    public TokenResponse login(@RequestBody LoginRequest request) {
        return authService.login(request.getUsername(), request.getPassword());
    }

    @PostMapping("/refresh")
    public TokenResponse refresh(@RequestBody Map<String, String> req) {
        String refreshToken = req.get("refreshToken");

        if (!jwtUtils.validateJwtToken(refreshToken)) {
            throw new RuntimeException("Invalid refresh token");
        }

        String userId = jwtUtils.getUserIdFromJwtToken(refreshToken);
        String role = jwtUtils.getRoleFromJwtToken(refreshToken);

        TokenResponse res = new TokenResponse();
        res.setAccessToken(jwtUtils.generateAccessToken(userId, role));
        res.setRefreshToken(refreshToken); // Giữ nguyên refresh token
        return res;
    }
}
