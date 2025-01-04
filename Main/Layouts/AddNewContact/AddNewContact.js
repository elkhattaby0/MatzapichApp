import { View, StyleSheet, Platform, StatusBar } from "react-native";
import { colors } from "../../Assist/Colors";
import Header from "./Sections/Header";
import Body from "./Sections/Body";
import { useDispatch, useSelector } from "react-redux";
// import { useEffect } from "react";
// import { supabase } from "../../Supabase/supabase";
// import { addUser, addContact } from "../../Redux-ToolKit/matzapichSlice";

const AddNewContact = () => {
    const dispatch = useDispatch();

    const users = useSelector(state => state.chats.users);
    const contacts = useSelector(state => state.chats.contacts);
    const currentUser = useSelector(state => state.chats.currentUser);

    // useEffect(() => {
    //     if (users.length === 0) {
    //         const fetchUsers = async () => {
    //             try {
    //                 let { data: users, error } = await supabase
    //                     .from('users')
    //                     .select('*');
    //                 if (error) throw error;
    //                 dispatch(addUser(users));
    //             } catch (error) {
    //                 console.error("Error fetching users:", error.message);
    //             }
    //         };
    //         fetchUsers();
    //     }

    //     if (contacts.length === 0) {
    //         const fetchContact = async () => {
    //             try {
    //                 let { data: contacts, error } = await supabase
    //                     .from('contacts')
    //                     .select('*')
    //                     .eq("user_id", currentUser?.id);
                        

    //                 if (error) throw error;
    //                 dispatch(addContact(contacts)); 
    //             } catch (error) {
    //                 console.error("Error fetching contacts:", error.message);
    //             }
    //         };
    //         fetchContact();
            
    //     }
    // }, [dispatch, users.length, contacts.length]);

    return (
        <View style={styles.container}>
            <Header />
            <Body 
                users={users} contacts={contacts} currentUser={currentUser}
            />
        </View>
    );
};

const styles = StyleSheet.create({
    container: {
        flex: 1,
        flexDirection: 'column',
        backgroundColor: colors.black,
        paddingTop: Platform.OS === "android" ? StatusBar.currentHeight : 0,
        alignItems: 'center',
    },
});

export default AddNewContact;
