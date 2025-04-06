package com.TrainingZone.Server.Config.DataInitializer;

import com.TrainingZone.Server.Models.Role;
import com.TrainingZone.Server.Models.User;
import com.TrainingZone.Server.Repositories.UserRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.boot.ApplicationArguments;
import org.springframework.boot.ApplicationRunner;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Component;

import java.util.List;

@Component
@RequiredArgsConstructor
public class UserDataInitializer implements ApplicationRunner {

    private final UserRepository userRepository;
    private final PasswordEncoder passwordEncoder;

    @Override
    public void run(ApplicationArguments args) throws Exception {

        if (userRepository.count() != 0)
            return;

        initUsers();



    }


    private void initUsers() {
        List<User> users = List.of(
                User.builder()
                        .name("ale")
                        .phone("123456789")
                        .email("ale@gmail.com")
                        .password(passwordEncoder.encode("1234"))
                        .role(Role.ADMIN)
                        .build(),

                User.builder()
                        .name("manu")
                        .phone("987654321")
                        .email("manu@gmail.com")
                        .password(passwordEncoder.encode("1234"))
                        .role(Role.ADMIN)
                        .build()
        );

        userRepository.saveAll(users);
    }


}
