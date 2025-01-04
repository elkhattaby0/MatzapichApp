import { NavigationContainer } from '@react-navigation/native';
import { createStackNavigator } from '@react-navigation/stack';
import AsyncStorage from '@react-native-async-storage/async-storage';

import SignIn from './Authentications/SignIn';
import SignUp from './Authentications/SignUp';
import HomeLayout from "../Layouts/Chats/HomeLayout"
import DetailsLayouts from '../Layouts/Details/DetailsLayouts';

import { Provider, useDispatch, useSelector } from 'react-redux';
import { store } from '../Redux-ToolKit/store';
import { useEffect } from 'react';
import { addCurrnetUser } from '../Redux-ToolKit/matzapichSlice';
import Settings from './Settings/Settings';
import AddNewContact from './AddNewContact/AddNewContact';

const AuthStack = createStackNavigator();
const AppStack = createStackNavigator();

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

const Layout = () => {
    const isAuthenticated = useSelector(state=> state.chats.currentUser)
    return (
        <NavigationContainer>
            {isAuthenticated ? <AppNavigator /> : <AuthNavigator />}
        </NavigationContainer>
    )
}
const Navigation = () => {
    return (
        <Provider store={store}>
            <Layout />
        </Provider>
    )
}

export default Navigation;