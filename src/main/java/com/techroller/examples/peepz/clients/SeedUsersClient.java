package com.techroller.examples.peepz.clients;

import com.techroller.examples.peepz.model.domain.User;
import com.fasterxml.jackson.databind.JsonNode;
import com.fasterxml.jackson.databind.ObjectMapper;
import org.springframework.boot.web.client.RestTemplateBuilder;
import org.springframework.cache.annotation.CacheConfig;
import org.springframework.cache.annotation.Cacheable;
import org.springframework.http.ResponseEntity;
import org.springframework.stereotype.Component;
import org.springframework.web.client.RestTemplate;

import javax.inject.Inject;
import javax.ws.rs.core.UriBuilder;
import java.io.IOException;
import java.net.URI;
import java.text.ParseException;
import java.text.SimpleDateFormat;
import java.util.Date;
import java.util.List;
import java.util.Locale;
import java.util.Optional;
import java.util.function.Function;
import java.util.stream.Collectors;
import java.util.stream.StreamSupport;

@Component
@CacheConfig(cacheNames = "seedUsers")
public class SeedUsersClient {
    private static final String RAMDOM_USER_API_BASE = "https://randomuser.me/api";
    // Arbitrary number of users to seed
    private static final String SEED_USERS_COUNT = "250";
    private static final ObjectMapper SIMPLE_MAPPER = new ObjectMapper();
    private static final SimpleDateFormat DATE_FORMAT = new SimpleDateFormat("yyyy-MM-dd'T'HH:mm:ss'Z'", Locale.US);

    private final RestTemplate restTemplate;

    @Inject
    public SeedUsersClient(RestTemplateBuilder restTemplateBuilder) {
        this.restTemplate = restTemplateBuilder
                .rootUri(RAMDOM_USER_API_BASE)
                .build();
    }

    @Cacheable
    public List<User> getSeedUsers() {

        URI uri = UriBuilder.fromUri(RAMDOM_USER_API_BASE)
                .queryParam("results", SEED_USERS_COUNT)
                .build();

        ResponseEntity<String> response = this.restTemplate.getForEntity(uri, String.class);
        String body = response.getBody();

        try {
            JsonNode jsonNode = SIMPLE_MAPPER.readTree(body);
            JsonNode resultsNode = jsonNode.get("results");

            List<User> users = StreamSupport.stream(resultsNode.spliterator(), true)
                    .map(node -> {
                        User user = new User();

                        maybeGet("dob", node, this::getDob)
                                .ifPresent(user::setDateOfBirth);
                        maybeGet("login", node, loginNode -> loginNode.get("username"))
                                .map(userNameNode -> userNameNode.asText())
                                .ifPresent(user::setUsername);
                        maybeGet("email", node, emailNode -> emailNode.asText())
                                .ifPresent(user::setEmail);

                        return user;
                    }).collect(Collectors.toList());
            return users;
        } catch (IOException e) {
            throw new RuntimeException(e);
        }
    }

    private Date getDob(JsonNode node) {
        try {
            String jsonDate = node.get("date").asText();
            return DATE_FORMAT.parse(jsonDate);
        } catch (ParseException e) {
            throw new RuntimeException(e);
        }
    }

    private <T> Optional<T> maybeGet(String nodeName, JsonNode parentNode, Function<JsonNode, T> func) {
        return Optional.ofNullable(parentNode.get(nodeName)).map(node -> func.apply(node));
    }
}
