package com.TrainingZone.Server.Repositories;

import com.TrainingZone.Server.Models.User;
import org.springframework.data.jpa.repository.JpaRepository;

import java.util.Optional;

public interface UserRepository extends JpaRepository<User,String> {
    Optional<User> findByEmailOrPhone(String email, String phone);
}