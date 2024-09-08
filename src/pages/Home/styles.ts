import {StyleSheet} from 'react-native';

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#fa9a9a',
    alignItems: 'center',
  },
  titleScreen: {
    fontWeight: 'bold',
    fontSize: 25,
    color: '#fff',
    marginVertical: 10,
  },
  contentArea: {
    width: '100%',
    marginTop: 5,
    paddingHorizontal: 10,
  },
  categoryArea: {
    height: 100,
    flexDirection: 'column',
    justifyContent: 'space-evenly',
  },
  buttonsArea: {
    marginTop: 5,
    flexDirection: 'row',
    justifyContent: 'space-evenly',
  },
  descriptionFoodArea: {
    marginTop: 8,
  },
  foodTitle: {
    fontSize: 18,
    fontWeight: 'bold',
  },
  foodTextHelper: {
    color: '#e64f4f',
  },
  resultArea: {
    marginTop: 10,
    alignItems: 'center',
  },
  resultTitle: {
    fontWeight: 'bold',
    fontSize: 18,
  },
  resultText: {
    fontWeight: 'bold',
    fontSize: 25,
  },
});

export default styles;
