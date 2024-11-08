import React, {useState, useEffect} from 'react';
import {Animated} from 'react-native';
import styles from './styles';

interface HeaderImageProps {
  animated: boolean;
  title?: string;
  shouldRemoveMarginTop?: boolean;
}

export default function HeaderImage({
  animated,
  title,
  shouldRemoveMarginTop,
}: HeaderImageProps) {
  const [marginTopImage] = useState(new Animated.Value(100));
  const [textOpacity] = useState(new Animated.Value(0));

  useEffect(() => {
    if (animated) {
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
    }
  }, []);

  return (
    <>
      <Animated.Image
        style={{
          width: animated
            ? marginTopImage.interpolate({
                inputRange: [0, 100],
                outputRange: [100, 340],
              })
            : 100,
          height: animated
            ? marginTopImage.interpolate({
                inputRange: [0, 100],
                outputRange: [100, 340],
              })
            : 100,
          marginTop: shouldRemoveMarginTop
            ? '0%'
            : animated
            ? marginTopImage.interpolate({
                inputRange: [0, 100],
                outputRange: ['10%', '50%'],
              })
            : '10%',
        }}
        source={require('../../assets/icon.png')}
      />
      <Animated.Text
        style={[styles.titleScreen, {opacity: animated ? textOpacity : 1}]}>
        {title ? title : 'Refeição na mão'}
      </Animated.Text>
    </>
  );
}
