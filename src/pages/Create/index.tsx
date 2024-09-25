import {
  View,
  Text,
  KeyboardAvoidingView,
  Keyboard,
  ToastAndroid,
} from 'react-native';
import React, {useState, useMemo} from 'react';
import {
  ActivityIndicator,
  Button,
  IconButton,
  SegmentedButtons,
  TextInput,
} from 'react-native-paper';
import {
  RootRouteProps,
  RootStackParamList,
} from '../../interfaces/RootStackParamList';
import {useRoute, useNavigation} from '@react-navigation/native';
import styles from './styles';
import {StackNavigationProp} from '@react-navigation/stack';
import CategoryButtons from '../../components/CategoryButtons';
import {Food} from '../../interfaces/Food';
import {addFood} from '../../utils/functions';

type CreateEditScreenProps =
  | RootRouteProps<'Cadastrar'>
  | RootRouteProps<'Editar'>;

type CreateScreenNavigationProp =
  | StackNavigationProp<RootStackParamList, 'Cadastrar'>
  | StackNavigationProp<RootStackParamList, 'Editar'>;

export default function Create() {
  const route = useRoute<CreateEditScreenProps>();
  const isEditMode = useMemo(() => route.name === 'Editar', [route]);
  const {key, category} = route.params || {};
  const [loading, setLoading] = useState(false);
  const navigation = useNavigation<CreateScreenNavigationProp>();

  const [categorySelected, setCategorySelected] = useState<string>('dairy');

  const [food, setFood] = useState<Omit<Food, 'key'>>({
    name: '',
    measurementUnit: '',
    quantity: 0,
  });

  const handleSelectMeasurementUnit = (value: string) => {
    Keyboard.dismiss();
    setFood(prevFood => ({
      ...prevFood,
      measurementUnit: value,
    }));
  };

  const handleAddFood = async () => {
    console.log(food);
    if (food.name === '') {
      ToastAndroid.showWithGravityAndOffset(
        `Você deve informar um nome válido para seu alimento`,
        ToastAndroid.SHORT,
        ToastAndroid.BOTTOM,
        25,
        50,
      );
      return;
    }

    if (food.quantity === 0) {
      ToastAndroid.showWithGravityAndOffset(
        `Você deve informar uma quantidade válida para seu alimento`,
        ToastAndroid.SHORT,
        ToastAndroid.BOTTOM,
        25,
        50,
      );
      return;
    }

    if (food.measurementUnit === '') {
      ToastAndroid.showWithGravityAndOffset(
        `Você deve informar uma unidade de medida válida para seu alimento`,
        ToastAndroid.SHORT,
        ToastAndroid.BOTTOM,
        25,
        50,
      );
      return;
    }

    //   if (id !== '') {
    //     firebase
    //       .database()
    //       .ref(categoria)
    //       .child(id)
    //       .update({
    //         nome: nome,
    //         quantidade: +quantidade,
    //         unidadeMedida: unidadeMedida,
    //       })
    //       .then(() => {
    //         navigation.goBack();
    //         ToastAndroid.showWithGravityAndOffset(
    //           `${nome} editado com sucesso`,
    //           ToastAndroid.SHORT,
    //           ToastAndroid.BOTTOM,
    //           25,
    //           50,
    //         );
    //       })
    //       .catch(() => {
    //         ToastAndroid.showWithGravityAndOffset(
    //           'Houve um erro ao editar o Alimento',
    //           ToastAndroid.SHORT,
    //           ToastAndroid.BOTTOM,
    //           25,
    //           50,
    //         );
    //       });
    //     return;
    //   }

    await addFood(categorySelected, food);
    navigation.goBack();
  };

  return (
    <KeyboardAvoidingView style={styles.container}>
      {loading ? (
        <View style={{flex: 1, alignItems: 'center', justifyContent: 'center'}}>
          <ActivityIndicator
            color="#b40000"
            style={styles.loadingActivityIndicator}
            size={50}
          />
          <Text style={styles.loadingText}>Trazendo Alimento...</Text>
        </View>
      ) : (
        <>
          <View style={styles.goBackArea}>
            <IconButton
              icon="keyboard-backspace"
              size={25}
              onPress={() => navigation.goBack()}
            />
          </View>
          <View style={styles.formArea}>
            <Text style={styles.title}>
              {/* {id !== '' ? `Editar ${nomeOriginal}` : 'Cadastrar Alimento'} */}
              {'Cadastrar Alimento'}
            </Text>
            <View style={styles.inputsArea}>
              <View style={{width: '100%'}}>
                <Text style={styles.categoryTitle}>Categoria</Text>
              </View>
              <CategoryButtons
                category={categorySelected}
                setCategory={setCategorySelected}
              />
              <TextInput
                mode="outlined"
                value={food.name}
                onChangeText={text =>
                  setFood(prevFood => ({
                    ...prevFood,
                    name: text,
                  }))
                }
                label="Nome"
                style={{backgroundColor: '#fa9a9a', marginTop: 10}}
                outlineColor="#F00"
                activeOutlineColor="#bc0000"
              />
              <TextInput
                mode="outlined"
                value={food.quantity !== 0 ? `${food.quantity}` : ''}
                onChangeText={text =>
                  setFood(prevFood => ({
                    ...prevFood,
                    quantity: +text,
                  }))
                }
                label="Quantidade"
                keyboardType="numeric"
                style={{backgroundColor: '#fa9a9a', marginVertical: 20}}
                outlineColor="#F00"
                activeOutlineColor="#bc0000"
              />
              <View style={{width: '100%'}}>
                <Text style={{fontWeight: 'bold', fontSize: 17}}>
                  Unidade de Medida
                </Text>
              </View>
              <SegmentedButtons
                style={{marginVertical: 20}}
                value={food.measurementUnit}
                onValueChange={handleSelectMeasurementUnit}
                buttons={[
                  {
                    value: 'ml',
                    label: 'Mililitro',
                    checkedColor: '#F00',
                  },
                  {
                    value: 'un',
                    label: 'Unidade',
                    checkedColor: '#F00',
                  },
                  {
                    value: 'g',
                    label: 'Grama',
                    checkedColor: '#F00',
                  },
                ]}
              />
              <Button
                icon="food-drumstick"
                mode="elevated"
                buttonColor="#FC6767"
                textColor="#FFF"
                style={{justifyContent: 'center', height: 40}}
                onPress={handleAddFood}>
                {/* {id !== '' ? 'Editar' : 'Cadastrar'} */}
                {'Cadastrar'}
              </Button>
            </View>
          </View>
        </>
      )}
    </KeyboardAvoidingView>
  );
}
