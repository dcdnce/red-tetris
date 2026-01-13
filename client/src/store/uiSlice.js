// store/uiSlice.js
import { createSlice } from "@reduxjs/toolkit";

const initialState = {
    lastHardDrop: {
        username: null,
        timestamp: null,
    },
};

const uiSlice = createSlice({
    name: "ui",
    initialState,
    reducers: {
        hardDropEffect: (state, action) => {
            state.lastHardDrop.username = action.payload.username;
            state.lastHardDrop.timestamp = Date.now();
        },
    },
});

export const { hardDropEffect } = uiSlice.actions;
export const selectLastHardDrop = (state) => state.ui.lastHardDrop;
export default uiSlice.reducer;
