import { View, Text, StyleSheet, TextInput, ScrollView, Image, TouchableOpacity, ActivityIndicator } from "react-native";
import { colors } from "../../../Assist/Colors";
import { supabase } from "../../../Supabase/supabase";
import { useState } from "react";
import { useSelector, useDispatch } from "react-redux";
import { addContact } from "../../../Redux-ToolKit/matzapichSlice";

const Body = ({ users, contacts, currentUser }) => {
    const [ser, setSer] = useState("");
    const dispatch = useDispatch();
    const [loadingContactId, setLoadingContactId] = useState(null);



    const ContentContact = (props) => {
        return (
            <View style={{
                flexDirection: 'column',
                justifyContent: 'space-between',
                alignItems: 'center',
                marginBottom: 15,
                backgroundColor: colors.softWhite,
                borderRadius: 10,
                width: '48%',
                padding: 15
            }}
                key={props.id}
            >
                <Image 
                    style={{
                        backgroundColor: colors.grayImg,
                        height: 70,
                        width: 70,
                        borderRadius: 100,
                        borderColor: colors.white,
                        borderWidth: 0.5
                    }}
                    source={require('../../../Assist/user.png')}
                />
                <Text style={{
                    color: colors.white, 
                    fontSize: 20, 
                    fontWeight: 600,
                    marginTop: 12,
                    marginBottom: 12
                    }}>{props.name}</Text>
                <TouchableOpacity 
                    activeOpacity={0.8}
                    onPress={async () => {
                        if (currentUser?.id && props.id) { 
                            setLoadingContactId(props.id);
                            try {
                                const { data, error } = await supabase
                                    .from('contacts')
                                    .insert([
                                        { user_id: currentUser.id, contact_id: props.id }, 
                                        { user_id: props.id, contact_id: currentUser.id}
                                    ])
                                    .select('*');
                                
                                if (error) throw error;
                                const { data: updatedContacts, error: fetchError } = await supabase
                                    .from('contacts')
                                    .select('*')
                                    .eq('user_id', currentUser?.id);

                                if (fetchError) throw fetchError;

                                dispatch(addContact(updatedContacts));
                                alert("Added successfully");
                            } catch (error) {
                                console.error("Error to add friend:", error.message);
                                alert("Failed to add friend. Please try again.");
                            } finally {
                                setLoadingContactId(null); 
                            }
                        } else {
                            alert("Error: Invalid user or contact ID");
                        }
                    }}
                        disabled={loadingContactId === props.id}
                    >
                    {loadingContactId === props.id ? (
                    <ActivityIndicator size="small" color={colors.lightGreen} />
                    ) : (
                    <Text
                        style={{
                            color: !props.isFollowed && colors.lightGreen,
                            padding: 7,
                            borderColor: !props.isFollowed && colors.lightGreen,
                            borderWidth: (props.isFollowed ? 0: 1),
                            borderRadius: 20,
                            width: 100,
                            textAlign: 'center',
                        }}
                    >
                        {!props.isFollowed &&  "Add"}
                    </Text>
                    )}
                </TouchableOpacity>
            </View>
        )
    }
    const MyContentContact = (props) => {
        return (
            <View style={{
                flexDirection: 'column',
                justifyContent: 'space-between',
                alignItems: 'center',
                marginBottom: 15,
                backgroundColor: colors.softWhite,
                borderRadius: 10,
                width: '48%',
                padding: 15
            }}
                key={props.id}
            >
                <Image 
                    style={{
                        backgroundColor: colors.grayImg,
                        height: 70,
                        width: 70,
                        borderRadius: 100,
                        borderColor: colors.white,
                        borderWidth: 0.5
                    }}
                    source={require('../../../Assist/user.png')}
                />
                <Text style={{
                    color: colors.white, 
                    fontSize: 20, 
                    fontWeight: 600,
                    marginTop: 12,
                    }}>{props.name}</Text>
                
            </View>
        )
    }
    return (
        <View style={body.containre}>
            <TextInput 
                style={body.search}
                multiline={true}
                placeholder="&#127940; Search"
                placeholderTextColor={colors.white}
                onChangeText={e=> setSer(e.toLocaleLowerCase())}
            />
            <ScrollView>
                <Text style={{color: colors.gray, fontSize: 18, fontWeight: 700}}>Contacts on MatZapich</Text>
                <View style={{
                    width: '100%', flexDirection: 'row', flexWrap: 'wrap', justifyContent: 'space-between', marginTop: 15 
                }}>
                {
                    users
                    ?.filter(user => contacts?.filter(contact => contact?.contact_id === user?.id).length > 0 
                    )
                    ?.map(user => (
                        <MyContentContact
                        key={user?.id}
                        name={user?.name}
                        id={user?.id}
                        isFollowed={false} 
                        />
                    ))
                }

                </View>
                <Text style={{color: colors.gray, fontSize: 18, fontWeight: 700}}>Add new Friend</Text>
                <View style={{
                    width: '100%', flexDirection: 'row', flexWrap: 'wrap', justifyContent: 'space-between', marginTop: 15
                }}>
                {
                    users
                    ?.filter(user => user?.id !== currentUser?.id && contacts?.filter(contact => contact?.contact_id === user?.id).length === 0 
                    )
                    ?.map(user => (
                        <ContentContact
                        key={user?.id}
                        name={user?.name}
                        id={user?.id}
                        isFollowed={false} 
                        />
                    ))

                }

                </View>
            </ScrollView>
        </View>
    )
}

const body = StyleSheet.create({
    containre: {
        width: '90%',
        height: '90%',
    },
    search: {
        backgroundColor: colors.softWhite,
        height:50,
        width: '100%',
        borderRadius:20,
        padding: 15,
        fontSize: 20,
        color: colors.white,
        marginBottom: 20
    },
})

export default Body;