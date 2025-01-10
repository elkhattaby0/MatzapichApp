import { View, Text, StyleSheet, ScrollView, ActivityIndicator } from "react-native";
import { colors } from "../../../Assist/Colors";
import { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { addMessages } from "../../../Redux-ToolKit/matzapichSlice";
import moment from "moment";

const BodySection = (props) => {
    const {loading, error, messages} = useSelector(state => state.chats);
    const [contentHeight, setContentHeight] = useState(0);
    const dispatch = useDispatch();
    console.log(loading)
    const formatMessageTime = (lastMessageTime) => {
        const messageDate = new Date(lastMessageTime);
        const currentDate = new Date();
        const messageDay = new Date(messageDate.getFullYear(), messageDate.getMonth(), messageDate.getDate());
        const today = new Date(currentDate.getFullYear(), currentDate.getMonth(), currentDate.getDate());
        const yesterday = new Date(today);
        yesterday.setDate(today.getDate() - 1); 
    
        if (messageDay.getTime() === today.getTime()) {
            const hours = messageDate.getHours().toString().padStart(2, "0");
            const minutes = messageDate.getMinutes().toString().padStart(2, "0");
            return `${hours}:${minutes}`;
        } else if (messageDay.getTime() === yesterday.getTime()) {
            return "Yesterday";
        } else {
            const year = messageDate.getFullYear().toString().slice(-2);;
            const month = (messageDate.getMonth() + 1).toString().padStart(2, "0");
            const day = messageDate.getDate().toString().padStart(2, "0");
            return `${month}/${day}/${year}`;
        }
    };




    const MsgStyle = (props) => {
        const isYou = props.sender === props.idCurrentUser;
        return (
            <View
                key={props.id}
                style={{
                    width: '100%',
                    alignItems: isYou ? 'flex-end' : 'flex-start',
                }}
            >
                <View
                    style={{
                        backgroundColor: isYou ? colors.green : colors.softWhite,
                        maxWidth: "70%",
                        width: 'auto',
                        padding: 10,
                        borderRadius: 10,
                        borderTopRightRadius: isYou ? 0 : 10,
                        borderTopLeftRadius: isYou ? 10 : 0,
                        flexDirection: 'row',
                        alignItems: 'flex-end',
                        marginTop: 8,
                        borderColor: colors.softWhite,
                        borderWidth: 0.8
                    }}
                >
                    <Text
                        style={{
                            color: colors.white,
                            fontSize: 18,
                            fontWeight: '500',
                            width: '82%',
                        }}
                    >
                        {props.message}
                    </Text>
                    <Text
                        style={{
                            textAlign: 'right',
                            color: colors.white,
                            fontSize: 13,
                            fontWeight: '500',
                            // marginLeft: 9,
                            top: 8,                            
                            // backgroundColor: 'red'
                        }}
                    >
                        {formatMessageTime(props.time)}
                    </Text>
                </View>
            </View>
        );
    };

    return (
        <ScrollView
            style={styles.body}
            onContentSizeChange={(contentWidth, contentHeight) => {
                setContentHeight(contentHeight);
            }}
            contentOffset={{ y: contentHeight }}
        >
            <View style={{ alignItems: 'center', marginTop: 5 }}>
                {
                    loading ?
                    <ActivityIndicator size="large" color={colors.lightGreen} /> : (
                        messages?.length > 0 ? (
                        messages.map((chat) => (
                            <MsgStyle
                                key={chat.id}
                                id={chat.id}
                                sender={chat.sender_id}
                                message={chat.message}
                                time={chat.timestamp}
                                idCurrentUser={props.idCurrentUser}
                            />
                        ))
                    ) : (
                        <Text style={styles.infoText}>
                            🔒 Messages and calls are end-to-end encrypted.
                        </Text>
                    )
                )}
            </View>
        </ScrollView>
    );
};

const styles = StyleSheet.create({
    body: {
        flex: 0.82,
        width: '90%',
    },
    infoText: {
        backgroundColor: colors.softWhite,
        color: "#dcc98c",
        padding: 6,
        textAlign: 'center',
        lineHeight: 19,
        marginTop: 10,
        borderRadius: 10,
    },
});

export default BodySection;
