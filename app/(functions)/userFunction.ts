/* eslint-disable */
import { LoginData, registerData } from "@/interfaces/interface_types";
import axios from "axios";
import { signOut } from "next-auth/react";

const userAxiosInstance = axios.create({ baseURL: process.env.NEXT_PUBLIC_USER_URL + "" });
const backendAxiosInstance = axios.create({ baseURL: process.env.NEXT_PUBLIC_SOCKET_URL + "", headers: { Authorization: "Bearer eyJhbGciOiJkaXIiLCJlbmMiOiJBMjU2R0NNIn0..dtRUFWyVH03Ek4Dn.lYMQgPvby3F6mM9cyJPx-Hm0pQU2ZvYXFnsa3IKj83HrZH7vy1lbaPdNpUx6NVZTvY5L-J3omAQwxTCAfagn3-eWf2q_K-IgTrHILagCFC4SbUck6GE0rzpvbUpGG-V7PsgbCdfm-eedOPOj99Z97VNtGJwwyabENvM4xpifnjXWbd5padEA6isM1RZ9HtqskKN80G50x5jnDxiX6EVX7iIbXQ4PWt6CPMT14Gw3O6pvjqpv-Gj27k3LQeCJNlvX0btalwYclqQ74kmLWddxadu0dpjFeVRS2_TWZFQC57jEgF6cIqHZmC3RSeMhwvUVgNQOBCitnnTWO-SMMfGmMaDpaDNyICU1aowXg7axljUB_PpPQMWWNju6YKE_4x01vNGqQY6OJhjheOr2EMEyxD_6ysVZ-zj_b2SYHpcIyVunekGhv8tv5kL2Lc8q44R59nnzphJFa9IF0xPbdcBJdqGVfyFVfWXjvpCkYv2fQxC_PfjYL33KA8dd2Xn_h1W-dUbMCPY3n5C8rk2U7cadzU0hCRiTZAzaVc4IEyP_Yw.M1mVw9gO-eDtzNm1UiypqQ" } })



export const logout = async (userId: string) => {
    signOut({ callbackUrl: "/login" });
    await backendAxiosInstance.post("/logout", { userId })
}

export function getTimeDifference(targetDate: string) {
    const currentDate = new Date();
    const targetDateTime = new Date(targetDate).getTime();
    const currentTime = currentDate.getTime();

    const timeDifference = Math.abs(targetDateTime - currentTime);
    const minutes = Math.floor((timeDifference / (1000 * 60)) % 60);
    const hours = Math.floor((timeDifference / (1000 * 60 * 60)) % 24);
    const days = Math.floor((timeDifference / (1000 * 60 * 60 * 24)) % 365);
    const months = Math.floor(days / 30);
    const years = Math.floor(days / 365);

    let timeString = '';

    if (years > 0) { timeString += years + (years === 1 ? ' year ' : ' years '); }
    if (months > 0) { timeString += months + (months === 1 ? ' month ' : ' months '); }
    if (days > 0) { timeString += days + (days === 1 ? ' day ' : ' days '); }
    if (hours > 0) { timeString += hours + (hours === 1 ? ' hour ' : ' hours '); }
    if (minutes > 0) { timeString += minutes + (minutes === 1 ? ' minute ' : ' minutes '); }

    return timeString.trim();
}


export const postLogin = async (Data: LoginData) => {
    try {
        const { data } = await userAxiosInstance.post("/login", Data);
        return data
    } catch (error: any) {
        console.log(error)
        return { message: error.message ?? "Error occured", status: false }
    }
}

export const postRegister = async (registerData: registerData) => {
    try {
        const { data } = await userAxiosInstance.post("/register", registerData);
        return data
    } catch (error: any) {
        console.log(error)
        return { message: error.message ?? "Error occured", status: false }
    }
}

export const getUsers = async () => {
    try {
        const { data } = await userAxiosInstance.get("/getUsers");
        return data
    } catch (error: any) {
        console.log(error)
        return { message: error.message ?? "Error occured", status: false }
    }
}

export const getUser = async (userId:string) => {
    try {
        const { data } = await userAxiosInstance.get("/getUsers/"+userId);
        return data
    } catch (error: any) {
        console.log(error)
        return { message: error.message ?? "Error occured", status: false }
    }
}

export const getChat = async (from: string, to: string) => {
    try {
        const { data } = await userAxiosInstance.get(`/chat?from=${from}&to=${to}`);
        return data
    } catch (error: any) {
        console.log(error)
        return { message: error.message ?? "Error occured", status: false }
    }
}


export const clearChatMessages = async (userId: string, selectedUserId: string) => {
    try {
        const { data } = await userAxiosInstance.delete(`/chat?userId=${userId}&selectedId=${selectedUserId}`)
        return data
    } catch (error: any) {
        console.log(error)
        return { message: error.message ?? "Error occured", status: false }
    }
}


export const userBlock = async (userId: string, selectedId: string) => {
    try {
        const { data } = await userAxiosInstance.patch("/block", { userId, selectedId });
        return data
    } catch (error: any) {
        return { message: error.message ?? "Error occured", status: false }
    }
}

export const saveProfilImage = async (file: File, userId: string) => {
    try {
        const formData = new FormData();
        formData.append("userId", userId);
        formData.append("profileImg", file); 
        const { data } = await backendAxiosInstance.post("/uploadImage", formData);
        return data;
    } catch (error: any) {
        return { message: error.message ?? "Error occurred", status: false };
    }
};
