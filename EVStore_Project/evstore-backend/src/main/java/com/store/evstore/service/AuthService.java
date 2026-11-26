package com.store.evstore.service;

import com.store.evstore.config.JwtUtils;
import com.store.evstore.dto.TokenResponse;
import com.store.evstore.model.entity.User;
import com.store.evstore.repository.UserRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Service;

@Service
@RequiredArgsConstructor
public class AuthService {

    private final UserRepository userRepository;
    private final PasswordEncoder passwordEncoder;
    private final JwtUtils jwtUtils;

    public TokenResponse login(String username, String password) {
        User user = userRepository.findByUsername(username);

        if (user == null || !passwordEncoder.matches(password, user.getPassword())) {
            throw new RuntimeException("Tên người dùng hoặc mật khẩu không hợp lệ");
        }

        if (Boolean.FALSE.equals(user.getActive())) {
            throw new RuntimeException("Tài khoản đã bị khóa hoặc không hoạt động");
        }

        String access = jwtUtils.generateAccessToken(user.getId().toString(), user.getRole().name());
        String refresh = jwtUtils.generateRefreshToken(user.getId().toString(), user.getRole().name());

        TokenResponse res = new TokenResponse();
        res.setAccessToken(access);
        res.setRefreshToken(refresh);
        return res;
    }

}
