// Trade2.js
import React, { useEffect, useRef, useState } from 'react';
import { createChart } from 'lightweight-charts';
import { View, StyleSheet, Text, TouchableOpacity, Image, Dimensions, Modal } from 'react-native';
import axios from 'axios';
import { api_url } from '../config';
import Slider from '@react-native-community/slider';
import { AntDesign } from '@expo/vector-icons';
import { useDispatch, useSelector } from 'react-redux';
const { width } = Dimensions.get('window');
import Checkbox from 'expo-checkbox';
import { useFonts } from 'expo-font'
import BuyUpModal from '../components/BuyUpModal';
import BuyingSuccessModal from '../components/TradeSuccessModal';
import candlesticksData from '../data/candledataauto.json'
import AsyncStorage from '@react-native-async-storage/async-storage';
import { truncateToTwoDecimals } from '../utils/TruncateTwoDecimals';
import { formatAmountWithCommas } from '../utils/FormatCommas';
// Function to determine font size based on screen width
const getFontSize = (baseSize) => {
  if (width > 800) return baseSize * 1.5; // Example for large screens
  if (width > 600) return baseSize * 1.25; // Example for medium screens
  return baseSize; // Example for small screens
};
const Trade2 = ({ route }) => {
  const { isActive } = useSelector(state => state.chartReducer);
  const chartContainerRef = useRef(null);
  const chartRef = useRef(null);
  const [cindex, setCIndex] = useState(0);
  const [data, setData] = useState([]);
  const [minimumBalance, setMinimumBalance] = useState(0);
  const [selectedButtonIndex, setSelectedButtonIndex] = useState(0);
  const [selectedButtonIndexVol, setSelectedButtonIndexVol] = useState(0);
  const [leverage, setLeverage] = useState(20);
  const [isTradeStart, setIsTradeStart] = useState(false);
  const [selectedVolume, setSelectedVolume] = useState({ label: '50', value: 50 });
  const [selectedCycle, setSelectedCycle] = useState({ "percentage": 3, "time": 30 });
  const [isLoading, setIsDataLoading] = useState(false); // Default frequency
  const [index, setIndex] = useState(0);
  const [candlesticksdata, setcandleSticksData] = useState(0);
  const [frequency, setFrequency] = useState('1h'); // Default frequency
  const [chartRefresh, setChartRefresh] = useState(false); // Default frequency
  const candlestickSeriesRef = useRef(null);
  const [currentPrice, setCurrentPrice] = useState(0); // Default frequency
  const [totalBalance, setTotalBalance] = useState(0); // Default frequency
  const [historicalData, setHistoricalData] = useState([]); // Default frequency
  const [entrypoint, setEntryPoint] = useState(0); // Default frequency
  const [currentBalance, setCurrentBalance] = useState(0); // Default frequency
  const [walletFetched, setWalletFetched] = useState(false);
  const [buyup, setBuyUp] = useState(null);
  const [closePrice, setClosePrice] = useState(0);
  const [startPrice, setStartPrice] = useState(0);
  const [amountError, setAmountError] = useState(false);
  const [tab, setTab] = useState('current');
  // const [time, setTime] = useState(30); // Initialize the timer to 30 seconds
  // const [isActive, setIsActive] = useState(false); // Timer is not active initially
  const closeModal = () => {
    setShowModal(false);
    setData([])
    setCIndex(0)
    setIsTradeStart(false)
  };
  // const [GoogleFonts] = useFonts({
  //   'Rubik-Black': require('../assets/fonts/Rubik-Medium.ttf')
  // })
  // Fetch prices when component mounts and when frequency changes
  // useEffect(() => {
  //   let timer;
  //   console.log(new Date().toISOString(), 'na yar update')

  //   if (isActive && time > 0) {
  //     timer = setInterval(() => {
  //       dispatch({ type: SET_TIME, payload: time - 1 });
  //     }, 1000);
  //   } else if (time === 0) {
  //     // Timer has finished
  //     UpdateWallet();
  //     setClosePrice(currentPrice);
  //     dispatch({ type: SET_ISACTIVE, payload: false });
  //     dispatch({ type: SET_TIME, payload: Number(selectedCycle.time) });
  //   }

  //   return () => {
  //     if (timer) clearInterval(timer); // Clean up interval
  //   };
  // }, [isActive, time, selectedCycle.time, currentPrice, dispatch]);

  // Function to retrieve time from local storage
  const getTimeFromLocalStorage = async () => {
    try {
      const keys = ['savedTime', 'tab', 'entryPoint', 'isTradeStart', 'currentBalance','percentage'];
      const items = await AsyncStorage.multiGet(keys);
      setTab(items[1][1])
      setEntryPoint(Number(items[2][1]))
      setIsTradeStart(Boolean(items[3][1]))
      setCurrentBalance(Number(items[4][1]))
      if (items[0][1] !== null) {
        return [items[0][1],Number(items[5][1]), Number(items[4][1])];
      }else {
        return [30,3,50]
      }
    } catch (error) {
      return null;
    }
  };


  function parseTimeStringToSeconds(timeString) {
    if (!timeString) {
      // Return 0 or any default value if the timeString is null or undefined
      return 0;
    }

    const [hours, minutes, seconds] = timeString.split(':').map(Number);
    return hours * 3600 + minutes * 60 + seconds;
  }

  // Function to get the difference in seconds between two time strings
  function getTimeDifferenceInSeconds(timeString1, timeString2) {
    const seconds1 = parseTimeStringToSeconds(timeString1);
    const seconds2 = parseTimeStringToSeconds(timeString2);

    // Return the absolute difference in seconds
    return Math.abs(seconds1 - seconds2);
  }

  useEffect(() => {
    const updateTime = async () => {
      const now = new Date();
      const hours = now.getHours().toString().padStart(2, '0');
      const minutes = now.getMinutes().toString().padStart(2, '0');
      const seconds = now.getSeconds().toString().padStart(2, '0');
  
      try {
        const [localtime, percentage, vol] = await getTimeFromLocalStorage();
  
        if (`${hours}:${minutes}:${seconds}` < localtime) {
          const secondsDifference = getTimeDifferenceInSeconds(`${hours}:${minutes}:${seconds}`, localtime);
          setSelectedCycle((prevCycle) => ({
            ...prevCycle,
            time: secondsDifference,
            percentage: percentage,
          }));
          setSelectedVolume((prevCycle) => ({
            ...prevCycle,
            label: vol,
            value: vol,
          }));
        }
  
        setIndex(`${hours}:${minutes}:${seconds}`);
  
        if (`${hours}:${minutes}:${seconds}` === localtime || `${hours}:${minutes}:${seconds}` > localtime) {
          await AsyncStorage.setItem('tradeModal', 'true');
          setEntryPoint(0);
          setTab('current');
          UpdateWallet();
        }
      } catch (error) {
        console.error('Error in updateTime:', error);
      }
    };
  
    // Update the time immediately when the component mounts
    updateTime();
  
    // Set up an interval to update the time every second
    const intervalId = setInterval(updateTime, 1000);
  
    // Clear the interval when the component unmounts
    return () => clearInterval(intervalId);
  }, [index]);
  

  const startTimer = async () => {
    // setTime(selectedCycle.time);
    // setIsActive(true);
    // dispatch({type:SET_ISACTIVE, payload:true})
    // setStartPrice(currentPrice)
    const now = new Date();
    const newTime = new Date(now.getTime() + selectedCycle.time * 1000);
    const hours = newTime.getHours().toString().padStart(2, '0');
    const minutes = newTime.getMinutes().toString().padStart(2, '0');
    const seconds = newTime.getSeconds().toString().padStart(2, '0');
    const timeString = `${hours}:${minutes}:${seconds}`;
    console.log(selectedCycle, 'ethy masla ay')
    console.log(timeString)
    try {
      const items = [
        ['savedTime', timeString],
        ['tab', 'position'],
        ['entryPoint', currentPrice],
        ['isTradeStart', true],
        ['currentBalance', selectedVolume?.value],
        ['percentage',selectedCycle.percentage],
        ['startPrice', currentPrice],
        ['totalTime', selectedCycle.time],
        ['startMargin', selectedVolume.value],
      ];
      await AsyncStorage.multiSet(items);
    } catch (error) {
      console.error('Failed to save multiple items:', error);
    }
  };
  useEffect(() => {
    switch (selectedButtonIndex) {
      case 0:
        setMinimumBalance(50);
        break;
      case 1:
        setMinimumBalance(500);
        break;
      case 2:
        setMinimumBalance(2000);
        break;
      case 3:
        setMinimumBalance(9000);
        break;
      case 4:
        setMinimumBalance(12000);
        break;
      default:
        setMinimumBalance(15000);
        break;
    }
  }, [selectedButtonIndex]);


  // Function to retrieve time from local storage

  useEffect(() => {
    const fetchPrices = async () => {
      try {
        const response = await axios.post(`${api_url}/trade/prices`, { frequency });
        setIsDataLoading(false)
        setHistoricalData(response.data);
      } catch (error) {
        console.error('Error fetching prices:', error);
      }
    };

    fetchPrices();
  }, [frequency, chartRefresh]); // Re-fetch if frequency changes

  useEffect(() => {
    if (historicalData.length > 0 && chartContainerRef.current) {
      chartRef.current = createChart(chartContainerRef.current, { height: 400 });
      candlestickSeriesRef.current = chartRef.current.addCandlestickSeries();

      // Convert date string to timestamp and format the time
      const formattedHistoricalData = historicalData.map(data => ({
        ...data,
        time: new Date(data.time).getTime() / 1000,
      }));

      // Set initial historical data
      candlestickSeriesRef.current.setData(formattedHistoricalData);

      // WebSocket connection
      const ws = new WebSocket(`wss://stream.binance.com:9443/ws/btcusdt@kline_${frequency}`);

      ws.onmessage = (event) => {
        const message = JSON.parse(event.data);
        const candlestick = message.k;

        const newCandle = {
          open: parseFloat(candlestick.o),
          high: parseFloat(candlestick.h),
          low: parseFloat(candlestick.l),
          close: parseFloat(candlestick.c),
          time: Math.floor(candlestick.t / 1000), // convert to seconds
        };
        setCurrentPrice(newCandle.close);
        setWalletFetched(false); // Mark that getWallet has been called
        candlestickSeriesRef.current.update(newCandle);
      };

      return () => {
        ws.close();
        chartRef.current.remove();
      };
    }
  }, [historicalData, frequency]);

  const walletId = useSelector(
    (state) => state?.userReducer?.currentUser?.walletId?._id
  );

  const getWallet = async () => {
    let btcUnit
    try {
      const response = await axios.post(`${api_url}/user/getWallet`, {
        walletId,
      });
      if (response?.data?.status === 200) {
        let arr = response?.data?.wallet?.currentBalance.sort(
          (a, b) => b.amount - a.amount
        );
        btcUnit = arr.find((item) => item?.name === "BTC")
        const apiKey =
          "685419b6bedfb725bb6af07ed3dd6fef8f20a83f05c066d1eb20a10c563c7801";
        const fromBtc = await axios.get(`https://min-api.cryptocompare.com/data/price?fsym=btc&tsyms=usd&api_key=${apiKey}`)
        await AsyncStorage.setItem("totalAmount", Number(btcUnit?.amount) * Number(fromBtc.data?.USD))
        await AsyncStorage.setItem("BTC", fromBtc.data?.USD)
        setCurrentBalance(btcUnit?.amount)
        setTotalBalance(Number(btcUnit?.amount) * Number(fromBtc.data?.USD))

      }
    } catch (error) {
      console.log('EROOROROOROROOR', error);
    }
  };

  // console.log(parseFloat(totalBalance) + parseFloat(calculatePnL(currentBalance, calculateROE(entrypoint, currentPrice, currentBalance))))
  const UpdateWallet = async () => {
    const vol = await AsyncStorage.getItem("currentBalance")
    const per = await AsyncStorage.getItem("percentage")
    const calMargin = (vol * Number(per)) / 100
    const totalAmount = await AsyncStorage.getItem("totalAmount")
    const BTC = await AsyncStorage.getItem("BTC")
    console.log(vol,per,totalAmount, BTC)
    const calculatedBalance = (calMargin + Number(totalAmount)) / Number(BTC)
    try {
      const response = await axios.post(`${api_url}/user/updateWallet`, {
        id: walletId, amount: calculatedBalance, name: 'BTC'
      });
      if (response?.data?.status === 200) {
        getWallet()
        setEntryPoint(0)
        const keys = ['savedTime', 'tab', 'entryPoint', 'isTradeStart', 'currentBalance',];
        await AsyncStorage.multiRemove(keys);
        setSelectedButtonIndex(0)
        setSelectedButtonIndexVol(0)
        // await AsyncStorage.setItem('totalTime',30);
      }
    } catch (error) {
      console.log('EROOROROOROROOR', error);
    }
  };

  useEffect(() => {
    if (!walletFetched && totalBalance === 0) {
      getWallet();
      setWalletFetched(true); // Mark that getWallet has been called
    }
  }, [currentPrice]);

  const [modalVisible, setModalVisible] = useState(false);
  const [percentage, setPercentage] = useState(0.1);
  const [showModal, setShowModal] = useState(false);
  const { coinId, itemSymbol, priceColor } = route?.params || {
    coinId: 'bitcoin',
    itemSymbol: 'BTC',
    priceColor: '#2ebd85',
  };
  const toggleModal = () => {
    setModalVisible(!modalVisible);
    setEntryPoint(currentPrice)
    setTab('position')
    setCurrentBalance(selectedAmount)
  };

  const handleValueChange = (value) => {
    setPercentage(value);
  };

  const handleSelectVolume = (volumeData) => {
    setSelectedVolume(volumeData);
  };

  const handleSelectCycle = (cycleData) => {
    setSelectedCycle(cycleData);
  };
  const startTrade = async () => {
    if (minimumBalance > selectedVolume?.value) {
      setAmountError(true)
      return
    } else {
      setIsTradeStart(true)
      setAmountError(false)
      setCurrentBalance(selectedVolume?.value)
      setShowModal(false)
      startTimer()
    }

  }
  // useEffect(() => {
  //   getCustomData()
  // }, [])


  // Function to generate dynamic data
  function generatePnlRoiData(time, percentage, amount) {
    const exactPnl = (percentage / 100) * amount;
    const data = [];
    let totalPnl = 0;

    for (let i = 1; i < time; i++) {
      const maxFluctuation = amount * 0.01;
      const pnl = (Math.random() * 2 - 1) * maxFluctuation;
      const isPositive = pnl > 0;
      totalPnl += pnl;
      data.push({ time: i, pnl: pnl.toFixed(2), roi: ((pnl / amount) * 100).toFixed(2), isPositive: isPositive });
    }

    const lastPnl = exactPnl;
    const lastRoi = percentage;
    const isPositive = lastPnl > 0;
    data.push({ time: time, pnl: lastPnl, roi: lastRoi, isPositive: isPositive });

    return data;
  }

  useEffect(() => {
    if (isTradeStart) {
      // Generate data based on the provided inputs
      const generatedData = generatePnlRoiData(selectedCycle.time, selectedCycle.percentage, selectedVolume?.value);
      setData(generatedData);
      // Start updating the index every second
      const interval = setInterval(() => {
        setCIndex(prevIndex => {
          if (prevIndex < generatedData.length - 1) {
            return prevIndex + 1;
          } else {
            clearInterval(interval);
            return prevIndex;
          }
        });
      }, 1000);

      return () => clearInterval(interval);
    }
  }, [isTradeStart]);
  // console.log(isTradeStart, data, cindex)
  const selectedAmount = (percentage / 100) * currentBalance;
  return <View >
    <BuyingSuccessModal
      buyup={buyup}
      setCIndex={setCIndex}
      setData={setData}
      setIsTradeStart={setIsTradeStart}
      tab={tab}
    />
    {showModal && (
      <BuyUpModal
        startTrade={startTrade}
        itemSymbol={itemSymbol}
        showModal={showModal}
        closeModal={closeModal}
        onSelectCycle={handleSelectCycle}
        setSelectedButtonIndex={setSelectedButtonIndex}
        selectedButtonIndex={selectedButtonIndex}
        onSelectVolume={handleSelectVolume}
        setSelectedButtonIndexVol={setSelectedButtonIndexVol}
        selectedButtonIndexVol={selectedButtonIndexVol}
        minimumBalance={minimumBalance}
        currentPrice={truncateToTwoDecimals(currentPrice)}
        buyup={buyup}
        amountError={amountError}
        totalBalance={totalBalance}
        truncateToTwoDecimals={truncateToTwoDecimals}
      />
      // </View>
    )}
    <View>
    <View style={{ paddingHorizontal: 20 }}>
        <View>
          <Text style={{ fontSize: 35, fontWeight: '800', color: '#2ebd85', marginBottom: '20px' }}>
            {formatAmountWithCommas(Number(truncateToTwoDecimals(currentPrice)))}
          </Text>
        </View>
        {/* <Text style={{ marginBottom: '30px' }}>Your Wallet: <Text style={{ fontSize: '18px', fontWeight: '600' }}>{truncateToTwoDecimals(totalBalance)}</Text></Text> */}
      </View>
      <View style={{ display: 'flex', flexDirection: 'row', overflow: 'scroll', backgroundColor: "#ededed" }}>
        <Text style={[styles.chartFilterBtn, { color: frequency === '1m' && 'aqua' }]} onPress={() => setFrequency('1m')}>1m</Text>
        <Text style={[styles.chartFilterBtn, { color: frequency === '5m' && 'aqua' }]} onPress={() => setFrequency('5m')}>5m</Text>
        <Text style={[styles.chartFilterBtn, { color: frequency === '1h' && 'aqua' }]} onPress={() => setFrequency('1h')}>1h</Text>
        <Text style={[styles.chartFilterBtn, { color: frequency === '4h' && 'aqua' }]} onPress={() => setFrequency('4h')}>4h</Text>
        <Text style={[styles.chartFilterBtn, { color: frequency === '1d' && 'aqua' }]} onPress={() => setFrequency('1d')}>1d</Text>
        <Text style={[styles.chartFilterBtn, { color: frequency === '1M' && 'aqua' }]} onPress={() => setFrequency('1M')}>1M</Text>
        <Text style={[styles.chartFilterBtn, { width: '70px' }]} onPress={() => setChartRefresh(!chartRefresh)}>Refresh</Text>
      </View>
    </View>
    <View style={styles.chart} ref={chartContainerRef} />

    {
      entrypoint === 0 && <View style={styles.btnContainer}>
        <TouchableOpacity
          style={[styles.button, styles.buyUpButton]}
          // onPress={startTrade}
          // onPress={openModal}
          //   disabled={currentBalance === 0}
          onPress={async () => {
            setBuyUp(true)
            setShowModal(true)
            setSelectedCycle({ percentage: 3, time: 30 })
            setSelectedVolume({value:50, label:'50'})
            await AsyncStorage.setItem('green', true)
          }}
        >
          <Text style={styles.buttonText}>Buy Up</Text>
        </TouchableOpacity>
        <TouchableOpacity
          style={[styles.button, styles.buyDownButton]}
          // onPress={handleBuyDown}
          // disabled={entrypoint > 0}
          onPress={async() => {
            setBuyUp(false)
            setShowModal(true)
            setSelectedCycle({ percentage: 3, time: 30 })
            setSelectedVolume({value:50, label:'50'})
            await AsyncStorage.setItem('green', false)
          }}
        >
          <Text style={styles.buttonText}>Buy Down</Text>
        </TouchableOpacity>
      </View>
    }
    <View
      style={{
        backgroundColor: 'white',
        justifyContent: 'space-around',
      }}
    >
      <View
        style={{
          flexDirection: 'row',
          justifyContent: 'space-around',
          alignItems: 'center',
          paddingHorizontal: 9
        }}
      >
        <TouchableOpacity onPress={() => setTab('current')}>
          <Text
            style={[
              styles.tabTitle,
              { color: tab === 'current' ? '#424141' : 'silver' },
            ]}
          >
            Open Orders(0)
          </Text>
          {
            tab === 'current' ? <View style={styles.borderBottom} /> : <View style={[styles.borderBottom, { opacity: 0 }]} />
          }
        </TouchableOpacity>
        <TouchableOpacity onPress={() => setTab('position')}>
          <Text
            style={[
              styles.tabTitle,
              { color: tab === 'position' ? '#424141' : 'silver' },
            ]}
          >
            Positions {entrypoint > 0 ? `(1)` : ''}
          </Text>
          {
            tab === 'position' ? <View style={styles.borderBottom} /> : <View style={[styles.borderBottom, { opacity: 0 }]} />
          }
        </TouchableOpacity>
        <TouchableOpacity onPress={() => setTab('futures')}>
          <Text
            style={[
              styles.tabTitle,
              { color: tab === 'futures' ? '#424141' : 'silver' },
            ]}
          >
            Futures Grid
          </Text>
          {
            tab === 'futures' ? <View style={styles.borderBottom} /> : <View style={[styles.borderBottom, { opacity: 0 }]} />
          }
        </TouchableOpacity>
        <TouchableOpacity style={{ width: 70 }}>
          <AntDesign name="addfile" size={15} color="#424141" style={{ textAlign: 'right' }} />
          {
            tab === 'futures1' ? <View style={styles.borderBottom} /> : <View style={[styles.borderBottom, { opacity: 0 }]} />
          }
        </TouchableOpacity>
      </View>
    </View>
    <View style={styles.horizontalDivider} />
    <View style={{
      flex: 1,
      flexDirection: "row",
      padding: 13,
      gap: 5,
      justifyContent: 'space-between'
    }}>
      <View style={{ flexDirection: 'row' }}> 
        <Checkbox
          style={{
            color: "aqua",
            alignSelf: "center",
            width: 13,
            height: 13,
            marginRight: 3,
            borderRadius: 30,
          }}
        />
        <Text style={[styles.hideText, {
          fontWeight: "500",
          alignSelf: "center",
          color: '#424141'
        }]} >Hide other symbols</Text>
      </View>
      <View>
        <TouchableOpacity style={styles.btnCloseAll}>
          <Text style={styles.btnText}>Close All</Text>
        </TouchableOpacity>
      </View>
    </View>
    <View style={styles.horizontalDivider} />

    {
      (tab === "position" && entrypoint > 0) && <View style={styles.positionContainer}>

        <View style={styles.positionHeader}>
          <View style={styles.BBtn}>B</View>
          <Text style={{ marginRight: '3px', marginLeft: '5px', fontWeight: '600', fontSize: getFontSize(14), color: '#424141' }}>BTCUSDT</Text>
          <Text style={{ fontSize: getFontSize(9), padding: 2, paddingRight: getFontSize(2), marginRight: '2px', fontWeight: '600', backgroundColor: '#f5f5f5', color: '#424141', paddingHorizontal: 5 }}>Perp</Text>
          <View style={{ backgroundColor: '#f5f5f5', flexDirection: 'row' }}>
            <Text style={{ fontWeight: '600', fontSize: getFontSize(9), padding: 2, color: '#424141', paddingHorizontal: 5 }}>Cross {leverage}x</Text>
          </View>
          <Image source={require('../assets/lines.png')} style={{ width: getFontSize(21), height: getFontSize(21) }} />
          <Image source={require('../assets/share-1.png')} style={{ width: getFontSize(21), height: getFontSize(21), marginLeft: '8px', position: 'absolute', right: 0 }} />
        </View>
        <View style={styles.PRSection}>
          <View style={styles.pnlContainer}>
            <Text style={[styles.pnlTitle, { borderBottomWidth: 1, borderBottomColor: "#b0b3b5", borderStyle: 'dotted' }]}>PNL (USDT)</Text>
            <Text style={[styles.PnlPrice, { color: entrypoint > 0 ? data[cindex]?.pnl > 0 ? '#24b54b' : '#f7584d' : 'black' }]}>{entrypoint > 0 ? formatAmountWithCommas(Number(data[cindex]?.pnl)) : '0.0'}</Text>
          </View>
          <View style={styles.roeContainer}>
            <Text style={[styles.pnlTitle, { borderBottomWidth: 1, borderBottomColor: "#b0b3b5", borderStyle: 'dotted' }]}>ROI</Text>
            <Text style={[styles.PnlPrice, { color: entrypoint > 0 ? buyup ? data[cindex]?.roi > 0 ? '#24b54b' : '#f7584d' : -data[cindex]?.roi > 0 ? '#24b54b' : '#f7584d' : 'black' }]}>{entrypoint > 0 ? buyup ? data[cindex]?.roi : -data[cindex]?.roi : '0.0'}%</Text>
          </View>
        </View>
        <View style={styles.SMRSection}>
          <View style={styles.pnlContainer}>
            <Text style={[styles.pnlTitle, { borderBottomWidth: 1, borderBottomColor: "#b0b3b5", borderStyle: 'dotted' }]}>Size (USDT)</Text>
            <Text style={styles.pnlPrice}>{entrypoint > 0 ? formatAmountWithCommas(Number(truncateToTwoDecimals(leverage * currentBalance))) : "0.0"}</Text>
          </View>
          <View style={styles.pnlContainer}>
            <Text style={[styles.pnlTitle, { width: getFontSize(95) }]}>Margin (USDT)</Text>
            <Text style={styles.pnlPrice}>{entrypoint > 0 ?formatAmountWithCommas(Number(truncateToTwoDecimals(currentBalance))) : '0.0'}</Text>
          </View>
          <View style={styles.roeContainer}>
            <Text style={[styles.pnlTitle, { borderBottomWidth: 1, borderBottomColor: "#b0b3b5", borderStyle: 'dotted' }]}>Margin Ratio</Text>
            <Text style={[styles.pnlPrice, { color: '#24b54b' }]}>{entrypoint > 0 ? '30' : '0'}%</Text>
          </View>
        </View>
        <View style={[styles.SMRSection, { marginVertical: '20px' }]}>
          <View style={styles.pnlContainer}>
            <Text style={[styles.pnlTitle, { borderBottomWidth: 1, borderBottomColor: "#b0b3b5", borderStyle: 'dotted' }]}>Entry Price (USDT)</Text>
            <Text style={styles.pnlPrice}>{formatAmountWithCommas(Number(entrypoint))}</Text>
          </View>
          <View style={styles.pnlContainer}>
            <Text style={styles.pnlTitle}>Mark Price (USDT)</Text>
            <Text style={styles.pnlPrice}>{entrypoint > 0 ? formatAmountWithCommas(Number(truncateToTwoDecimals(currentPrice))) : '0.0'}</Text>
          </View>
          <View style={styles.roeContainer}>
            <Text style={styles.pnlTitle}>Liq. Price (USDT)</Text>
            <View style={styles.pnlPrice}>
              <View style={{ marginRight: 5 }}>--</View>
            </View>
            <View style={{ position: 'relative', marginRight: 5 }}>
              <View style={{ position: 'absolute', right: 2, bottom: -5 }}>
                -
              </View>
              <View style={{ position: 'absolute', right: 7, bottom: -5 }}>
                -
              </View>
            </View>
          </View>
        </View>
      </View>
    }
    {
      (tab === "position" && entrypoint > 0) && <View style={styles.pbtnContainer}>
        <TouchableOpacity style={[styles.btn]}>
          <Text style={styles.btnText}>Leverage</Text>
        </TouchableOpacity>
        <TouchableOpacity style={[styles.btn]}>
          <Text style={styles.btnText}>TP/SL</Text>
        </TouchableOpacity>
        <TouchableOpacity style={[styles.btn]} onPress={() => entrypoint > 0 && UpdateWallet()}>
          <Text style={styles.btnText}>Close</Text>
        </TouchableOpacity>
        <TouchableOpacity style={[styles.btn]} onPress={() => entrypoint > 0 && UpdateWallet()}>
          <Text style={styles.btnText}>Reverse</Text>
        </TouchableOpacity>
      </View>
    }

  </View>;
};

