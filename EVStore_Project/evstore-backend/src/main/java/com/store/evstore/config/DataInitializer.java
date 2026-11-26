package com.store.evstore.config;

import com.store.evstore.model.entity.User;
import com.store.evstore.model.enums.Role;
import com.store.evstore.repository.UserRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.boot.CommandLineRunner;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Component;

import java.time.LocalDateTime;

@Component
@RequiredArgsConstructor
public class DataInitializer implements CommandLineRunner {

    private final UserRepository userRepository;
    private final PasswordEncoder passwordEncoder;

    @Override
    public void run(String... args) {
        if (userRepository.count() == 0) {
            User admin = User.builder()
                    .username("admin")
                    .email("admin@evstore.com")
                    .fullName("admin")
                    .password(passwordEncoder.encode("Admin123!"))
                    .role(Role.ADMIN)
                    .active(true)
                    .createdAt(LocalDateTime.now())
                    .updatedAt(LocalDateTime.now())
                    .build();

            userRepository.save(admin);
            System.out.println("✔ Admin mặc định đã được tạo!");
        }
    }
}
