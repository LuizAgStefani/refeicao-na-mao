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
import {
  createUserWithEmailAndPassword,
  signInWithEmailAndPassword,
  signOut,
} from 'firebase/auth';
import {auth} from '../config/firebaseConnection';
import AsyncStorage from '@react-native-async-storage/async-storage';
import {KEY_USER_ID} from './asyncStorageKeys';
import {StackNavigationProp} from '@react-navigation/stack';
import {RootStackParamList} from '../interfaces/RootStackParamList';
import {useNavigation, CommonActions} from '@react-navigation/native';

export const fetchFoods = async (
  category: string,
  setFoods: Function,
  setLoading: Function,
) => {
  setLoading(true);
  setFoods([]);

  try {
    const dbRef = ref(getDatabase());
    const userId = await getUserIdFromAsyncStorage();
    if (userId !== undefined) {
      const snapshot = await get(child(dbRef, `${userId}/foods/${category}/`));

      if (snapshot.exists()) {
        const foodsObtained: Food[] = [];
        snapshot.forEach(val => {
          const food: Food = {
            key: val.key,
            name: val.val().name,
            measurementUnit: val.val().measurementUnit,
            quantity: val.val().quantity,
            calories: val.val().calories,
          };
          foodsObtained.push(food);
        });
        setFoods(foodsObtained);
      } else {
        setFoods([]);
      }
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
    const userId = await getUserIdFromAsyncStorage();

    if (userId !== undefined) {
      const foodRef = ref(db, `${userId}/foods/${category}/${food.key}`);

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
    const userId = await getUserIdFromAsyncStorage();

    if (userId !== undefined) {
      const foodsRef = ref(db, `${userId}/foods/${category}/`);

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
    } else {
      ToastAndroid.showWithGravityAndOffset(
        'Houve um erro ao cadastrar o alimento',
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
    const userId = await getUserIdFromAsyncStorage();

    if (userId !== undefined) {
      const foodRef = ref(db, `${userId}/foods/${category}/${foodKey}`);

      const snapshot = await get(foodRef);

      if (snapshot.exists()) {
        const food = snapshot.val();
        return {...food, category};
      } else {
        return null;
      }
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
    const userId = await getUserIdFromAsyncStorage();

    if (userId !== undefined) {
      const foodRef = ref(db, `${userId}/foods/${category}/${foodKey}`);

      await update(foodRef, newFood);

      ToastAndroid.showWithGravityAndOffset(
        `${newFood.name} cadastrado(a) com sucesso`,
        ToastAndroid.SHORT,
        ToastAndroid.BOTTOM,
        25,
        50,
      );
    }
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

export const login = async (
  email: string,
  password: string,
  setLoading: Function,
  navigation:
    | StackNavigationProp<RootStackParamList, 'Home'>
    | StackNavigationProp<RootStackParamList, 'CreateUser'>,
) => {
  setLoading(true);
  signInWithEmailAndPassword(auth, email, password)
    .then(async userCredential => {
      const user = userCredential.user;
      try {
        await AsyncStorage.setItem(KEY_USER_ID, user.uid);
        navigation.replace('Home');
      } catch (_) {
        ToastAndroid.showWithGravityAndOffset(
          `Houve um erro ao fazer o login, tente novamente!`,
          ToastAndroid.SHORT,
          ToastAndroid.BOTTOM,
          25,
          50,
        );
      }
    })
    .catch(error => {
      if (error.code === 'auth/invalid-credential') {
        ToastAndroid.showWithGravityAndOffset(
          `Usuário ou senha inválidos, altere os dados e tente novamente!`,
          ToastAndroid.SHORT,
          ToastAndroid.BOTTOM,
          25,
          50,
        );
      } else {
        ToastAndroid.showWithGravityAndOffset(
          `Ocorreu um erro ao fazer o login, tente novamente!`,
          ToastAndroid.SHORT,
          ToastAndroid.BOTTOM,
          25,
          50,
        );
      }
    })
    .finally(() => setLoading(false));
};

export const logout = async (): Promise<boolean> => {
  try {
    await signOut(auth);
    await AsyncStorage.clear();
    return true;
  } catch (error) {
    console.error('Erro ao fazer logout:', error);
    return false;
  }
};

export const registerUser = async (
  email: string,
  password: string,
): Promise<boolean> => {
  try {
    const userCredential = await createUserWithEmailAndPassword(
      auth,
      email,
      password,
    );

    const user = userCredential.user;

    try {
      await AsyncStorage.setItem(KEY_USER_ID, user.uid);
      return true;
    } catch (_) {
      ToastAndroid.showWithGravityAndOffset(
        `Houve um erro ao fazer o login, tente novamente!`,
        ToastAndroid.SHORT,
        ToastAndroid.BOTTOM,
        25,
        50,
      );
      return false;
    }
  } catch (error: any) {
    return false;
  }
};

export const getUserIdFromAsyncStorage = async () => {
  try {
    const value = await AsyncStorage.getItem(KEY_USER_ID);
    if (value !== null) {
      return value;
    }
  } catch (e) {
    return undefined;
  }
};

export const getIconByCategory = (category: string) => {
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

export const convertMealType = (mealType: string) => {
  switch (mealType) {
    case 'Café da Manhã':
      return 'breakfast';
    case 'Colação':
      return 'lightMeal';
    case 'Almoço':
      return 'lunch';
    case 'Lanche':
      return 'snack';
    case 'Jantar':
      return 'dinner';
    default:
      return '';
  }
};

export const convertWeekDay = (weekDay: string) => {
  switch (weekDay) {
    case 'Segunda':
      return 'monday';
    case 'Terça':
      return 'tuesday';
    case 'Quarta':
      return 'wednesday';
    case 'Quinta':
      return 'thursday';
    case 'Sexta':
      return 'friday';
    case 'Sábado':
      return 'saturday';
    case 'Domingo':
      return 'sunday';
    default:
      return '';
  }
};

export const saveWeekDayTimeFood = async (
  weekDay: string,
  mealType: string,
  foodNames: string[],
) => {
  try {
    const db = getDatabase();
    const userId = await getUserIdFromAsyncStorage();

    if (userId !== undefined) {
      const weekDayFoodRef = ref(
        db,
        `${userId}/weekDay/${convertWeekDay(weekDay)}/${convertMealType(
          mealType,
        )}/`,
      );
      await set(weekDayFoodRef, foodNames);

      ToastAndroid.showWithGravityAndOffset(
        `Refeição de ${weekDay} - ${mealType} cadastrada com sucesso`,
        ToastAndroid.SHORT,
        ToastAndroid.BOTTOM,
        25,
        50,
      );
    } else {
      ToastAndroid.showWithGravityAndOffset(
        'Houve um erro ao cadastrar a refeição',
        ToastAndroid.SHORT,
        ToastAndroid.BOTTOM,
        25,
        50,
      );
    }
  } catch (error) {
    ToastAndroid.showWithGravityAndOffset(
      'Houve um erro ao cadastrar a refeição',
      ToastAndroid.SHORT,
      ToastAndroid.BOTTOM,
      25,
      50,
    );
  }
};

export const getFoodWeekDayTime = async (
  weekDay: string,
  setLoading: Function,
) => {
  try {
    setLoading(true);
    const dbRef = ref(getDatabase());
    const userId = await getUserIdFromAsyncStorage();
    if (userId !== undefined) {
      const snapshot = await get(
        child(dbRef, `${userId}/weekDay/${convertWeekDay(weekDay)}`),
      );

      if (snapshot.exists()) {
        return snapshot.val();
      } else {
        return null;
      }
    }
  } catch (error) {
    ToastAndroid.showWithGravityAndOffset(
      'Houve um erro ao obter as refeições',
      ToastAndroid.SHORT,
      ToastAndroid.BOTTOM,
      25,
      50,
    );
  } finally {
    setLoading(false);
  }
};

export const getFoodWeekDayTimeUnit = async (
  weekDay: string,
  // setLoading: Function,
  mealType: string,
) => {
  try {
    const dbRef = ref(getDatabase());
    const userId = await getUserIdFromAsyncStorage();
    if (userId !== undefined) {
      const snapshot = await get(
        child(
          dbRef,
          `${userId}/weekDay/${convertWeekDay(weekDay)}/${convertMealType(
            mealType,
          )}`,
        ),
      );

      if (snapshot.exists()) {
        return snapshot.val();
      } else {
        return null;
      }
    }
  } catch (error) {
    ToastAndroid.showWithGravityAndOffset(
      'Houve um erro ao obter as refeições deste período',
      ToastAndroid.SHORT,
      ToastAndroid.BOTTOM,
      25,
      50,
    );
  }
};
