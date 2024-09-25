import React, { useEffect, useState, useRef } from "react";
import {
  View,
  Text,
  StyleSheet,
  FlatList,
  Pressable,
  Image,
  Modal,
  Linking,
} from "react-native";
import Carousel from "../components/carousel";
import { TextInput } from "react-native-gesture-handler";
import {
  Entypo,
  FontAwesome,
  FontAwesome5,
  MaterialCommunityIcons,
  MaterialIcons,
  Feather,
} from "@expo/vector-icons";
import { style } from "deprecated-react-native-prop-types/DeprecatedViewPropTypes";
import { connect, useDispatch, useSelector } from "react-redux";
import { getCoinMarket } from "../stores/market/marketActions";
import { SafeAreaView } from "react-native-safe-area-context";
import { useFocusEffect, useNavigation } from "@react-navigation/native";
import { ScrollView } from "react-native-virtualized-view";
import { LineChart } from "react-native-chart-kit";
import AuthModal from "../components/AuthModal";
import { exptyingError } from "../stores/user/userActions";
import CoinSearchComponent from "../components/CoinSearch";
import CountryFlag from "react-native-country-flag";
import { BottomSheetModalProvider, BottomSheetModal } from "@gorhom/bottom-sheet";
import 'react-native-gesture-handler';

