import React, { useState } from "react";
import {
  Modal,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
  Dimensions,
  ActivityIndicator,
} from "react-native";
import { AntDesign } from "@expo/vector-icons";
import { useNavigation } from "@react-navigation/native";
import Cycle from "./Cycle";
import SelectVolume from "./SelectVolume";
import { useSelector } from "react-redux";
import { formatAmountWithCommas } from "../utils/FormatCommas";

const { width: screenWidth } = Dimensions.get("window");

const BuyUpModal = ({
  startTrade,
  itemSymbol,
  showModal,
  closeModal,
  onSelectCycle,
  setSelectedButtonIndex,
  selectedButtonIndex,
  onSelectVolume,
  setSelectedButtonIndexVol,
  selectedButtonIndexVol,
  minimumBalance,
  buyup,
  amountError,
  totalBalance,
  currentPrice,
  truncateToTwoDecimals
}) => {
  // const navigation = useNavigation();
  // const userWallet = useSelector(
  //   (state) => state?.userReducer?.currentUser?.walletId
  // );
  const [isZeroBalance, setIsZeroBalance]=useState(false)
  return (
    <Modal transparent={true} visible={showModal}>
      <View style={styles.container}>
        <View style={styles.modalContent}>
          <View style={styles.modalTopHeader}>
            <View style={styles.headerSubContainer}>
              <View style={[styles.buyupContainer,{backgroundColor:buyup ? '#2ac187':'#df294a'}]}>
                <Text style={[styles.buyupText]}>Buy {buyup ? 'Up':'Down'}</Text>
              </View>
              <Text style={styles.symbolText}>
                {itemSymbol?.toUpperCase()}/USDT
              </Text>
            </View>
            <TouchableOpacity style={styles.closeButton} onPress={() => {
              closeModal()
              setIsZeroBalance(false)
            }}>
              <AntDesign name="close" size={24} color="#FFFFFF" />
            </TouchableOpacity>
          </View>

          <View style={styles.authcontainer}>
            <Cycle
              onSelectCycle={onSelectCycle}
              setSelectedButtonIndex={setSelectedButtonIndex}
              selectedButtonIndex={selectedButtonIndex}
            />
            <SelectVolume
              onSelectVolume={onSelectVolume}
              setSelectedButtonIndexVol={setSelectedButtonIndexVol}
              selectedButtonIndexVol={selectedButtonIndexVol}
              minBalance={minimumBalance}
            />
           {
            amountError && <View>
            <Text style={{color:'red', marginHorizontal:2}}>Minimum Amount must be above {minimumBalance}</Text>
           </View>
           }
            <View style={styles.assetContainer}>
              <Text style={styles.assetText}>Available assets :</Text>
              <Text style={styles.assetText}>
                {formatAmountWithCommas(Number(truncateToTwoDecimals(totalBalance))) ?? `0.00`} USDT
              </Text>
            </View>
           {
            isZeroBalance && <Text style={{color:'red', marginTop:'10px'}}>Please deposit the amount first</Text>
           }
            <TouchableOpacity disabled={currentPrice==='0'} style={styles.confirmButton} onPress={() => {
              if(totalBalance===0){
                setIsZeroBalance(true)
              } else {
                startTrade()
              }
            }}>
              {
                currentPrice !== '0' ?  <Text style={styles.confirmButtonText}>Confirm Buy</Text> : <ActivityIndicator size="small" color="#000" />
              }
              
            </TouchableOpacity>
          </View>
        </View>
      </View>
    </Modal>
  );
};

export default BuyUpModal;

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    backgroundColor: "rgba(0, 0, 0, 0.5)",
    padding: 20,
  },
  modalContent: {
    backgroundColor: "#000000",
    width: screenWidth > 600 ? "50%" : "85%", // 50% on large screens, 80% on small screens
    borderRadius: 30,
    borderColor: "grey",
    borderWidth: StyleSheet.hairlineWidth,
    padding: 20,
  },
  closeButton: {
    padding: 10,
  },
  modalTopHeader: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    borderBottomColor: "grey",
    borderBottomWidth: StyleSheet.hairlineWidth,
    paddingBottom: 10,
  },
  authcontainer: {
    flex: 1,
    justifyContent: "center",
  },
  headerSubContainer: {
    flexDirection: "row",
    alignItems: "center",
  },
  buyupContainer: {
    paddingVertical: 4,
    paddingHorizontal: 8,
    marginRight: 8,
    borderRadius: 4,
  },
  buyupText: {
    color: "white",
    fontSize: 14,
    fontWeight: "500",
  },
  symbolText: {
    color: "white",
    fontSize: 17,
    fontWeight: "500",
    marginLeft: 5,
  },
  assetContainer: {
    marginTop: "4%",
    flexDirection: "row",
    justifyContent: "space-between",
  },
  assetText: {
    fontSize: 16,
    color: "#FFFFFF",
  },
  confirmButton: {
    backgroundColor: "#0052fe",
    paddingVertical: 12,
    justifyContent: "center",
    alignItems: "center",
    marginVertical: 20,
    borderRadius: 4,
  },
  confirmButtonText: {
    color: "white",
    fontSize: 16,
    fontWeight: "500",
  },
});
