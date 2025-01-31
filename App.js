import React, { useEffect, useState } from 'react';
import Navigation from './Main/Layouts/Navigation';
import { store } from './Main/Redux-ToolKit/store';
import { Provider } from 'react-redux';
import * as Network from 'expo-network';
import MessageBox from './Main/Layouts/MessageBox';

export default App = () => {
  const [isConnected, setIsConnected] = useState(null);

  useEffect(() => {
    const checkConnection = async () => {
      const networkState = await Network.getNetworkStateAsync();
      setIsConnected(networkState.isConnected);
    };

    checkConnection();
  }, []);
  
  
  return ( 
    <Provider store={store}>
      {
      isConnected === null ? 
      (<MessageBox msg="Checking connection..." />) : 
      (isConnected ? "" : <MessageBox msg="You are offline" />)
    }
      <Navigation />
    </Provider>
  )
}

