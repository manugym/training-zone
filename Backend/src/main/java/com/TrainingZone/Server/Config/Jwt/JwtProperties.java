package com.TrainingZone.Server.Config.Jwt;

import lombok.Data;
import org.springframework.boot.context.properties.ConfigurationProperties;

@Data
@ConfigurationProperties(prefix = "jwt")
public class JwtProperties {
    private String key;
    private Long accessTokenExpiration;
}