const styles = StyleSheet.create({
  chart: {
    width: '100%',
    height: 400
  },

  chartFilterBtn: {
    backgroundColor: 'transparent',
    color: 'white',
    textAlign: 'center',
    width: '50px',
    margin: '10px',
    padding: '1px',
  },
  positionContainer: {
    paddingHorizontal: '13px',
    marginTop: 17
  },

  positionHeader: {
    display: 'flex',
    flexDirection: 'row',
    alignItems: 'center'
  },
  selectContainer: {
    flex: 1,
    paddingHorizontal: '10px'
  },
  PRSection: {
    display: 'flex',
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginVertical: '20px'
  },
  picker: {
    height: 30,
    width: 50,
  },
  pnlContainer: {
    textAlign: 'left',
  },
  roeContainer: {
    display: 'flex',
    alignItems: 'flex-end',
  },
  pnlPrice: {
    fontWeight: '700',
    fontSize: getFontSize(11),
    color: '#424141',
    // fontFamily:'Rubik-Black'
  },
  PnlPrice: {
    fontWeight: '700',
    fontSize: getFontSize(15)
  },
  roeTitle: {
    fontWeight: '600'
  },
  pnlTitle: {
    fontWeight: '600',
    fontSize: getFontSize(11),
    color: '#b0b3b5'
  },
  SMRSection: {
    display: 'flex',
    flexDirection: 'row',
    justifyContent: 'space-between'
  },
  buyUpButton: {
    backgroundColor: '#2ebd85',
  },
  buyDownButton: {
    backgroundColor: '#df294a',
  },
  buttonText: {
    color: 'white',
    fontSize: 16,
    fontWeight: 'bold',
  },
  btnContainer: {
    paddingHorizontal: '10%',
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  button: {
    width: 100,
    height: getFontSize(35),
    // borderRadius: 10,
    justifyContent: 'center',
    alignItems: 'center',
    marginVertical: 10,
  },

  pbtnContainer: {
    flexDirection: 'row',
    justifyContent: 'space-around',
    width: '100%',
    paddingHorizontal: 10,
    marginBottom: 50,
  },
  pbtn: {
    width: (width - 60) / 3, // Adjust width to fit within the container
    height: getFontSize(30),
    borderWidth: 1,
    borderRadius: 5,
    justifyContent: 'center',
    alignItems: 'center',
  },
  btnText: {
    fontWeight: '700',
    textAlign: 'center',
    fontSize: getFontSize(12),
    color: '#424141'
  },
  BBtn: {
    backgroundColor: '#24b54b',
    paddingHorizontal: 4,
    color: 'white',
    fontWeight: '600',
    borderRadius: 3,
    // fontFamily:'Rubik-Black'
  },
  modalContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  mButton: {
    // backgroundColor: '#59e37d',
    padding: 10,
    borderRadius: 5,
    width: 100,
    marginTop: 10
  },
  buttonText: {
    color: '#fff',
    fontWeight: 'bold',
    textAlign: 'center',
    // fontFamily:'Rubik-Black'
  },
  modalOverlay: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: 'rgba(0,0,0,0.5)',
  },
  modalContainer: {
    backgroundColor: 'white',
    padding: 20,
    borderRadius: 10,
    alignItems: 'center',
  },
  mTitle: {
    fontSize: 24,
    fontWeight: 'bold',
    marginBottom: 20,
  },
  balanceText: {
    fontSize: 18,
    marginBottom: 20,
  },
  slider: {
    width: '100%',
    height: 40,
  },
  percentageText: {
    fontSize: 18,
    marginVertical: 10,
  },
  amountText: {
    fontSize: 18,
    marginTop: 20,
  },
  borderBottom: {
    borderBottomWidth: 3,
    borderColor: '#FFD700',
    width: 20, // Adjust the width of the border as needed
    alignSelf: 'center',
    marginTop: 4, // Adjust the space between the text and the border
  },
  horizontalDivider: {
    height: 1,
    backgroundColor: '#e0e0e0',
  },
  btn: {
    backgroundColor: '#ededed',
    paddingHorizontal: 19,
    paddingVertical: 10,
    borderRadius: 5,
    fontSize: getFontSize(11)
  },
  btnCloseAll: {
    backgroundColor: '#ededed',
    paddingHorizontal: 8,
    paddingVertical: 5,
    borderRadius: 5,
    fontSize: getFontSize(12)
  },
  hideText: {
    fontSize: getFontSize(12)
  },
  tabTitle: {
    fontWeight: '700',
    fontSize: getFontSize(12)
  },
  leverageContainer: {
    display: 'flex',
    flexDirection: 'row'
  },
});

export default Trade2;
