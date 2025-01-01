export class RegisterUserRequest {
    name: string;
    username: string;
    password: string;
}

export class RegisterUserResponse {
    name: string;
    username: string;
    role?: string;
    refreshToken?: string;
}
