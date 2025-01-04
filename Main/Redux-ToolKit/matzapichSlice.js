import { createSlice } from "@reduxjs/toolkit";

const initialState = {
    chats: [],
    contacts: [],
    users: [],
    conversations: [],
    messages: [],
    usersByChats: [],
    currentUser: null,
    loading: 0, 
    error: null,
}

export const matzapichSlice = createSlice({
    name: 'chats',
    initialState,
    reducers: {
        addUser: (state, action) => {
            state.users = action.payload;
        },
        addContact: (state, action) => {
            state.contacts = action.payload;
        },
        addCurrnetUser: (state, action)=> {
            state.currentUser = action.payload
        },
        addUsersByChats: (state, action) => {
            state.usersByChats = action.payload;
        },
        addChat: (state, action) => {
            const chat = state.chats.find(chat => chat.id === action.payload.id);
            if (chat) {
                chat.conversation.push(action.payload);
            }
        },
        addMessages: (state, action) => {
            state.messages = action.payload;
        },
        logout: (state) => {
            return initialState;
        },
    }
})

export const { addChat, addUser, addContact, addCurrnetUser, addMessages, addUsersByChats, logout } = matzapichSlice.actions;
export default matzapichSlice.reducer;