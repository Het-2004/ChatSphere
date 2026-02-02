package com.chatsphere.dto;

import com.chatsphere.model.Role;
import lombok.Builder;
import lombok.Getter;

@Getter
@Builder
public class UserResponse {

    private String id;
    private String username;
    private Role role;
    private boolean online;
}
