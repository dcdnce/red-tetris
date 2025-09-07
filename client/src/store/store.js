import { configureStore } from "@reduxjs/toolkit";
// Importer les reducers ici
import gameReducer from "./gameSlice";

export const store = configureStore({
    reducer: {
        game: gameReducer,
    },
    // Middleware
});
