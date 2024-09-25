import { View, Text, Image, Pressable, ActivityIndicator } from "react-native";
import { React, useEffect, useState } from "react";
import { SafeAreaView } from "react-native-safe-area-context";
import { AntDesign } from "@expo/vector-icons";
import {
  GestureHandlerRootView,
  NativeViewGestureHandler,
  TextInput,
} from "react-native-gesture-handler";
import { userLogin } from "../stores/user/userActions";
import { useDispatch, useSelector } from "react-redux";
import Toast from "react-native-toast-message";
import axios from "axios";
import { api_url } from "../config";
import CountryFlag from "react-native-country-flag";

const Login = ({ navigation }) => { 
  const dispatch = useDispatch();
  const [email, setEmail] = useState();
  const [password, setPassword] = useState();
  const [isLoading, setIsLoading] = useState(false);

  const user = { email: email, password: password };
  const userState = useSelector((state) => state?.userReducer);
  console.log(userState);
  useEffect(() => {
    if (userState?.currentUser?.username) {
      setIsLoading(false);
      Toast.show({
        type: "success",
        text1: "Success",
        text2: `Welcome ${userState?.currentUser?.username} `,
      });
      navigation?.navigate("Home2");
    } else {
      if (userState?.error !== null || undefined) {
        if(userState?.error?.status === 404 || 401){
          setIsLoading(false);
          Toast.show({
            type: "error",
            text1: "Error",
            text2: `Error login: ${userState?.error?.message} `,
          });
        }
        if(userState?.error?.status === 403){
          setIsLoading(false)
          Toast.show({
            type: "error",
            text1: "Verify email",
            text2: `Error login: ${userState?.error?.message} `,
          });
          navigation.navigate("Otp", {email: email})
        }
      }
    }
  }, [userState?.currentUser, userState?.error]);

  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

  const emailError = email && !email.match(emailRegex) ? "E-mail format incorrect" : "";
  const signIn = () => {
    if (email && password) {
      setIsLoading(true);
      dispatch(userLogin(user));
    } else {
      Toast.show({
        type: "error",
        text1: "error",
        text2: "Please fill all fields",
      });
      setIsLoading(false);
    }
  };

  return (
    <GestureHandlerRootView style={{backgroundColor: "white"}}>
      <SafeAreaView style={{ backgroundColor: "white", paddingBottom: 370 }}>
        <View
          style={{
            backgroundColor: "white",
            flexDirection: "row",
            alignItems: "center",
            justifyContent: "space-between"
          }}
        >
          <AntDesign
            name="close"
            size={35}
            color="black"
            style={{
              padding: 5,
              marginLeft: 10,
              marginTop: 15,
            }}
            onPress={() => navigation.navigate("Home2")}
          />
          <Pressable > <CountryFlag isoCode="gb" size={20} style={{padding: 5,
              marginRight: 20,
              marginTop: 15,}} /></Pressable>
        </View>
        <View
          style={{
            padding: 40,
            justifyContent: "center",
            alignItems: "center",

          }}
        >
          <Text
            style={{
              fontSize: 32,
              color: "aqua",
              fontWeight: "bold",
              textTransform: "uppercase",
              paddingBottom: 20,
              paddingTop: 60
            }}
          >
            Welcome to Bitget
          </Text>
        </View>
        <View
          style={{
            flexDirection: "row",
            justifyContent: "center",
            alignItems: "center",
            paddingBottom: 20,
          }}
        >
          <TextInput
            labelValue={email}
            onChangeText={(userEmail) => setEmail(userEmail)}
            placeholder="Please enter your email address"
            style={{
              padding: 17,
              alignItems: "center",
              width: "90%",
              paddingLeft: 22,
              borderRadius: 8,
              borderWidth: 1, 
              fontSize: 18,
              borderColor: "#ededed",
              color: "#6e6e6e"
            }}
            keyboardType="email-address"
            autoCapitalize="none"
            autoCorrect={false}
          />
        </View>
        <View>
        {email && (
            <Text style={{ color: "red", marginVertical: 5, marginLeft: 25}}>{emailError}</Text>
          )}
        </View>

        <View style={{ justifyContent: "center", alignItems: "center" }}>
          <TextInput
            labelValue={password}
            onChangeText={(userPassword) => setPassword(userPassword)}
            placeholder="Please enter password"
            style={{
              padding: 17,
              alignItems: "center",
              width: "90%",
              paddingLeft: 22,
              borderRadius: 8,
              borderWidth: 1, 
              fontSize: 18,
              borderColor: "#ededed",
              color: "#6e6e6e"
            }}
            secureTextEntry={true}
          ></TextInput>
        </View>
        <View style={{ justifyContent: "center", alignItems: "center", paddingTop: 20, }}>
          <TextInput
            labelValue={password}
            onChangeText={(userPassword) => setPassword(userPassword)}
            placeholder="Please enter verification code"
            style={{
              padding: 17,
              alignItems: "center",
              width: "90%",
              paddingLeft: 22,
              borderRadius: 8,
              borderWidth: 1, 
              fontSize: 18,
              borderColor: "#ededed",
              color: "#6e6e6e"
            }}
          ></TextInput>
        </View>
        <Text
          style={{
            color: "aqua",
            marginLeft: 25,
            marginVertical: 5,
            fontSize: 17
          }}
        >
          Forgot your password?
        </Text>

        <View>
          <Pressable
            style={{
              width: "90%",
              alignSelf: "center",
              marginTop: 10,
              marginBottom: 10,
              padding: 10,
              backgroundColor: "aqua",
              borderColor: "#D3D3D3",
              borderStyle: "solid",
              alignItems: "center",
            }}
            onPress={() => signIn()}
          >
            {isLoading ? (
              <ActivityIndicator size="small" color="black" />
            ) : (
              <Text
                style={{
                  fontSize: 20,
                  color: "white",
                  fontWeight: "bold",
                }}
              >
                {" "}
                Login{" "}
              </Text>
            )}
          </Pressable>
          <View
            style={{ flexDirection: "row", gap: 3, justifyContent: "center" }}
          >
            <Text style={{fontSize: 17 }}>Don't have an account?</Text>
            <Text
              style={{ color: "aqua", fontSize: 17 }}
              onPress={() => navigation.navigate("Signup")}
            >
              Sign up
            </Text>
          </View>
        </View>
      </SafeAreaView>
    </GestureHandlerRootView>
  );
};

export default Login;
