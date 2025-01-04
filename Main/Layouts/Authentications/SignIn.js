import { Text, View, Platform, StatusBar, TextInput, TouchableOpacity, StyleSheet, ImageBackground, ScrollView, ActivityIndicator } from "react-native";
import { colors } from "../../Assist/Colors";
import { useNavigation } from "@react-navigation/native";
import { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { addCurrnetUser, addUser } from "../../Redux-ToolKit/matzapichSlice";
import { supabase } from "../../Supabase/supabase";
import AsyncStorage from '@react-native-async-storage/async-storage';
import Structure from "../../Json/Structure.json";

const Identify = Structure.app; 
const Main = Structure.Auth.SignIn;

const Inscription = ({ data, handleData, Result, loadingContacted }) => {
    
    return (
        <View style={styles.containre}>
            <View
                style={styles.section}
            >
                <Text style={styles.label}>{Main.labelEmail}</Text>
                <TextInput 
                    placeholder={Main.PlaceholderEmail}
                    placeholderTextColor={colors.softGreen}
                    style={styles.input}
                    keyboardType="email-address"
                    multiline={false}
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
                    multiline={false}
                    secureTextEntry={true}
                    value={data.password}
                    onChangeText={(value)=> handleData('password', value)}
                />
            </View>
            <TouchableOpacity
            >
                <Text style={{
                    color: colors.softGreen,
                    fontSize: 20,
                    fontWeight: 500,
                    marginTop: 15,
                }}
                >{Main.ButtonForgotPassword}</Text>
            </TouchableOpacity>
            
            <TouchableOpacity
                onPress={Result}
            >
                {
                    loadingContacted ? 
                    (<ActivityIndicator size="large" color={colors.lightGreen} />) :
                    (
                    <Text
                        style={styles.btn}
                    >{Main.ButtonSignIn}</Text>
                    )
                }
            </TouchableOpacity>
        </View>
    )

    
}

const SignIn = () => {
    const navigation = useNavigation();
    const [data, setData] = useState({})
    const [loadingContacted, setLoadingContacted] = useState(null);
    const dispatch = useDispatch();
    const handleData = (name, value) => {
        setData(n=> ({
            ...n,
            [name]: value
        }))
    }
    const Result = async () => {
        const { email, password } = data;
        if (!email || !password) {
            alert('All fields are required.');
            return;
        }
        setLoadingContacted(true);
        try {
            const { data: userData, error } = await supabase.auth.signInWithPassword({
                email,
                password
            });
    
            if (error) {
                alert(`Error: ${error.message}`);
                return;
            }
    
            if (userData?.session?.access_token) {
                // await AsyncStorage.setItem('userToken', userData.session.access_token);
                // const token = await AsyncStorage.getItem('userToken')
                // dispatch(addCurrnetUser(token));
    
                const { data, err } = await supabase
                    .from('users')
                    .select('*')
                    .eq('id', userData.user.id)
                if(err) {
                    alert(`Error: ${err.message}`);
                    return;
                }
                
                dispatch(addCurrnetUser({
                    id: data[0].id,
                    name: data[0].name, 
                    email: userData.user.email, 
                    about: data[0].about,
                    img: data[0].profile_picture_url}));
                // try {
                //     insertUserData(userData.user.id, userData.user.name, userData.user.email, userData.user.profile_picture_url);
                // } catch (error) {
                //     console.error('Error:', error); 
                // }
                
    
            } else {
                alert('User does not exist.');
            }
        } catch (e) {
            alert(`Unexpected error: ${e.message}`);
        }
        finally {
            setLoadingContacted(null);
        }
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
                    style={{width: '100%', height: '100%', alignItems: '',justifyContent: 'center',
                        alignContent: 'center'}}
                >
                    <Text
                        style={{
                            color: colors.white,
                            fontSize: 50,
                            fontWeight: 900,
                            textAlign: 'center'
                        }}
                    >
                        {Identify.AppName}
                    </Text>
                </ImageBackground>
            </View>
                    {/* Bottom */}
            <ScrollView
                style={{
                    flex: 0.7,
                    width: '80%',
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
                    }}
                >
                    {Main.header}
                </Text>
                <Inscription data={data} handleData={handleData} Result={Result} loadingContacted={loadingContacted} />
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
                        {Main.textSingUp}</Text>
                        <TouchableOpacity
                            onPress={()=> navigation.navigate("SignUp")}
                        >
                            
                        <Text style={{
                            color: colors.lightGreen,
                            fontSize: 22,
                            fontWeight: 700,
                        }}
                            > {Main.ButtonSignUp}</Text>
                            
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

export default SignIn;