import { LoginData, registerData } from "@/interfaces/interface_types";
import axios from "axios";


const userAxiosInstance = axios.create({ baseURL: "http://localhost:3000/api/users" })

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