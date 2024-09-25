import axios from "axios";
import {
  View,
  Text,
  Image,
  Pressable,
  TouchableOpacity,
  Button,
  Dimensions,
  Platform,
} from "react-native";
import React, { useEffect, useRef, useState } from "react";
import { SafeAreaView } from "react-native-safe-area-context";
import * as ImagePicker from "expo-image-picker";
import * as FileSystem from "expo-file-system";
import * as Clipboard from 'expo-clipboard';
import {
  Entypo,
  Ionicons,
  FontAwesome5,
  MaterialCommunityIcons,
} from "@expo/vector-icons";
import {
  GestureHandlerRootView,
  ScrollView,
  TextInput,
} from "react-native-gesture-handler";
import ImageSelect from "../components/ImageSelect";
import Toast from "react-native-toast-message";
import { api_url } from "../config";
import { useSelector } from "react-redux";
import DepositImage from "../components/DepositImage";

const USDTERC = ({ navigation }) => {
  const [depositAmount, setDepositAmount] = useState(0);
  const fileInputRef = useRef(null);

  const handleImageClick = () => {
    fileInputRef.current.click();
  };
  // _______________________________________

  const [image, setImage] = useState(null);
  // const { userReducer } = useSelector((state) => state);
  const currentUser  = useSelector(
    (state) => state?.userReducer?.currentUser
  );
console.log("CURRENT USDTTRc",currentUser)
  const data = {
    userId: currentUser?._id,
    username: currentUser?.username,
    amount: depositAmount,
    currency: 'USDT-ERC',
  };
  const depositData = JSON.stringify(data);

  const openImagePickerAsync = async () => {
    let permissionResult =
      await ImagePicker.requestMediaLibraryPermissionsAsync();
    if (permissionResult.granted === false) {
      alert('Permission to access camera roll is required!');
      return;
    }
    let pickerResult = await ImagePicker.launchImageLibraryAsync();
    setImage(pickerResult?.assets[0].uri);
  };

  const handleFileChange = (event) => {
    const selectedFile = event.target.files[0];
    console.log(selectedFile)
    setImage(selectedFile)
    // setFile(selectedFile);
  };

  const handleDeposit = async () => {
    if (!depositAmount || !image) {
      Toast.show({
        type: 'error',
        text1: 'Error',
        text2: 'Please enter the deposit amount and select an image.',
      });
      return;
    } else {
      try {
        let uploadResult;
        if (Platform.OS === 'web') {
          console.log('in web')
          const formData = new FormData();
          formData.append('demo_image', image);
          formData.append('data', depositData);
          uploadResult = await fetch(`${api_url}/deposit/createDeposit`, {
            method: 'POST',
            body: formData,
          });
        } else {
          uploadResult = await FileSystem.uploadAsync(
            `${api_url}/deposit/createDeposit`,
            image,
            {
              httpMethod: 'POST',
              uploadType: FileSystem.FileSystemUploadType.MULTIPART,
              fieldName: 'demo_image',
              headers: {
                data: depositData,
              },
            }
          );
        }
        if (uploadResult?.status === 200) {
          Toast.show({
            type: 'success',
            text1: 'Success',
            text2: 'Deposit request sent successfully.',
          });
          setImage(null);
          setDepositAmount(null);
          navigation.navigate("DepositRecord")

        } else {
          Toast.show({
            type: 'error',
            text1: 'Error',
            text2: `Something went wrong`,
          });
        }
      } catch (e) {
        console.error('Error:', e);
        Toast.show({
          type: 'error',
          text1: 'Error',
          text2: `Something went wrong`,
        });
      }
    }
  };

  const [copiedText, setCopiedText] = React.useState('');

  const copyToClipboard = async () => {
    await Clipboard.setStringAsync('0x4A1f2938AB5a0250E07e38f9a91774880Cef1C6d');
  };

  return (
    <GestureHandlerRootView>
      <SafeAreaView style={{
        backgroundColor: "white"
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
            onPress={() => navigation.navigate("Deposit")}
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
            onPress={() => navigation.navigate("DepositRecord")}
          />
          </View>

        
          </View>
        </View>
        <View
          style={{
            flexDirection: "row",
            marginTop: 30,
            justifyContent: "space-between",
            alignItems: "center",
            width: "100%",
            paddingHorizontal: 20
          }}
        >
          <Text
            style={{
              fontSize: 17,
              color: "gray",
            }}
          >
            Network
          </Text>
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
              gap: 8
            }}
          >
            <Image
            source={require("../assets/USDT.png")}
            style={{
              alignItems: "center",
              height: 20,
              width: 20,
            }}
          />

          <Text
            style={{
              fontSize: 18,
              fontWeight: "600",
              color: "black",
            }}
          >
            USDT-ERC
          </Text>
          </View>

        
          </View>
        </View>

        <View
          style={{
            justifyContent: "center",
            alignItems: "center",
            marginBottom: 20,
          }}
        >
          <Image
            source={require("../assets/(new)ethqrcode.jpg")}
            style={{
              borderColor: "aqua",
              borderWidth: 2,
              width: 200,
              height: 200,
              marginTop: 20,
            }}
          />
          <Text
            style={{
              padding: 25,
              textAlign: "center",
              width: "95%",
              fontSize: 18,
              color: "gray",
              textDecorationLine: "underline",
            }}
            selectable={true}
          >
            0x4A1f2938AB5a0250E07e38f9a91774880Cef1C6d
          </Text>
          <TouchableOpacity
            style={{
              flexDirection: "row",
              justifyContent: "center",
              alignItems: "center",
              padding: 10,
              backgroundColor: "#0e1111",
              borderRadius: 25,
              width: 200,
            }}
            onPress={copyToClipboard}
          >
            <Text style={{ color: "white", marginRight: 5 }}>Copy</Text>
            <Ionicons name="ios-copy" size={24} color="white" />
          </TouchableOpacity>
        </View>
        <View style={{
          marginLeft: "3%"
        }}>
          <Text
            style={{
              fontSize: 15,
              color: "gray",
            }}
          >
            Deposit Amount
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
                borderWidth: 1,
                padding: 15,
                marginTop: 10,
                width: "95%"
              }}
              placeholder="Please Enter Amount"
              value={depositAmount}
              onChangeText={(text) => setDepositAmount(text)}
              keyboardType="numeric"
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
              paddingBottom: 15
            }}
          >
            Click to upload pictures
          </Text>
        </View>
        <Pressable
          style={{
            alignSelf: "center",
            justifyContent: "center",
            alignItems: "center",
            paddingVertical: 20,
            width: "94%",
            backgroundColor: "#0e1111",
          }}  onPress={() => Platform.OS === 'web' ? handleImageClick() : openImagePickerAsync()}
        >
          {
         Platform.OS === 'web' && (<input accept="image/*" style={{display:'none'}} ref={fileInputRef} type="file" onChange={handleFileChange}/>)
        }
          {image && <DepositImage image={image}/> }

          <View style={{ flex: 1, borderColor: "white", justifyContent: "center", padding: 30, borderRadius: 15, borderWidth: 2, borderStyle: "dashed"}}>
          <Entypo name="camera" size={30} color="white" alignSelf="center" />
          </View>
        </Pressable>
        <TouchableOpacity
          style={{
            flexDirection: "row",
            justifyContent: "center",
            alignItems: "center",
            alignSelf: "center",
            padding: 15,
            backgroundColor: "aqua",
            width: "95%",
            marginTop: 20,
            marginBottom: "5%",
          }}
          onPress={handleDeposit}  
        >
          <Text style={{ color: "white", marginRight: 5 }}>Confirm Deposit</Text>
        </TouchableOpacity>
      </ScrollView>
      </SafeAreaView>
    </GestureHandlerRootView>
  );
};

export default USDTERC;
