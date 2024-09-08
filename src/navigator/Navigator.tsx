import {createStackNavigator} from '@react-navigation/stack';
import {RootStackParamList} from '../interfaces/RootStackParamList';
import Home from '../pages/Home';

const Stack = createStackNavigator<RootStackParamList>();

export default function Navigator() {
  return (
    <Stack.Navigator
      screenOptions={{
        headerShown: false,
      }}>
      <>
        <Stack.Screen name="Home" component={Home} />
      </>
    </Stack.Navigator>
  );
}
