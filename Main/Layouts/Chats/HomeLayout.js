import { StyleSheet, View, Platform, StatusBar } from "react-native";
import HeaderSection from "./Sections/HeaderSection";
import BodySection from "./Sections/BodySection";
import FooterSection from "./Sections/FooterSection";
import { useState, useEffect } from "react";
import { useSelector, useDispatch } from "react-redux";
import { ConversationCurrentUser } from "../../Supabase/supabaseApi";
import { addConversations } from "../../Redux-ToolKit/matzapichSlice";


const HomeLayout = () => {
    const [isToggleClosed, setIsToggleClosed] = useState(false);
    const dispatch = useDispatch();
    const currentUser = useSelector(state => state.chats.currentUser);
    const messages = useSelector(state => state.chats.messages);

    useEffect(() => {
        const fetchConversations = async () => {
            try {
                const { conversations, error } = await ConversationCurrentUser(currentUser?.id);
                if (error) throw new Error(error);
                dispatch(addConversations(conversations))
            } catch (err) {
                console.error("Error fetching conversations:", err.message);
            }
        };
    
        if (currentUser?.id) {
            fetchConversations();
        }
    }, [currentUser?.id,messages]);
    
    

    return (
        <View style={styles.containre}>
            <HeaderSection isToggleClosed={isToggleClosed} setIsToggleClosed={setIsToggleClosed} />
            <BodySection 
                isToggleClosed={isToggleClosed} 
                setIsToggleClosed={setIsToggleClosed} 
                currentUserId={currentUser?.id}
            />
            <FooterSection />
        </View>
    )
}

const styles = StyleSheet.create({
    containre: {
        flex: 1,
        backgroundColor: "#0b1014",
        alignItems: 'center',
        paddingTop: Platform.OS === "android" ? StatusBar.currentHeight : 0
    },
})

export default HomeLayout