import { View, StyleSheet, Platform, StatusBar, ImageBackground } from "react-native";
import HeaderSection from "./Sections/HeaderSection";
import BodySection from "./Sections/BodySection";
import FooterSection from "./Sections/FooterSection";
import { supabase } from "../../Supabase/supabase";
import { addMessages } from "../../Redux-ToolKit/matzapichSlice";
import { useState, useEffect } from "react";
import { useDispatch } from "react-redux";

const DetailsLayouts = ({ route }) => {
    const { itemId, name, image, currentUserId } = route.params;
    const [conversations, setConversations] = useState([]);
    const dispatch = useDispatch();

    useEffect(() => {
        const fetchConversations = async () => {
            try {
                const { data, error } = await supabase
                    .from('conversations')
                    .select('*')
                    .or(
                        `and(user1_id.eq.${currentUserId},user2_id.eq.${itemId}),and(user1_id.eq.${itemId},user2_id.eq.${currentUserId})`
                    );
                if (error) throw error;
                setConversations(data);
            } catch (error) {
                console.error('Error fetching conversations:', error.message);
            }
        };

        fetchConversations();
    }, [currentUserId, itemId]);

    useEffect(() => {
        const fetchMessages = async () => {
            try {
                dispatch(addMessages([])); // Clear previous messages
                if (conversations[0]?.id) {
                    const { data: messages, error } = await supabase
                        .from('messages')
                        .select('*')
                        .eq('conversation_id', conversations[0].id);
                    if (error) throw error;
                    dispatch(addMessages(messages));
                }
            } catch (error) {
                console.error("Error fetching messages:", error.message);
            }
        };

        fetchMessages();
    }, [conversations, dispatch]);

    return (
        <View style={styles.container}>
            <ImageBackground
                source={require('../../Assist/background MatZapich.jpeg')}
                resizeMode="cover"
                style={{ width: '100%', height: '100%', alignItems: 'center' }}
            >
                <HeaderSection
                    idCurrentUser={currentUserId}
                    idContact={itemId}
                    idConversation={conversations[0]?.id}
                    name={name}
                    img={image}
                />
                <BodySection
                    idCurrentUser={currentUserId}
                    idContact={itemId}
                    idConversation={conversations[0]?.id}
                />
                <FooterSection
                    idCurrentUser={currentUserId}
                    idContact={itemId}
                    idConversation={conversations[0]?.id}
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
