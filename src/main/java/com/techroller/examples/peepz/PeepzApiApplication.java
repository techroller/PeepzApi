package com.techroller.examples.peepz;

import com.techroller.examples.peepz.clients.SeedUsersClient;
import com.techroller.examples.peepz.model.domain.User;
import com.techroller.examples.peepz.model.repository.UsersRepository;
import org.springframework.boot.SpringApplication;
import org.springframework.boot.autoconfigure.SpringBootApplication;
import org.springframework.boot.autoconfigure.domain.EntityScan;
import org.springframework.cache.annotation.EnableCaching;
import org.springframework.context.ApplicationListener;
import org.springframework.context.ConfigurableApplicationContext;
import org.springframework.context.annotation.ComponentScan;
import org.springframework.context.annotation.Configuration;
import org.springframework.context.event.ContextStartedEvent;
import org.springframework.data.jpa.repository.config.EnableJpaRepositories;
import org.springframework.stereotype.Component;
import org.springframework.web.servlet.config.annotation.ResourceHandlerRegistry;
import org.springframework.web.servlet.config.annotation.WebMvcConfigurer;
import org.springframework.web.servlet.resource.WebJarsResourceResolver;

import javax.inject.Inject;
import java.util.List;

@SpringBootApplication
@ComponentScan(basePackages = {
        "com.techroller.examples.peepz.model.repository",
        "com.techroller.examples.peepz.controllers",
        "com.techroller.examples.peepz.clients"
})
@EntityScan(basePackages = {"com.techroller.examples.peepz.model.domain"})
@EnableJpaRepositories(basePackages = {"com.techroller.examples.peepz.model.repository"})
@EnableCaching
public class PeepzApiApplication {

    public static void main(String[] args) {
        ConfigurableApplicationContext ctx = SpringApplication.run(PeepzApiApplication.class, args);
        ctx.publishEvent(new ContextStartedEvent(ctx));
    }

    @Component
    public static class ContextStartedEventListener implements ApplicationListener<ContextStartedEvent> {

        private final SeedUsersClient client;
        private final UsersRepository repository;

        @Inject
        public ContextStartedEventListener(SeedUsersClient client, UsersRepository repository) {
            this.client = client;
            this.repository = repository;
        }

        @Override
        public void onApplicationEvent(ContextStartedEvent event) {
            List<User> users = client.getSeedUsers();
            repository.saveAll(users);
        }
    }

    @Configuration
    public static class StaticResourcesConfigurer implements WebMvcConfigurer {

        @Override
        public void addResourceHandlers(ResourceHandlerRegistry registry) {
            registry.addResourceHandler("/webjars/**")
                    .addResourceLocations("classpath:/META-INF/resources/webjars/")
                    .resourceChain(true)
                    .addResolver(new WebJarsResourceResolver());
        }
    }
}
