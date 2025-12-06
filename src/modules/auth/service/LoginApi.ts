import type {LoginRequest, LoginResponse} from "../../../context/auth/types.ts";
import {api} from "../../../config/axios.config.ts";

export async function loginApi(payload: LoginRequest): Promise<LoginResponse> {

    console.log(payload);
    const response = await api.post(`/auth/login`, payload);
    console.log(response);
    return response.data.data;
}