import React from 'react';
import Svg, { Path, Defs, LinearGradient, Stop } from 'react-native-svg';
import { View, StyleSheet, Dimensions } from 'react-native';

const { width, height } = Dimensions.get('window');

interface CurvedLinesGraphicProps {
  style?: object;
}

const CurvedLinesGraphic: React.FC<CurvedLinesGraphicProps> = ({ style }) => {
  return (
    <View style={[styles.container, style]}>
      <Svg
        width={width * 1.2}
        height={height * 0.6}
        viewBox="0 0 400 500"
        style={styles.svg}
      >
        <Defs>
          <LinearGradient id="curveGradient" x1="0%" y1="0%" x2="100%" y2="100%">
            <Stop offset="0%" stopColor="rgba(255,255,255,0.9)" />
            <Stop offset="50%" stopColor="rgba(255,255,255,0.6)" />
            <Stop offset="100%" stopColor="rgba(255,255,255,0.3)" />
          </LinearGradient>
        </Defs>
        
        {/* Main infinity loop - top part */}
        <Path
          d="M 50 200 
             C 50 100, 150 50, 200 120 
             C 250 190, 300 180, 340 120 
             C 380 60, 420 100, 380 180 
             C 340 260, 280 280, 200 250 
             C 120 220, 60 280, 80 360 
             C 100 440, 180 480, 280 440 
             C 380 400, 420 320, 350 260"
          stroke="url(#curveGradient)"
          strokeWidth="20"
          strokeLinecap="round"
          fill="none"
          opacity={0.9}
        />
        
        {/* Secondary decorative curve */}
        <Path
          d="M 100 280 
             C 140 220, 180 200, 220 240 
             C 260 280, 300 260, 320 200"
          stroke="rgba(255,255,255,0.4)"
          strokeWidth="12"
          strokeLinecap="round"
          fill="none"
        />
        
        {/* Subtle accent curve */}
        <Path
          d="M 180 350 
             C 220 320, 260 340, 280 380"
          stroke="rgba(255,255,255,0.3)"
          strokeWidth="8"
          strokeLinecap="round"
          fill="none"
        />
      </Svg>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    position: 'absolute',
    alignItems: 'center',
    justifyContent: 'center',
  },
  svg: {
    transform: [{ rotate: '-15deg' }],
  },
});

export default CurvedLinesGraphic;
