import {useCallback, useEffect, useState} from 'react';
import {Text, View, TouchableOpacity, Animated} from 'react-native';
import {Food} from '../../interfaces/Food';
import CategoryButtons from '../../components/CategoryButtons';
import styles from './styles';

export default function Home() {
  const [firstFoodDialog, setFirstFoodDialog] = useState(true);
  const [category, setCategory] = useState<string>('dairy');
  const [marginTopImage] = useState(new Animated.Value(100));
  const [textOpacity] = useState(new Animated.Value(0));

  const handleDismissFoodDialog = useCallback(() => {
    setFirstFoodDialog(false);
  }, []);

  useEffect(() => {
    Animated.sequence([
      Animated.timing(marginTopImage, {
        toValue: 0,
        duration: 1500,
        useNativeDriver: false,
      }),
      Animated.timing(textOpacity, {
        toValue: 1,
        duration: 1500,
        useNativeDriver: false,
      }),
    ]).start();
  }, []);

  const DialogItemFood = (food: Food) => {
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
        onPress={() => {}}>
        <Text style={{fontSize: 18, color: '#FFF'}}>{food.name}</Text>
      </TouchableOpacity>
    );
  };

  return (
    <View style={styles.container}>
      {/* <Portal>
        <Dialog
          style={{backgroundColor: '#FC6767'}}
          onDismiss={handleDismissFoodDialog}
          visible={firstFoodDialog}>
          <Dialog.Title
            style={{textAlign: 'center', color: '#b40000', fontWeight: 'bold'}}>
            Escolha o primeiro alimento
          </Dialog.Title>
          <Dialog.ScrollArea style={{height: 200}}>
            <FlatList
              showsVerticalScrollIndicator={false}
              data={foodList}
              renderItem={({item}) => (
                <DialogItemFood
                  name={item.name}
                  quantity={item.quantity}
                  unity={item.unity}
                />
              )}
            />
          </Dialog.ScrollArea>
        </Dialog>
      </Portal> */}
      <Animated.Image
        style={{
          width: marginTopImage.interpolate({
            inputRange: [0, 100],
            outputRange: [100, 340],
          }),
          height: marginTopImage.interpolate({
            inputRange: [0, 100],
            outputRange: [100, 340],
          }),
          marginTop: marginTopImage.interpolate({
            inputRange: [0, 100],
            outputRange: ['10%', '50%'],
          }),
        }}
        source={require('../../assets/icon.png')}
      />
      <Animated.Text style={[styles.titleScreen, {opacity: textOpacity}]}>
        Refeição na mão
      </Animated.Text>
      <Animated.ScrollView style={[styles.contentArea, {opacity: textOpacity}]}>
        <CategoryButtons category={category} setCategory={setCategory} />
      </Animated.ScrollView>
    </View>
  );
}
