import {createStackNavigator} from '@react-navigation/stack';
import {RootStackParamList} from '../interfaces/RootStackParamList';
import Home from '../pages/Home';
import {Text} from 'react-native';
import Registers from '../pages/Registers';

const Stack = createStackNavigator<RootStackParamList>();

export default function Navigator() {
  return (
    <Stack.Navigator
      screenOptions={{
        headerShown: false,
      }}
      initialRouteName="Home">
      <Stack.Screen name="Home" component={Home} />
      <Stack.Screen name="Registros" component={Registers} />
    </Stack.Navigator>
  );
}
