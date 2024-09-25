import {StyleSheet} from 'react-native';

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#fa9a9a',
  },
  loadingActivityIndicator: {marginTop: 30},
  loadingText: {
    marginTop: 10,
    fontWeight: 'bold',
    fontSize: 22,
    color: '#b40000',
  },
  goBackArea: {
    width: '100%',
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
  },
  formArea: {
    flex: 1,
    backgroundColor: '#fa9a9a',
    alignItems: 'center',
  },
  title: {
    fontWeight: 'bold',
    fontSize: 24,
    marginBottom: 20,
  },
  inputsArea: {
    width: '100%',
    marginTop: 5,
    paddingHorizontal: 10,
  },
  categoryTitle: {fontWeight: 'bold', fontSize: 17, marginBottom: 10},
});

export default styles;
