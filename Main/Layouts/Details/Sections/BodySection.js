import { View, Text, StyleSheet, ScrollView, ActivityIndicator } from "react-native";
import { colors } from "../../../Assist/Colors";
import { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { supabase } from "../../../Supabase/supabase";
import { addMessages } from "../../../Redux-ToolKit/matzapichSlice";
import moment from "moment";

const BodySection = (props) => {
    const Chats = useSelector(state => state.chats.messages);
    const [contentHeight, setContentHeight] = useState(0);
    const [isLoading, setIsLoading] = useState(false);
    const dispatch = useDispatch();


    const formatMessageTime = (time) => {
        // const messageDate = moment(time, 'YYYY-MM-DD HH:mm:ss');
        // const now = moment();
        // const diffHours = now.diff(messageDate, 'hours');
        // const diffMinutes = now.diff(messageDate, 'minutes');
        const now = moment();
        const dataTime = moment(time, 'YYYY-MM-DD HH:mm:ss')
        const diff = now.format('YYYY-MM-DD HH:mm:ss') - dataTime
        return diff
        // if (diffHours < 24) {
        //     // if (diffHours > 0) {
        //     //     return `${diffHours} hour${diffHours > 1 ? 's' : ''} ago`;
        //     // }
        //     // return `${diffMinutes} minute${diffMinutes > 1 ? 's' : ''} ago`;
        //     // return messageDate.format('HH:mm')
        //     return (now.format('YYYY-MM-DD HH:mm:ss'))
        // } else if (diffHours < 48 && messageDate.isSame(now.subtract(1, 'day'), 'day')) {
        //     return 'Yesterday';
        // } else {
        //     return messageDate.format('YYYY-MM-DD');
        // }
    };
    


    useEffect(() => {
        setIsLoading(true);
        const fetchMessages = async () => {
            try {
                dispatch(addMessages([])); // Clear previous messages
                if (props.idConversation) {
                    const { data: messages, error } = await supabase
                        .from('messages')
                        .select('*')
                        .eq('conversation_id', props.idConversation);
                    if (error) throw error;
                    dispatch(addMessages(messages));
                    setIsLoading(false);
                }
            } catch (error) {
                console.error("Error fetching messages:", error.message);
            }
        };

        fetchMessages();
    }, [props.idConversation, dispatch]);

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
                            marginLeft: 9,
                            top: 8,
                        }}
                    >
                        {formatMessageTime(props.time)}
                        {/* {moment(props.time, 'YYYY-MM-DD HH:mm:ss').format('HH:mm')} */}
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
                    isLoading ?
                    <ActivityIndicator size="large" color={colors.lightGreen} /> : (
                    Chats.length > 0 ? (
                        Chats.map((chat) => (
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
