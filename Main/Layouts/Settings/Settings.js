import { View, Text, StyleSheet, StatusBar, Platform, TouchableOpacity, Image, ActivityIndicator, TextInput, Animated, Alert } from "react-native";
import { colors } from "../../Assist/Colors";
import { useNavigation } from "@react-navigation/native";
import { useSelector } from "react-redux";
import * as ImagePicker from 'expo-image-picker';
import { useState, useEffect, useRef } from "react";

const Settings = () => {
    const navigate = useNavigation();
    const user = useSelector(state => state.chats.currentUser);
    const [edited, setIsEdited] = useState(false);
    const [isLoading, setIsLoading] = useState(false);
    const [editingId, setEditingId] = useState(null);
    const [newName, setNewName] = useState(user?.name || ''); // Default value
    const [newAbout, setNewAbout] = useState(user?.about || ''); // Default value

    const slideAnim = useRef(new Animated.Value(200)).current;

    useEffect(() => {
        Animated.timing(slideAnim, {
            toValue: 0,
            duration: 500,
            useNativeDriver: true,
        }).start();
    }, []);

    const pickImage = async () => {
        const permission = await ImagePicker.requestMediaLibraryPermissionsAsync();
        if (permission.granted) {
            let res = await ImagePicker.launchImageLibraryAsync({
                mediaTypes: 'images',
                allowsEditing: true,
                aspect: [1, 1],
                quality: 1,
            });

            if (!res.cancelled) {
                const { uri, mimeType, fileSize } = res.assets[0];
                const fileName = uri.split('/').pop();
                const file = {
                    uri,
                    type: mimeType,
                    name: fileName,
                    size: fileSize,
                };

                try {
                    setIsLoading(true);
                    // Replace this with actual image upload logic
                    // const resp = await ProfileImage(file, user[0]?.id);
                    if (true) { // Simulate success
                        console.log('Image uploaded successfully:', uri);
                        user[0].Image = uri; // Update user image
                    } else {
                        console.error('Image upload failed');
                    }
                } catch (error) {
                    console.error('Error uploading image:', error.message);
                } finally {
                    setIsLoading(false);
                }
            } else {
                console.log("Image selection cancelled");
            }
        }
    };

    const handleSave = () => {
        if (editingId === 1) {
            Alert.alert('Name Updated', `Your new name is: ${newName}`);
        } else if (editingId === 2) {
            Alert.alert('About Updated', `Your new about information is: ${newAbout}`);
        }

        setIsEdited(false);
        setEditingId(null);
    };

    const EditInfo = ({ id }) => {
        return (
            <View
                style={{
                    display: edited ? 'flex' : 'none',
                    position: 'absolute',
                    zIndex: 10,
                    height: "106%",
                    width: '100%',
                    backgroundColor: '#00000085',
                    justifyContent: 'flex-end',
                }}
            >
                <Animated.View
                    style={{
                        transform: [{ translateY: slideAnim }],
                        position: 'relative',
                        backgroundColor: colors.black,
                        width: '100%',
                        height: 250,
                        paddingLeft: 5,
                        paddingRight: 5,
                        justifyContent: 'center',
                        borderTopRightRadius: 20,
                        borderTopLeftRadius: 20,
                    }}
                >
                    <Text
                        style={{
                            color: colors.white,
                            fontSize: 16,
                            marginLeft: 20,
                            textAlign: 'left',
                        }}
                    >
                        {id === 1 ? "Name" : "About"} :
                    </Text>
                    <TextInput
                        placeholderTextColor={colors.gray}
                        style={{
                            backgroundColor: colors.black,
                            color: colors.white,
                            fontSize: 20,
                            height: 40,
                            width: '90%',
                            marginTop: 20,
                            marginLeft: 20,
                            borderBottomColor: colors.lightGreen,
                            borderBottomWidth: 2,
                        }}
                        value={id === 1 ? newName : newAbout}
                        onChangeText={text => {
                            if (id === 1) {
                                setNewName(text);
                            } else {
                                setNewAbout(text);
                            }
                        }}
                    />
                    <View
                        style={{
                            flexDirection: 'row',
                            justifyContent: 'flex-end',
                            alignItems: 'center',
                            height: 30,
                            width: '90%',
                            marginRight: 20,
                            marginLeft: 20,
                            marginTop: 20,
                        }}
                    >
                        <TouchableOpacity
                            onPress={() => {
                                setEditingId(null); // Close the edit form
                                setIsEdited(false);
                            }}
                        >
                            <Text
                                style={{
                                    color: colors.lightGreen,
                                    fontSize: 18,
                                    fontWeight: 500,
                                }}
                            >
                                Cancel
                            </Text>
                        </TouchableOpacity>
                        <TouchableOpacity
                            style={{ marginLeft: 40 }}
                            onPress={handleSave}
                        >
                            <Text
                                style={{
                                    color: colors.lightGreen,
                                    fontSize: 18,
                                    fontWeight: 500,
                                }}
                            >
                                Save
                            </Text>
                        </TouchableOpacity>
                    </View>
                </Animated.View>
            </View>
        );
    };

    const Info = [
        {
            id: 1,
            img: require("../../Assist/user1.png"),
            label: "Name",
            description: user?.name,
            size: 25,
            edit: true
        },
        {
            id: 2,
            img: require("../../Assist/about.png"),
            label: "About",
            description: user?.about,
            size: 20,
            edit: true
        },
        {
            id: 3,
            img: require("../../Assist/call3.png"),
            label: "Email",
            description: user?.email,
            size: 25,
            edit: false
        },
    ];

    return (
        <View style={styles.container}>
            {/* Render EditInfo only when editing */}
            {editingId && <EditInfo id={editingId} />}
            <View style={header.header}>
                <TouchableOpacity onPress={() => navigate.goBack()}>
                    <Image source={require('../../Assist/arrow.png')} style={header.camera} />
                </TouchableOpacity>
                <Text style={header.logo}>Profile</Text>
            </View>

            <View style={body.containre}>
                <View
                    style={{
                        marginTop: 50,
                        alignItems: 'center',
                    }}
                >
                    {isLoading ? (
                        <ActivityIndicator size="large" color={colors.lightGreen} />
                    ) : (
                        <Image
                            source={user[0]?.Image ? { uri: user[0]?.Image } :
                                require('../../Assist/user.png')}
                            style={{
                                backgroundColor: colors.grayImg,
                                height: 160,
                                width: 160,
                                borderRadius: 100,
                            }}
                        />
                    )}
                    <TouchableOpacity
                        activeOpacity={0.98}
                        onPress={pickImage}
                        style={{
                            backgroundColor: colors.lightGreen,
                            height: 40,
                            width: 40,
                            borderRadius: 100,
                            alignItems: 'center',
                            justifyContent: 'center',
                            position: 'absolute',
                            bottom: 0,
                            right: 100
                        }}
                    >
                        <Image
                            source={require('../../Assist/camera3.png')}
                            style={{
                                height: 24,
                                width: 24,
                            }}
                        />
                    </TouchableOpacity>
                </View>
            </View>
            <View style={footer.containre}>
                {Info.map(n => (
                    <View key={n?.id}>
                        <View
                            style={{
                                flexDirection: 'row',
                                justifyContent: 'space-between',
                                alignItems: "center",
                                marginTop: 15,
                            }}
                        >
                            <Image
                                source={n.img}
                                style={{ height: n.size, width: n.size, backgroundColor: '' }}
                            />
                            <View
                                style={{
                                    width: "85%",
                                    backgroundColor: '',
                                    paddingBottom: 15,
                                    borderBottomColor: n.edit ? colors.gray : '',
                                    borderBottomWidth: n.edit ? 0.2 : 0,
                                    flexDirection: 'row',
                                }}
                            >
                                <View style={{ width: '90%', backgroundColor: '' }}>
                                    <Text style={{ color: colors.gray, fontSize: 18 }}>{n?.label}</Text>
                                    <Text style={{ color: colors.white, fontSize: 24 }}>{n?.description}</Text>
                                </View>
                                {n.edit &&
                                    <TouchableOpacity
                                        onPress={() => {
                                            setIsEdited(true);
                                            setEditingId(n.id); // Set the current editing ID
                                        }}
                                        style={{
                                            alignItems: 'center',
                                            height: 39,
                                            width: "10%",
                                            justifyContent: "center",
                                            backgroundColor: ''
                                        }}
                                    >
                                        <Image
                                            source={require('../../Assist/edit.png')}
                                            style={{ height: 20, width: 30 }}
                                        />
                                    </TouchableOpacity>
                                }
                            </View>
                        </View>
                    </View>
                ))}
            </View>
        </View>
    );
};

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: colors.black,
        paddingTop: Platform.OS === "android" ? StatusBar.currentHeight : 0,
        alignItems: 'center'
    }
});

const header = StyleSheet.create({
    header: {
        flex: 0.2,
        flexDirection: "row",
        alignItems: 'center',
        borderBottomColor: colors.gray,
        borderBottomWidth: 0.2,
        width: '90%'
    },

    logo: {
        color: colors.white,
        fontWeight: 500,
        fontSize: 28,
        marginLeft: 15
    },
    camera: {
        width: 18,
        height: 18
    },
});

const body = StyleSheet.create({
    containre: {
        width: '90%',
    }
});

const footer = StyleSheet.create({
    containre: {
        width: '88%',
        marginTop: 50
    }
});

export default Settings;
