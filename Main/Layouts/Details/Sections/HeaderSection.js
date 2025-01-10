import { useState } from "react";
import { View, Text, TouchableOpacity, Image, StyleSheet, Alert } from 'react-native';
import { colors } from "../../../Assist/Colors"
import { useNavigation } from "@react-navigation/native";

const HeaderSection = (props) => {
    const [isClosed, setIsClosed] = useState(false)
    const navigation = useNavigation()
    return (
        <View style={styles.header} key={props.idConversation}>
        <View style={{
            width: '90%',
            flexDirection: "row",
            alignItems: 'center',
            justifyContent: 'space-between' 
        }}>
            <View
                style={{flexDirection: 'row', alignItems: 'center', width:'50%'}}
            >   
                <TouchableOpacity style={{marginRight:10}} onPress={()=> navigation.goBack()}>
                    <Image source={require('../../../Assist/arrow.png')} style={{
                        width: 20, 
                        height: 20
                    }} />
                </TouchableOpacity>
                <TouchableOpacity>
                    <Image 
                        source={
                            props.img !== null ? 
                            {uri: props.img} :
                            require("../../../Assist/user.png") 
                        }
                        style={styles.image}
                    />
                </TouchableOpacity>
                <TouchableOpacity  activeOpacity={0.5}
                    // onPress={()=> {
                    //     Alert.alert('', `Conversation ID: ${props?.idConversation}\nContact ID: ${props?.idContact}\nCurrent User ID: ${props?.idCurrentUser}\nCurrent User Name: ${props?.idCurrentUser}\nContact Name: ${props?.name}`)
                    // }}
                >
                    <Text
                        style={{color: colors.white, fontSize: 24, fontWeight: 600, marginLeft:8}}
                    >{(props?.name).slice(0,25)}</Text>
                </TouchableOpacity>
            </View>
            <View style={styles.headerRightSide}>
                <TouchableOpacity>
                    <Image source={require('../../../Assist/video.png')} style={styles.camera} />
                </TouchableOpacity>
                <TouchableOpacity>
                    <Image source={require('../../../Assist/call2.png')} style={{
                        width: 20, 
                        height: 20
                    }} />
                </TouchableOpacity>
                <TouchableOpacity onPress={()=> isClosed ? setIsClosed(false): setIsClosed(true)}>
                    <Image source={require('../../../Assist/dots.png')} style={styles.list} />
                </TouchableOpacity>
            </View>
        </View>
        </View>
    )
}
const styles = StyleSheet.create({
    header: {
        flex: 0.11,
        flexDirection: "row",
        alignItems: 'center',
        justifyContent: 'center',
        width: '100 %',
        backgroundColor: colors.black,
        shadowColor: colors.black,
        shadowOffset: { width: 0, height: 14 },
        shadowOpacity: 0.5,
        shadowRadius: 6,
        // For Android
        elevation: 15,
        // borderBlockColor: colors.grayImg,
        // borderBottomWidth: 0.2
    },

    logo: {
        color: colors.white,
        fontWeight: 600,
        fontSize: 30
    },
    headerRightSide: {
        flexDirection: 'row',
        justifyContent: "space-between",
        // alignItems: 'flex-end',
        alignItems: 'center',
        width: '30%',
        // backgroundColor: 'red'
    },
    camera: {
        width: 25, 
        height: 25
    },
    list: {
        width: 25, 
        height: 25
    },
    image: {
        height:40, 
        width: 40, 
        backgroundColor: colors.grayImg, 
        borderRadius: 100
    }
})

export default HeaderSection;