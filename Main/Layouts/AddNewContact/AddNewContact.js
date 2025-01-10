import { View, StyleSheet, Platform, StatusBar } from "react-native";
import { colors } from "../../Assist/Colors";
import Header from "./Sections/Header";
import Body from "./Sections/Body";
import { useDispatch, useSelector } from "react-redux";
import { useEffect } from "react";
import { ReadContactsByCurrentUser, ReadUsers } from "../../Supabase/supabaseApi";
import { addContact, addUser, setLoading } from "../../Redux-ToolKit/matzapichSlice";

const AddNewContact = () => {
    const dispatch = useDispatch();
    const { loading, error, currentUser, contacts, users } = useSelector(state => state.chats);

    useEffect(()=> {
        const fetchContactsByCurrentUser = async () => {
            dispatch(setLoading(true))
            try {
                const { users } = await ReadUsers()
                const { contactsData, error } = await ReadContactsByCurrentUser(currentUser?.id)
                if(error) throw new Error(error)
                dispatch(addUser(users))
                dispatch(addContact(contactsData))
            } catch (error) {
                console.error("Error in ReadContactsByCurrentUser:", error.message);
            } finally {
                dispatch(setLoading(false))
            }
        }
        fetchContactsByCurrentUser()
    }, [currentUser?.id])
    
    return (
        <View style={styles.container}>
            <Header />
            <Body 
                currentUser={currentUser?.id} 
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
