import { Text, View, Platform, StatusBar, TextInput, TouchableOpacity, StyleSheet, ImageBackground, ScrollView } from "react-native";
import { colors } from "../../Assist/Colors";
import { useNavigation } from "@react-navigation/native";
import { useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { addUser } from "../../Redux-ToolKit/matzapichSlice";
import { supabase } from "../../Supabase/supabase";
import Structure from "../../Json/Structure.json";

const Identify = Structure.app; 
const Main = Structure.Auth.SignUp;

const Inscription = ({ data, handleData, Result }) => {
    return (
        <View style={styles.containre}>
            <View
                style={styles.section}
            >
                <Text style={styles.label}>{Main.labelName} {data.name && (data.name).length >= 25 && "( Max 25 characters )"}</Text>
                <TextInput 
                    placeholder={Main.PlaceholderName}
                    maxLength={25}
                    placeholderTextColor={colors.softGreen}
                    multiline={false}
                    style={styles.input}
                    value={data.name}
                    onChangeText={(e)=> handleData('name', e)}
                />
            </View>
            <View
                style={styles.section}
            >
                <Text style={styles.label}>{Main.labelEmail}</Text>
                <TextInput 
                    placeholder={Main.PlaceholderEmail}
                    placeholderTextColor={colors.softGreen}
                    multiline={false}
                    keyboardType="email-address"
                    style={styles.input}
                    value={data.email}
                    onChangeText={(value)=> handleData('email', value)}
                />
            </View>
            <View
                style={styles.section}
            >
                <Text style={styles.label}>{Main.labelPassword}</Text>
                <TextInput 
                    placeholderTextColor={colors.softGreen}
                    style={styles.input}
                    secureTextEntry={true}
                    multiline={false}
                    value={data.password}
                    onChangeText={(value)=> handleData('password', value)}
                />
            </View>
            <View
                style={styles.section}
            >
                <Text style={styles.label}>{Main.labelConfirmPassword}</Text>
                <TextInput 
                    placeholderTextColor={colors.softGreen}
                    style={styles.input}
                    secureTextEntry={true}
                    multiline={false}
                    value={data.repassword}
                    onChangeText={(value)=> handleData('repassword', value)}
                />
            </View>
            
            <TouchableOpacity
                onPress={Result}
            >
                <Text
                    style={styles.btn}
                >{Main.ButtonSignUp}</Text>
            </TouchableOpacity>
        </View>
    )

}

const SignUp = () => {
    const navigation = useNavigation();
    const [data, setData] = useState({})
    const users = useSelector(state=> state.chats.users)
    const dispatch = useDispatch()

    const handleData = (name, value) => {
        setData(n=> ({
            ...n,
            [name]: value
        }))
    }

    const Result = async () => {
        const { name, email, password, repassword } = data;
        if (!name || !email || !password || !repassword) {
            alert('All fields are required.');
            return;
        }
        if (password !== repassword) {
            alert('Passwords do not match.');
            return;
        }

        
        try {
            const { data, error } = await supabase.auth.signUp({
                email,
                password,
            })
            if (error) {
                alert(`Error: ${error.message}`);
                return
            }
            const userId = data.user?.id
            const { error: insertError } = await supabase
                .from('users')
                .insert([{ id: userId, name, profile_picture_url: null }]);

            if (insertError) {
                alert(`Error inserting into users table: ${insertError.message}`);
                return;
            }
            
            if (data.user) {
                alert('Success! Please check your inbox for email verification.');
            } else {
                alert('Sign-up successful, but email verification is required.');
            }
        }catch (err) {
            console.error('Unexpected error during sign-up:', err);
            alert('An unexpected error occurred. Please try again later.');
        }

        alert(`Success`);
        
    }


    return (
        <View
            style={{
                flex: 1,
                backgroundColor: colors.black,
                alignItems: 'center',
                paddingTop: Platform.OS === "android" ? StatusBar.currentHeight : 0
            }}
        >   
                    {/* Top */}
            <View
                style={{
                    flex: 0.3,
                    backgroundColor: colors.lightGreen,
                    justifyContent: 'center',
                    alignContent: 'center',
                    width: '100%'
                }}
            >
                <ImageBackground
                    source={require("../../Assist/background MatZapich.jpeg")}
                    resizeMode="cover"
                    style={{width: '100%', height: '100%', alignItems: 'center',justifyContent: 'center',
                        alignContent: 'center', }}
                >
                    <Text
                        style={{
                            color: colors.white,
                            fontSize: 50,
                            fontWeight: 900,
                            textAlign: 'center'
                        }}
                    >{Identify.AppName}</Text>
                </ImageBackground>
            </View>
                    {/* Bottom */}
            <ScrollView
                style={{
                    flex: 0.7,
                    width: '80%',
                    
                    // alignItems:'center',
                    // justifyContent: 'space-evenly',
                    // backgroundColor: 'yellow'
                }}
            >
                <Text
                    style={{
                        color: colors.softGreen,
                        fontSize: 25,
                        fontWeight: 500,
                        textAlign: 'center',
                        padding: 40,
                        flex: 0.2,
                        // backgroundColor: 'red'
                    }}
                >
                    {Main.header}
                </Text>
                <Inscription data={data} handleData={handleData} Result={Result} />
                <View
                    style={{
                        flex: 0.1, 
                        flexDirection: 'row', 
                        marginTop: 20,
                        justifyContent: 'center'
                    }}
                >
                    <Text
                        style={{
                            color: colors.softGreen,
                            fontSize: 20,
                            fontWeight: 500,
                        }}
                    >
                        {Main.textSingIn}</Text>
                        <TouchableOpacity
                            onPress={()=> navigation.navigate("SignIn")}
                        >
                            <Text style={{
                            color: colors.lightGreen,
                            fontSize: 22,
                            fontWeight: 700
                        }}
                            > {Main.ButtonSignIn}</Text>
                        </TouchableOpacity>
                </View>
            </ScrollView>
        </View>
    )
}

const styles = StyleSheet.create({
    containre: {
        flex: 0.6,
        justifyContent: 'space-evenly'

    },

    section: {
        // backgroundColor: colors.softWhite,
    },
    label: {
        color: colors.lightGreen,
        fontSize: 18,
        fontWeight: 500,
        marginLeft: 5
    },
    input: {
        borderBottomWidth: 1,
        borderBottomColor: colors.white,
        marginBottom: 10,
        color: colors.white,
        fontSize: 20,
        fontWeight: 500
    },
    btn: {
        backgroundColor: colors.lightGreen,
        color: colors.white,
        padding: 15,
        marginTop: 25,
        borderRadius: 10,
        textAlign: 'center',
        fontSize: 23,
        fontWeight: 500
    }
})
export default SignUp;