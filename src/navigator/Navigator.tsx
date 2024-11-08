import {createStackNavigator} from '@react-navigation/stack';
import {RootStackParamList} from '../interfaces/RootStackParamList';
import Calculator from '../pages/Calculator';
import Registers from '../pages/Registers';
import Create from '../pages/Create';
import Login from '../pages/Login';
import CreateUser from '../pages/CreateUser';
import Home from '../pages/Home';
import FoodOrganizer from '../pages/FoodOrganizer';
import FoodOrganizerCreate from '../pages/FoodOrganizerCreate';

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
      <Stack.Screen name="Home" component={Home} />
      <Stack.Screen name="CreateUser" component={CreateUser} />
      <Stack.Screen name="Calculator" component={Calculator} />
      <Stack.Screen name="Registros" component={Registers} />
      <Stack.Screen name="Cadastrar" component={Create} />
      <Stack.Screen name="Editar" component={Create} />
      <Stack.Screen name="FoodOrganizer" component={FoodOrganizer} />
      <Stack.Screen
        name="FoodOrganizerCreate"
        component={FoodOrganizerCreate}
      />
    </Stack.Navigator>
  );
}
