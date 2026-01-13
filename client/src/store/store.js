import { configureStore } from "@reduxjs/toolkit";
// Importer les reducers ici
import gameReducer from "./gameSlice";
import uiReducer from "./uiSlice";

export const store = configureStore({
    reducer: {
        roomsHandler: gameReducer,
        ui: uiReducer,
    },
    // Middleware
});
