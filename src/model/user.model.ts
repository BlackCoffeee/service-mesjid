export class RegisterUserRequest {
    name: string;
    username: string;
    password: string;
}

export class UserResponse {
    name: string;
    username: string;
    role?: string;
    refreshToken?: string;
}

export class LoginUserRequest {
    username: string;
    password: string;
}
