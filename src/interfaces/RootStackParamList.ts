import {RouteProp} from '@react-navigation/native';

export type RootStackParamList = {
  Login: undefined;
  Home: undefined;
  Calculator: undefined;
  Registros: undefined;
  Cadastrar: undefined;
  Editar: {key: string; category: string};
  CreateUser: undefined;
  FoodOrganizer: undefined;
  FoodOrganizerCreate: {weekDay: string; mealType: string};
};

export type RootRouteProps<RouteName extends keyof RootStackParamList> =
  RouteProp<RootStackParamList, RouteName>;
