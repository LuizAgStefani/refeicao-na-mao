import {ToastAndroid} from 'react-native';
import {
  child,
  get,
  getDatabase,
  push,
  ref,
  remove,
  set,
  update,
} from 'firebase/database';
import {Food} from '../interfaces/Food';

export const fetchFoods = async (
  category: string,
  setFoods: Function,
  setLoading: Function,
) => {
  setLoading(true);
  setFoods([]);

  try {
    const dbRef = ref(getDatabase());
    const snapshot = await get(child(dbRef, `${category}/`));

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
    } else {
      setFoods([]);
    }
  } catch (error) {
    console.error('Erro ao buscar os dados: ', error);
  } finally {
    setLoading(false);
  }
};

export const deleteFood = async (
  category: string,
  food: Partial<Food>,
  shouldHideMessage?: boolean,
) => {
  try {
    const db = getDatabase();
    const foodRef = ref(db, `${category}/${food.key}`);

    await remove(foodRef);
    if (!shouldHideMessage && food.name) {
      ToastAndroid.showWithGravityAndOffset(
        `${food.name} excluído(a) com sucesso`,
        ToastAndroid.SHORT,
        ToastAndroid.BOTTOM,
        25,
        50,
      );
    }
  } catch (_) {
    ToastAndroid.showWithGravityAndOffset(
      'Houve um erro ao excluir o alimento',
      ToastAndroid.SHORT,
      ToastAndroid.BOTTOM,
      25,
      50,
    );
  }
};

export const addFood = async (
  category: string,
  newFood: Omit<Food, 'key'>,
  shouldHideMessage?: boolean,
) => {
  try {
    const db = getDatabase();
    const foodsRef = ref(db, `${category}/`);

    await push(foodsRef, newFood);

    if (!shouldHideMessage) {
      ToastAndroid.showWithGravityAndOffset(
        'Alimento cadastrado com sucesso',
        ToastAndroid.SHORT,
        ToastAndroid.BOTTOM,
        25,
        50,
      );
    }
  } catch (error) {
    ToastAndroid.showWithGravityAndOffset(
      'Houve um erro ao cadastrar o alimento',
      ToastAndroid.SHORT,
      ToastAndroid.BOTTOM,
      25,
      50,
    );
  }
};

export const fetchFoodByKey = async (category: string, foodKey: string) => {
  try {
    const db = getDatabase();
    const foodRef = ref(db, `${category}/${foodKey}`);

    const snapshot = await get(foodRef);

    if (snapshot.exists()) {
      const food = snapshot.val();
      return {...food, category};
    } else {
      return null;
    }
  } catch (error) {
    return null;
  }
};

export const editFood = async (
  category: string,
  foodKey: string,
  newFood: Partial<Food>,
) => {
  try {
    const db = getDatabase();
    const foodRef = ref(db, `${category}/${foodKey}`);

    await update(foodRef, newFood);

    ToastAndroid.showWithGravityAndOffset(
      `${newFood.name} cadastrado(a) com sucesso`,
      ToastAndroid.SHORT,
      ToastAndroid.BOTTOM,
      25,
      50,
    );
  } catch (error) {
    ToastAndroid.showWithGravityAndOffset(
      'Houve um erro ao editar o alimento',
      ToastAndroid.SHORT,
      ToastAndroid.BOTTOM,
      25,
      50,
    );
  }
};
