import {RouteProp} from '@react-navigation/native';

export type RootStackParamList = {
  Login: undefined;
  Home: undefined;
  Registros: undefined;
  Cadastrar: undefined;
  Editar: {key: string; category: string};
  CreateUser: undefined;
};

export type RootRouteProps<RouteName extends keyof RootStackParamList> =
  RouteProp<RootStackParamList, RouteName>;
