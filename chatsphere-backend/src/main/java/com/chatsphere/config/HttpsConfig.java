package com.chatsphere.config;

import org.apache.catalina.connector.Connector;
import org.springframework.boot.web.embedded.tomcat.TomcatServletWebServerFactory;
import org.springframework.boot.web.server.WebServerFactoryCustomizer;
import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;

@Configuration
public class HttpsConfig {

    /*
     * Redirect HTTP (8080) → HTTPS (4040)
     * Prevents insecure access
     */
    @Bean
    public WebServerFactoryCustomizer<TomcatServletWebServerFactory> servletContainer() {
        return factory -> factory.addAdditionalTomcatConnectors(httpToHttpsRedirectConnector());
    }

    private Connector httpToHttpsRedirectConnector() {
        Connector connector = new Connector(
                TomcatServletWebServerFactory.DEFAULT_PROTOCOL);

        connector.setScheme("http");
        connector.setPort(8080);
        connector.setSecure(false);
        connector.setRedirectPort(4040);

        return connector;
    }
}
