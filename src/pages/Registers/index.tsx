import {useState, useEffect} from 'react';
import {View, Text, FlatList} from 'react-native';
import styles from './styles';
import {Button, Icon, IconButton} from 'react-native-paper';
import {useNavigation} from '@react-navigation/native';
import {StackNavigationProp} from '@react-navigation/stack';
import {RootStackParamList} from '../../interfaces/RootStackParamList';
import CategoryButtons from '../../components/CategoryButtons';
import {child, get, getDatabase, ref} from 'firebase/database';
import {Food} from '../../interfaces/Food';
import Loading from '../../components/Loading';
import CardFoodRegisters from '../../components/CardFoodRegisters';

type RegistersScreenNavigationProp = StackNavigationProp<
  RootStackParamList,
  'Registros'
>;

export default function Registers() {
  const navigation = useNavigation<RegistersScreenNavigationProp>();

  const [category, setCategory] = useState<string>('dairy');
  const [loading, setLoading] = useState(false);
  const [foods, setFoods] = useState<Food[]>([]);

  useEffect(() => {
    setLoading(true);
    setFoods([]);
    const dbRef = ref(getDatabase());
    get(child(dbRef, `${category}/`))
      .then(snapshot => {
        if (snapshot.exists()) {
          const foodsObtained: Food[] = [];
          snapshot.forEach(val => {
            const food: Food = {
              key: val.key,
              name: val.val().name,
              measurementUnit: val.val().measurementUnit,
              quantity: val.val().quantity,
            };

            foodsObtained.push(food);
          });
          setFoods(foodsObtained);
        }
      })
      .catch(error => {
        console.error(error);
      })
      .finally(() => setLoading(false));
  }, [category]);

  const renderItem = ({item}: {item: Food}) => (
    <CardFoodRegisters food={item} category={category} />
  );

  return (
    <View style={styles.container}>
      <View style={styles.screenArea}>
        <IconButton
          icon="keyboard-backspace"
          size={25}
          onPress={() => navigation.goBack()}
        />
        <Button
          icon="food-drumstick"
          mode="elevated"
          buttonColor="#FC6767"
          textColor="#FFF"
          style={{justifyContent: 'center', height: 40}}
          onPress={() => navigation.navigate('Cadastrar')}>
          Adicionar Alimento
        </Button>
      </View>
      <Text style={styles.title}>Alimentos Cadastrados</Text>
      <View style={styles.contentArea}>
        <CategoryButtons category={category} setCategory={setCategory} />
        {loading ? (
          <Loading />
        ) : (
          <FlatList
            showsVerticalScrollIndicator={false}
            style={styles.flatList}
            data={foods}
            renderItem={renderItem}
            keyExtractor={item => item.key}
            ListEmptyComponent={() => (
              <View style={styles.listEmptyComponentView}>
                <Icon source="food-drumstick-off" size={35} color="#900" />
                <Text style={styles.listEmptyComponentText}>
                  Sem Alimentados Cadastrados
                </Text>
              </View>
            )}
          />
        )}
      </View>
    </View>
  );
}