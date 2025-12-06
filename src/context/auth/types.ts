export interface LoginRequest {

    username:string,
    password:string
}

export interface UserData {
  username: string;
  id: string;
  email: string;
  fullname: string;
  roles: string[];
  companyId: number;
  companyName: string;
}

export interface LoginResponse {

  accessToken: string;
  refreshToken: string;
  expiresIn: number;
  tokenType: string;
  user: UserData;
}

// interface ApiResponse<T> {
//   success: boolean;
//   message: string;
//   data: T;
// }

export interface LoginStatus {
    token: string | null;
    user: UserData | null
}
export interface LoginPayload {

    token: string;
    user:UserData
}