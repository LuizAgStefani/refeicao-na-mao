import {StyleSheet} from 'react-native';

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#fa9a9a',
    alignItems: 'center',
  },
  screenArea: {
    width: '95%',
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    marginVertical: 15,
  },
  title: {
    fontWeight: 'bold',
    fontSize: 24,
  },
  contentArea: {
    width: '100%',
    marginTop: 5,
    paddingHorizontal: 10,
  },
  flatList: {
    marginTop: 10,
  },
  listEmptyComponentView: {
    alignItems: 'center',
    marginTop: 10,
  },
  listEmptyComponentText: {
    marginTop: 10,
    fontWeight: 'bold',
    fontSize: 20,
    color: '#b40000',
  },
});

export default styles;
