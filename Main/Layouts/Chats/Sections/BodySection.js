import { View, Text, StyleSheet, TouchableOpacity, TextInput, Image, TouchableWithoutFeedback, ScrollView } from "react-native";
import { colors } from "../../../Assist/Colors";
import { useNavigation } from "@react-navigation/native";
import { useDispatch, useSelector } from "react-redux";
import {logout } from "../../../Redux-ToolKit/matzapichSlice";
import { SignOut } from "../../../Supabase/supabaseApi";

const BodySection = ({ setIsToggleClosed, isToggleClosed, currentUserId})=> {  
    const navigation = useNavigation();
    const dispatch = useDispatch();
    const { loading, error, conversations } = useSelector(state=> state.chats)
    
    const CutText = (text) => {
        const x = 47;
        if(text.length >= x) {
            return `${text.slice(0, x)}...`
        } else {
            return text;
        }
    }
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
    
    

    const PickerHeader = () => {        
        return (
            <View style={{
                display: isToggleClosed ? 'flex': 'none',
                backgroundColor: colors.black, 
                shadowColor: colors.black, 
                shadowOffset: { width: 0, height: 10 },
                shadowOpacity: 0.8, 
                shadowRadius: 15, 
                elevation: 15, 
                width: 200,
                borderRadius: 10,
                position:'absolute',
                zIndex: 10,
                right: 0,
                padding:15,
                justifyContent:'space-evenly'
            }}>
            <TouchableOpacity><Text style={styles.stylePicker}>New grop</Text></TouchableOpacity>
            <TouchableOpacity><Text style={styles.stylePicker}>New broadcast</Text></TouchableOpacity>
            <TouchableOpacity><Text style={styles.stylePicker}>Linked devices</Text></TouchableOpacity>
            <TouchableOpacity><Text style={styles.stylePicker}>Starred messages</Text></TouchableOpacity>
            <TouchableOpacity><Text style={styles.stylePicker}
                onPress={()=> {
                    navigation.navigate('Settings');
                    setIsToggleClosed(!isToggleClosed) 
                }}
            >Settings</Text></TouchableOpacity>
            <TouchableOpacity
                onPress={async()=> {
                    try {
                        const { error } = await SignOut()
                        if(error) throw new Error(error)
                        dispatch(logout())
                    } catch (error) {
                        return;
                    }
                }}
            ><Text style={styles.stylePicker}>Log Out</Text></TouchableOpacity>
        </View>
        )
    } 

    return (
        <ScrollView style={styles.body}>
            <PickerHeader />
            <TextInput 
                style={styles.search}
                multiline={true}
                placeholder="🔍 Search"
                placeholderTextColor={colors.white}
            />
            
            {
                conversations
                .map(n=> (
                <TouchableWithoutFeedback
                    key={n?.contact_id} 
                    onPress={ async ()=> {          
                        navigation.navigate('Details', { 
                            UserId: currentUserId,
                            ContactId: n?.contact_id,
                            ContactName: n?.contact_name,
                            ContactImage: n?.contact_image
                        })
                    }}
                >
                    <View style={styles.content}>
                    <TouchableOpacity>
                        <Image 
                            source={
                                n?.contact_image !== null ? 
                                {uri: n?.contact_image} :
                                require("../../../Assist/user.png") 
                            }
                            
                            style={styles.image}  
                        />
                    </TouchableOpacity>
                    <View style={styles.contentLeft}>
                        <View style={styles.contentLeftTop}>
                            <Text style={styles.fullname}>{n.contact_name}</Text>
                            <Text style={styles.time}>{formatMessageTime(n.last_message_time)}</Text>
                        </View>
                        <View style={styles.contentLeftBottom}>
                            <Text style={styles.msg}>{CutText(n.last_message)}</Text>
                        </View>
                    </View>
                    </View>
                </TouchableWithoutFeedback>
                ))
            }
            
            <TouchableOpacity 
                activeOpacity={0.8}
                onPress={()=> navigation.navigate('AddNewContact')}
                style={{
                    position: 'absolute',
                    top: 560,
                    right: 0,
                    zIndex:10,
                    height: 60,
                    width: 60,
                    borderRadius: 20,
                    backgroundColor: colors.lightGreen,
                    alignItems: 'center',
                    justifyContent: 'center'
                    }}>
                        <Image
                            source={require('../../../Assist/contact.png')}
                            style={{
                                height: 28,
                                width: 28,
                            }}
                        />
            </TouchableOpacity>
        </ScrollView>
    )
    }
    
    const styles = StyleSheet.create({
        body: {
            flex: 0.82,
            width: '90%',
        },
        search: {
            backgroundColor: colors.softWhite,
            height:50,
            width: '100%',
            borderRadius:20,
            padding: 15,
            fontSize: 20,
            color: colors.white,
        },
        image: {
            backgroundColor: colors.grayImg,
            height: 50,
            width: 50,
            borderRadius: 100,
            padding:10,
            borderColor: colors.grayImg,
            borderWidth: 4
        }, 
        pikcer: {
            display: 'none',
            backgroundColor: colors.black, 
            shadowColor: colors.black, 
            shadowOffset: { width: 0, height: 10 },
            shadowOpacity: 0.8, 
            shadowRadius: 15, 
            elevation: 15, 
            width: 200,
            borderRadius: 10,
            position:'absolute',
            zIndex: 10,
            right: 0,
            padding:15,
            justifyContent:'space-evenly'
        },
        stylePicker : {
            color: colors.white, 
            fontSize: 16, 
            fontWeight:400, 
            height:45
        },
        content: {
            flexDirection:'row', 
            marginTop: 10,
            borderRadius: 25,
            // borderColor: colors.softWhite,
            // borderWidth: 0.5
        },
        contentLeft: {
            flex: 1, 
            justifyContent: 'center', 
            marginLeft: 10
        },
        contentLeftTop: {
            flexDirection:'row', 
            justifyContent: 'space-between'
        },
        contentLeftBottom: {
            flexDirection:'row', 
            alignItems: "center"
        },
        fullname: {
            fontSize: 18, 
            fontWeight: 700, 
            color: colors.white
        },
        time: {
            fontSize: 12, 
            fontWeight: 500, 
            marginRight: 10,
            color: colors.white
        },
        msg: {
            fontSize:15, 
            color: colors.gray
        },
        avatar: {
            width: 22,
            height: 22,
            marginRight: 5,
            transform: [{ rotate: '-15deg' }]
            }
})


export default BodySection;