function Home({ getCoinMarket, coins }) {
  const navigation = useNavigation();
  const dispatch = useDispatch();
  const [showModal, setShowModal] = useState(false);
  const BottomSheetModalRef = useRef(null);
  const snapPoints = ["48%"];

  function handlePresentModal() {
    BottomSheetModalRef.current?.present();
    
  };


  // const user = useSelector((state) => state?.userReducer?.currentUser?.token);
  const user = useSelector((state) => state?.userReducer?.currentUser?.token);
  const cuser = useSelector((state) => state?.userReducer?.currentUser);
  console.log('cuser', JSON.stringify(cuser))
  const currentUser = user;
  useFocusEffect(
    React.useCallback(() => {
      getCoinMarket();
      dispatch(exptyingError());
      console.log("TOKEN: " + user);
    }, [])
  );

  const handleNavigation = (screen) => {
    if (currentUser) {
      navigation.navigate(screen);
    } else {
      setShowModal(true);
    }
  };
  const closeModal = () => {
    setShowModal(false);
  };

  console.log(coins)

  return (
    <BottomSheetModalProvider>
    <SafeAreaView
      style={{
        backgroundColor: "white",
        height: "100%"
      }}>
      <ScrollView
        style={{
          backgroundColor: "white",
        }}
      >
        <View
          style={{
            flexDirection: "row",
            marginTop: 5,
            padding: 15,
            backgroundColor: "white",
            justifyContent: "space-between",
            gap: 10
          }}
        >
          <Pressable
            onPress={() => {
              if (currentUser) {
                navigation.openDrawer();
              } else {
                setShowModal(true);
              }
            }}
          >
            <MaterialCommunityIcons name="dots-grid" size={40} color="black" />
          </Pressable>
          <TextInput placeholder="Search coin pairs" style={{borderWidth: 1, borderRadius: 20, paddingHorizontal: 15, width: "100%"}} ></TextInput>
          <Pressable onPress={handlePresentModal} > <CountryFlag isoCode="gb" size={20} style={{marginTop: 10}} /></Pressable>
        </View>
        {/* <View style={{ zIndex: 10000 }}>
          <CoinSearchComponent coins={coins} />
        </View> */}
        <View>
          <Carousel />
        </View>
        <View style={styles.IconContainer}>
          <Pressable
            style={styles.categoryBtn}
            onPress={() => {
              if (currentUser) {
                navigation.navigate("Deposit");
              } else {
                setShowModal(true);
              }
            }}
          >
            <View style={styles.IconCategory}>
              <FontAwesome name="cc-mastercard" size={30} color="aqua" />
              <Text style={styles.txtbtn}>Deposit</Text>
            </View>
          </Pressable>
          <Pressable
            style={styles.categoryBtn}
            onPress={() => {
              if (currentUser) {
                navigation.navigate("Withdraw");
              } else {
                setShowModal(true);
              }
            }}
          >
            <View style={styles.IconCategory}>
              <Entypo name="wallet" size={30} color="aqua" />
              <Text style={styles.txtbtn}>Withdraw</Text>
            </View>
          </Pressable>
          <Pressable
            style={styles.categoryBtn}
            onPress={() => handleNavigation("Exchange")}
          >
            <View style={styles.IconCategory}>
              <FontAwesome5 name="exchange-alt" size={30} color="aqua" />
              <Text style={styles.txtbtn}>Exchange</Text>
            </View>
          </Pressable>
          <Pressable
            style={styles.categoryBtn}
            onPress={() => handleNavigation("Referral")}
          >
            <View style={styles.IconCategory}>
              <MaterialIcons name="verified" size={30} color="aqua" />
              <Text style={styles.txtbtn}>Referral</Text>
            </View>
          </Pressable>
        </View>
        <View style={styles.IconContainer2}>
          <Pressable
            style={styles.categoryBtn}
            onPress={() => handleNavigation("DeFi")}
          >
            <View style={styles.IconCategory}>
              <Entypo name="wallet" size={30} color="aqua" />
              <Text style={styles.txtbtn}>DeFi</Text>
            </View>
          </Pressable>
          <Pressable
            style={styles.categoryBtn}
            onPress={() => handleNavigation("DeFi")}
          >
            <View style={styles.IconCategory}>
              <Entypo name="wallet" size={30} color="aqua" />
              <Text style={styles.txtbtn}>Staking</Text>
            </View>
          </Pressable>
          <Pressable
            onPress={() => navigation.navigate("Trade")}
            style={styles.categoryBtn}
          >
            <View style={styles.IconCategory}>
              <Entypo name="user" size={30} color="aqua" />
              <Text style={styles.txtbtn}>Options</Text>
            </View>
          </Pressable>
          <Pressable
            style={styles.categoryBtn}
            onPress={() => handleNavigation("spot")}
          >
            <View style={styles.IconCategory}>
              <MaterialIcons name="support-agent" size={30} color="aqua" />
              <Text style={styles.txtbtn}>Support</Text>
            </View>
          </Pressable>
        </View>

        {/** *PopularCrypto/** */}
        <View
          style={{
            paddingHorizontal: 15,
            paddingBottom: 5,
          }}
        >
          <Text
            style={{
              fontWeight: "700",
              fontSize: 20,
            }}
          >
            Cryptocurrency
          </Text>
        </View>
        <View
          style={{
            flex: 1,
            flexDirection: "row",
            justifyContent: "center",
            width: "100%",
            height: "100%",
            backgroundColor: "white",
          }}
        >
          <FlatList
            data={coins}
            keyExtractor={(item) => item.id}
            renderItem={({ item, index }) => {
              let priceColor =
                item.price_change_percentage_7d_in_currency == 0
                  ? "grey"
                  : item.price_change_percentage_7d_in_currency > 0
                    ? "#2ebd85"
                    : "#df294a";
              return (
                <Pressable
                  onPress={() => {
                    if (currentUser) {
                      navigation.navigate("Trade", {
                        coinId: item.id,
                        itemSymbol: item.symbol,
                        priceColor,
                      });
                    } else {
                      setShowModal(true);
                    }
                  }}
                >
                  <View
                    style={{
                      flexDirection: "row",
                      marginBottom: 15,
                      marginTop: 15,
                      alignSelf: "center",
                      alignItems: "center",
                    }}
                  >
                    {/*coins*/}
                    <Image
                      source={{ uri: item.image }}
                      style={{
                        height: 40,
                        width: 40,
                        marginRight: 20,
                      }}
                    />
                    <View
                      style={{
                        flex: 1,
                        flexDirection: "column",
                        alignItems: "center",
                        alignSelf: "center",
                      }}
                    >
                      <Text
                        style={{
                          color: "black",
                          fontSize: 18,
                          textTransform: "uppercase",
                          fontWeight: "bold",
                        }}
                      >
                        {item.symbol}USDT
                      </Text>

                      <View
                        style={{
                          flexDirection: "row",
                          justifyContent: "flex-center",
                          alignItems: "center",
                          alignSelf: "center",
                        }}
                      >
                        <Text
                          style={{
                            textTransform: "uppercase",
                            color: "gray",
                            alignItems: "center",
                            marginRight: 5,
                          }}
                        >
                          {item.symbol}
                        </Text>
                        <Text
                          style={{
                            paddingHorizontal: 3,
                            backgroundColor: "aqua",
                            textAlign: "center",
                          }}
                        >
                          10X
                        </Text>
                      </View>
                    </View>
                    {/*linechart*/}
                    <BottomSheetModal
        ref={BottomSheetModalRef}
        index={0}
        snapPoints={snapPoints}
        >
          <View>
            <Text>Hello and Welcome</Text> </View>
        </BottomSheetModal>

                    {/*linechart*/}
                    <View
                      style={{
                        flex: 1,
                        alignItems: "center",
                        alignSelf: "center",
                        alignItems: "center",
                        marginLeft: 30,
                        marginRight: 30,
                      }}
                    >
                      <LineChart
                        withVerticalLabels={false}
                        withHorizontalLabels={false}
                        withDots={false}
                        withInnerLines={false}
                        withVerticaLines={false}
                        withOutlerLines={false}
                        withShadow={false}
                        data={{
                          datasets: [
                            {
                              data: item.sparkline_in_7d.price,
                            },
                          ],
                        }}
                        width={100}
                        height={60}
                        chartConfig={{
                          color: () => priceColor,
                          backgroundGradientFromOpacity: 0,
                          backgroundGradientToOpacity: 0,
                          propsForBackgroundLines: {
                            strokeDasharray: "1",
                            strokeWidth: 0, // If you put 0 in the value no line is displayed
                            strokeDasharray: "1",
                            strokeWidth: 0, // If you put 0 in the value no line is displayed
                            stroke: `rgba(0, 0, 0, 0)`,
                          },
                        }}
                        bezier
                        style={{
                          paddingRight: 0,
                        }}
                      />
                    </View>

                    {/*figures*/}
                    <View
                      style={{
                        flex: 1,
                        alignItems: "center",
                        alignSelf: "center",
                        justifyContent: "flex-end",
                      }}
                    >
                      <Text
                        style={{
                          color: "black",
                          fontSize: 20,
                          fontWeight: "bold",
                        }}
                      >
                        {item.current_price}
                      </Text>

                      <View
                        style={{
                          flexDirection: "row",
                          alignSelf: "center",
                          alignItems: "center",
                        }}
                      >
                        {item.price_change_percentage_7d_in_currency != 0 && (
                          <Feather
                            name="arrow-up"
                            size={15}
                            style={{
                              color: priceColor,
                              transform:
                                item.price_change_percentage_7d_in_currency > 0
                                  ? [{ rotate: "45deg" }]
                                  : [{ rotate: "125deg" }],
                            }}
                          />
                        )}
                        <Text
                          style={{
                            marginLeft: 5,
                            color: priceColor,
                            fontWeight: "bold",
                          }}
                        >
                          {" "}
                          {item.price_change_percentage_7d_in_currency.toFixed(
                            2
                          )}
                          %
                        </Text>
                      </View>
                    </View>
                    {/*figures*/}
                  </View>
                </Pressable>
              );
            }}
            style={{ height: "100%", width: "100%" }}
          />
        </View>
        <AuthModal
          showModal={showModal}
          closeModal={closeModal}
          navigation={navigation}
        />
      </ScrollView>
    </SafeAreaView>
    </BottomSheetModalProvider>
  );
}

