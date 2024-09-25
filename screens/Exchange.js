import React, { useState, useEffect, useRef } from "react";
import {
  View,
  Text,
  Pressable,
  ScrollView,
  Image,
} from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import CustomPicker from "../components/CustomPicker";
import { Ionicons, AntDesign } from "@expo/vector-icons";
import { useNavigation } from "@react-navigation/native";
import { api_url } from "../config";
import axios from "axios";
import { useSelector } from "react-redux";
import Toast from "react-native-toast-message";
import { BottomSheetModalProvider, BottomSheetModal } from "@gorhom/bottom-sheet";
import 'react-native-gesture-handler';
import { GestureHandlerRootView } from "react-native-gesture-handler";

const Exchange = () => {
  const userId = useSelector((state) => state.userReducer.currentUser?._id);

  const navigation = useNavigation();
  const [selectedOption, setSelectedOption] = useState(null);
  const [selectedOption2, setSelectedOption2] = useState(null);
  const BottomSheetModalRef = useRef(null);
  const snapPoints = ["48%"];

  function handlePresentModal() {
    BottomSheetModalRef.current?.present();
    
  };
  const [show, setShow] = useState(false);
  const [show2, setShow2] = useState(false);

  const [amount, setAmount] = useState("");
  const [fromCurrency, setFromCurrency] = useState("USD"); // Default from currency
  const [toCurrency, setToCurrency] = useState("BTC"); // Default to currency
  const [result, setResult] = useState("");
  const [finalResult, setFinalResult] = useState(null);

  const showCurrencyName = (currency) => {};

  const showFromCurrencyName = (currency) => {};

  const convertCurrency = async () => {
    // https://min-api.cryptocompare.com/data/price?fsym=BTC&tsyms=USD&api_key=685419b6bedfb725bb6af07ed3dd6fef8f20a83f05c066d1eb20a10c563c7801
    const apiKey =
      "685419b6bedfb725bb6af07ed3dd6fef8f20a83f05c066d1eb20a10c563c7801";
    const apiUrl = `https://min-api.cryptocompare.com/data/price?fsym=${selectedOption2.cId}&tsyms=${selectedOption.cId}&api_key=${apiKey}`;
    if ((amount, selectedOption, selectedOption2)) {
      try {
        const response = await fetch(apiUrl);
        const data = await response.json();

        const rate = data[selectedOption.cId];
        const convertedResult = parseFloat(amount) / rate;
        console.log("response", response);
        console.log("data", data);
        console.log("rate", rate);
        console.log("convertedRate", convertedResult);
        setFinalResult(convertedResult);

        setResult(
          `${amount} ${
            selectedOption?.label
          } is equal to ${convertedResult.toFixed(8)} ${selectedOption2.label}`
        );
      } catch (error) {
        setResult("Error: Unable to fetch exchange rate.");
        console.error(error);
      }
    } else {
      console.log("ADD AMOUNT");
    }
  };

  const [selectedValue, setSelectedValue] = useState(null);
  const [filteredOptions, setFilterOptions] = useState(null);
  const [filteredOptions2, setFilterOptions2] = useState(null);

  const placeholder = {
    label: "Select an option...",
    value: null,
  };

  const options = [
    {
      label: "ETH",
      cId: "ETH",
      id: "ETH",
      icon: (
        <Image
          source={require("../assets/ETH.png")}
          style={{
            alignItems: "center",
            height: 30,
            width: 30,
            marginRight: 10,
          }}
        />
      ),
    },
    {
      label: "BTC",
      cId: "BTC",
      id: "BTC",
      icon: (
        <Image
        source={require("../assets/BTC.png")}
        style={{
          alignItems: "center",
          height: 30,
          width: 30,
          marginRight: 10,
        }}
      />
      ),
    },
    {
      label: "USDT",
      cId: "USD",
      id: "USDT",
      icon: (
        <Image
          source={require("../assets/USDT.png")}
          style={{
            alignItems: "center",
            height: 30,
            width: 30,
          }}
        />
      ),
    },
  ];

  useEffect(() => {
    if (selectedOption) {
      const arr = options.filter(
        (option) => option?.label !== selectedOption.label
      );
      setFilterOptions(arr);
    }
  }, [selectedOption]);

  useEffect(() => {
    if (selectedOption2) {
      const arr = options.filter(
        (option) => option?.label !== selectedOption2.label
      );
      setFilterOptions2(arr);
    }
  }, [selectedOption2]);

  console.log("___FILTERED___", filteredOptions);

  const handleSelection = (item) => {
    setSelectedOption(item);
    setShow(false);
  };

  const handleSelection2 = (item) => {
    setSelectedOption2(item);
    setShow2(false);
  };

  const handelAmount = (text) => {
    setShow(false);
    setShow2(false);

    let toNumber = Number(text);
    setAmount(toNumber);
  };

  useEffect(() => {
    const getData = setTimeout(() => {
      if (amount > 0) {
        console.log("___AMOUNT___", amount);
        convertCurrency();
      }
      // console.log()
    }, 1000);
    return () => clearTimeout(getData);
  }, [amount]);

  const sendRequest = async () => {
    if (selectedOption && selectedOption2 && amount && finalResult) {
      try {
        const response = await axios.post(`${api_url}/exchange/coins`, {
          from: selectedOption.label,
          to: selectedOption2.label,
          amount,
          convertedAmount: finalResult,
          userId,
        });
        console.log("ressss", response, response?.data?.status);
        if (response?.data?.status == 200) {
          Toast.show({
            type: "success",
            text1: response.data?.message,
            text2: "Conversion successful!",
          });
          navigation.navigate("Wallet");
        } else if (response?.status == 404) {
          Toast.show({
            type: "error",
            text1: "Something went wrong",
            text2: "Wallet not found",
          });
        }
      } catch (e) {
        console.log("eeeeeeeeeee", e);
        Toast.show({
          type: "error",
          text1: "Something went wrong",
          text2: " Having touble on server",
        });
      }
    }
  };

  useEffect(() => {
    // sendRequest()
  }, [finalResult]);

  return (
    <BottomSheetModalProvider>
    <SafeAreaView 
    style={{
      backgroundColor: "white",
      height: "100%"
    }}>
    <ScrollView
      style={{
        height: "100%"
      }}
    >
        <View
          style={{
            flex: 1,
            flexDirection: "row",
            alignItems: "center",
          }}
        >
          <Ionicons
            name="arrow-back-outline"
            size={30}
            color="black"
            style={{
              padding: 5,
              marginLeft: 10,
              marginTop: 12,
            }}
            onPress={() => navigation.goBack("")}
          />
          <Text
            style={{
              padding: 5,
              marginLeft: 5,
              marginTop: 10,
              fontSize: 21,
            }}
          >
            Exchange
          </Text>
        </View>
      <View style={{
        backgroundColor: "#f8f8f8",
        width: "93%",
        margin: "auto",
        borderRadius: 5,
        marginTop: 40
      }}>
        <Text
          style={{
            padding: 10,
            marginLeft: 5,
            marginTop: 5,
            fontSize: 17,
            color: "gray",
          }}
        >
          From
        </Text>
        <View style={{ marginBottom: 10
        }}>
        <Pressable onPress={handlePresentModal} style={{flexDirection: "row", gap: 8, padding: 14}} >
        <Image
            source={require("../assets/USDT.png")}
            style={{
              alignItems: "center",
              height: 30,
              width: 30,
            }}
          />

          <Text
            style={{
              fontSize: 20,
              color: "black",
              fontWeight: "650",
              marginTop: 1
            }}
          >
            USDT
          </Text>
          <Ionicons name="caret-down-outline" size={18} color="black" style={{marginTop: 4}} />
           </Pressable>
        </View>
      </View>
      <View style={{margin: "auto", backgroundColor: "aqua", borderRadius: 35, padding: 10, marginBottom: -5, marginTop: -10, borderStyle: "solid", position: "relative"}}>
      <AntDesign name="swap" size={26} color="black" />
      </View>
      <View style={{
        backgroundColor: "#f8f8f8",
        width: "93%",
        margin: "auto",
        borderRadius: 5,
        paddingBottom: 5
      }}>
        <Text
          style={{
            padding: 10,
            marginLeft: 5,
            marginTop: 5,
            fontSize: 17,
            color: "gray",
          }}
        >
          To
        </Text>
        <View style={{ marginBottom: 10
        }}>
        <Pressable onPress={handlePresentModal} style={{flexDirection: "row", gap: 8, padding: 14}} >
        <Image
            source={require("../assets/BTC.png")}
            style={{
              alignItems: "center",
              height: 30,
              width: 30,
            }}
          />

          <Text
            style={{
              fontSize: 20,
              color: "black",
              fontWeight: "650",
              marginTop: 1
            }}
          >
            BTC
          </Text>
          <Ionicons name="caret-down-outline" size={18} color="black" style={{marginTop: 6}} />
           </Pressable>
        </View>
      </View>
      <Pressable
          style={{
            flexDirection: "row",
            justifyContent: "center",
            alignItems: "center",
            alignSelf: "center",
            padding: 15,
            backgroundColor: "aqua",
            width: "93%",
            marginTop: 20,
            marginBottom: 5
          }}
        >
          <Text style={{ color: "white", marginRight: 5, fontSize: 18 }}>Convert</Text>
        </Pressable>
        <Text
          style={{
            padding: 10,
            margin: "auto",
            fontSize: 17,
            color: "gray",
          }}
        >
          Exchange Rate: 1 USDT 
        </Text>
        <BottomSheetModal
        ref={BottomSheetModalRef}
        index={0}
        snapPoints={snapPoints}
        >
          <View>
            <Text>Hello and Welcome</Text> </View>
        </BottomSheetModal>
    </ScrollView>
    </SafeAreaView>
    </BottomSheetModalProvider>
  );
};

export default Exchange;
