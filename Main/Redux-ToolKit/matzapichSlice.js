import { createSlice } from "@reduxjs/toolkit";
import { SignUpApi, SignInApi, ReadUsers } from "../Supabase/supabaseApi";

const initialState = {
    chats: [],
    contacts: [],
    users: [],
    conversations: [],
    messages: [],
    usersByChats: [],
    currentUser: null,
    loading: false, // 
    error: null,
}

export const matzapichSlice = createSlice({
    name: 'chats',
    initialState,
    reducers: {
        setLoading: (state, action) => {
            state.loading = action.payload;
        },
        setError: (state, action) => {
            state.error = action.payload;
        },



        addUser: (state, action) => {
            state.users = action.payload;
        },
        addContact: (state, action) => {
            state.contacts = action.payload;
        },
        addConversations: (state, action) => {
            state.conversations = action.payload
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

export const { setLoading, setError, addChat, addUser, addContact, addConversations, addCurrnetUser, addMessages, addUsersByChats, logout } = matzapichSlice.actions;
export default matzapichSlice.reducer;