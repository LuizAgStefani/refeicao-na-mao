import {View} from 'react-native';
import {SegmentedButtons} from 'react-native-paper';
import styles from './style';

interface Props {
  category: string;
  setCategory: React.Dispatch<React.SetStateAction<string>>;
  disabled?: boolean;
}

export default function CategoryButtons(props: Props) {
  return (
    <View style={styles.categoryArea}>
      <SegmentedButtons
        value={props.category}
        onValueChange={props.setCategory}
        buttons={[
          {
            value: 'dairy',
            label: 'Laticínio',
            icon: 'cow',
            checkedColor: '#f00',
            disabled: props.disabled,
          },
          {
            value: 'protein',
            label: 'Proteína',
            icon: 'food-drumstick',
            checkedColor: '#f00',
            uncheckedColor: '#cfcfcf',
            disabled: props.disabled,
          },
        ]}
      />
      <SegmentedButtons
        value={props.category}
        onValueChange={props.setCategory}
        buttons={[
          {
            value: 'carbohydrate',
            label: 'Carboídrato',
            icon: 'bread-slice',
            checkedColor: '#F00',
            disabled: props.disabled,
          },
          {
            value: 'fruit',
            label: 'Fruta',
            icon: 'fruit-grapes',
            checkedColor: '#F00',
            disabled: props.disabled,
          },
        ]}
      />
    </View>
  );
}
