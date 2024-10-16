import {createStackNavigator} from '@react-navigation/stack';
import {RootStackParamList} from '../interfaces/RootStackParamList';
import Home from '../pages/Home';
import Registers from '../pages/Registers';
import Create from '../pages/Create';
import Login from '../pages/Login';
import CreateUser from '../pages/CreateUser';

const Stack = createStackNavigator<RootStackParamList>();

interface NavigatorProps {
  signedIn: boolean;
}

function getInitialRoute(signedIn: boolean) {
  if (!signedIn) return 'Login';

  return 'Home';
}

export default function Navigator({signedIn}: NavigatorProps) {
  return (
    <Stack.Navigator
      screenOptions={{
        headerShown: false,
      }}
      initialRouteName={getInitialRoute(signedIn)}>
      <Stack.Screen name="Login" component={Login} />
      <Stack.Screen name="CreateUser" component={CreateUser} />
      <Stack.Screen name="Home" component={Home} />
      <Stack.Screen name="Registros" component={Registers} />
      <Stack.Screen name="Cadastrar" component={Create} />
      <Stack.Screen name="Editar" component={Create} />
    </Stack.Navigator>
  );
}
