import { configureStore } from "@reduxjs/toolkit";
import matzapichReducer from "./matzapichSlice";

export const store = configureStore({
    reducer: {
        chats: matzapichReducer,
    }
})