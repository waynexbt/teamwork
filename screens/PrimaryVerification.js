import { View, Text, TextInput, Pressable, SafeAreaView, ScrollView } from "react-native";
import React, { useEffect, useState } from "react";
import { Ionicons } from "@expo/vector-icons";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { useSelector } from "react-redux";
import Toast from "react-native-toast-message";

const PrimaryVerification = ({ navigation }) => {
  const [fullname, setFullName] = useState('');
  const [valid_id, setValidId] = useState('');

  const handlePV = async () => {
    if (fullname === '' || valid_id === '') {
      return Toast.show({ type: 'error', text1: 'Error', text2: 'Please enter all fields' });
    } else {
      await AsyncStorage.setItem('Primaryverification', 'true');
      navigation.navigate("PrimaryVerificationReview");
    }
  };

  const cuser = useSelector((state) => state?.userReducer?.currentUser);

  // useEffect(() => {
  //   const checkPrimaryVerification = async () => {
  //     await AsyncStorage.setItem('Primaryverification', 'false');
  //     const isPV = await AsyncStorage.getItem('Primaryverification');
  //     if (isPV === 'true') {
  //       navigation.navigate("PrimaryVerificationReview");
  //     }
  //   };

  //   checkPrimaryVerification();
  // }, [cuser]);

  return (
    <SafeAreaView style={{ backgroundColor: "white", height: "100%" }}>
      <ScrollView style={{ flexGrow: 1, backgroundColor: "white", height: "100%" }}>
        <View style={{ padding: 15, backgroundColor: "white" }}>
          <View style={{ flex: 1, flexDirection: "row", gap: 10 }}>
            <Ionicons
              name="arrow-back-outline"
              size={30}
              color="black"
              onPress={() => navigation.goBack("")}
            />
            <Text style={{ fontSize: 20, fontWeight: "bold", paddingTop: 3 }}>
              Primary Verification
            </Text>
          </View>

          <View style={{ justifyContent: "center", alignItems: "center", paddingBottom: 20 }}>
            <TextInput
              placeholder="Please Enter your full name"
              style={{ padding: 15, width: "98%", borderWidth: 1, borderColor: "#ccc" }}
              autoCapitalize="none"
              autoCorrect={false}
              value={fullname}
              onChangeText={(text) => setFullName(text)}
            />
          </View>
          
          <View style={{ justifyContent: "center", alignItems: "center" }}>
            <TextInput
              placeholder="Please enter your valid ID Number"
              value={valid_id}
              onChangeText={(text) => setValidId(text)}
              style={{ padding: 15, width: "98%", borderWidth: 1, borderColor: "#ccc" }}
            />
          </View>

          <View>
            <Pressable
              style={{
                marginTop: 25,
                padding: 15,
                alignItems: "center",
                backgroundColor: "aqua",
                width: "98%",
              }}
              onPress={handlePV}
            >
              <Text>Submit</Text>
            </Pressable>
          </View>
        </View>
      </ScrollView>
    </SafeAreaView>
  );
};

export default PrimaryVerification;
