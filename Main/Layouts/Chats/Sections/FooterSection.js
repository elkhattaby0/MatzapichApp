import { View, TouchableOpacity, Text, Image, StyleSheet } from "react-native";
import FooterBody from "../../../Json/FooterBody.json"
import { colors } from "../../../Assist/Colors";
import { useNavigation } from "@react-navigation/native";

const FooterSection = () => {
    const navigation = useNavigation();
    
    const getImageSource = (imageName) => {
        switch (imageName) {
            case 'chat.png':
                return require('../../../Assist/chat.png');
            case 'updates.png':
                return require('../../../Assist/updates.png');
            case 'group.png':
                return require('../../../Assist/group.png');
            case 'call.png':
                return require('../../../Assist/call.png');
        }
    };
    return (
        <View style={styles.footer}>
        {
            FooterBody.map(n=> (
                <View style={{justifyContent: 'center', alignItems: 'center'}} key={n.id}>
                    <TouchableOpacity
                    style={{
                        backgroundColor: n.isActive ? colors.green : colors.black, 
                        width: 70,
                        height: 40,
                        borderRadius: 20,
                        justifyContent: 'center',
                        alignItems: 'center'
                    }}
                    >
                    <Image
                        source={getImageSource(n.img)}
                        style={styles.img}
                    />
                    </TouchableOpacity>
                    <Text
                    style={styles.txt}
                    >{n.title}</Text>
                </View>
            ))
        }
        </View>
    )
}

const styles = StyleSheet.create({
    footer: {
        flex: 0.13,
        width: '90%',
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center'
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
})

export default FooterSection;