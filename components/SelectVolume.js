import React, { useState } from "react";
import {
  View,
  Text,
  StyleSheet,
  FlatList,
  TouchableOpacity,
  Dimensions,
  TextInput,
} from "react-native";
import VolumeValue from "./VolumeValue";

const { width } = Dimensions.get("window");

const SelectVolume = ({
  onSelectVolume,
  setSelectedButtonIndexVol,
  selectedButtonIndexVol,
  minBalance
}) => {
  const [volValue, setVolValue] = useState("");

  const handleBoxPress = (item, index) => {
    setSelectedButtonIndexVol(index);
    onSelectVolume(item);
    setVolValue(item.value);
  };
  const handleChange = (text) => {
    const numericValue = text.replace(/[^0-9]/g, '');
    setVolValue(numericValue)
    onSelectVolume({'label':numericValue,'value':numericValue})
  };

  const boxData = [
    { label: '50', value: 50 },
    { label: '100', value: 100 },
    { label: '500', value: 500 },
    { label: '1000', value: 1000 },
    { label: '2000', value: 2000 },
    { label: '5000', value: 5000 },
    { label: '10000', value: 10000 },
    { label: '20000', value: 20000 },
    { label: 'All', value: 0.00 },
    // Add more box data as needed
  ];

  return (
    <View style={styles.container}>
      <Text style={styles.heading}>Buying Volume</Text>
      <View style={styles.volumeDisplay}>
        <TextInput style={styles.volumeText} value={volValue} onChangeText={handleChange}   keyboardType='numeric' placeholder={volValue ? volValue : `Amount Min ${minBalance} USDT` || "Amount Min 100 USDT"}/>
      </View>
      <FlatList
        data={boxData}
        keyExtractor={(item, index) => index.toString()}
        horizontal
        renderItem={({ item, index }) => (
          <TouchableOpacity onPress={() => handleBoxPress(item, index)}>
            <VolumeValue
              item={item}
              bgColor={selectedButtonIndexVol === index ? "#0052fe" : "#2f323b"}
            />
          </TouchableOpacity>
        )}
        contentContainerStyle={styles.flatListContent}
      />
    </View>
  );
};

export default SelectVolume;

const styles = StyleSheet.create({
  container: {
    marginTop: "5%",
  },
  heading: {
    fontWeight: "500",
    color: "white",
    fontSize: 15,
    marginBottom: 8,
  },
  volumeDisplay: {
    backgroundColor: "#2f323b",
    marginBottom:5,
    borderRadius:5
  },
  volumeText: {
    color: "grey",
    fontWeight: "500",
    fontSize: 16,
    paddingVertical:8,
    paddingLeft:5,
  },
  flatListContent: {
    justifyContent: 'space-between',
  },
});
