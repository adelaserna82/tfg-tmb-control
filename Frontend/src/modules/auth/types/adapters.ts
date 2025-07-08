export interface LoginRequest {
    email: string;
    password: string;
}

export function loginRequestAdapter(email: string, password: string): LoginRequest {
    return {
        email,
        password,
    };
}