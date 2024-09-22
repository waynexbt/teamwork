import React, { useEffect, useState } from "react";
import {
  Modal,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
  Dimensions
} from "react-native";
import { useNavigationState } from '@react-navigation/native';

import { AntDesign } from "@expo/vector-icons";
import AsyncStorage from '@react-native-async-storage/async-storage';
import axios from "axios";
import { formatAmountWithCommas } from "../utils/FormatCommas";
const { width: screenWidth } = Dimensions.get("window");

const TradeSuccessModal = ({ setCIndex, setData, setIsTradeStart, tab }) => {
  const currentRoute = useNavigationState((state) => state.routes[state.index].name);
  // Calculate a responsive font size for the settlementAmount
  const responsiveFontSize = screenWidth > 600 ? 24 : 20;
  const responsiveFontSizeUSDT = screenWidth > 600 ? 14 : 12;
  const responsiveFontSizeTitle = screenWidth > 600 ? 17 : 13;
  const [time, setTime] = useState(0)
  const [startPrice, setstartPrice] = useState(0)
  const [startMargin, setStartMargin] = useState(0)
  const [currentPrice, setCurrentPrice] = useState(0)
  const [totalMargin, setMargin] = useState(0)
  const [showModal, setShowModal] = useState(false)
  const [close, setCLose] = useState(false)
  const [green, setGreen] = useState(false)

  useEffect(() => {
    const fetchData = async () => {
      try {
        const keys = ['totalTime', 'startMargin', 'startPrice', 'percentage','tradeModal', 'green'];
        const items = await AsyncStorage.multiGet(keys);
        console.log(items, 'fghjkl;')
        const totalTime = items[0][1] !== null ? parseFloat(items[0][1]) : 0;
        const startMargin = items[1][1] !== null ? parseFloat(items[1][1]) : 0;
        const startPrice = items[2][1] !== null ? parseFloat(items[2][1]) : 0;
        const percentage = items[3][1] !== null ? parseFloat(items[3][1]) : 0;
        const calMargin = (Number(startMargin) * Number(percentage)) / 100
        setMargin(calMargin)
        setTime(totalTime);
        setStartMargin(startMargin);
        setstartPrice(startPrice);
        setShowModal(items[4][1])
        setGreen(items[5][1])
        const apiKey =
          "685419b6bedfb725bb6af07ed3dd6fef8f20a83f05c066d1eb20a10c563c7801";
        const fromBtc = await axios.get(`https://min-api.cryptocompare.com/data/price?fsym=btc&tsyms=usd&api_key=${apiKey}`);
        console.log('AsyncStorage items:', items); // Check what is returned from AsyncStorage
        setCurrentPrice(Number(fromBtc.data?.USD));
      } catch (error) {
        console.error("Failed to fetch data", error);
      }
    };

    fetchData();
  }, [tab, close]);
  return (
    <Modal transparent={true} visible={showModal==='true'}>
      <View style={styles.container}>
        <View style={styles.modalContent}>
          <View style={styles.modalHeader}>
            <Text style={styles.symbolText}>BTC/USDT</Text>
            <TouchableOpacity style={styles.closeButton} onPress={async () => {
              setCIndex(0)
              setData([])
              setIsTradeStart(false)
              const keys = ['savedTime', 'tab', 'entryPoint', 'isTradeStart', 'currentBalance'];
              await AsyncStorage.multiRemove(keys);
              await AsyncStorage.setItem('tradeModal','false');
              setCLose(!close)
            }}>
              <AntDesign name="close" size={20} color="#FFFFFF" />
            </TouchableOpacity>
          </View>

          <View style={styles.settlementInfo}>
            <Text style={[styles.settlementAmount, { fontSize: responsiveFontSize }]}>
              +{formatAmountWithCommas(Number(totalMargin))}.00 <Text style={[styles.infoLabel, { fontSize: responsiveFontSizeUSDT }]}>USDT</Text>
            </Text>
            <Text style={[styles.settlementStatus, { fontSize: responsiveFontSizeTitle }]}>Settlement completed</Text>
          </View>

          <View style={styles.infoContainer}>
            <Text style={styles.infoLabel}>Current price:</Text>
            <Text style={styles.infoValue}>{formatAmountWithCommas(startPrice)} USDT</Text>
          </View>
          <View style={styles.infoContainer}>
            <Text style={styles.infoLabel}>Time:</Text>
            <Text style={styles.infoValue}>{time}s</Text>
          </View>
          <View style={styles.infoContainer}>
            <Text style={styles.infoLabel}>Side:</Text>
            <Text style={[styles.infoValue, { color: green === 'true' ? '#2ac187' : '#df294a' }]}>Buy {green === 'true' ? "Up" : "Down"}</Text>
          </View>
          <View style={styles.infoContainer}>
            <Text style={styles.infoLabel}>Amount:</Text>
            <Text style={styles.infoValue}>{formatAmountWithCommas(Number(startMargin))} USDT</Text>
          </View>
          <View style={styles.infoContainer}>
            <Text style={styles.infoLabel}>Price:</Text>
            <Text style={styles.infoValue}>{formatAmountWithCommas(Number(currentPrice))} USDT</Text>
          </View>

          <Text style={styles.settlementNote}>
            The ultimate price for each option contract is determined by the
            system's settlement process.
          </Text>
        </View>
      </View>
    </Modal>
  );
};

export default TradeSuccessModal;

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    backgroundColor: "rgba(0, 0, 0, 0.5)",
    padding: 20,
  },
  modalContent: {
    backgroundColor: "#1c1c1c",
    width: screenWidth > 600 ? "50%" : "80%",
    borderRadius: 10,
    borderColor: "grey",
    borderWidth: StyleSheet.hairlineWidth,
    padding: 20,
  },
  modalHeader: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    borderBottomColor: "grey",
    borderBottomWidth: StyleSheet.hairlineWidth,
    paddingBottom: 10,
    marginBottom: 10,
  },
  symbolText: {
    color: "white",
    fontSize: 18,
    fontWeight: "bold",
  },
  closeButton: {
    padding: 10,
  },
  settlementInfo: {
    alignItems: "center",
    marginBottom: 20,
  },
  settlementAmount: {
    color: "#2ac187",
    fontWeight: "bold",
  },
  settlementStatus: {
    color: "white",
    fontSize: 16,
  },
  infoContainer: {
    flexDirection: "row",
    justifyContent: "space-between",
    marginBottom: 10,
  },
  infoLabel: {
    color: "#b0b0b0",
    fontSize: 14,
  },
  infoValue: {
    color: "white",
    fontSize: 14,
    fontWeight: '500'
  },
  settlementNote: {
    color: "#b0b0b0",
    fontSize: 12,
    marginTop: 20,
  },
});
