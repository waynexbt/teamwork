import React, { useState } from "react";
import {
  View,
  Text,
  StyleSheet,
  FlatList,
  TouchableOpacity,
  Dimensions,
} from "react-native";
import BoxComponent from "./Box";

const { width } = Dimensions.get("window");

const Cycle = ({
  onSelectCycle,
  selectedButtonIndex,
  setSelectedButtonIndex,
}) => {
  const handleBoxPress = (item, index) => {
    setSelectedButtonIndex(index);
    onSelectCycle(item);
  };

  const renderBox = ({ item, index }) => (
    <TouchableOpacity onPress={() => handleBoxPress(item, index)}>
      <BoxComponent
        time={item?.time}
        percentage={item?.percentage}
        bgColor={selectedButtonIndex === index ? "#0052fe" : "#2f323b"}
      />
    </TouchableOpacity>
  );

  const boxData = [
    { time: 30, percentage: 3 },
    { time: 60, percentage: 5 },
    { time: 120, percentage: 12 },
    { time: 180, percentage: 20 },
    { time: 240, percentage: 30 },
    { time: 300, percentage: 42 },
    // Add more box data as needed
  ];

  return (
    <View style={styles.container}>
      <Text style={styles.title}>Select Cycle</Text>
      <FlatList
        data={boxData}
        horizontal
        showsHorizontalScrollIndicator={false}
        keyExtractor={(item, index) => index.toString()}
        renderItem={renderBox}
        contentContainerStyle={styles.flatListContent}
      />
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    marginTop: "5%",
  },
  title: {
    marginBottom: 16,
    fontWeight: "500",
    color: "white",
    fontSize: 15,
    paddingHorizontal: "5%",
  },
  flatListContent: {
    paddingHorizontal: "5%",
  },
  selectedBox: {
    backgroundColor: "green",
  },
  unselectedBox: {
    backgroundColor: "black",
  },
});

export default Cycle;
