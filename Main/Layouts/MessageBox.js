import { View, Text, StyleSheet } from "react-native";
import { colors } from "../../assets/Colors";

const MessageBox = ({ msg }) => {
    return (
        <View style={styles.containre}>
            <Text
                style={styles.txt}
            >{msg}</Text>
        </View>
    )
}

const styles = StyleSheet.create({
    containre: { 
        alignItems: 'center', 
        justifyContent: 'center' 
    },

    txt: { 
        position: 'absolute', 
        zIndex: 99, 
        backgroundColor: colors.softGreen,
        paddingLeft: 16, 
        paddingRight: 16, 
        paddingTop: 12,
        paddingBottom: 12,
        fontSize: 16, 
        top: 30, 
        borderRadius: 20 ,
        borderWidth: 3,
        borderColor: colors.green,
        fontSize: 15
    }
})

export default  MessageBox;