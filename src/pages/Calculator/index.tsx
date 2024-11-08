import {useCallback, useEffect, useState} from 'react';
import {Text, View, TouchableOpacity, Animated, FlatList} from 'react-native';
import {Food} from '../../interfaces/Food';
import CategoryButtons from '../../components/CategoryButtons';
import styles from './styles';
import {getDatabase, ref, child, get} from 'firebase/database';
import Loading from '../../components/Loading';
import {
  Button,
  Dialog,
  Icon,
  IconButton,
  Portal,
  TextInput,
} from 'react-native-paper';
import Toast from 'react-native-toast-message';
import {useNavigation} from '@react-navigation/native';
import {RootStackParamList} from '../../interfaces/RootStackParamList';
import {StackNavigationProp} from '@react-navigation/stack';
import {getUserIdFromAsyncStorage} from '../../utils/functions';
import HeaderImage from '../../components/HeaderImage';

interface DialogItemFoodProps {
  food: Food;
  setFood: (food: Food) => void;
}

type CalculatorScreenNavigationProp = StackNavigationProp<
  RootStackParamList,
  'Calculator'
>;

export default function Calculator() {
  const [firstFoodDialog, setFirstFoodDialogVisible] = useState(false);
  const [secondFoodDialog, setSecondFoodDialogVisible] = useState(false);
  const [category, setCategory] = useState<string>('dairy');
  const [foods, setFoods] = useState<Food[]>([]);
  const [loading, setLoading] = useState(false);
  const [firstFood, setFirstFood] = useState<Food>();
  const [secondFood, setSecondFood] = useState<Food>();
  const [notFullfilFoodQuantity, setNotFullfilFoodQuantity] = useState('');
  const [subResult, setSubResult] = useState('');

  const navigation = useNavigation<CalculatorScreenNavigationProp>();

  const handleDismissFoodDialog = useCallback(() => {
    setFirstFoodDialogVisible(false);
    setSecondFoodDialogVisible(false);
  }, []);

  const resetScreen = useCallback(() => {
    setSubResult('');
    setFirstFood(undefined);
    setSecondFood(undefined);
    setNotFullfilFoodQuantity('');
    setFoods([]);
  }, []);

  const getData = useCallback(async () => {
    setLoading(true);
    resetScreen();
    const dbRef = ref(getDatabase());
    const userId = await getUserIdFromAsyncStorage();

    if (userId !== undefined) {
      get(child(dbRef, `${userId}/foods/${category}/`))
        .then(snapshot => {
          if (snapshot.exists()) {
            const orderedFoods: Food[] = [];

            snapshot.forEach(val => {
              const food: Food = {
                key: val.key,
                name: val.val().name,
                measurementUnit: val.val().measurementUnit,
                quantity: val.val().quantity,
              };
              orderedFoods.push(food);
            });

            orderedFoods.sort((a: Food, b: Food) =>
              a.name
                .toLocaleLowerCase()
                .localeCompare(b.name.toLocaleLowerCase()),
            );

            setFoods(orderedFoods);
          }
        })
        .catch(error => {
          console.error(error);
        })
        .finally(() => setLoading(false));
    }
  }, [category]);

  useEffect(() => {
    getData();
  }, [category]);

  const handleAddFood = useCallback(
    (food: Food, selectedModal: 'first' | 'second') => {
      if (subResult !== '') {
        setSubResult('');
        setFirstFood(undefined);
        setSecondFood(undefined);
        setNotFullfilFoodQuantity('');
      }

      switch (selectedModal) {
        case 'first':
          setFirstFood(food);
          break;
        case 'second':
          setSecondFood(food);
        default:
          break;
      }
      handleDismissFoodDialog();
    },
    [subResult],
  );

  const handleCalculate = () => {
    if (
      firstFood !== undefined &&
      secondFood !== undefined &&
      notFullfilFoodQuantity !== ''
    ) {
      const quantityFirstFood = firstFood.quantity;

      if (+notFullfilFoodQuantity > quantityFirstFood!) {
        Toast.show({
          visibilityTime: 6000,
          type: 'info',
          text1: 'Atenção',
          text1Style: {
            fontSize: 17,
          },
          text2:
            'A quantidade não pode ser maior do que a quantidade padrão do Alimento',
          text2Style: {
            fontSize: 13,
          },
        });
        return;
      }

      const quantitySecondFood = secondFood.quantity;

      let firstResult = (+notFullfilFoodQuantity * 100) / quantityFirstFood;
      firstResult = +firstResult.toFixed(0);

      let secondResult = (firstResult * quantitySecondFood) / 100;
      secondResult = +secondResult.toFixed(0);

      const finalResult = quantitySecondFood! - secondResult;

      setSubResult(`${finalResult}`);
    } else {
      return;
    }
  };

  const DialogItemFood = ({food, setFood}: DialogItemFoodProps) => {
    return (
      <TouchableOpacity
        style={{
          width: '100%',
          borderBottomWidth: 1,
          margin: 5,
          height: 50,
          justifyContent: 'center',
          borderBottomColor: '#FFF',
        }}
        onPress={() => setFood(food)}>
        <Text style={{fontSize: 18, color: '#FFF'}}>{food.name}</Text>
      </TouchableOpacity>
    );
  };

  return (
    <View style={styles.container}>
      <Portal>
        <Dialog
          style={{backgroundColor: '#FC6767'}}
          onDismiss={handleDismissFoodDialog}
          visible={firstFoodDialog}>
          <Dialog.Title style={styles.dialogTitle}>
            Escolha o Primeiro Alimento
          </Dialog.Title>
          <Dialog.ScrollArea style={{height: 200}}>
            <FlatList
              showsVerticalScrollIndicator={false}
              data={foods}
              renderItem={({item}) => (
                <DialogItemFood
                  food={item}
                  setFood={item => handleAddFood(item, 'first')}
                />
              )}
            />
          </Dialog.ScrollArea>
        </Dialog>
        <Dialog
          style={{backgroundColor: '#FC6767'}}
          onDismiss={handleDismissFoodDialog}
          visible={secondFoodDialog}>
          <Dialog.Title style={styles.dialogTitle}>
            Escolha o Segundo Alimento
          </Dialog.Title>
          <Dialog.ScrollArea style={{height: 200}}>
            <FlatList
              showsVerticalScrollIndicator={false}
              data={foods}
              renderItem={({item}) => (
                <DialogItemFood
                  food={item}
                  setFood={item => handleAddFood(item, 'second')}
                />
              )}
            />
          </Dialog.ScrollArea>
        </Dialog>
      </Portal>
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
      <HeaderImage title="Calculadora de alimentos" animated={false} />
      <Animated.ScrollView
        showsVerticalScrollIndicator={false}
        style={styles.contentArea}>
        <CategoryButtons category={category} setCategory={setCategory} />
        {loading ? (
          <Loading />
        ) : (
          <>
            {foods.length > 0 ? (
              <>
                <View style={styles.buttonsArea}>
                  <Button
                    disabled={loading}
                    icon="food-drumstick"
                    mode="elevated"
                    buttonColor="#FC6767"
                    textColor="#FFF"
                    onPress={() => setFirstFoodDialogVisible(true)}
                    style={{width: '45%'}}>
                    1
                  </Button>
                  <Button
                    disabled={loading}
                    icon="food-drumstick"
                    mode="elevated"
                    buttonColor="#FC6767"
                    textColor="#FFF"
                    onPress={() => setSecondFoodDialogVisible(true)}
                    style={{width: '45%'}}>
                    2
                  </Button>
                </View>
                <View style={styles.descriptionFoodArea}>
                  <Text style={styles.foodTitle}>
                    Alimento 1:{' '}
                    {firstFood !== undefined ? (
                      <Text style={{color: '#da0606'}}>{firstFood.name}</Text>
                    ) : (
                      'Não escolhido'
                    )}
                  </Text>
                  <Text style={styles.foodTextHelper}>
                    (Alimento que não será consumido completamente)
                  </Text>
                </View>
                <TextInput
                  disabled={firstFood === undefined}
                  mode="outlined"
                  value={notFullfilFoodQuantity}
                  onChangeText={text => setNotFullfilFoodQuantity(text)}
                  label="Quantidade"
                  keyboardType="numeric"
                  style={{
                    backgroundColor: '#fa9a9a',
                    marginBottom: 10,
                    marginTop: 5,
                  }}
                  outlineColor="#F00"
                  activeOutlineColor="#bc0000"
                  maxLength={6}
                />
                <View style={[styles.descriptionFoodArea, {marginBottom: 20}]}>
                  <Text style={styles.foodTitle}>
                    Alimento 2:{' '}
                    {secondFood !== undefined ? (
                      <Text style={{color: '#da0606'}}>{secondFood.name}</Text>
                    ) : (
                      'Não escolhido'
                    )}
                  </Text>
                  <Text style={styles.foodTextHelper}>
                    (Alimento que será calculado o restante)
                  </Text>
                </View>
                <Button
                  disabled={
                    firstFood === undefined ||
                    secondFood === undefined ||
                    notFullfilFoodQuantity === ''
                  }
                  icon="calculator"
                  mode="elevated"
                  buttonColor="#FC6767"
                  textColor="#FFF"
                  onPress={handleCalculate}>
                  Calcular
                </Button>
                {subResult !== '' && secondFood !== undefined && (
                  <View style={styles.resultArea}>
                    <Text style={styles.resultTitle}>Resultado</Text>
                    <View
                      style={{
                        borderWidth: 1,
                        borderColor: '#F00',
                        padding: 5,
                        paddingHorizontal: 10,
                        borderRadius: 50,
                        marginTop: 5,
                      }}>
                      <Text style={styles.resultText}>
                        {subResult}
                        {secondFood.measurementUnit}
                      </Text>
                    </View>
                  </View>
                )}
              </>
            ) : (
              <View style={styles.noFoodArea}>
                <View style={{marginBottom: 20}}>
                  <Button
                    icon="food-fork-drink"
                    mode="elevated"
                    buttonColor="#FC6767"
                    textColor="#FFF"
                    onPress={() => navigation.navigate('Registros')}
                    style={{marginBottom: 5}}>
                    Gerenciar Alimentos
                  </Button>
                </View>
                <Icon source="food-drumstick-off" size={35} color="#900" />
                <Text
                  style={{
                    marginTop: 10,
                    fontWeight: 'bold',
                    fontSize: 20,
                    color: '#b40000',
                    textAlign: 'center',
                  }}>
                  Sem Alimentados Cadastrados para essa categoria
                </Text>
              </View>
            )}
          </>
        )}
      </Animated.ScrollView>
    </View>
  );
}
