import { View, Text, Image, Pressable } from "react-native";
import React from "react";
import { SafeAreaView } from "react-native-safe-area-context";
import { Ionicons } from "@expo/vector-icons";
import { ScrollView } from "react-native-virtualized-view"

const Deposit = ({ navigation }) => {
  return (
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
            Deposit
          </Text>
        </View>
      <View>
        <Text
          style={{
            padding: 10,
            marginLeft: 5,
            marginTop: 30,
            fontSize: 17,
            color: "gray",
          }}
        >
          Network
        </Text>
      </View>

      <Pressable
        style={{
          flexDirection: "row",
          width: "95%",
          alignSelf: "center",
          marginTop: 3,
          marginBottom: 10,
          borderRadius: 5,
          padding: 20,
          backgroundColor: "#F8F8F8",
          borderColor: "#D3D3D3",
          borderStyle: "solid",
          borderWidth: 0.5,
          alignItems: "center",
        }}
        onPress={() => navigation.navigate("Usdterc")}
      >
        <Image
          source={require("../assets/USDT.png")}
          style={{
            alignItems: "center",
            height: 25,
            width: 25,
            marginRight: 10,
          }}
        />
        <Text
          style={{
            fontSize: 20,
            color: "black",
          }}
        >
          USDT-ERC
        </Text>
        <View
          style={{
            // marginLeft: 200,
            marginLeft: "auto",
          }}
        >
          <Ionicons name="md-arrow-forward-circle" size={24} color="gray" />
        </View>
      </Pressable>
      <Pressable
        style={{
          flexDirection: "row",
          width: "95%",
          alignSelf: "center",
          marginTop: 3,
          marginBottom: 10,
          borderRadius: 5,
          padding: 20,
          backgroundColor: "#F8F8F8",
          borderColor: "#D3D3D3",
          borderStyle: "solid",
          borderWidth: 0.5,
          alignItems: "center",
        }}
        onPress={() => navigation.navigate("Usdc")}
      >
        <Image
          source={require("../assets/USDT-ERC.png")}
          style={{
            alignItems: "center",
            height: 25,
            width: 25,
            marginRight: 10,
          }}
        />
        <Text
          style={{
            justifyContent: "center",
            fontSize: 20,
            color: "black",
          }}
        >
          USDC-ERC
        </Text>
        <View
          style={{
            // marginLeft: 200,
            marginLeft: "auto",
          }}
        >
          <Ionicons name="md-arrow-forward-circle" size={24} color="gray" />
        </View>
      </Pressable>
      <Pressable
        style={{
          flexDirection: "row",
          width: "95%",
          alignSelf: "center",
          marginTop: 3,
          marginBottom: 10,
          borderRadius: 5,
          padding: 20,
          backgroundColor: "#F8F8F8",
          borderColor: "#D3D3D3",
          borderStyle: "solid",
          borderWidth: 0.5,
          alignItems: "center",
        }}
        onPress={() => navigation.navigate("Usdttrc")}
      >
        <Image
          source={require("../assets/USDT.png")}
          style={{
            alignItems: "center",
            height: 25,
            width: 25,
            marginRight: 10,
          }}
        />
        <Text
          style={{
            justifyContent: "center",
            fontSize: 20,
            color: "black",
          }}
        >
          USDT-TRC
        </Text>
        <View
          style={{
            // marginLeft: 200,
            marginLeft: "auto",
          }}
        >
          <Ionicons name="md-arrow-forward-circle" size={24} color="gray" />
        </View>
      </Pressable>
      <Pressable
        style={{
          flexDirection: "row",
          width: "95%",
          alignSelf: "center",
          marginTop: 3,
          marginBottom: 10,
          borderRadius: 5,
          padding: 20,
          backgroundColor: "#F8F8F8",
          borderColor: "#D3D3D3",
          borderStyle: "solid",
          borderWidth: 0.5,
          alignItems: "center",
        }}
        onPress={() => navigation.navigate("Btc")}
      >
        <Image
          source={require("../assets/BTC.png")}
          style={{
            alignItems: "center",
            height: 25,
            width: 25,
            marginRight: 10,
          }}
        />
        <Text
          style={{
            marginLeft: 5,
            fontSize: 20,
            color: "black",
          }}
        >
          BTC
        </Text>
        <View
          style={{
            // marginLeft: 270,
            marginLeft: "auto",
          }}
        >
          <Ionicons name="md-arrow-forward-circle" size={24} color="gray" />
        </View>
      </Pressable>
      <Pressable
        style={{
          flexDirection: "row",
          width: "95%",
          alignSelf: "center",
          marginTop: 3,
          marginBottom: 10,
          borderRadius: 5,
          padding: 20,
          backgroundColor: "#F8F8F8",
          borderColor: "#D3D3D3",
          borderStyle: "solid",
          borderWidth: 0.5,
        }}
        onPress={() => navigation.navigate("Eth")}
      >
        <Image
          source={require("../assets/ETH.png")}
          style={{
            alignItems: "center",
            height: 25,
            width: 25,
            marginRight: 10,
          }}
        />
        <Text
          style={{
            marginLeft: 5,
            fontSize: 20,
            color: "black",
          }}
        >
          ETH
        </Text>
        <View
          style={{
            // marginLeft: 270,
            marginLeft: "auto",
          }}
        >
          <Ionicons name="md-arrow-forward-circle" size={24} color="gray" />
        </View>
      </Pressable>
    </ScrollView>
    </SafeAreaView>
  );
};

export default Deposit;
