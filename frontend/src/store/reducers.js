import { createSlice } from "@reduxjs/toolkit";

// Get token from localStorage
function getToken() {
    const token = localStorage.getItem("token");
    return token;
}

const initialState = {
    token: getToken() || "",
    roomToken: ""
};

const userSlice = createSlice({
    name: "user",
    initialState,
    reducers: {
        setUser: (state, action) => {
            state.token = action.payload.token;

            // Store in localStorage
            localStorage.setItem("token", action.payload.token);
        },
        logout: (state) => {
            state.token = "";

            // Remove from localStorage
            localStorage.removeItem("token");
        },
        storeRoomData: (state, action) => {
            state.roomToken = action.payload
        }
    },
});

const reducers = userSlice.reducer;
export const { setUser, logout, storeRoomData } = userSlice.actions;
export default reducers;
