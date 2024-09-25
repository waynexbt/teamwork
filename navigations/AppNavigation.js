import React from "react";
import { NavigationContainer } from "@react-navigation/native";
import { createNativeStackNavigator } from "@react-navigation/native-stack";
import DrawerNavigation from "./DrawerNavigation";
import {
  Deposit,
  Deposithistory,
  Loan,
  Login,
  Signup,
  Trade,
  USDTERC,
} from "../screens";
import Btc from "../screens/Btc";
import SlipPicture from "../components/LoanSlip";
import AuthModal from "../components/AuthModal";
import TradeProfit from "../components/TradeProfit";
import WithdrawUSDTTRC from "../screens/WithdrawUSDTTRC";
import Usdttrc from "../screens/Usdttrc";
import Eth from "../screens/Eth";
import OtpConfirmation from "../screens/OtpConfirmation";
import DepositSlip from "../components/DepositSlip";
import LoanSlip from "../components/LoanSlip";
import WithdrawalSlip from "../components/WithdrawalSlip";
import LoanHistory from "../screens/LoanHistory";
import Exchange from "../screens/Exchange";
import ViewFullImage from "../components/ViewFullImage";
import Spot from "../screens/Spot";
import Referral from "../screens/Refferal";
import Searchbar from "../screens/Searchbar";
import PrimaryVerificationReview from "../components/PrimaryVerificationReview";
import DepositRecord from "../components/DepositRecord";
import PrimaryVerification from "../screens/PrimaryVerification";
import Usdc from "../screens/Usdc";
import Withdraw from "../screens/Withdraw";
import WithdrawUSDTERC from "../screens/WithdrawUSDTERC";
import WithdrawBTC from "../screens/WithdrawBTC";
import WithdrawETH from "../screens/WithdrawETH";
import WithdrawUSDC from "../screens/WithdrawUSDC";
import WithdrawRecord from "../components/WithdrawRecord";

const Stack = createNativeStackNavigator();

const AppNavigation = () => {
  return (
    <NavigationContainer>
      <Stack.Navigator
        screenOptions={{
          headerShown: false,
        }}
        initialRouteName="Futures"
      >
        <Stack.Screen name="Futures" component={DrawerNavigation} />
        <Stack.Screen name="TradeProfit" component={TradeProfit} />
        <Stack.Screen name="AuthModal" component={AuthModal} />
        <Stack.Screen name="Login" component={Login} />
        <Stack.Screen name="Signup" component={Signup} />
        <Stack.Screen name="Otp" component={OtpConfirmation} />
        <Stack.Screen name="Deposit" component={Deposit} />
        <Stack.Screen name="Loan" component={Loan} />
        <Stack.Screen name="Usdterc" component={USDTERC} />
        <Stack.Screen name="Usdc" component={Usdc} />
        <Stack.Screen name="Usdttrc" component={Usdttrc} />
        <Stack.Screen name="Deposithistory" component={Deposithistory} />
        <Stack.Screen name="LoanHistory" component={LoanHistory} />

        <Stack.Screen name="Btc" component={Btc} />
        <Stack.Screen name="Eth" component={Eth} />
        <Stack.Screen name="Exchange" component={Exchange} />
        <Stack.Screen name="LoanSlip" component={LoanSlip} />
        <Stack.Screen name="DepositSlip" component={DepositSlip} />
        <Stack.Screen name="WithdrawalSlip" component={WithdrawalSlip} />
        <Stack.Screen name="WithdrawUSDTTRC" component={WithdrawUSDTTRC} />
        <Stack.Screen name="WithdrawUSDTERC" component={WithdrawUSDTERC} />
        <Stack.Screen name="WithdrawBTC" component={WithdrawBTC} />
        <Stack.Screen name="WithdrawETH" component={WithdrawETH} />
        <Stack.Screen name="WithdrawUSDC" component={WithdrawUSDC} />
        <Stack.Screen name="spot" component={Spot} />
        <Stack.Screen name="Referral" component={Referral} />
        <Stack.Screen name="Searchbar" component={Searchbar} />
        <Stack.Screen name="Withdraw" component={Withdraw} />

        <Stack.Screen name="ViewFullImage" component={ViewFullImage} />
        <Stack.Screen name="DepositRecord" component={DepositRecord} />
        <Stack.Screen name="WithdrawRecord" component={WithdrawRecord} />
        <Stack.Screen name="PrimaryVerificationReview" component={PrimaryVerificationReview} />
        <Stack.Screen name="PrimaryVerification" component={PrimaryVerification} />

      </Stack.Navigator>
    </NavigationContainer>
  );
};

export default AppNavigation;
