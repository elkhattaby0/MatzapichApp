import { View, StyleSheet, Platform, StatusBar, ImageBackground } from "react-native";
import HeaderSection from "./Sections/HeaderSection";
import BodySection from "./Sections/BodySection";
import FooterSection from "./Sections/FooterSection";
import { addMessages, setLoading } from "../../Redux-ToolKit/matzapichSlice";
import { useState, useEffect } from "react";
import { useDispatch } from "react-redux";
import { ReadConversationsByCurrentUser, ReadMessagesByConversationID } from "../../Supabase/supabaseApi";

const DetailsLayouts = ({ route }) => {
    const { UserId, ContactId, ContactName, ContactImage } = route.params;
    const [conversationId, setConversationId] = useState(null);
    const dispatch = useDispatch();

    useEffect(() => {
        const fetchConversations = async () => {
            dispatch(setLoading(true));
            if (!UserId || !ContactId) return;
            try {
                const { conversations, error } = await ReadConversationsByCurrentUser(UserId, ContactId);
                if (error) {
                    console.error(`Error fetching conversations: ${error.message}`);
                    return; 
                }
    
                dispatch(addMessages([]));
                const firstConversation = conversations[0];
                if (firstConversation?.id) {
                    setConversationId(firstConversation.id);
                    await fetchMessagesByConversationID(firstConversation.id);
                }
            } catch (err) {
                console.error("Error in fetchConversations:", err.message);
            } finally {
                dispatch(setLoading(false));
            }
        };
    
        const fetchMessagesByConversationID = async (conversationId) => {
            try {
                const { messages, error } = await ReadMessagesByConversationID(conversationId);
                if (error) {
                    console.error(`Error fetching messages: ${error.message}`);
                    return;
                }
                dispatch(addMessages(messages));
            } catch (err) {
                console.error("Error in fetchMessagesByConversationID:", err.message);
            } finally {
                dispatch(setLoading(false));
            }
        };
    
        fetchConversations();
    }, [UserId, ContactId]);
    
    

    return (
        <View style={styles.container}>
            <ImageBackground
                source={require('../../Assist/background MatZapich.jpeg')}
                resizeMode="cover"
                style={{ width: '100%', height: '100%', alignItems: 'center' }}
            >
                <HeaderSection
                    idCurrentUser={UserId}
                    idContact={ContactId}
                    name={ContactName}
                    img={ContactImage}
                />
                <BodySection
                    idCurrentUser={UserId}
                    idContact={ContactId}
                />
                <FooterSection
                    idCurrentUser={UserId}
                    idContact={ContactId}
                    idConversation={conversationId}
                />
            </ImageBackground>
        </View>
    );
};

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: "#0b1014",
        alignItems: 'center',
        paddingTop: Platform.OS === "android" ? StatusBar.currentHeight : 0,
    },
});

export default DetailsLayouts;
