import { StyleSheet, View, Platform, StatusBar } from "react-native";
import { supabase } from "../../Supabase/supabase";
import HeaderSection from "./Sections/HeaderSection";
import BodySection from "./Sections/BodySection";
import FooterSection from "./Sections/FooterSection";
import { useState, useEffect } from "react";
import { useSelector, useDispatch } from "react-redux";
import { addUser, addContact, addUsersByChats } from "../../Redux-ToolKit/matzapichSlice";


const HomeLayout = () => {
    const [isToggleClosed, setIsToggleClosed] = useState(false);
    const dispatch = useDispatch();
    const currentUser = useSelector(state => state.chats.currentUser);
    const users =useSelector(state => state.chats.users)
    const contacts = useSelector(state => state.chats.contacts);
    const lastChats = useSelector(state=> state.chats.usersByChats)
    
    useEffect(() => {
        if (users.length === 0) {
            const fetchUsers = async () => {
                try {
                    let { data: users, error } = await supabase
                        .from('users')
                        .select('*');
                    if (error) throw error;
                    dispatch(addUser(users));
                } catch (error) {
                    console.error("Error fetching users:", error.message);
                }
            };
            fetchUsers();
        }

        if (contacts.length === 0) {
            const fetchContact = async () => {
                try {
                    let { data: contacts, error } = await supabase
                        .from('contacts')
                        .select('*')
                        .eq("user_id", currentUser?.id);
                    if (error) throw error;
                    dispatch(addContact(contacts)); 
                } catch (error) {
                    // console.error("Error fetching contacts:", error.message);
                }
            };
            fetchContact();
            
            
        }
    }, [dispatch, users?.length, contacts?.length]);

    return (
        <View style={styles.containre}>
            <HeaderSection isToggleClosed={isToggleClosed} setIsToggleClosed={setIsToggleClosed} />
            <BodySection 
                isToggleClosed={isToggleClosed} 
                setIsToggleClosed={setIsToggleClosed} 
                users={users} contacts={contacts} currentUser={currentUser}
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