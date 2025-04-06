package com.TrainingZone.Server.Controllers;

import com.TrainingZone.Server.Services.UserService;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.annotation.AuthenticationPrincipal;
import org.springframework.security.core.userdetails.UserDetails;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

@RestController
@RequestMapping("/user")
@RequiredArgsConstructor
public class UserController {

    private final UserService userService;

    @GetMapping("authenticated")
    public ResponseEntity<String> getAuthenticatedUser(@AuthenticationPrincipal UserDetails userDetails){
        return ResponseEntity.ok("Usuario autenticado: " + userDetails.getUsername() + userDetails.getAuthorities());
    }


}
