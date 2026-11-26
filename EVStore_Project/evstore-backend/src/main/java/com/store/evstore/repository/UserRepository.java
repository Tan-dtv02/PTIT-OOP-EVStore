package com.store.evstore.repository;

import com.store.evstore.model.entity.User;
import com.store.evstore.model.enums.Role;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.data.jpa.repository.JpaRepository;

public interface UserRepository extends JpaRepository<User, Long> {

    Page<User> findByRoleOrderByCreatedAtDesc(Role role, Pageable pageable);

    Page<User> findByUsernameContainingIgnoreCaseOrFullNameContainingIgnoreCaseOrEmailContainingIgnoreCaseOrderByCreatedAtDesc(
            String username, String fullName, String email, Pageable pageable
    );

    Page<User> findAllByOrderByCreatedAtDesc(Pageable pageable);

    User findByUsername(String username);
}
