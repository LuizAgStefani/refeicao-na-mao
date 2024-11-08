import {
  View,
  Text,
  KeyboardAvoidingView,
  Keyboard,
  ToastAndroid,
} from 'react-native';
import React, {useState, useMemo, useEffect, useCallback} from 'react';
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
import {
  addFood,
  deleteFood,
  editFood,
  fetchFoodByKey,
} from '../../utils/functions';

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
  const [originalName, setOriginalName] = useState('');
  const [isFirstRender, setIsFirstRender] = useState(true);
  const [loading, setLoading] = useState(false);
  const navigation = useNavigation<CreateScreenNavigationProp>();

  const [categorySelected, setCategorySelected] = useState<string>('dairy');

  const [food, setFood] = useState<Omit<Food, 'key'>>({
    name: '',
    measurementUnit: '',
    quantity: 0,
    calories: 0,
  });

  useEffect(() => {
    if (isFirstRender) {
      void getFoodByKey();
    }

    return () => {
      setIsFirstRender(false);
    };
  }, [category, key, isFirstRender]);

  const getFoodByKey = useCallback(async () => {
    if (category && key) {
      setLoading(true);
      const foodFoundByKey = await fetchFoodByKey(category, key);
      if (foodFoundByKey !== null) {
        setFood({
          name: foodFoundByKey.name,
          measurementUnit: foodFoundByKey.measurementUnit,
          quantity: foodFoundByKey.quantity,
          calories: foodFoundByKey.calories ?? 0,
        });
        setOriginalName(foodFoundByKey.name);
        setCategorySelected(foodFoundByKey.category);
      }
      setLoading(false);
    }
  }, [category, key]);

  const handleSelectMeasurementUnit = (value: string) => {
    Keyboard.dismiss();
    setFood(prevFood => ({
      ...prevFood,
      measurementUnit: value,
    }));
  };

  const handleAddFood = async () => {
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

    if (isEditMode && key && category) {
      if (categorySelected !== category) {
        deleteFood(category, {key}, true);
      }
      await editFood(categorySelected, key, food);
    } else {
      await addFood(categorySelected, food);
    }

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
              {isEditMode ? `Editar ${originalName}` : 'Cadastrar Alimento'}
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
                label="Nome: *"
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
                label="Quantidade: *"
                keyboardType="numeric"
                style={{backgroundColor: '#fa9a9a', marginVertical: 20}}
                outlineColor="#F00"
                activeOutlineColor="#bc0000"
              />
              <TextInput
                mode="outlined"
                value={food.calories !== 0 ? `${food.calories}` : ''}
                onChangeText={text =>
                  setFood(prevFood => ({
                    ...prevFood,
                    calories: +text,
                  }))
                }
                maxLength={4}
                label="Quantidade de calorias:"
                keyboardType="numeric"
                style={{backgroundColor: '#fa9a9a', marginBottom: 20}}
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
                {isEditMode ? 'Editar' : 'Cadastrar'}
              </Button>
            </View>
          </View>
        </>
      )}
    </KeyboardAvoidingView>
  );
}
