import 'react-native-gesture-handler';
import React, {useEffect} from 'react';
import {StatusBar, StyleSheet, useColorScheme} from 'react-native';
import {Colors} from 'react-native/Libraries/NewAppScreen';
import {hide} from 'react-native-bootsplash';
import {NavigationContainer} from '@react-navigation/native';
import {PaperProvider} from 'react-native-paper';
import Navigator from './src/navigator/Navigator';

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
    </NavigationContainer>
  );
}

export default App;
