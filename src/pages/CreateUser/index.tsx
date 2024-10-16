import {
  View,
  Text,
  Animated,
  KeyboardAvoidingView,
  ToastAndroid,
} from 'react-native';
import React, {useState, useMemo, useCallback} from 'react';
import styles from './styles';
import {Button, Icon, IconButton, TextInput} from 'react-native-paper';
import {login, registerUser} from '../../utils/functions';
import {StackNavigationProp} from '@react-navigation/stack';
import {RootStackParamList} from '../../interfaces/RootStackParamList';
import {CommonActions, useNavigation} from '@react-navigation/native';

type LoginScreenNavigationProp = StackNavigationProp<
  RootStackParamList,
  'Home'
>;

export default function CreateUser() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [passwordConfirmation, setpasswordConfirmation] = useState('');
  const [hidedPassword, setHidedPassword] = useState(true);
  const [hidedPasswordConfirmation, setHidedPasswordConfirmation] =
    useState(true);
  const [loading, setLoading] = useState(false);

  const navigation = useNavigation<LoginScreenNavigationProp>();
  const navigationReset = useNavigation();

  const isValidEmail = useMemo(() => {
    const regex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return regex.test(email);
  }, [email]);

  const isValidPassword = useMemo(() => {
    const regex =
      /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[@$!%*?&])[A-Za-z\d@$!%*?&]{8,}$/;
    return regex.test(password);
  }, [password]);

  const isValidPasswordConfirmation = useMemo(() => {
    return passwordConfirmation === password;
  }, [password, passwordConfirmation]);

  const handleSubmitUser = useCallback(async () => {
    setLoading(true);

    if (email === '' || !isValidEmail) {
      ToastAndroid.showWithGravityAndOffset(
        `Informe um email válido`,
        ToastAndroid.SHORT,
        ToastAndroid.BOTTOM,
        25,
        50,
      );

      return setLoading(false);
    }

    if (password === '' || !isValidPassword) {
      ToastAndroid.showWithGravityAndOffset(
        `Informe uma senha válida`,
        ToastAndroid.SHORT,
        ToastAndroid.BOTTOM,
        25,
        50,
      );

      return setLoading(false);
    }

    if (passwordConfirmation === '' || !isValidPasswordConfirmation) {
      ToastAndroid.showWithGravityAndOffset(
        `As senhas devem ser iguais`,
        ToastAndroid.SHORT,
        ToastAndroid.BOTTOM,
        25,
        50,
      );

      return setLoading(false);
    }

    if (await registerUser(email, password)) {
      navigationReset.dispatch(
        CommonActions.reset({
          index: 0,
          routes: [{name: 'Home'}],
        }),
      );

      ToastAndroid.showWithGravityAndOffset(
        `Cadastro efetuado com sucesso`,
        ToastAndroid.SHORT,
        ToastAndroid.BOTTOM,
        25,
        50,
      );
    } else {
      ToastAndroid.showWithGravityAndOffset(
        `Houve algum problema ao cadastrar o usuário, tente novamente!`,
        ToastAndroid.SHORT,
        ToastAndroid.BOTTOM,
        25,
        50,
      );
    }
  }, [email, password, passwordConfirmation]);

  return (
    <View style={styles.container}>
      <IconButton
        icon="keyboard-backspace"
        size={25}
        onPress={() => navigation.goBack()}
        style={{
          position: 'absolute',
          left: 0,
          top: 0,
        }}
      />
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
        keyboardVerticalOffset={-50}>
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
          Preencha os campos para fazer o cadastro
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
          <TextInput
            right={
              <TextInput.Icon
                onPress={() =>
                  setHidedPasswordConfirmation(prevStatus => !prevStatus)
                }
                icon={hidedPasswordConfirmation ? 'eye' : 'eye-off'}
              />
            }
            secureTextEntry={hidedPasswordConfirmation}
            mode="outlined"
            value={passwordConfirmation}
            onChangeText={text => setpasswordConfirmation(text)}
            label="Confirmação de Senha: *"
            style={{backgroundColor: '#fa9a9a', marginBottom: 10}}
            outlineColor="#F00"
            activeOutlineColor="#bc0000"
          />
          {!isValidPasswordConfirmation && passwordConfirmation !== '' && (
            <Text
              style={{
                marginLeft: 10,
                marginTop: 5,
                color: '#d20000',
                fontWeight: 'bold',
              }}>
              As senhas devem ser iguais
            </Text>
          )}
          <Button
            disabled={loading}
            icon="account-plus"
            mode="elevated"
            buttonColor="#FC6767"
            textColor="#FFF"
            style={{justifyContent: 'center', height: 40}}
            onPress={handleSubmitUser}>
            {loading ? 'Cadastrando ...' : 'Cadastrar usuário'}
          </Button>
        </View>
      </KeyboardAvoidingView>
    </View>
  );
}
