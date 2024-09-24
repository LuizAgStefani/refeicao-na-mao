import {View, Text} from 'react-native';
import React from 'react';
import {List} from 'react-native-paper';
import {Food} from '../../interfaces/Food';
import {TouchableOpacity} from 'react-native-gesture-handler';
import styles from './styles';

type CardFoodRegistersProps = {
  food: Food;
  category: string;
};

const getIconByCategory = (category: string) => {
  switch (category) {
    case 'dairy':
      return 'cow';
    case 'protein':
      return 'food-drumstick';
    case 'carbohydrate':
      return 'bread-slice';
    case 'fruit':
      return 'fruit-grapes';
    default:
      return '';
  }
};

export default function CardFoodRegisters({
  category,
  food,
}: CardFoodRegistersProps) {
  const icon = getIconByCategory(category);

  return (
    <List.Item
      title={<Text style={styles.listItemTitle}>{food.name}</Text>}
      description={
        <Text style={styles.listItemDescription}>
          {food.quantity}
          {food.measurementUnit}
        </Text>
      }
      left={props => <List.Icon {...props} icon={icon} color="#b40000" />}
      right={props => (
        <View style={styles.listItemRight}>
          <TouchableOpacity onPress={() => {}} {...props}>
            <List.Icon icon="lead-pencil" color="#b40000" />
          </TouchableOpacity>
          <TouchableOpacity onPress={() => {}} {...props}>
            <List.Icon icon="trash-can" color="#b40000" />
          </TouchableOpacity>
        </View>
      )}
      style={styles.listItem}
    />
  );
}
