import { Dimensions, StyleSheet, Text, View } from "react-native";
import React from "react";

const { width } = Dimensions.get("window");

const VolumeValue = ({ item, bgColor }) => {
  return (
    <View style={[styles.wrapper, { backgroundColor: bgColor }]}>
      <Text style={styles.timeText}>{item?.label}</Text>
    </View>
  );
};

export default VolumeValue;

const styles = StyleSheet.create({
  wrapper: {
    flex: 1,
    margin: 2,
    padding: 10,
    borderColor: "white",
    borderRadius: 5,
    justifyContent: "center",
    alignItems: "center",
    maxWidth: "100%", // Ensure it doesn't exceed 100% width
  },
  timeText: {
    fontSize: 16,
    color: "white",
  },
});
