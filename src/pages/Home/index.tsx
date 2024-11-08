import React, {useCallback, useState, useEffect} from 'react';
import {Animated, View, ToastAndroid} from 'react-native';
import HeaderImage from '../../components/HeaderImage';
import {
  Button,
  Dialog,
  FAB,
  Portal,
  Text as TextPaper,
} from 'react-native-paper';
import styles from './styles';
import {StackNavigationProp} from '@react-navigation/stack';
import {RootStackParamList} from '../../interfaces/RootStackParamList';
import {CommonActions, useNavigation} from '@react-navigation/native';
import {logout} from '../../utils/functions';

type HomeScreenNavigationProp =
  | StackNavigationProp<RootStackParamList, 'Registros'>
  | StackNavigationProp<RootStackParamList, 'Calculator'>
  | StackNavigationProp<RootStackParamList, 'FoodOrganizer'>;

export default function Home() {
  const navigation = useNavigation<HomeScreenNavigationProp>();
  const navigationReset = useNavigation();
  const [logoutDialogVisible, setLogoutDialogVisible] = useState(false);

  const [state, setState] = useState({open: false});

  const onStateChange = ({open}: {open: boolean}) => setState({open});

  const {open} = state;

  const handleLogout = useCallback(async () => {
    try {
      const logoutSuccess = await logout();

      if (logoutSuccess) {
        setLogoutDialogVisible(false);
        navigationReset.dispatch(
          CommonActions.reset({
            index: 0,
            routes: [{name: 'Login'}],
          }),
        );
      }
    } catch (e) {
      ToastAndroid.showWithGravityAndOffset(
        `Ocorreu um erro ao fazer o logout, tente novamente!`,
        ToastAndroid.SHORT,
        ToastAndroid.BOTTOM,
        25,
        50,
      );
    }
  }, []);

  return (
    <View style={styles.container}>
      <Portal>
        <FAB.Group
          backdropColor="rgba(255, 255, 255, 0.7)"
          rippleColor="#f00"
          open={open}
          visible
          icon={open ? 'arrow-u-left-top' : 'menu'}
          color="#FFF"
          fabStyle={{
            backgroundColor: '#FC6767',
            borderWidth: 1,
            borderColor: '#b90000',
          }}
          actions={[
            {
              icon: 'door-open',
              label: 'Sair do Sistema',
              onPress: () => setLogoutDialogVisible(true),
              style: {backgroundColor: '#FC6767'},
              color: '#fff',
            },
            {
              icon: 'food-variant',
              label: 'Gerenciar Alimentos',
              onPress: () => navigation.navigate('Registros'),
              style: {backgroundColor: '#FC6767'},
              color: '#fff',
            },
            {
              icon: 'calculator',
              label: 'Calculadora de alimentos',
              onPress: () => navigation.navigate('Calculator'),
              style: {backgroundColor: '#FC6767'},
              color: '#fff',
            },
            {
              icon: 'calendar',
              label: 'Organizador alimentar',
              onPress: () => navigation.navigate('FoodOrganizer'),
              style: {backgroundColor: '#FC6767'},
              color: '#fff',
            },
          ]}
          onStateChange={onStateChange}
        />
        <Dialog
          visible={logoutDialogVisible}
          onDismiss={() => setLogoutDialogVisible(false)}>
          <Dialog.Title>Sair</Dialog.Title>
          <Dialog.Content>
            <TextPaper variant="bodyMedium">
              Você tem certeza que quer sair do sistema?
            </TextPaper>
          </Dialog.Content>
          <Dialog.Actions>
            <Button onPress={() => setLogoutDialogVisible(false)}>Não</Button>
            <Button onPress={handleLogout}>Sim</Button>
          </Dialog.Actions>
        </Dialog>
      </Portal>
      <HeaderImage animated={true} />
      <View style={{width: '80%'}}>
        <Button
          style={styles.button}
          icon="food-fork-drink"
          mode="elevated"
          buttonColor="#FC6767"
          textColor="#FFF"
          onPress={() => navigation.navigate('Registros')}>
          Gerenciar Alimentos
        </Button>
        <Button
          style={styles.button}
          icon="calculator"
          mode="elevated"
          buttonColor="#FC6767"
          textColor="#FFF"
          onPress={() => navigation.navigate('Calculator')}>
          Calculadora de alimentos
        </Button>
        <Button
          style={styles.button}
          icon="calendar"
          mode="elevated"
          buttonColor="#FC6767"
          textColor="#FFF"
          onPress={() => navigation.navigate('FoodOrganizer')}>
          Organizador alimentar
        </Button>
      </View>
    </View>
  );
}
