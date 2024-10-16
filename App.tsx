import 'react-native-gesture-handler';
import './src/config/firebaseConnection';
import React, {useEffect, useState} from 'react';
import {StatusBar} from 'react-native';
import {hide} from 'react-native-bootsplash';
import {NavigationContainer} from '@react-navigation/native';
import {PaperProvider} from 'react-native-paper';
import Navigator from './src/navigator/Navigator';
import Toast, {InfoToast} from 'react-native-toast-message';
import {User, onAuthStateChanged} from 'firebase/auth';
import {auth} from './src/config/firebaseConnection';

const toastConfig = {
  info: (props: any) => <InfoToast {...props} text2NumberOfLines={0} />,
};

function App(): React.JSX.Element {
  const [user, setUser] = useState<User | null>();
  const [isTokenLoaded, setIsTokenLoaded] = useState(false);
  const [isLoggedIn, setIsLoggedIn] = useState(false);

  useEffect(() => {
    const init = async () => {
      return new Promise(resolve => {
        onAuthStateChanged(auth, user => {
          if (user) {
            setIsLoggedIn(true);
            setUser(user);
            resolve(user);
          } else {
            resolve(null);
          }
        });
      });
    };

    init().finally(async () => {
      setIsTokenLoaded(true);
      await hide({fade: true});
      console.log('BootSplash has been hidden successfully');
    });
  }, []);

  return (
    <NavigationContainer>
      <PaperProvider>
        <StatusBar backgroundColor="#FA9A9A" />
        {isTokenLoaded && <Navigator signedIn={isLoggedIn} />}
      </PaperProvider>
      <Toast config={toastConfig} />
    </NavigationContainer>
  );
}

export default App;
