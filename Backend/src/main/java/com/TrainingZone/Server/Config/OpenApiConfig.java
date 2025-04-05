package com.TrainingZone.Server.Config;

import io.swagger.v3.oas.annotations.OpenAPIDefinition;
import io.swagger.v3.oas.annotations.info.Info;
import org.springframework.context.annotation.Configuration;

/*Configuración de swagger*/
@Configuration
@OpenAPIDefinition(
        info = @Info(
                title = "Training Zone Server",
                description = "Training Zone App Server",
                version = "1.0.0"

        )
)
public class OpenApiConfig {
}
