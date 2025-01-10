import { View, TouchableOpacity, Text, Image, StyleSheet, TextInput } from "react-native";
import { colors } from "../../../Assist/Colors";
import { useDispatch, useSelector } from "react-redux";
import { useState } from "react";
import { addMessages } from "../../../Redux-ToolKit/matzapichSlice";
import { InsertMessagesByData, ReadMessagesByConversationID } from "../../../Supabase/supabaseApi";

const FooterSection = (props) => {
    const dispatch = useDispatch();
    const [chat, setChat] = useState({
        message: "",  
    });

    const handleSubmit = (name, value) => {
        setChat(prevValues => {

            return {
                ...prevValues,
                conversation_id: props.idConversation,
                sender_id: props.idCurrentUser,
                receiver_id: props.idContact,
                [name]: value,
            };
        });
    };

    const Result = async () => {
        if (chat.message.trim() === "") {
            return; 
        } else {
            try {
                setChat({message: ""})
                const { insertData, error } = await InsertMessagesByData(chat)
                if (error) throw new Error (error)
            } catch (error) {
                console.error("Error in InsertMessagesByData:", error.message);
            }
            try {
                const { messages, error } = await ReadMessagesByConversationID(props.idConversation);
                if (error) throw new Error(`Error fetching messages: ${error}`);
                dispatch(addMessages(messages));
            } catch (err) {
                console.error("Error in fetchMessagesByConversationID:", err.message);
            } 
        }

        
    };

    return (
        <View style={styles.footer}>
            <View style={{ justifyContent: 'center', alignItems: 'center' }}>
                <View style={{ flexDirection: 'row' }}>
                    <View style={{
                        backgroundColor: colors.softWhite,
                        flexDirection: 'row',
                        alignItems: 'center',
                        borderRadius: 45,
                        paddingLeft: 18,
                        paddingRight: 18,
                        paddingTop: 1,
                        paddingBottom: 1
                    }}>
                        <TouchableOpacity>
                            <Image
                                source={require("../../../Assist/sticker.png")}
                                style={{ height: 20, width: 20 }}
                            />
                        </TouchableOpacity>
                        <TextInput
                            placeholder="Message"
                            placeholderTextColor={colors.gray}
                            multiline={true}
                            numberOfLines={12}
                            value={chat.message} 
                            onChangeText={(text) => handleSubmit('message', text)} 
                            style={{
                                width: 186,
                                fontSize: 23,
                                padding: 12,
                                color: colors.white
                            }}
                        />
                        <TouchableOpacity>
                            <Image
                                source={require("../../../Assist/attach.png")}
                                style={{ height: 22, width: 22 }}
                            />
                        </TouchableOpacity>
                        <TouchableOpacity>
                            <Image
                                source={require("../../../Assist/camera2.png")}
                                style={{ height: 22, width: 22, marginLeft: 10 }}
                            />
                        </TouchableOpacity>
                    </View>
                    <TouchableOpacity
                        style={{
                            backgroundColor: "#21c063",
                            borderRadius: 100,
                            width: 50,
                            height: 50,
                            justifyContent: 'center',
                            alignItems: 'center',
                            marginLeft: 4
                        }}
                        onPress={Result} 
                    >
                        <Image
                            source={require("../../../Assist/send.png")}
                            style={{ height: 18, width: 18 }}
                        />
                    </TouchableOpacity>
                </View>
            </View>
        </View>
    );
};

const styles = StyleSheet.create({
    footer: {
        flex: 0.13,
        width: '90%',
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
        marginTop: 10
    },
    img: {
        height: 25,
        width: 25
    },
    txt: {
        color: colors.softGreen,
        fontSize: 16,
        fontWeight: 600,
        marginTop: 5
    }
});

export default FooterSection;
