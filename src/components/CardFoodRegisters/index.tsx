import {View, Text, Alert, GestureResponderEvent} from 'react-native';
import React, {useCallback} from 'react';
import {List} from 'react-native-paper';
import {Food} from '../../interfaces/Food';
import {TouchableOpacity} from 'react-native-gesture-handler';
import styles from './styles';
import {deleteFood, getIconByCategory} from '../../utils/functions';
import {useNavigation} from '@react-navigation/native';
import {RootStackParamList} from '../../interfaces/RootStackParamList';
import {StackNavigationProp} from '@react-navigation/stack';

type CardFoodRegistersProps = {
  food: Food;
  category: string;
  setFoods: React.Dispatch<React.SetStateAction<Food[]>>;
  shouldHideActions?: boolean;
  onPress?: (e: GestureResponderEvent) => void;
  shouldHideQuantity?: boolean;
};

type CreateScreenNavigationProp = StackNavigationProp<
  RootStackParamList,
  'Editar'
>;

export default function CardFoodRegisters({
  category,
  food,
  setFoods,
  shouldHideActions,
  onPress,
  shouldHideQuantity,
}: CardFoodRegistersProps) {
  const icon = getIconByCategory(category);

  const navigation = useNavigation<CreateScreenNavigationProp>();

  const handleRemoveFood = useCallback(() => {
    Alert.alert(
      'Confirmar exclusão',
      `Você quer realmente excluir o(a) ${food.name}?`,
      [
        {text: 'Cancelar', onPress: () => false},
        {
          text: 'Confirmar',
          onPress: async () => {
            await deleteFood(category, food);

            setFoods(prevFoods => prevFoods.filter(f => f.key !== food.key));
          },
        },
      ],
    );
  }, []);

  return (
    <List.Item
      onPress={onPress ? onPress : () => {}}
      title={<Text style={styles.listItemTitle}>{food.name}</Text>}
      description={
        !shouldHideQuantity ? (
          <Text style={styles.listItemDescription}>
            {food.quantity}
            {food.measurementUnit}
            {food.calories && food.calories !== 0
              ? ` - ${food.calories} cal.`
              : ``}
          </Text>
        ) : undefined
      }
      left={props => <List.Icon {...props} icon={icon} color="#b40000" />}
      right={
        !shouldHideActions
          ? props => (
              <View style={styles.listItemRight}>
                <TouchableOpacity
                  onPress={() =>
                    navigation.navigate('Editar', {
                      category: category,
                      key: food.key,
                    })
                  }
                  {...props}>
                  <List.Icon icon="lead-pencil" color="#b40000" />
                </TouchableOpacity>
                <TouchableOpacity onPress={handleRemoveFood} {...props}>
                  <List.Icon icon="trash-can" color="#b40000" />
                </TouchableOpacity>
              </View>
            )
          : undefined
      }
      style={styles.listItem}
    />
  );
}
