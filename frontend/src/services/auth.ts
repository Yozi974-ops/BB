import { api } from "./api";
import * as SecureStore from "expo-secure-store";

export interface User {
    id: number;
    email: string;
    username: string;
    display_name?: string;
}

// MOCK USER for "No Auth" mode
const MOCK_USER: User = {
    id: 1,
    email: "sebastian@example.com",
    username: "sebastian",
    display_name: "Sébastien Owner",
};

export const authService = {
    async getMe(): Promise<User> {
        // Return mock user immediately
        return Promise.resolve(MOCK_USER);
    },

    async logout() {
        // Do nothing or clear local storage if needed, but for now we are bypassing auth
        await SecureStore.deleteItemAsync("authToken");
    }
};
