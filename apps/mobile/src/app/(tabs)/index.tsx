/**
 * Home Screen with animated sky background and 3D sun scene.
 */

import { View, Text, StyleSheet } from "react-native";
import Animated, { AnimatedStyle } from "react-native-reanimated";
import { useSunContext } from "@/context/SunContext";
import { SunScene } from "@/components/SunScene";

const AnimatedView = Animated.createAnimatedComponent(View);

export default function HomeScreen() {
  const { skyStyle, isReady, location, altitudeDegrees, exposure } = useSunContext();

  return (
    <AnimatedView style={[skyStyle as AnimatedStyle<any>, { flex: 1 }]}>
      {isReady && <SunScene />}
      {/* Info overlay centered below sun */}
      <View style={styles.infoContainer}>
        {location && (
          <Text style={styles.infoText}>
            City: {location.city}
          </Text>
        )}
        {altitudeDegrees !== null && (
          <Text style={styles.infoText}>
            Angle: {altitudeDegrees.toFixed(1)}°
          </Text>
        )}
        {exposure && (
          <Text style={styles.exposureText}>
            IR: {exposure.ir.toFixed(0)}% | UVA: {exposure.uva.toFixed(0)}% | UVB: {exposure.uvb.toFixed(0)}%
          </Text>
        )}
      </View>
    </AnimatedView>
  );
}

const styles = StyleSheet.create({
  infoContainer: {
    position: "absolute",
    bottom: 80,
    left: 0,
    right: 0,
    alignItems: "center",
    justifyContent: "center",
  },
  infoText: {
    color: "white",
    fontSize: 28,
    fontWeight: "600",
    textShadowColor: "rgba(0, 0, 0, 0.75)",
    textShadowOffset: { width: 0, height: 2 },
    textShadowRadius: 4,
    marginVertical: 4,
  },
  exposureText: {
    color: "white",
    fontSize: 20,
    fontWeight: "500",
    textShadowColor: "rgba(0, 0, 0, 0.75)",
    textShadowOffset: { width: 0, height: 2 },
    textShadowRadius: 4,
    marginTop: 8,
    opacity: 0.9,
  },
});
