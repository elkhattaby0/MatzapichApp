import { View, Text, TouchableOpacity, Image, StyleSheet } from 'react-native';
import { colors } from "../../../Assist/Colors"

const HeaderSection = ({ isToggleClosed, setIsToggleClosed }) => {
    return (
        <View style={styles.header}>
            <Text style={styles.logo}>MatZapich</Text>
            <View style={styles.headerRightSide}>
                <TouchableOpacity>
                <Image source={require('../../../Assist/camera.png')} style={styles.camera} />
                </TouchableOpacity>
                <TouchableOpacity onPress={()=> setIsToggleClosed(!isToggleClosed) }>
                <Image source={require('../../../Assist/dots.png')} style={styles.list} />
                </TouchableOpacity>
            </View>
        </View>
    )
}
const styles = StyleSheet.create({
    header: {
        flex: 0.1,
        flexDirection: "row",
        alignItems: 'center',
        justifyContent: 'space-between',
        width: '90%',
        marginBottom: 10,
        
    },

    logo: {
        color: colors.white,
        fontWeight: 600,
        fontSize: 30
    },
    headerRightSide: {
        flexDirection: 'row',
        justifyContent: "space-between",
        alignItems: 'flex-end',
        width: '18%',
    },
    camera: {
        width: 25, 
        height: 25
    },
    list: {
        width: 25, 
        height: 25
    },
})

export default HeaderSection;