package com.store.evstore.service;

import com.store.evstore.model.entity.User;
import com.store.evstore.model.enums.Role;
import com.store.evstore.repository.UserRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.data.domain.*;
import org.springframework.security.crypto.bcrypt.BCryptPasswordEncoder;
import org.springframework.stereotype.Service;

@Service
@RequiredArgsConstructor
public class UserService {

    private final UserRepository userRepository;
    private final BCryptPasswordEncoder passwordEncoder;

    public Page<User> search(String keyword, Role role, int page, int size) {
        Pageable pageable = PageRequest.of(page, size);

        if (keyword == null || keyword.isBlank()) {
            return role == null
                    ? userRepository.findAllByOrderByCreatedAtDesc(pageable)
                    : userRepository.findByRoleOrderByCreatedAtDesc(role, pageable);
        }

        return userRepository
                .findByUsernameContainingIgnoreCaseOrFullNameContainingIgnoreCaseOrEmailContainingIgnoreCaseOrderByCreatedAtDesc(
                        keyword, keyword, keyword, pageable
                );
    }

    public User findById(Long id) {
        return userRepository.findById(id)
                .orElseThrow(() -> new RuntimeException("User not found"));
    }

    // ===========================================================
    // CREATE USER (WITH PASSWORD HASH)
    // ===========================================================
    public User create(User user) {
        user.setId(null);

        // 🔥 Hash mật khẩu khi tạo user
        if (user.getPassword() != null && !user.getPassword().isBlank()) {
            user.setPassword(passwordEncoder.encode(user.getPassword()));
        }

        return userRepository.save(user);
    }

    // ===========================================================
    // UPDATE USER (ALLOW CHANGE PASSWORD)
    // ===========================================================
    public User update(Long id, User user) {
        User old = findById(id);

        old.setFullName(user.getFullName());
        old.setEmail(user.getEmail());
        old.setRole(user.getRole());
        old.setActive(user.getActive());

        if (user.getPassword() != null && !user.getPassword().isBlank()) {

            if (!user.getPassword().startsWith("$2a$")) {
                old.setPassword(passwordEncoder.encode(user.getPassword()));
            } else {
            }
        }

        return userRepository.save(old);
    }

    public void delete(Long id) {
        userRepository.deleteById(id);
    }

    public User updateActive(Long id, Boolean active) {
        User u = findById(id);
        u.setActive(active);
        return userRepository.save(u);
    }

}
