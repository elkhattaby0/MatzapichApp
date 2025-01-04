import { View, TouchableOpacity, Image, Text, StyleSheet } from 'react-native';
import { colors } from '../../../Assist/Colors';
import { useNavigation } from '@react-navigation/native';

const Header = () => {
    const navigate = useNavigation();

    return (
        <View style={header.header}>
                <TouchableOpacity onPress={()=> navigate.goBack()}>
                <Image source={require('../../../Assist/arrow.png')} style={header.camera} />
                </TouchableOpacity>
            <Text style={header.logo}>Find Friends</Text>
        </View>
    )
}

const header = StyleSheet.create({
    header: {
        height: "10%",
        flexDirection: "row",
        alignItems: 'center',
        // borderBottomColor: colors.gray,
        // borderBottomWidth:0.2,
        width: '90%'
    },

    logo: {
        color: colors.white,
        fontWeight: 800,
        fontSize: 35,
        marginLeft: 15
    },
    camera: {
        width: 20, 
        height: 20
    },
})

export default Header;