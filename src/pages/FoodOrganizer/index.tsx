import React, {useState, useCallback} from 'react';
import {View} from 'react-native';
import styles from './style';
import {
  Button,
  Card,
  Divider,
  IconButton,
  List,
  SegmentedButtons,
  Text,
} from 'react-native-paper';
import {useFocusEffect, useNavigation} from '@react-navigation/native';
import {StackNavigationProp} from '@react-navigation/stack';
import {RootStackParamList} from '../../interfaces/RootStackParamList';
import HeaderImage from '../../components/HeaderImage';
import {ScrollView, TouchableOpacity} from 'react-native-gesture-handler';
import {getFoodWeekDayTime} from '../../utils/functions';
import Loading from '../../components/Loading';

type FoodOrganizerScreenNavigationProp = StackNavigationProp<
  RootStackParamList,
  'FoodOrganizerCreate'
>;

type WeekDay = {
  abreviation: 'seg' | 'ter' | 'qua' | 'qui' | 'sex' | 'sab' | 'dom';
  name:
    | 'Segunda'
    | 'Terça'
    | 'Quarta'
    | 'Quinta'
    | 'Sexta'
    | 'Sábado'
    | 'Domingo';
};

type MealTimeCardProps = {
  mealType: string;
  foods: string[];
};

export default function FoodOrganizer() {
  const navigation = useNavigation<FoodOrganizerScreenNavigationProp>();

  const [weekDay, setWeekDay] = useState<WeekDay>({
    abreviation: 'seg',
    name: 'Segunda',
  });

  const [breakfastFood, setBreakfastFood] = useState<string[]>([]);
  const [lightMealFood, setLightMealFood] = useState<string[]>([]);
  const [lunchFood, setLunchFood] = useState<string[]>([]);
  const [snackFood, setSnackFood] = useState<string[]>([]);
  const [dinnerFood, setDinnerFood] = useState<string[]>([]);

  const [loading, setLoading] = useState(false);

  useFocusEffect(
    useCallback(() => {
      function resetFoods() {
        setBreakfastFood([]);
        setLightMealFood([]);
        setLunchFood([]);
        setSnackFood([]);
        setDinnerFood([]);
      }

      async function getFoodWeekDayTimeFunction() {
        const foodsPerWeekDayTime = await getFoodWeekDayTime(
          weekDay.name,
          setLoading,
        );

        if (foodsPerWeekDayTime !== null) {
          if (foodsPerWeekDayTime.breakfast) {
            setBreakfastFood(foodsPerWeekDayTime.breakfast);
          }

          if (foodsPerWeekDayTime.lightMeal) {
            setLightMealFood(foodsPerWeekDayTime.lightMeal);
          }

          if (foodsPerWeekDayTime.lunch) {
            setLunchFood(foodsPerWeekDayTime.lunch);
          }

          if (foodsPerWeekDayTime.snack) {
            setSnackFood(foodsPerWeekDayTime.snack);
          }

          if (foodsPerWeekDayTime.dinner) {
            setDinnerFood(foodsPerWeekDayTime.dinner);
          }
        }
      }

      resetFoods();
      getFoodWeekDayTimeFunction();
    }, [weekDay]),
  );

  const changeWeekDay = useCallback((value: string) => {
    switch (value) {
      case 'seg':
        setWeekDay({abreviation: 'seg', name: 'Segunda'});
        break;
      case 'ter':
        setWeekDay({abreviation: 'ter', name: 'Terça'});
        break;
      case 'qua':
        setWeekDay({abreviation: 'qua', name: 'Quarta'});
        break;
      case 'qui':
        setWeekDay({abreviation: 'qui', name: 'Quinta'});
        break;
      case 'sex':
        setWeekDay({abreviation: 'sex', name: 'Sexta'});
        break;
      case 'sab':
        setWeekDay({abreviation: 'sab', name: 'Sábado'});
        break;
      case 'dom':
        setWeekDay({abreviation: 'dom', name: 'Domingo'});
        break;
      default:
        break;
    }
  }, []);

  function MealTimeCard({mealType, foods}: MealTimeCardProps) {
    return (
      <Card style={styles.foodMealCard}>
        <View style={styles.foodMealHeader}>
          <Text style={styles.foodMealHeaderText}>{mealType}</Text>
          <Card.Actions>
            <TouchableOpacity
              onPress={() =>
                navigation.navigate('FoodOrganizerCreate', {
                  mealType: mealType,
                  weekDay: weekDay.name,
                })
              }>
              <List.Icon icon="lead-pencil" color="#b40000" />
            </TouchableOpacity>
          </Card.Actions>
        </View>
        <Card.Content>
          {foods.length === 0 ? (
            <Text style={{color: '#fff', fontWeight: 'bold'}}>
              Sem itens cadastrados
            </Text>
          ) : (
            foods.map((food, index) => (
              <Text
                key={`${food}-${index}`}
                style={{color: '#b40000', fontWeight: 'bold'}}>
                {food}
              </Text>
            ))
          )}
        </Card.Content>
      </Card>
    );
  }

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
      <HeaderImage title="Organizador alimentar" animated={false} />
      <SegmentedButtons
        style={styles.weekDayButtons}
        value={weekDay.abreviation}
        onValueChange={changeWeekDay}
        buttons={[
          {
            value: 'seg',
            label: 'Seg',
            checkedColor: '#f00',
          },
          {
            value: 'ter',
            label: 'Ter',
            checkedColor: '#f00',
          },
          {
            value: 'qua',
            label: 'Qua',
            checkedColor: '#f00',
          },
          {
            value: 'qui',
            label: 'Qui',
            checkedColor: '#f00',
          },
        ]}
      />
      <SegmentedButtons
        style={styles.weekDayButtons}
        value={weekDay.abreviation}
        onValueChange={changeWeekDay}
        buttons={[
          {
            value: 'sex',
            label: 'Sex',
            checkedColor: '#f00',
          },
          {
            value: 'sab',
            label: 'Sáb',
            checkedColor: '#f00',
          },
          {
            value: 'dom',
            label: 'Dom',
            checkedColor: '#f00',
          },
        ]}
      />
      <Text style={styles.weekDayTitle}>{weekDay.name}</Text>
      {loading ? (
        <Loading />
      ) : (
        <ScrollView style={{width: '100%'}}>
          <MealTimeCard foods={breakfastFood} mealType="Café da Manhã" />
          <MealTimeCard foods={lightMealFood} mealType="Colação" />
          <MealTimeCard foods={lunchFood} mealType="Almoço" />
          <MealTimeCard foods={snackFood} mealType="Lanche" />
          <MealTimeCard foods={dinnerFood} mealType="Jantar" />
        </ScrollView>
      )}
    </View>
  );
}
