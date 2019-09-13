package com.techroller.examples.peepz.model.repository;

import com.techroller.examples.peepz.model.domain.User;
import org.springframework.data.repository.PagingAndSortingRepository;
import org.springframework.data.repository.query.Param;
import org.springframework.data.rest.core.annotation.RepositoryRestResource;
import org.springframework.data.rest.core.annotation.RestResource;

import java.util.UUID;

@RepositoryRestResource(collectionResourceRel = "users", path = "users")
public interface UsersRepository extends PagingAndSortingRepository<User, UUID> {
    @RestResource(path = "/{username}")
    User getByUsername(@Param("username") String username);
}
