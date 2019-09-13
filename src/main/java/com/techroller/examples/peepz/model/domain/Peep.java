package com.techroller.examples.peepz.model.domain;

import javax.persistence.Column;
import javax.persistence.Entity;
import javax.persistence.JoinColumn;
import javax.persistence.ManyToOne;

@Entity
public class Peep extends EntityBase {

    @ManyToOne
    @JoinColumn(name = "user_id")
    private User by;

    @Column(nullable = false)
    private String content;

    public User getBy() {
        return by;
    }

    public void setBy(User by) {
        this.by = by;
    }

    public String getContent() {
        return content;
    }

    public void setContent(String content) {
        this.content = content;
    }
}
