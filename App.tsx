import 'react-native-gesture-handler';
import './src/config/firebaseConnection';
import React, {useEffect} from 'react';
import {StatusBar} from 'react-native';
import {hide} from 'react-native-bootsplash';
import {NavigationContainer} from '@react-navigation/native';
import {PaperProvider} from 'react-native-paper';
import Navigator from './src/navigator/Navigator';
import Toast, {InfoToast} from 'react-native-toast-message';

const toastConfig = {
  info: (props: any) => <InfoToast {...props} text2NumberOfLines={0} />,
};

function App(): React.JSX.Element {
  useEffect(() => {
    const init = async () => {
      // …do multiple sync or async tasks
    };

    init().finally(async () => {
      await hide({fade: true});
      console.log('BootSplash has been hidden successfully');
    });
  }, []);

  return (
    <NavigationContainer>
      <PaperProvider>
        <StatusBar backgroundColor="#FA9A9A" />
        <Navigator />
      </PaperProvider>
      <Toast config={toastConfig} />
    </NavigationContainer>
  );
}

export default App;
