import React from 'react';
import Navigation from './Main/Layouts/Navigation';
import { store } from './Main/Redux-ToolKit/store';
import { Provider } from 'react-redux';

export default App = () => {
  return (
    <Provider store={store}>
      <Navigation />
    </Provider>
  )
}