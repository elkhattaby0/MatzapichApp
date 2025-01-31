import { NavigationContainer } from '@react-navigation/native';
import { createStackNavigator } from '@react-navigation/stack';

import SignIn from './Authentications/SignIn';
import SignUp from './Authentications/SignUp';
import HomeLayout from "../Layouts/Chats/HomeLayout"
import DetailsLayouts from '../Layouts/Details/DetailsLayouts';

import { useSelector } from 'react-redux';
import Settings from './Settings/Settings';
import AddNewContact from './AddNewContact/AddNewContact';

const AuthStack = createStackNavigator();
const AppStack = createStackNavigator();

// import { Text, View } from 'react-native';

const AuthNavigator = () => (
    <AuthStack.Navigator initialRouteName="SignIn">
        <AuthStack.Screen name="SignIn" component={SignIn} options={{ headerShown: false }} />
        <AuthStack.Screen name="SignUp" component={SignUp} options={{ headerShown: false }} />
    </AuthStack.Navigator>
);

const AppNavigator = () => (
    <AppStack.Navigator initialRouteName="Chats">
        <AppStack.Screen name="Chats" component={HomeLayout} options={{ headerShown: false }} />
        <AppStack.Screen name="Details" component={DetailsLayouts} options={{ headerShown: false }} />
        <AppStack.Screen name="Settings" component={Settings} options={{ headerShown: false }} />
        <AppStack.Screen name="AddNewContact" component={AddNewContact} options={{ headerShown: false }} />
    </AppStack.Navigator>
);

const Navigation = () => {
    const isAuthenticated = useSelector(state=> state.chats.currentUser)
    return (
        <NavigationContainer>
            {isAuthenticated ? <AppNavigator /> : <AuthNavigator />}
        </NavigationContainer>
    )
    // return (
    //     <View style={{
    //         flex: 1,
    //         justifyContent: 'center',
    //         alignItems: 'center'
    //     }}>
    //         <Text style={{
    //             fontSize:50,
    //             fontWeight: 700
    //         }}>MatZapich</Text>
    //         <Text>Version: 12-01-2025 19:05</Text>
    //     </View>  
    // )
}

export default Navigation;