function mapStateToProps(state) {
  return {
    coins: state.marketReducer.coins,
    state: state,
  };
}

function mapDispatchToProps(dispatch) {
  return {
    getCoinMarket: (
      currency,
      coinList,
      orderBy,
      sparkline,
      priceChangePerc,
      perPage,
      page
    ) => {
      return dispatch(
        getCoinMarket(
          currency,
          coinList,
          orderBy,
          sparkline,
          priceChangePerc,
          perPage,
          page
        )
      );
    },
  };
}

export default connect(mapStateToProps, mapDispatchToProps)(Home);

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  IconContainer: {
    flexDirection: "row",
    width: "95%",
    alignSelf: "center",
    paddingTop: 20,
  },
  IconContainer2: {
    flexDirection: "row",
    width: "95%",
    alignSelf: "center",
    paddingTop: 20,
    paddingBottom: 20,
  },
  categoryBtn: {
    flex: 1,
    width: "30%",
    marginHorizontal: 0,
    alignSelf: "center",
  },
  IconCategory: {
    borderWidth: 0,
    alignItems: "center",
    justifyContent: "center",
    alignSelf: "center",
    width: 70,
    height: 70,
  },
  authcontainer: {
    flexDirection: "column",
    width: "95%",
    alignSelf: "center",
    marginTop: 3,
    marginBottom: 10,
    borderRadius: 5,
    padding: 10,
    borderColor: "black",
    borderStyle: "solid",
    borderWidth: 0.5,
  },
  authtext: {
    paddingTop: 15,
    paddingLeft: 5,
    paddingBottom: 10,
    fontSize: 18,
    fontWeight: "bold",
  },
  authtext2: {
    color: "#D3D3D3",
    fontSize: 12,
    marginLeft: 5,
    paddingBottom: 5,
    flexDirection: "column",
  },
  buttoncontainer: {
    flexDirection: "row",
    position: "relative",
    marginBottom: 10,
  },
  btn1: {
    marginTop: 10,
    marginLeft: 5,
    padding: 5,
    backgroundColor: "aqua",
    borderRadius: 15,
    width: 100,
    height: 30,
  },
  textbtn: {
    textAlign: "center",
    fontSize: 13,
    lineHeight: 21,
    fontWeight: "bold",
    letterSpacing: 0.25,
    color: "white",
  },
  btn2: {
    marginTop: 10,
    marginLeft: 5,
    padding: 5,
    backgroundColor: "#D3D3D3",
    borderRadius: 15,
    width: 100,
    height: 30,
  },
  textbtn2: {
    textAlign: "center",
    fontSize: 13,
    lineHeight: 21,
    fontWeight: "bold",
    letterSpacing: 0.25,
    color: "white",
  },
  modalContainer: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    backgroundColor: "rgba(0, 0, 0, 0.5)",
  },
  modalContent: {
    backgroundColor: "white",
    padding: 20,
    borderRadius: 10,
    alignItems: "center",
  },
  modalText: {
    fontSize: 16,
    marginBottom: 20,
    textAlign: "center",
  },
  closeButton: {
    alignSelf: "flex-end",
    marginBottom: 5,
  },
  closeButtonText: {
    color: "black",
    fontWeight: "bold",
  },
});
