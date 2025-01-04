import { View, Text, StyleSheet, TouchableOpacity, TextInput, Image, TouchableWithoutFeedback, ScrollView, Alert } from "react-native";
import { colors } from "../../../Assist/Colors";
import { CommonActions, useNavigation } from "@react-navigation/native";
import { useDispatch, useSelector } from "react-redux";
import AsyncStorage from '@react-native-async-storage/async-storage';
import { supabase } from "../../../Supabase/supabase";
import { addCurrnetUser, logout } from "../../../Redux-ToolKit/matzapichSlice";

const BodySection = ({ setIsToggleClosed, isToggleClosed, users, contacts, currentUser })=> {  
    const navigation = useNavigation();
    const dispatch = useDispatch();
    const CutText = (text) => {
        const x = 47;
        if(text.length >= x) {
            return `${text.slice(0, x)}...`
        } else {
            return text;
        }
    }
    const getData = async () => {
        // const userSession = await AsyncStorage.getItem('user');
        // const session = JSON.parse(userSession)
        // console.log('Full Session => ', userSession);
    }
    // getData()
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

                        const { error } = await supabase.auth.signOut();
                        if (error) {
                            console.error('Error during sign out:', error.message);
                            alert('Failed to log out. Please try again.');
                            return;
                        }
            
                        await AsyncStorage.removeItem('userToken');
                        await AsyncStorage.clear();
                        dispatch(logout())
                        dispatch(addCurrnetUser(null));
                        
                        setTimeout(() => {
                            navigation.dispatch(
                                CommonActions.reset({
                                    index: 0,
                                    routes: [{ name: 'SignIn' }], 
                                })
                            );
                        },100)
                        setIsToggleClosed(!isToggleClosed) 
                    } catch (e) {
                        console.error('Unexpected error during logout:', e.message);
                        alert('An unexpected error occurred during logout.');
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
                placeholder="&#127940; Search"
                placeholderTextColor={colors.white}
            />
            
            {
                users.filter(user => contacts.filter(contact => contact?.contact_id === user?.id ).length > 0) 
                .map(n=> (
                <TouchableWithoutFeedback
                    key={n.id} 
                    onPress={ async ()=> {           
                        try {
                            let { data: conversations, error } = await supabase
                            .from('conversations')
                            .select('*')
                            .or(
                                `and(user1_id.eq.${currentUser?.id},user2_id.eq.${n.id}),and(user1_id.eq.${n.id},user2_id.eq.${currentUser?.id})`
                            );
                            if (error) throw error;
                            if(conversations.length <= 0) {
                                try {
                                    const { data, error } = await supabase
                                    .from('conversations')
                                    .insert([
                                    { "user1_id": currentUser?.id, "user2_id": n.id },
                                    ])
                                    .select()
                                    if(error) throw error;
                                } catch (error) {
                                    
                                }
                            }
                        } catch (error) {
                            console.error('Error fetching conversations:', error.message);
                        }                               
                        navigation.navigate('Details', { 
                            itemId: n.id, 
                            name: n.name, 
                            image: n.profile_picture_url,
                            currentUserId: currentUser?.id
                        })
                    }}
                >
                    <View style={styles.content}>
                    <TouchableOpacity>
                        <Image 
                            source={
                                n?.profile_picture_url !== null ? 
                                {uri: n?.profile_picture_url} :
                                require("../../../Assist/user.png") 
                            }
                            
                            style={styles.image}  
                        />
                    </TouchableOpacity>
                    <View style={styles.contentLeft}>
                        <View style={styles.contentLeftTop}>
                            <Text style={styles.fullname}>{n.name}</Text>
                            <Text style={styles.time}>22:26</Text>
                        </View>
                        <View style={styles.contentLeftBottom}>
                            {/* <Image
                                source={(() => {
                                    switch (false) {
                                        case true:
                                            return require('../../../Assist/read_true.png');
                                        case false:
                                            return require('../../../Assist/read_false.png');
                                        default:
                                            return null;  
                                    }
                                })()}
                                style={styles.avatar}
                            /> */}
                            <Text style={styles.msg}>{CutText("Hey, How are you doing i hope you're well Hey How are you doing i hope you're well")}</Text>
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
            // display: getIsClosed ? 'flex': 'none',
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
            // backgroundColor: colors.softWhite,
            borderRadius: 25,
            borderColor: colors.softWhite,
            borderWidth: 0.5
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
            marginRight: 25,
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