import React, {useState, useCallback, useEffect} from 'react';
import {ToastAndroid, View} from 'react-native';
import styles from './styles';
import {
  RootRouteProps,
  RootStackParamList,
} from '../../interfaces/RootStackParamList';
import {
  useNavigation,
  useRoute,
  useFocusEffect,
} from '@react-navigation/native';
import {Chip, Icon, IconButton, Text} from 'react-native-paper';
import HeaderImage from '../../components/HeaderImage';
import {StackNavigationProp} from '@react-navigation/stack';
import CategoryButtons from '../../components/CategoryButtons';
import Loading from '../../components/Loading';
import {FlatList, ScrollView} from 'react-native-gesture-handler';
import {Food} from '../../interfaces/Food';
import CardFoodRegisters from '../../components/CardFoodRegisters';
import {
  fetchFoods,
  getFoodWeekDayTimeUnit,
  getIconByCategory,
  saveWeekDayTimeFood,
} from '../../utils/functions';

type EditFoodOrganizerScreenProps = RootRouteProps<'FoodOrganizerCreate'>;

type EditFoodScreenNavigationProp = StackNavigationProp<
  RootStackParamList,
  'FoodOrganizerCreate'
>;

export default function FoodOrganizerCreate() {
  const route = useRoute<EditFoodOrganizerScreenProps>();
  const navigation = useNavigation<EditFoodScreenNavigationProp>();
  const [categorySelected, setCategorySelected] = useState<string>('dairy');
  const [chipFoods, setChipFoods] = useState<string[]>([]);
  const [loading, setLoading] = useState(false);
  const [foods, setFoods] = useState<Food[]>([]);
  const {weekDay, mealType} = route.params || {};

  useFocusEffect(
    useCallback(() => {
      async function getFoodWeekDayTimeUnitFunction() {
        const foods = await getFoodWeekDayTimeUnit(weekDay, mealType);
        if (foods !== null) {
          setChipFoods(foods);
        }
      }

      void getFoodWeekDayTimeUnitFunction();
    }, []),
  );

  const addChipFood = useCallback(
    (item: Food) => {
      setChipFoods(chips => {
        const exists = chips.some(chip => chip === item.name);
        if (exists) return chips;
        return [...chips, item.name];
      });
    },
    [categorySelected],
  );

  const removeChipFood = useCallback(
    (foodName: string) => {
      setChipFoods(chips => chips.filter(chip => !(chip === foodName)));
    },
    [categorySelected],
  );

  const renderItem = ({item}: {item: Food}) => (
    <CardFoodRegisters
      food={item}
      category={categorySelected}
      setFoods={setFoods}
      shouldHideActions
      shouldHideQuantity
      onPress={() => addChipFood(item)}
    />
  );

  const saveMealRoutine = useCallback(async () => {
    try {
      await saveWeekDayTimeFood(weekDay, mealType, chipFoods);

      navigation.goBack();
    } catch (_) {
      ToastAndroid.showWithGravityAndOffset(
        'Houve um erro ao obter as refeições',
        ToastAndroid.SHORT,
        ToastAndroid.BOTTOM,
        25,
        50,
      );
    }
  }, [weekDay, mealType, chipFoods]);

  useFocusEffect(
    useCallback(() => {
      if (categorySelected) {
        fetchFoods(categorySelected, setFoods, setLoading);
      }
    }, [categorySelected]),
  );

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
      <HeaderImage title={`${weekDay} - ${mealType}`} animated={false} />
      <View style={{width: '100%'}}>
        <CategoryButtons
          category={categorySelected}
          setCategory={setCategorySelected}
        />
        {loading ? (
          <Loading />
        ) : (
          <>
            <FlatList
              showsVerticalScrollIndicator={false}
              style={{marginTop: 10, height: '30%'}}
              data={foods}
              renderItem={renderItem}
              keyExtractor={item => item.key}
              ListEmptyComponent={() => (
                <View
                  style={{
                    alignItems: 'center',
                    marginTop: 10,
                  }}>
                  <Icon source="food-drumstick-off" size={35} color="#900" />
                  <Text
                    style={{
                      marginTop: 10,
                      fontWeight: 'bold',
                      fontSize: 20,
                      color: '#b40000',
                    }}>
                    Sem Alimentados Cadastrados
                  </Text>
                </View>
              )}
            />
            <Text
              style={{
                marginVertical: 10,
                fontSize: 20,
                fontWeight: 'bold',
                color: '#fff',
              }}>
              Itens adicionados:
            </Text>
            <View style={{display: 'flex', flexDirection: 'row'}}>
              <ScrollView
                style={{
                  display: 'flex',
                  borderWidth: 2,
                  borderColor: '#b40000',
                  height: 125,
                  padding: 5,
                  borderRadius: 15,
                }}>
                {chipFoods.map((chip: string, index: number) => (
                  <Chip
                    key={`${chip}-${index}-${categorySelected}`}
                    onClose={() => removeChipFood(chip)}
                    style={{marginBottom: 10}}
                    closeIcon="close">
                    {chip}
                  </Chip>
                ))}
              </ScrollView>
              <View
                style={{
                  justifyContent: 'center',
                  alignItems: 'center',
                }}>
                <IconButton
                  style={{backgroundColor: '#FC6767'}}
                  iconColor="#b40000"
                  onPress={saveMealRoutine}
                  size={40}
                  icon="content-save"
                />
              </View>
            </View>
          </>
        )}
      </View>
    </View>
  );
}
