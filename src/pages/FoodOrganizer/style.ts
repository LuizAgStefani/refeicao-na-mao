import {StyleSheet} from 'react-native';

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#fa9a9a',
    alignItems: 'center',
    paddingHorizontal: 10,
  },
  weekDayButtons: {marginVertical: 3},
  weekDayTitle: {
    fontSize: 17,
    fontWeight: 'bold',
    color: '#fff',
    marginVertical: 5,
  },
  foodMealCard: {
    width: '100%',
    backgroundColor: '#fa9a9a',
    borderWidth: 1,
    borderColor: '#b40000',
    marginVertical: 3,
  },
  foodMealHeader: {
    display: 'flex',
    flexDirection: 'row',
    justifyContent: 'flex-start',
    alignItems: 'center',
    borderBottomWidth: 2,
    borderColor: '#b40000',
    marginBottom: 5,
  },
  foodMealHeaderText: {
    marginLeft: 10,
    color: '#b40000',
    fontWeight: 'bold',
  },
});

export default styles;
