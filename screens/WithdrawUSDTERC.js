import {
    FlatList,
    StyleSheet,
    Text,
    View,
    Image,
    Pressable
  } from "react-native";
  import React, { useEffect, useRef, useState } from "react";
  import { SafeAreaView } from "react-native-safe-area-context";
  import { useSelector } from "react-redux";
  import axios from "axios";
  import { api_url } from "../config";
  import Toast from "react-native-toast-message";
  import {
    Ionicons,
    FontAwesome5,
  } from "@expo/vector-icons";
  import {
    GestureHandlerRootView,
    ScrollView,
    TextInput,
  } from "react-native-gesture-handler";
  
  
  const WithdrawUSDTERC = ({ navigation }) => {
    const [amount, setAmount] = useState(0);
    console.log(amount)
    const [userAccount, setUserAccount] = useState("");
    const [selectedCurrency, setSelectedCurrency] = useState(0)
    const [conecerndAmount, setConcerndAmount] = useState(null)
    const [wallet, setWallet] = useState([])
    const walletId = useSelector(
      (state) => state?.userReducer?.currentUser?.walletId?._id
    );
    const user = useSelector(
      (state) => state?.userReducer?.currentUser
    );
    const getWallet= async ()=>{
      try{const response = await axios.post(`${api_url}/user/getWallet`, {walletId})
      if(response?.data?.status === 200){
        let arr = response?.data?.wallet?.currentBalance.sort((a, b)=>  b.amount - a.amount)
        setWallet(arr)
      }
      }catch(error){
        console.log("EROOROROOROROOR", error)
      }
      // console.log(response)
    }
  
    useEffect(()=>{
      getWallet()
    },[])
    useEffect(()=>{
      let amount = wallet.find((item) => item.name == currencies[selectedCurrency]?.label)
      console.log("AMOUNT", amount)
      setConcerndAmount(amount)
    },[selectedCurrency])
  
    const currencies = [
    { id: '1', label: 'USDT-ERC'},
    { id: '2', label: 'BTC'},
  
  ]
  
    const handleChangeAmount = (data)=>{
    
      console.log("AMONT",parseInt(data) ,"seleeelelle", conecerndAmount?.amount)
      if(data === "" || parseInt(data) <= conecerndAmount?.amount){
        setAmount(data)
      }else{
        Toast.show({type:"error", text1:"Amount error", text:"You cannot exceed amount"})
      }
    }
  
  const withdrawAmount = async () => {
    if(conecerndAmount && amount, userAccount){
      try{
  
        console.log("DATA",amount, conecerndAmount?.name, user._id, user?.username, userAccount );
        const withdrawReq = await axios.post(`${api_url}/withdrawal/create`,{username: user?.username,currency: conecerndAmount?.name,userId: user?._id, amount, accountNumber: userAccount })
        console.log("REESPONSE",withdrawReq?.data)
        if(withdrawReq?.data?.status == 200){
          Toast.show({type: "success", text1:"Success", text2: "Withdraw request succeess"})
          setAmount("")
          setUserAccount(null)
        }
      }catch(error){
        console.log("ERRORR",error)
      }
    }
  
  };
  
    return (
      <GestureHandlerRootView>
        <SafeAreaView style={{
          backgroundColor: "white",
          height: "100%"
        }}>
        <ScrollView>
        <View
            style={{
              flex: 1,
              flexDirection: "row",
              justifyContent: "space-between",
              alignItems: "center",
              width: "95%"
            }}
          >
            <View
              style={{
                flexDirection: 'row',
                alignItems: 'center',
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
              onPress={() => navigation.navigate("Withdraw")}
            />
            <Text
              style={{
                padding: 5,
                marginLeft: 5,
                marginTop: 10,
                fontSize: 21,
              }}
            >
              Withdraw
            </Text>
            </View>
            <View
            style={{
              flexDirection: 'row',
              justifyContent: 'space-between',
            }}
          >
            </View>
            <View
            style={{
              flexDirection: 'row',
              justifyContent: 'space-between',
            }}
          >
            <View
              style={{
                flexDirection: 'row',
                alignItems: 'center',
              }}
            >
               <FontAwesome5
              name="history"
              size={23}
              color="black"
              style={{ marginTop: 9
              }}
              onPress={() => navigation.navigate("WithdrawalRequest")}
            />
            </View>
  
          
            </View>
          </View>
          <View
            style={{
              flexDirection: "row",
              marginTop: 30,
              alignItems: "center",
              width: "100%",
              marginLeft: "3%"
            }}
          >
            <Text
              style={{
                fontSize: 15,
                color: "gray",
              }}
            >
              Network
            </Text>
          </View>
          <View
            style={{
              flexDirection: 'row',
              justifyContent: 'space-between',
              backgroundColor: "#F8F8F8",
              borderColor: "#D3D3D3",
              borderStyle: "solid",
              borderWidth: 0.5,
              padding: 13,
              width: "95%",
              alignSelf: "center",
              marginTop: 10,
            }}
          >
            <View
              style={{
                flexDirection: 'row',
                alignItems: 'center',
                gap: 8
              }}
            >
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
                fontSize: 18,
                color: "black",
                fontWeight: "400",
              }}
            >
              USDT-ERC
            </Text>
            </View>
  
          
            </View>
          <View
            style={{
              flexDirection: "row",
              marginTop: 20,
              alignItems: "center",
              width: "100%",
              marginLeft: "3%"
            }}
          >
            <Text
              style={{
                fontSize: 15,
                color: "gray",
              }}
            >
              Available Balance: 
            </Text>
            </View>
          <View style={{ ustifyContent: "center" }}>
            <View style={{ justifyContent: "center", flexDirection:"row",marginBottom:15 }}>
              <FlatList showsHorizontalScrollIndicator={false}
              color="white"
              flexDirection="row"
              data={currencies}
              horizontal
              // style={styles.flatList}
              keyExtractor={(item) => item._id}
              renderItem={({item, index})=>{
                return(
                  <Pressable style={selectedCurrency == index ? {...styles.currencyButton, backgroundColor:"aqua"}:styles.currencyButton} onPress={()=> setSelectedCurrency(index)}>
                <Text style={selectedCurrency == index ?{color: "black", fontSize:18, textAlign:"center", fontWeight:"bold"}: {color: "white", fontSize:18, textAlign:"center"}}>{item.label}</Text>
  
              </Pressable>
                )
              }} 
              />
              
            </View>
            {conecerndAmount && <Text style={styles.buttonText}>{conecerndAmount?.name}{":  "}{conecerndAmount?.amount}</Text>}</View>
          <View style={{
            marginLeft: "3%",
          }}>
            <Text
              style={{
                fontSize: 15,
                color: "gray",
              }}
            >
              Amount 
            </Text>
          </View>
          <View
            style={{
              justifyContent: "center",
              alignItems: "center",
            }}
          >
              <TextInput
                style={{
                  padding: 15,
                  marginTop: 10,
                  width: "95%",
                  backgroundColor: "#F8F8F8",
                  fontSize: 15
                }}
                placeholder="Enter Withdraw Amount"
                inputMode="numeric"
                value={amount}
                onChangeText={(text) => handleChangeAmount(text)}
              />
          </View>
          <View style={{
            marginLeft: "3%"
          }}>
            <Text
              style={{
                fontSize: 15,
                color: "gray",
                marginTop: 10,
              }}
            >
              Address 
            </Text>
          </View>
          <View
            style={{
              justifyContent: "center",
              alignItems: "center",
            }}
          >
              <TextInput
                style={{
                  padding: 15,
                  marginTop: 10,
                  width: "95%",
                  fontSize: 15,
                  backgroundColor: "#F8F8F8"
                }}
                placeholder="Enter Crypto Wallet Address"
                inputMode="numeric"
                value={userAccount}
                onChangeText={(text) => setUserAccount(text)}
              />
          </View>
          <View
            style={{
              marginLeft: "3%",
              marginTop: 20,
            }}
          >
            <Text
              style={{
                fontSize: 15,
                color: "gray",
              }}
            >
              Password
            </Text>
          </View>
          <View
            style={{
              justifyContent: "center",
              alignItems: "center",
              marginBottom: 20 
            }}
          >
              <TextInput
                style={{
                  padding: 15,
                  marginTop: 10,
                  width: "95%",
                  fontSize: 15,
                  backgroundColor: "#F8F8F8"
                }}
                placeholder="Enter Fund Password"
                inputMode="numeric"
              />
          </View>
          <View style={{
            marginLeft: "3%"
          }}>
            <Text
              style={{
                fontSize: 15,
                color: "gray",
                marginTop: 5,
              }}
            >
             Tips 
            </Text>
          </View>
          <View style={{
            marginLeft: "3%"
          }}>
            <Text
              style={{
                fontSize: 15,
                color: "gray",
                marginTop: 10,
              }}
            >
            Withdraw will be under review after the order is submitted, the review may take up to 24 hours. If you have any questions, please feel free to contact our customer support. 
            </Text>
          </View>
          <Pressable
            style={{
              flexDirection: "row",
              justifyContent: "center",
              alignItems: "center",
              alignSelf: "center",
              padding: 15,
              backgroundColor: "aqua",
              width: "95%",
              marginTop: 100,
              marginBottom: "5%",
            }}
            onPress={withdrawAmount}  
          >
            <Text style={{ color: "white", marginRight: 5, fontSize: 18}}>Confirm Withdraw</Text>
          </Pressable>
        </ScrollView>
        </SafeAreaView>
      </GestureHandlerRootView>
    );
  };
  
  export default WithdrawUSDTERC;
  
  const styles = StyleSheet.create({
    mainView: {
      padding: "3%",
      height: "100%",
      width: "100%",
      // justifyContent: "center",
    },
    button: {
      width: 100,
      height: 50,
      // borderRadius: 10,
      justifyContent: "center",
      alignItems: "center",
      alignSelf: "center",
      marginVertical: 10,
      borderRadius: 10,
    },
    WithdrawalButton: {
      backgroundColor: "aqua",
    },
    buttonText: {
      color: "black",
      fontSize: 16,
      fontWeight: "bold",
    },
    currencyButton:{
      backgroundColor:"gray",
      justifyContent:"center", 
      margin:10,
      padding:5,
      width:70, 
      height:30,
      alignContent:"center"
    },
    flatList:{
      flexDirection:"row",justifyContent: "center"
    }
  });
  