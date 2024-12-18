import {
  View,
  Text,
  Animated,
  KeyboardAvoidingView,
  ToastAndroid,
} from 'react-native';
import React, {useState, useMemo, useCallback} from 'react';
import styles from './styles';
import {Button, IconButton, TextInput} from 'react-native-paper';
import {login} from '../../utils/functions';
import {StackNavigationProp} from '@react-navigation/stack';
import {RootStackParamList} from '../../interfaces/RootStackParamList';
import {useNavigation} from '@react-navigation/native';

type LoginScreenNavigationProp =
  | StackNavigationProp<RootStackParamList, 'Home'>
  | StackNavigationProp<RootStackParamList, 'CreateUser'>;

export default function Login() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [hidedPassword, setHidedPassword] = useState(true);
  const [loading, setLoading] = useState(false);

  const navigation = useNavigation<LoginScreenNavigationProp>();

  const isValidEmail = useMemo(() => {
    const regex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return regex.test(email);
  }, [email]);

  const isValidPassword = useMemo(() => {
    const regex =
      /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[@$!%*?&])[A-Za-z\d@$!%*?&]{8,}$/;
    return regex.test(password);
  }, [password]);

  const handleLogin = useCallback(() => {
    if (email === '' || !isValidEmail) {
      ToastAndroid.showWithGravityAndOffset(
        `Informe um email válido`,
        ToastAndroid.SHORT,
        ToastAndroid.BOTTOM,
        25,
        50,
      );

      return;
    }

    if (password === '' || !isValidPassword) {
      ToastAndroid.showWithGravityAndOffset(
        `Informe uma senha válida`,
        ToastAndroid.SHORT,
        ToastAndroid.BOTTOM,
        25,
        50,
      );

      return;
    }

    login(email, password, setLoading, navigation);
  }, [email, password]);

  return (
    <View style={styles.container}>
      <Animated.Image
        style={{
          width: 120,
          height: 120,
          marginTop: '10%',
        }}
        source={require('../../assets/icon.png')}
      />
      <KeyboardAvoidingView
        style={{
          flex: 1,
          alignItems: 'center',
          width: '100%',
        }}
        behavior="height"
        keyboardVerticalOffset={-30}>
        <Text
          style={{
            fontWeight: 'bold',
            fontSize: 36,
            color: '#fff',
            marginVertical: 10,
          }}>
          Refeição na Mão
        </Text>
        <Text
          style={{
            fontWeight: 'bold',
            fontSize: 15,
          }}>
          Faça login com seu e-mail
        </Text>
        <View
          style={{
            width: '100%',
            marginTop: 5,
            paddingHorizontal: 10,
          }}>
          <TextInput
            keyboardType="email-address"
            mode="outlined"
            value={email}
            onChangeText={text => setEmail(text)}
            label="Email: *"
            style={{backgroundColor: '#fa9a9a', marginTop: 10}}
            outlineColor="#F00"
            activeOutlineColor="#bc0000"
          />
          {!isValidEmail && email !== '' && (
            <Text
              style={{
                marginLeft: 10,
                marginTop: 5,
                color: '#d20000',
                fontWeight: 'bold',
              }}>
              Informe um e-mail válido.
            </Text>
          )}
          <TextInput
            right={
              <TextInput.Icon
                onPress={() => setHidedPassword(prevStatus => !prevStatus)}
                icon={hidedPassword ? 'eye' : 'eye-off'}
              />
            }
            secureTextEntry={hidedPassword}
            mode="outlined"
            value={password}
            onChangeText={text => setPassword(text)}
            label="Senha: *"
            style={{backgroundColor: '#fa9a9a', marginVertical: 10}}
            outlineColor="#F00"
            activeOutlineColor="#bc0000"
          />
          {!isValidPassword && password !== '' && (
            <Text
              style={{
                marginLeft: 10,
                marginTop: 5,
                color: '#d20000',
                fontWeight: 'bold',
              }}>
              A senha deve ter pelo menos 8 caracteres, incluindo maiúsculas,
              minúsculas, números e símbolos
            </Text>
          )}
          <Button
            disabled={loading}
            icon="account-key"
            mode="elevated"
            buttonColor="#FC6767"
            textColor="#FFF"
            style={{justifyContent: 'center', height: 40}}
            onPress={handleLogin}>
            {loading ? 'Fazendo login ...' : 'Fazer login'}
          </Button>
          <Button
            disabled={loading}
            icon="account-plus"
            mode="elevated"
            buttonColor="#FC6767"
            textColor="#FFF"
            style={{
              justifyContent: 'center',
              height: 40,
              width: '90%',
              marginLeft: '5%',
              marginTop: 20,
            }}
            onPress={() => navigation.navigate('CreateUser')}>
            Cadastrar usuário
          </Button>
        </View>
      </KeyboardAvoidingView>
    </View>
  );
}
