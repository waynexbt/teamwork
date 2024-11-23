import { View, Text, Pressable, Image} from 'react-native'
import React from 'react'
import { ScrollView } from 'react-native-gesture-handler'
import GestureHandlerRootView from 'react-native-gesture-handler'
import { AntDesign } from '@expo/vector-icons'
import { SafeAreaView } from 'react-native-safe-area-context'
import AutoScrollFlatList from '../components/AutoscrollFlatList'

const DeFi = () => {
    return (
      <SafeAreaView
        style={{
          backgroundColor: "white",
          flex: 1,
        }}
      >
        <ScrollView>
          <View
            style={{
              flex: 1,
              flexDirection: "row",
              backgroundColor: "white",
              justifyContent: "space-between",
              position: "relative",
            }}
          >
            <Text
              style={{
                fontWeight: "bold",
                fontSize: 25,
                marginLeft: 15,
                marginBottom: 15,
              }}
            >
              {" "}
              DeFi{" "}
            </Text>
            <AntDesign
              name="customerservice"
              size={30}
              color="black"
              style={{ marginHorizontal: 20 }}
            />
          </View>
          <View
            style={{
              flexDirection: "row",
              paddingHorizontal: 25,
              paddingBottom: 20,
              paddingTop: 20,
            }}
          >
            <Image
              source={require("../assets/USDT.png")}
              style={{
                width: 35,
                height: 35,
              }}
            ></Image>
            <Text
              style={{
                fontWeight: "bold",
                fontSize: 25,
                alignSelf: "center",
                paddingLeft: 5,
                color: "black",
              }}
            >
              ETH
            </Text>
            <Text
              style={{
                fontSize: 25,
                alignSelf: "center",
                paddingLeft: 10,
                color: "black",
              }}
            >
              Ethereum
            </Text>
          </View>
          <View
            style={{
              flexDirection: "row",
              justifyContent: "space-between",
            }}
          >
            <Text style={{ paddingHorizontal: 25 }}>Total Output (ETH)</Text>
            <Text style={{ paddingHorizontal: 25 }}>Nodes</Text>
          </View>
          <View
            style={{
              flexDirection: "row",
              justifyContent: "space-between",
              paddingTop: 5,
              paddingBottom: 20,
            }}
          >
            <Text
              style={{
                paddingHorizontal: 25,
                fontWeight: "bold",
                color: "green",
              }}
            >
              44445.34
            </Text>
            <Text style={{ paddingHorizontal: 25, fontWeight: "bold" }}>
              {" "}
              23094
            </Text>
          </View>
          <View
            style={{
              flexDirection: "row",
              justifyContent: "space-between",
            }}
          >
            <Text style={{ paddingHorizontal: 25 }}>Participants</Text>
            <Text style={{ paddingHorizontal: 25 }}> User Benefits (USDT)</Text>
          </View>
          <View
            style={{
              flexDirection: "row",
              justifyContent: "space-between",
              paddingTop: 5,
            }}
          >
            <Text style={{ paddingHorizontal: 30, fontWeight: "bold" }}>
              13829
            </Text>
            <Text style={{ paddingHorizontal: 30, fontWeight: "bold" }}>
              {" "}
              729000.59
            </Text>
          </View>
          <View
            style={{
              paddingTop: 20,
              paddingBottom: 10,
            }}
          >
            <Pressable
              style={{
                padding: 5,
                backgroundColor: "aqua",
                width: 380,
                borderRadius: 15,
                alignSelf: "center",
              }}
            >
              <Text
                style={{
                  fontSize: 23,
                  fontWeight: "bold",
                  textTransform: "uppercase",
                  alignSelf: "center",
                }}
              >
                Participate now
              </Text>
            </Pressable>
          </View>
          <View
            style={{
              flex: 1,
              flexDirection: "row",
              justifyContent: "space-between",
              marginTop: 20,
              marginHorizontal: 5,
            }}
          >
            <Text
              style={{
                fontWeight: "bold",
                fontSize: 20,
                marginLeft: 15,
                marginBottom: 15,
              }}
            >
              {" "}
              Income Ratio{" "}
            </Text>
            <Text
              style={{
                fontWeight: "bold",
                fontSize: 20,
                marginBottom: 15,
                color: "aqua",
              }}
            >
              {" "}
              Guidelines{" "}
            </Text>
          </View>
          <View
            style={{
              flexDirection: "row",
              justifyContent: "space-between",
              backgroundColor: "gray",
              padding: 20,
              marginTop: 10,
            }}
          >
            <Text
              style={{
                color: "white",
                fontWeight: "bold",
              }}
            >
              Gear
            </Text>
            <Text
              style={{
                color: "white",
                fontWeight: "bold",
              }}
            >
              Amount
            </Text>
            <Text
              style={{
                color: "white",
                fontWeight: "bold",
              }}
            >
              ROE
            </Text>
          </View>
          <View
            style={{
              flexDirection: "row",
              justifyContent: "space-between",
              backgroundColor: "black",
              padding: 20,
            }}
          >
            <Text
              style={{
                color: "white",
                fontWeight: "bold",
              }}
            >
              1
            </Text>
            <Text
              style={{
                color: "white",
                fontWeight: "bold",
                paddingLeft: 45,
              }}
            >
              500~1000
            </Text>
            <Text
              style={{
                color: "white",
                fontWeight: "bold",
              }}
            >
              0.25%
            </Text>
          </View>
          <View
            style={{
              flexDirection: "row",
              justifyContent: "space-between",
              backgroundColor: "black",
              padding: 20,
            }}
          >
            <Text
              style={{
                color: "white",
                fontWeight: "bold",
              }}
            >
              2
            </Text>
            <Text
              style={{
                color: "white",
                fontWeight: "bold",
                paddingLeft: 45,
              }}
            >
              1000~5000
            </Text>
            <Text
              style={{
                color: "white",
                fontWeight: "bold",
              }}
            >
              0.35%
            </Text>
          </View>
          <View
            style={{
              flexDirection: "row",
              justifyContent: "space-between",
              backgroundColor: "black",
              padding: 20,
            }}
          >
            <Text
              style={{
                color: "white",
                fontWeight: "bold",
              }}
            >
              3
            </Text>
            <Text
              style={{
                color: "white",
                fontWeight: "bold",
                paddingLeft: 45,
              }}
            >
              5000~20000
            </Text>
            <Text
              style={{
                color: "white",
                fontWeight: "bold",
              }}
            >
              0.45%
            </Text>
          </View>
          <View
            style={{
              flexDirection: "row",
              justifyContent: "space-between",
              backgroundColor: "black",
              padding: 20,
            }}
          >
            <Text
              style={{
                color: "white",
                fontWeight: "bold",
              }}
            >
              4
            </Text>
            <Text
              style={{
                color: "white",
                fontWeight: "bold",
                paddingLeft: 45,
              }}
            >
              20000~50000
            </Text>
            <Text
              style={{
                color: "white",
                fontWeight: "bold",
              }}
            >
              0.65%
            </Text>
          </View>
          <View
            style={{
              flexDirection: "row",
              justifyContent: "space-between",
              backgroundColor: "black",
              padding: 20,
            }}
          >
            <Text
              style={{
                color: "white",
                fontWeight: "bold",
              }}
            >
              5
            </Text>
            <Text
              style={{
                color: "white",
                fontWeight: "bold",
                paddingLeft: 45,
              }}
            >
              50000~200000
            </Text>
            <Text
              style={{
                color: "white",
                fontWeight: "bold",
              }}
            >
              0.75%
            </Text>
          </View>
          <View
            style={{
              flexDirection: "row",
              justifyContent: "space-between",
              backgroundColor: "black",
              padding: 20,
            }}
          >
            <Text
              style={{
                color: "white",
                fontWeight: "bold",
              }}
            >
              6
            </Text>
            <Text
              style={{
                color: "white",
                fontWeight: "bold",
                paddingLeft: 45,
              }}
            >
              200000~500000
            </Text>
            <Text
              style={{
                color: "white",
                fontWeight: "bold",
              }}
            >
              0.95%
            </Text>
          </View>
          <View
            style={{
              flexDirection: "row",
              justifyContent: "space-between",
              backgroundColor: "black",
              padding: 20,
            }}
          >
            <Text
              style={{
                color: "white",
                fontWeight: "bold",
              }}
            >
              7
            </Text>
            <Text
              style={{
                color: "white",
                fontWeight: "bold",
                paddingLeft: 45,
              }}
            >
              500000~1000000
            </Text>
            <Text
              style={{
                color: "white",
                fontWeight: "bold",
              }}
            >
              1.00%
            </Text>
          </View>
          <View>
            <Text
              style={{
                fontSize: 23,
                fontWeight: "bold",
                alignSelf: "center",
                marginTop: 20,
              }}
            >
              User Profits
            </Text>
          </View>
          <View
            style={{
              flex: 1,
              alignContent: "center",
              backgroundColor: "white",
              padding: 25,
              marginTop: 15,
              justifyContent: "space-evenly",
            }}
          >
            <View
              style={{
                padding: 5,
                borderRadius: 25,
                backgroundColor: "black",
              }}
            >
              <Pressable
                style={{
                  padding: 5,
                  borderRadius: 25,
                  backgroundColor: "aqua",
                }}
              ></Pressable>
            </View>
            <View
              style={{
                flexDirection: "row",
                gap: 20,
                justifyContent: "space-between",
                backgroundColor: "black",
                paddingBottom: 20,
                paddingHorizontal: 20,
                paddingVertical: 20,
              }}
            >
              <Text style={{ color: "white" }}>Wallet Address</Text>
              <Text style={{ color: "white" }}> Amount</Text>
            </View>
            <View
              style={{
                borderBottomColor: "gray",
                borderBottomWidth: 1,
                width: "100%",
              }}
            />



                {/* new start */}
                
                {/* <View
                    style={{
                        flexDirection: "row",
                        gap: 20,
                        justifyContent: "space-between",
                        backgroundColor: "black",
                        paddingBottom: 20,
                        paddingHorizontal: 20,
                        paddingVertical: 20,
                    }}
                    >
                    <Text style={{ color: "white" }}>Wallet Address</Text>
                    <Text style={{ color: "white" }}> Amount</Text>

                    
                </View> */}
                
                {/* new end */}

          </View>

<View style={{ flexDirection: "row",
paddingBottom: 20,
paddingHorizontal: 25,
                        justifyContent: "space-between",
                        maxHeight:230,
                        marginTop: -15
                        }}>
    
          <AutoScrollFlatList DATA={[
    { "address": "0x594e******bc7d70", "amount": "1 ETH" },
    { "address": "0x6f8e******f9abc", "amount": "0.5 ETH" },
    { "address": "0x7c3e******df1abc", "amount": "2 ETH" },
    { "address": "0x9d4f******cde123", "amount": "0.75 ETH" },
    { "address": "0x2a3b******98f67", "amount": "1.2 ETH" },
    { "address": "0x5b7e******abcde", "amount": "3 ETH" },
    { "address": "0x1c2d******abcdef", "amount": "0.1 ETH" },
    { "address": "0x8f7e******0abcdef", "amount": "4 ETH" },
    { "address": "0x3a4b******def01", "amount": "1.5 ETH" },
    { "address": "0x2c3d******def2", "amount": "2.5 ETH" },
    { "address": "0x4e5f******def34", "amount": "0.3 ETH" },
    { "address": "0x6d7c******def56", "amount": "5 ETH" },
    { "address": "0x1a2b******def7", "amount": "0.9 ETH" },
    { "address": "0x9f8e******def8", "amount": "1.8 ETH" },
    { "address": "0x3c4d******def90", "amount": "2.2 ETH" }
]
} />
</View>

          <View>
            <Text
              style={{
                fontSize: 23,
                fontWeight: "bold",
                alignSelf: "center",
                marginTop: 20,
              }}
            >
              Auditors
            </Text>
          </View>
          <View
            style={{
              flex: 1,
              flexDirection: "row",
              marginTop: 15,
              marginBottom: 20,
              justifyContent: "space-evenly",
            }}
          >
            <Pressable
              style={{
                justifyContent: "center",
                width: 200,
                height: 50,
                borderRadius: 15,
                borderWidth: 1,
                borderColor: "aqua",
                backgroundColor: "white",
                cursor: "pointer",
              }}
            >
              <Image
                source={require("../assets/DeFI/openzeppelin.png")}
                style={{ height: 40, width: 140, alignSelf: "center" }}
              ></Image>
            </Pressable>

            <Pressable
              style={{
                justifyContent: "center",
                width: 200,
                height: 50,
                borderRadius: 15,
                borderWidth: 1,
                borderColor: "aqua",
                backgroundColor: "white",
                cursor: "pointer",
              }}
            >
              <Image
                source={require("../assets/DeFI/consensys.png")}
                style={{ height: 40, width: 140, alignSelf: "center" }}
              ></Image>
            </Pressable>
          </View>
          <View>
            <Text
              style={{
                fontSize: 23,
                fontWeight: "bold",
                alignSelf: "center",
                marginTop: 10,
              }}
            >
              Partners
            </Text>
          </View>
          <View
            style={{
              flex: 1,
              flexDirection: "row",
              marginTop: 15,
              marginBottom: 10,
              justifyContent: "space-evenly",
            }}
          >
            <Pressable
              style={{
                justifyContent: "center",
                width: 130,
                height: 50,
                borderRadius: 15,
                borderWidth: 1,
                borderColor: "aqua",
                backgroundColor: "white",
                cursor: "pointer",
              }}
            >
              <Image
                source={require("../assets/DeFI/tokenpocket.png")}
                style={{ height: 40, width: 120, alignSelf: "center" }}
              ></Image>
            </Pressable>

            <Pressable
              style={{
                justifyContent: "center",
                width: 140,
                height: 50,
                borderRadius: 15,
                borderWidth: 1,
                borderColor: "aqua",
                backgroundColor: "white",
                cursor: "pointer",
              }}
            >
              <Image
                source={require("../assets/DeFI/defibox.png")}
                style={{ height: 40, width: 130, alignSelf: "center" }}
              ></Image>
            </Pressable>
            <Pressable
              style={{
                justifyContent: "center",
                width: 130,
                height: 50,
                borderRadius: 15,
                borderWidth: 1,
                borderColor: "aqua",
                backgroundColor: "white",
                cursor: "pointer",
              }}
            >
              <Image
                source={require("../assets/DeFI/coinbase.png")}
                style={{ height: 30, width: 120, alignSelf: "center" }}
              ></Image>
            </Pressable>
          </View>
          <View
            style={{
              flex: 1,
              flexDirection: "row",
              marginTop: 5,
              marginBottom: 20,
              justifyContent: "space-evenly",
            }}
          >
            <Pressable
              style={{
                justifyContent: "center",
                width: 130,
                height: 50,
                borderRadius: 15,
                borderWidth: 1,
                borderColor: "aqua",
                backgroundColor: "white",
                cursor: "pointer",
              }}
            >
              <Image
                source={require("../assets/DeFI/gate.png")}
                style={{ height: 40, width: 130, alignSelf: "center" }}
              ></Image>
            </Pressable>

            <Pressable
              style={{
                justifyContent: "center",
                width: 140,
                height: 50,
                borderRadius: 15,
                borderWidth: 1,
                borderColor: "aqua",
                backgroundColor: "white",
                cursor: "pointer",
              }}
            >
              <Image
                source={require("../assets/DeFI/debank.png")}
                style={{ height: 40, width: 130, alignSelf: "center" }}
              ></Image>
            </Pressable>
            <Pressable
              style={{
                justifyContent: "center",
                width: 130,
                height: 50,
                borderRadius: 15,
                borderWidth: 1,
                borderColor: "aqua",
                backgroundColor: "white",
                cursor: "pointer",
              }}
            >
              <Image
                source={require("../assets/DeFI/bitkeep.png")}
                style={{ height: 40, width: 130, alignSelf: "center" }}
              ></Image>
            </Pressable>
          </View>
        </ScrollView>
      </SafeAreaView>
    );
}

export default DeFi