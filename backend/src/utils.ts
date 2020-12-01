import { number } from "yup";

const utils = {
    getCurrentTime(): number {
        // wrong date. Date.now is returning Europe timezone
        // subtract 3h
        const currentTime = Date.now() - 3600000 * 3;
        return currentTime;
    }
}

export default utils;