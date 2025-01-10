import React, { useState } from "react";
import {
    View,
    Text,
    StyleSheet,
    TextInput,
    ScrollView,
    Image,
    TouchableOpacity,
    ActivityIndicator,
} from "react-native";
import { colors } from "../../../Assist/Colors";
import { useSelector, useDispatch } from "react-redux";
import { addContact, setLoading, addMessages } from "../../../Redux-ToolKit/matzapichSlice";
import {
    InsertContactByContactIdAndCurrentUserID,
    InsertConversation,
    ReadContactsByCurrentUser,
    ReadConversationsByCurrentUser,
} from "../../../Supabase/supabaseApi";
import { useNavigation } from "@react-navigation/native";

const Body = ({ currentUser }) => {
    const navigation = useNavigation();
    const [searchQuery, setSearchQuery] = useState("");
    const dispatch = useDispatch();
    const { loading, contacts, users } = useSelector((state) => state.chats);

    const Contact = ({ id, name, isFollowed, onPress, loading }) => (
        <View style={styles.contactCard} key={id}>
            <Image
                style={styles.contactImage}
                source={require("../../../Assist/user.png")}
            />
            <Text style={styles.contactName}>{name}</Text>
            <TouchableOpacity
                style={styles.contactButton}
                activeOpacity={0.8}
                onPress={onPress}
                disabled={loading}
            >
                {loading ? (
                    <ActivityIndicator size="small" color={colors.lightGreen} />
                ) : (
                    <Text
                        style={[
                            styles.contactButtonText,
                            !isFollowed && {
                                color: colors.softWhite,
                                backgroundColor: colors.lightGreen,
                                borderWidth: 1,
                                borderRadius: 15,
                            },
                            isFollowed && {
                                color: colors.lightGreen,
                                borderColor: colors.lightGreen,
                                borderWidth: 1,
                                borderRadius: 15,
                            },
                        ]}
                    >
                        {!isFollowed ? "Add" : "Message"}
                    </Text>
                )}
            </TouchableOpacity>
        </View>
    );

    const handleAddContact = async (userId) => {
        if (loading[userId]) return; 
        dispatch(setLoading({ id: userId, isLoading: true })); 

        try {
            const { insertContact, error } = await InsertContactByContactIdAndCurrentUserID(
                currentUser,
                userId
            );
            if (error) throw new Error(error);

            const { contactsData, error: readError } = await ReadContactsByCurrentUser(currentUser);
            if (readError) throw new Error(readError);

            dispatch(addContact(contactsData));
        } catch (error) {
            console.error("Error managing contacts:", error.message);
        } finally {
            dispatch(setLoading({ id: userId, isLoading: false }));
        }
    };

    const handleConversation = async (userId, contactId, contactName, contactImage) => {
        if (loading[contactId]) return; 
        dispatch(setLoading({ id: contactId, isLoading: true })); 

        try {
            const { conversations, error } = await ReadConversationsByCurrentUser(userId, contactId);
            if (error) throw new Error(error);

            if (conversations.length === 0) {
                try {
                    const { insertData, error } = await InsertConversation(userId, contactId);
                    if (error) throw new Error(error);
                } catch (error) {
                    console.error("Error InsertConversation:", error.message);
                    return;
                }
            }
        } catch (error) {
            console.error("Error handleConversation:", error.message);
        } finally {
            dispatch(setLoading({ id: contactId, isLoading: false })); 
            dispatch(addMessages([]));
            navigation.navigate("Details", {
                UserId: userId,
                ContactId: contactId,
                ContactName: contactName,
                ContactImage: contactImage,
            });
        }
    };

    const filteredUsers = users?.filter((user) =>
        user.name.toLowerCase().includes(searchQuery.toLowerCase())
    );

    return (
        <View style={styles.container}>
            <TextInput
                style={styles.search}
                placeholder="🔍 Search"
                placeholderTextColor={colors.white}
                onChangeText={(text) => setSearchQuery(text)}
            />
            <ScrollView>
                <Text style={styles.sectionTitle}>Contacts on MatZapich</Text>
                <View style={styles.contactList}>
                    {filteredUsers
                        ?.filter((user) =>
                            contacts.some((contact) => contact.contact_id === user.id)
                        )
                        ?.map((user) => (
                            <Contact
                                key={user.id}
                                id={user.id}
                                name={user.name}
                                isFollowed={true}
                                onPress={() =>
                                    handleConversation(
                                        currentUser,
                                        user?.id,
                                        user?.name,
                                        user?.profile_picture_url
                                    )
                                }
                                loading={loading[user.id]}
                            />
                        ))}
                </View>

                <Text style={styles.sectionTitle}>Add New Friend</Text>
                <View style={styles.contactList}>
                    {filteredUsers
                        ?.filter(
                            (user) =>
                                user.id !== currentUser &&
                                !contacts.some((contact) => contact.contact_id === user.id)
                        )
                        ?.map((user) => (
                            <Contact
                                key={user.id}
                                id={user.id}
                                name={user.name}
                                isFollowed={false}
                                onPress={() => handleAddContact(user.id)}
                                loading={loading[user.id]}
                            />
                        ))}
                </View>
            </ScrollView>
        </View>
    );
};

const styles = StyleSheet.create({
    container: {
        width: "90%",
        height: "90%",
    },
    search: {
        backgroundColor: colors.softWhite,
        height: 50,
        width: "100%",
        borderRadius: 20,
        padding: 15,
        fontSize: 20,
        color: colors.white,
        marginBottom: 20,
    },
    sectionTitle: {
        color: colors.gray,
        fontSize: 18,
        fontWeight: "700",
        marginVertical: 10,
    },
    contactList: {
        width: "100%",
        flexDirection: "row",
        flexWrap: "wrap",
        justifyContent: "space-between",
        marginTop: 15,
    },
    contactCard: {
        flexDirection: "column",
        justifyContent: "space-between",
        alignItems: "center",
        marginBottom: 15,
        backgroundColor: colors.softWhite,
        borderRadius: 10,
        width: "48%",
        padding: 15,
    },
    contactImage: {
        backgroundColor: colors.grayImg,
        height: 70,
        width: 70,
        borderRadius: 100,
        borderColor: colors.white,
        borderWidth: 0.5,
    },
    contactName: {
        color: colors.white,
        fontSize: 20,
        fontWeight: "600",
        marginTop: 12,
        marginBottom: 12,
    },
    contactButton: {
        padding: 7,
        borderRadius: 20,
        width: 100,
        textAlign: "center",
    },
    contactButtonText: {
        textAlign: "center",
        paddingVertical: 5,
        fontWeight: "600",
    },
});

export default Body;
