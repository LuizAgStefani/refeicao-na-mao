import {createStackNavigator} from '@react-navigation/stack';
import {RootStackParamList} from '../interfaces/RootStackParamList';
import Home from '../pages/Home';
import {Text} from 'react-native';
import Registers from '../pages/Registers';
import Create from '../pages/Create';

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
      <Stack.Screen name="Cadastrar" component={Create} />
      <Stack.Screen name="Editar" component={Create} />
    </Stack.Navigator>
  );
}
