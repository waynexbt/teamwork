import React, { useEffect, useRef, useState, userReducer } from "react";
import {
  View,
  Text,
  TouchableOpacity,
  StyleSheet,
  Pressable
} from "react-native";
import {
  DrawerContentScrollView,
  DrawerItem,
  DrawerItemList,
} from "@react-navigation/drawer";
import { FontAwesome, AntDesign, Feather, FontAwesome5, Ionicons } from "@expo/vector-icons";
import { useDispatch, useSelector } from "react-redux";
import { userLogOut } from "../stores/user/userActions";
import IdentityVerificationModal from "./IdentityVerificationModal";
import AsyncStorage 
from "@react-native-async-storage/async-storage";
import "../translation"
import i18n from "../translation"
import { useTranslation } from "react-i18next";
import {useNavigation} from '@react-navigation/native';

const CustomDrawer = (props) => {
  const { t } = useTranslation();
  const navigation = useNavigation();
  // const [loading, setLoading] = useState(false);
  const dispatch = useDispatch();
  const [isModalVisible, setIsModalVisible] = useState(false);

  const toggleModal = () => {
      setIsModalVisible(!isModalVisible);
  };
  const currentUser = useSelector(
    (state) => state?.userReducer?.currentUser?.username
  );


  useEffect(() => {
    if (!currentUser?.username) {
      props.navigation.closeDrawer();
      
    }
  }, [currentUser]);

  // const signOut = () => {
  //   dispatch(userLogOut());
  // };

  const signOut = async() => {
    // setLoading(true);
    dispatch(userLogOut());
    await AsyncStorage.setItem("Primaryverification", false)
    props.navigation.reset({
      index: 0,
      routes: [{ name: "Home2" }],
      key: Math.random().toString(), // Change the key to force a full refresh
    });

  };
  return (
    <View
      style={{
        flex: 1,
      }}
    >
      <IdentityVerificationModal props={props} toggleModal={toggleModal} isModalVisible={isModalVisible}/>
      <DrawerContentScrollView
        {...props}
        contentContainerStyle={{
          backgroundColor: "white",
        }}
      >
        
        <View
          style={{
            flex: 1,
            flexDirection: "row",
            alignItems: "center",
            justifyContent: "space-between"
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
            onPress={() => navigation.closeDrawer("")}
          />
          <AntDesign name="customerservice" size={30} color="black" style={{  padding: 5,
              marginRight: 10,
              marginTop: 12, }} />
        </View>
        <View
          style={{
            flexDirection: "row",
          }}
        >
          <FontAwesome
            name="user-circle"
            size={50}
            color="black"
            style={{
              padding: 15,
              marginTop: 15
            }}
          />
          <View style={{ flexDirection: "column" }}>
            <Text
              style={{ color: "black", paddingTop: 25, fontWeight: "bold", textTransform: "uppercase" }}
            >
              {currentUser}
            </Text>
            <Text style={{ color: "gray" }}>UID: 71733</Text>
           <Text style={{ color: "gray" }}>Credit Score: 70</Text>
            </View>
        </View>
        <View>
          <View style={{
            padding: 10,
            backgroundColor: "aqua",
            marginHorizontal: 13,
            borderRadius: 10,
            flexDirection: "row",
            gap: 20,
            justifyContent: 'center'
          }}>
            <Text style={{
              justifyContent: "center",
              paddingTop: 3,
              color: "white",
              fontWeight: "700"}}>Options</Text>
          <Text style={{
              justifyContent: "center",
              color: "white",
              paddingTop: 3,
              fontWeight: "600"}}>Trade Digital Currency</Text>
          <Feather name="arrow-right" size={24} color="white" />
          </View>
        </View>
        <DrawerItem
          label="Identity Verification"
          onPress={() => {
            setIsModalVisible(true)
            // Handle onPress event for the new drawer item
          }}
          icon={({ color, size }) => (
            <FontAwesome5 name="address-card" size={24} color="#000000" />
          )}
          labelStyle={{ marginLeft: -20, marginTop: 5 }}
        />
        <DrawerItemList {...props} />
      </DrawerContentScrollView>
      
        <TouchableOpacity
          style={{
            marginHorizontal: 20,
            marginVertical: 30,
            padding: 15,
            backgroundColor: "aqua",
            fontWeight: "400"
          }}
          onPress={() => signOut()}
        >
          {/* {loading ? (
            <ActivityIndicator size="small" color="white" />
          ) : ( */}
            <Text
              style={{
                color: "white",
                alignSelf: "center",
                fontSize: 18,
                fontWeight: "bold",
              }}
            >
              Sign out
            </Text>
          {/* )} */}
        </TouchableOpacity>

      </View>
  );
};

export default CustomDrawer;

const styles = StyleSheet.create({
  verifiedStyle: {
    color: "lime",
    fontWeight: "bold",
    fontSize: 13,
    textTransform: "uppercase",
    paddingLeft: 2,
  },
  notVeirfiedStyle: {
    color: "red",
    fontWeight: "bold",
    fontSize: 13,
    textTransform: "uppercase",
    paddingLeft: 2,
  },
});
