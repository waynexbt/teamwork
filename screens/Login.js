import { View, Text, Image, Pressable, ActivityIndicator } from "react-native";
import { React, useCallback, useEffect, useState } from "react";
import { SafeAreaView } from "react-native-safe-area-context";
import { AntDesign } from "@expo/vector-icons";
import {
  GestureHandlerRootView,
  NativeViewGestureHandler,
  TextInput,
} from "react-native-gesture-handler";
// 
import Svg, { Text as SvgText, Circle, Rect } from 'react-native-svg';

import { userLogin } from "../stores/user/userActions";
import { useDispatch, useSelector } from "react-redux";
import Toast from "react-native-toast-message";
import axios from "axios";
import { api_url } from "../config";

const Login = ({ navigation }) => { 
  const dispatch = useDispatch();
  const [email, setEmail] = useState();
  const [password, setPassword] = useState();
  const [isLoading, setIsLoading] = useState(false);

  // 
  const [captcha, setCaptcha] = useState(generateCaptcha());
  const [userInput, setUserInput] = useState('');
  const [backgroundShapes, setBackgroundShapes] = useState([]);


// 
  const user = { email: email, password: password };
  const userState = useSelector((state) => state?.userReducer);
  
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

  useEffect(() => {
    // Generate background shapes when the component mounts or CAPTCHA changes
    setBackgroundShapes(renderBackgroundShapes());
  }, [captcha]);

  const signIn = () => {
    if(userInput !== captcha){
      Toast.show({
        type: "error",
        text1: "Wrong captcha",
        text2: `Please enter valid captcha`,
      });
      return;
    }

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

  function generateCaptcha (){
    return Math.floor(1000 + Math.random() * 9000).toString(); // 4-digit number
  }

  const renderBackgroundShapes = () => {
    const shapes = [];
    for (let i = 0; i < 10; i++) {
      const shapeType = Math.random() > 0.5 ? 'circle' : 'rect';
      const color = `rgba(${Math.random() * 255}, ${Math.random() * 255}, ${Math.random() * 255}, 0.3)`;

      if (shapeType === 'circle') {
        shapes.push(
          <Circle
            key={i}
            cx={Math.random() * 120} // Adjusted for reduced width
            cy={Math.random() * 40} // Adjusted for reduced height
            r={Math.random() * 10 + 5} // Random radius
            fill={color}
          />
        );
      } else {
        shapes.push(
          <Rect
            key={i}
            x={Math.random() * 120} // Adjusted for reduced width
            y={Math.random() * 40} // Adjusted for reduced height
            width={Math.random() * 15 + 5} // Random width
            height={Math.random() * 15 + 5} // Random height
            fill={color}
          />
        );
      }
    }
    return shapes;
  };

  const getColorForDigit = (digit) => {
    const colors = ['#000000', '#4B0082', '#8B0000', '#FF4500', '#2E8B57', '#00008B', '#A52A2A', '#483D8B'];
    return colors[digit] || '#000000'; // Fallback to black
  };

  return (
    <GestureHandlerRootView>
      <SafeAreaView style={{ backgroundColor: "white", paddingBottom: 300 }}>
        <View
          style={{
            flexDirection: "row",
            alignItems: "center",
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
        </View>
        <View
          style={{
            padding: 50,
            justifyContent: "center",
            alignItems: "center",
          }}
        >
          <Text
            style={{
              fontSize: 30,
              color: "aqua",
              fontWeight: "bold",
              textTransform: "uppercase",
            }}
          >
            Welcome to Bitget
          </Text>
          <Image
            source={require("../assets/bitgetlogo.png")}
            style={{ justifyContent: "center", alignItems: "center" }}
          ></Image>
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
            placeholder="Enter your email address"
            style={{
              padding: 15,
              alignItems: "center",
              width: "85%",
              paddingLeft: 22,
              borderRadius: 8,
              borderWidth: 1,
            }}
            keyboardType="email-address"
            autoCapitalize="none"
            autoCorrect={false}
          ></TextInput>
        </View>
        <View style={{ justifyContent: "center", alignItems: "center", paddingBottom: 20, }}>
          <TextInput
            labelValue={password}
            onChangeText={(userPassword) => setPassword(userPassword)}
            placeholder="Enter your password"
            style={{
              padding: 15,
              alignItems: "center",
              width: "85%",
              paddingLeft: 22,
              borderRadius: 8,
              borderWidth: 1,
            }}
            secureTextEntry={true}
          ></TextInput>
        </View>

        <View style={{ alignItems: "center",flexDirection:"row",
          borderRadius: 8,
          borderWidth: 1,
          width: "85%",
          margin:"auto"
         }}>
          <TextInput
            labelValue={captcha}
            onChangeText={(captchaText) => setUserInput(captchaText)}
            placeholder="Enter captcha"
            style={{
              padding: 15,
              alignItems: "center",
              paddingLeft: 22,
            }}
          ></TextInput>


          <Svg height="40" width="120" > 
            {backgroundShapes}
            {captcha.split('').map((digit, index) => (
              <SvgText
                key={index}
                x={25 + index * 25} // Adjusted for new width
                y="30" // Adjusted Y position for centering
                textAnchor="middle"
                fontSize="20" // Adjusted font size
                fill={getColorForDigit(digit)}
                fontWeight="bold"
              >
                {digit}
              </SvgText>
            ))}
          </Svg>
          
        </View>

        {/*  */}

     
        
        <Text
          style={{
            color: "aqua",
            paddingTop: 10,
            paddingBottom: 10,
            paddingHorizontal: 35,
          }}
        >
          Forgot your password?
        </Text>

        <View>
          <Pressable
            style={{
              width: "75%",
              alignSelf: "center",
              marginTop: 3,
              marginBottom: 10,
              borderRadius: 35,
              padding: 10,
              backgroundColor: "aqua",
              borderColor: "#D3D3D3",
              borderStyle: "solid",
              borderWidth: 0.5,
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
            style={{ flexDirection: "row", gap: 2, justifyContent: "center" }}
          >
            <Text>Don't have an account?</Text>
            <Text
              style={{ color: "aqua" }}
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
