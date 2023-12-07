package com.dgitalfactory.usersecurity.configuration;

import io.swagger.v3.oas.models.Components;
import io.swagger.v3.oas.models.OpenAPI;
import io.swagger.v3.oas.models.info.Contact;
import io.swagger.v3.oas.models.info.Info;
import io.swagger.v3.oas.models.info.License;
import io.swagger.v3.oas.models.security.SecurityRequirement;
import io.swagger.v3.oas.models.security.SecurityScheme;
import io.swagger.v3.oas.models.servers.Server;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;

import java.util.List;
/**
 * @author Cristian Manuel Orozco - Orozcocristian860@gmail.com
 * @created 30/11/2023 - 08:54
 */
 @Configuration
public class OpenAPIConfig {
    public static final String SCHEME_NAME = "BearerScheme";
    public static final String SCHEME = "Bearer";

    @Value("${sagger.openapi.dev-url}")
    private String DEV_URL;

    @Value("${sagger.openapi.prod-url}")
    private String PROD_URL;

    @Value("${sagger.urllicense}")
    private String LICENSE_URL;

    @Value("${sagger.urltermsofservice}")
    private String TERMSOFSVC_URL;

    @Bean
    public OpenAPI customOpenAPI() {
        Server devServer = new Server();
        devServer.setUrl(DEV_URL);
        devServer.setDescription("Server URL in Development environment");

        Server prodServer = new Server();
        prodServer.setUrl(PROD_URL);
        prodServer.setDescription("Server URL in Production environment");

        Contact contact = new Contact();
        contact.setEmail("agro_sustentable@gmail.com");
        contact.setName("Agro Sustentable");
        contact.setUrl("https://www.agro_sustentable.com");

        License mitLicense = new License().name("MIT License").url(LICENSE_URL);

        Info info = new Info()
                .title("Agro Sustentable API")
                .version("1.0")
                .contact(contact)
                .description("Api para empresa Agro Sustentable.").termsOfService(TERMSOFSVC_URL)
                .license(mitLicense);

        var openApi = new OpenAPI()
                .info(info)
                .servers(List.of(devServer, prodServer));
        this.addSecurity(openApi);

        return openApi;
    }
    private void addSecurity(OpenAPI openApi) {
        var components = this.createComponents();
        var securityItem = new SecurityRequirement().addList(SCHEME_NAME);
        openApi.components(components).addSecurityItem(securityItem);
    }

    private Components createComponents() {
        var components = new Components();
        components.addSecuritySchemes(SCHEME_NAME, this.createSecurityScheme());
        return components;
    }

    private SecurityScheme createSecurityScheme() {
        return new SecurityScheme().name(SCHEME_NAME).type(SecurityScheme.Type.HTTP).scheme(SCHEME);
    }
}
