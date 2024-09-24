import {StyleSheet} from 'react-native';

const styles = StyleSheet.create({
  listItemTitle: {fontWeight: 'bold', color: '#b40000'},
  listItemDescription: {color: '#b40000'},
  listItemRight: {
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center',
  },
  listItem: {
    backgroundColor: '#FC6767',
    borderRadius: 15,
    marginBottom: 10,
  },
});

export default styles;
