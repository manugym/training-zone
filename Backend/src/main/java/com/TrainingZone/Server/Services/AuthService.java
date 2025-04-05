package com.TrainingZone.Server.Services;


import com.TrainingZone.Server.Config.Jwt.JwtService;
import com.TrainingZone.Server.Controllers.AuthRequest;
import com.TrainingZone.Server.Controllers.AuthResponse;
import com.TrainingZone.Server.Models.Role;
import com.TrainingZone.Server.Models.User;
import com.TrainingZone.Server.Repositories.UserRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.security.authentication.AuthenticationManager;
import org.springframework.security.authentication.UsernamePasswordAuthenticationToken;
import org.springframework.security.core.userdetails.UserDetails;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Service;

@Service
@RequiredArgsConstructor
public class AuthService {

    private final UserRepository userRepository;
    private final JwtService jwtService;
    private final PasswordEncoder passwordEncoder;
    private final AuthenticationManager authenticationManager;

    public AuthResponse login(AuthRequest request) {
        authenticationManager.authenticate(new UsernamePasswordAuthenticationToken(request.getCredential(), request.getPassword()));
        UserDetails user=userRepository.findByUsername(request.getCredential()).orElseThrow();
        String token=jwtService.getToken(user);
        return AuthResponse.builder()
                .token(token)
                .build();

    }

    public AuthResponse register(AuthRequest request) {
        User user = User.builder()
                .username(request.getCredential())
                .password(passwordEncoder.encode( request.getPassword()))
                .role(Role.USER)
                .build();

        userRepository.save(user);

        return AuthResponse.builder()
                .token(jwtService.getToken(user))
                .build();

    }

}

