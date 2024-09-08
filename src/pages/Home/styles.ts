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
    marginTop: 20,
    flexDirection: 'row',
    justifyContent: 'space-evenly',
    borderTopWidth: 2,
    borderTopColor: '#e64f4f',
    paddingTop: 10,
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
    marginVertical: 10,
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
  noFoodArea: {alignItems: 'center', marginTop: 20},
  dialogTitle: {
    textAlign: 'center',
    color: '#fff',
    fontWeight: 'bold',
  },
});

export default styles;
