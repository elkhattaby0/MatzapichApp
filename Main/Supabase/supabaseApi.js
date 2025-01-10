import { supabase } from "./supabase";

// SIGN UP
export const SignUpApi = async (name, email, password) => {
    try {
        const { data: signUpData, error: signUpError } = await supabase.auth.signUp({ email, password });
        if (signUpError) throw signUpError;
        const userId = signUpData.user?.id;

        if (!userId) throw new Error('User ID not found during sign-up.'); 
        const { data: insertData, error: insertError } = await supabase.from('users').insert([
        { id: userId, name, profile_picture_url: null },
        ]);
        if (insertError) throw insertError;
        return { signUpData, insertData, error: null };
    } catch (error) {
        return { data: null, error: error.message };
    }
};

// SIGN IN
export const SignInApi = async (email, password) => {
    try {
        const { data: userData, error } = await supabase.auth.signInWithPassword({ email, password });
        if (error) throw error;
        return { userData, error: null };
    } catch (error) {
        return { data: null, error: error.message };  
    }
}

// SIGN OUT
export const SignOut = async () => {
    try {
        const { error } = await supabase.auth.signOut();
        if (error) throw error;
        return { error: null };
    } catch (error) {
        return { error: error.message };
    }
}

// Read CURRENT USER
export const ReadCurrentUser = async (userId) => {
    try {
        const { data: currentUser, error } = await supabase.from('users').select('*').eq('id', userId);
        if (error) throw error;
        return { currentUser, error: null };
    } catch (error) {
        return { data: null, error: error.message };
    }
}

// Read Conversation of Current User
export const ConversationCurrentUser = async (userId) => {
    try {
        const { data: messages, error: messagesError } = await supabase
            .from('messages')
            .select(`
                id,
                sender_id,
                receiver_id,
                message,
                timestamp
            `)
            .or(`sender_id.eq.${userId},receiver_id.eq.${userId}`)
            .order('timestamp', { ascending: false });

        if (messagesError) throw new Error(messagesError.message);

        const contactsMap = new Map();

        messages.forEach((msg) => {
            const contactId = msg.sender_id === userId ? msg.receiver_id : msg.sender_id;

            if (!contactsMap.has(contactId)) {
                contactsMap.set(contactId, {
                    contact_id: contactId,
                    last_message: msg.message,
                    last_message_time: msg.timestamp,
                });
            }
        });

        const conversations = Array.from(contactsMap.values());

        const contactIds = conversations.map((c) => c.contact_id);
        const { data: users, error: usersError } = await supabase
            .from('users')
            .select('id, name, profile_picture_url')
            .in('id', contactIds);

        if (usersError) throw new Error(usersError.message);

        const enrichedConversations = conversations.map((conversation) => {
            const user = users.find((u) => u.id === conversation.contact_id);
            return {
                ...conversation,
                contact_name: user?.name || "Unknown",
                contact_image: user?.profile_picture_url || null,
            };
        });

        return { conversations: enrichedConversations, error: null };
    } catch (error) {
        return { conversations: null, error: error.message || "Something went wrong" };
    }
};


// Read USERS
export const ReadUsers = async () => {
    try {
        let { data: users, error } = await supabase.from('users').select('*');
        if (error) throw error;
        return { users, error: null };
    } catch (error) {
        return { users: null, error: error.message };
    }
}

// Read Contats BY Current User
export const ReadContactsByCurrentUser = async (userId) => {
    try {
        const { data: contactsData, error } = await supabase.from('contacts').select('*').eq('user_id', userId);
        if (error) throw error;
        return { contactsData, error: null };
    } catch (error) {
        return { data: null, error: error.message };
    }   
}

// Read Conversations BY Current User
export const ReadConversationsByCurrentUser = async (userId, contactId) => {
    try {
        let { data: conversations, error } = await supabase
        .from('conversations')
        .select('*')
        .or(`and(user1_id.eq.${userId},user2_id.eq.${contactId}),and(user1_id.eq.${contactId},user2_id.eq.${userId})`);
        if (error) throw error;
        return { conversations, error: null };
    } catch (error) {
        return { conversations: null, error: error.message };
    }
} 

// Insert Conversation
export const InsertConversation = async (userId, contactId) => {
    try {
        const { data: insertData, error } = await supabase.from('conversations')
        .insert([{ "user1_id": userId, "user2_id": contactId }]).select()
        if (error) throw error;
        return { insertData, error: null };
    } catch (error) {
        return { data: null, error: error.message };
    }
}

// Read Messages BY Conversation id
export const ReadMessagesByConversationID = async (conversationId) => {
    try {
        const { data: messages, error } = await supabase
        .from('messages')
        .select('*').eq('conversation_id', conversationId);
        if (error) throw error
        return { messages, error: null }
    } catch (error) {
        return { conversations: null, error: error.message };
    }
}

// Insert Message BY Conversation id
export const InsertMessagesByData = async (data) => {
    try {
        const { data: insertData, error } = await supabase
        .from('messages').insert([data]).select()
        if(error) throw error
        return {insertData, error: null}
    } catch (error) {
        return {insertData: null, error: error.message}
    }

}

// Insert Contact By ContactID and CurrentUerID
export const InsertContactByContactIdAndCurrentUserID = async (userId, contactId) => {
    try {
        const { data: insertContact, error } = await supabase.from('contacts')
        .insert([
            { user_id: userId, contact_id: contactId }, 
            { user_id: contactId, contact_id: userId}]).select('*');
            if (error) throw error
            return { insertContact, error: null}
    } catch (error) {
        return {insertContact: null, error: error.message}
    }
}