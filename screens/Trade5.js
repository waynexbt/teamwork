// Trade2.js
import React, { useEffect, useRef, useState } from 'react';
import { createChart } from 'lightweight-charts';
import { View, StyleSheet, Text, TouchableOpacity, Image, Dimensions, Modal } from 'react-native';
import axios from 'axios';
import { api_url } from '../config';
import Slider from '@react-native-community/slider';
import { AntDesign } from '@expo/vector-icons';
import { useSelector } from 'react-redux';
const { width } = Dimensions.get('window');
import Checkbox from 'expo-checkbox';
import { useFonts } from 'expo-font'
import BuyUpModal from '../components/BuyUpModal';
import BuyingSuccessModal from '../components/TradeSuccessModal';
import candlesticksData from '../data/candledataauto.json'

// Function to determine font size based on screen width
const getFontSize = (baseSize) => {
  if (width > 800) return baseSize * 1.5; // Example for large screens
  if (width > 600) return baseSize * 1.25; // Example for medium screens
  return baseSize; // Example for small screens
};
const Trade2 = ({ route }) => {
  const chartContainerRef = useRef(null);
  const chartRef = useRef(null);
  const [index, setIndex] = useState(0);
  const [minimumBalance, setMinimumBalance] = useState(0);
  const [selectedButtonIndex, setSelectedButtonIndex] = useState(0);
  const [selectedButtonIndexVol, setSelectedButtonIndexVol] = useState(0);
  const [leverage, setLeverage] = useState(20);
  const [selectedVolume, setSelectedVolume] = useState({label:'50', value:50});
  const [selectedCycle, setSelectedCycle] = useState({ "percentage": 3, "time": 30 });
  const [isLoading, setIsDataLoading] = useState(false); // Default frequency
  const [frequency, setFrequency] = useState('1h'); // Default frequency
  const [candlesticksdata, setcandleSticksData] = useState(0);
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
  const [time, setTime] = useState(30); // Initialize the timer to 30 seconds
  const [isActive, setIsActive] = useState(false); // Timer is not active initially
  const [tradeSuccessModal, setTradeSuccessModal] = useState(false); // Timer is not active initially


  const closeModal = () => {
    setShowModal(false);
  };
  const [GoogleFonts] = useFonts({
    'Rubik-Black': require('../assets/fonts/Rubik-Medium.ttf')
  })
  // Fetch prices when component mounts and when frequency changes
  useEffect(() => {
    let timer;
    if (isActive && time > 0) {
      timer = setInterval(() => {
        setTime((prevTime) => prevTime - 1);
      }, 1000);
    } else if (time === 0) {
      setIsActive(false);
      UpdateWallet()
      setTradeSuccessModal(true)
      setClosePrice(currentPrice)
      setTime(selectedCycle.time); // Reset the timer to the selected time
    }
    return () => clearInterval(timer);

  }, [isActive, time, selectedCycle.time]);

  useEffect(() => {
    if (chartContainerRef.current) {
      chartRef.current = createChart(chartContainerRef.current, { height: 400 });
      candlestickSeriesRef.current = chartRef.current.addCandlestickSeries();

      // Convert date string to timestamp
      const formattedHistoricalData = historicalData.map(data => ({
        ...data,
        time: new Date(data.time).getTime() / 1000,
      }));

      // Set initial historical data
      candlestickSeriesRef.current.setData(formattedHistoricalData);

      return () => {
        chartRef.current.remove();
      };
    }
  }, []);

  useEffect(() => {
    if (candlesticksdata.length > 0) {
      const intervalId = setInterval(() => {
        if (index < candlesticksdata.length) {
          const newCandle = {
            open: candlesticksdata[index].open,
            high: candlesticksdata[index].high,
            low: candlesticksdata[index].low,
            close: candlesticksdata[index].close,
            time: candlesticksdata[index].time,
          };
          setCurrentPrice(newCandle.close);
          candlestickSeriesRef.current.update(newCandle);
          setIndex(prevIndex => prevIndex + 1);
        } else {
          clearInterval(intervalId); // Stop the interval when all data is displayed
        }
      }, 1000);

      return () => clearInterval(intervalId); // Cleanup on unmount
    }
  }, [index, candlesticksdata]);

  const startTimer = () => {
    setTime(selectedCycle.time);
    setIsActive(true);
    setStartPrice(currentPrice)
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


  function toggleSign(value) {
    return -value;
  }

  function calculateROE(entryPrice, currentPrice, userBalance) {
    const initialValue = entryPrice * userBalance;
    const currentValue = currentPrice * userBalance;
    const roe = ((currentValue - initialValue) / initialValue) * 100;
    return truncateToTwoDecimals(roe);
  }



  function calculatePnL(userBalance, roe) {
    const pnl = userBalance * roe / 100 * leverage;
    if (buyup) {
      return truncateToTwoDecimals(pnl);
    } else {
      return truncateToTwoDecimals(toggleSign(pnl));
    }
  }

  function truncateToTwoDecimals(number) {
    const numberString = number.toString();
    const decimalIndex = numberString.indexOf('.');
    if (decimalIndex === -1 || decimalIndex + 3 > numberString.length) {
      return numberString;
    }
    return numberString.slice(0, decimalIndex + 3);
  }

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
        setCurrentBalance(btcUnit?.amount)
        setTotalBalance(btcUnit?.amount)

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
      setAmountError(false)
      startTimer()
  
      setEntryPoint(currentPrice)
      setCurrentBalance(selectedVolume?.value)
      setTab('position')
      setShowModal(false)
    } 

  }

  function calculateROE(entryPrice, currentPrice, userBalance) {
    const initialValue = entryPrice * userBalance;
    const currentValue = currentPrice * userBalance;
    const roe = ((currentValue - initialValue) / initialValue) * 100;
    return truncateToTwoDecimals(roe);
  }

  function toggleSign(value) {
    return -value;
  }

  function calculatePnL(userBalance, roe) {
    const pnl = userBalance * roe / 100 * leverage;
    if (buyup) {
      return truncateToTwoDecimals(pnl);
    } else {
      return truncateToTwoDecimals(toggleSign(pnl));
    }
  }

  function truncateToTwoDecimals(number) {
    const numberString = number.toString();
    const decimalIndex = numberString.indexOf('.');
    if (decimalIndex === -1 || decimalIndex + 3 > numberString.length) {
      return numberString;
    }
    return numberString.slice(0, decimalIndex + 3);
  }
  
  const UpdateWallet = async () => {
    const calculatedBalance = parseFloat(totalBalance) + parseFloat(calculatePnL(currentBalance, calculateROE(entrypoint, currentPrice, currentBalance)))
    setCurrentBalance(calculatedBalance)
    setTotalBalance(calculatedBalance)
    setEntryPoint(0)
  };

  const getCustomData = async () => {
    setcandleSticksData(candlesticksData)
  };

  useEffect(() => {
    getCustomData()
  }, [])

  const selectedAmount = (percentage / 100) * currentBalance;
  return <View >
    <BuyingSuccessModal
      buyup={buyup}
      showModal={tradeSuccessModal}
      setTradeSuccessModal={setTradeSuccessModal}
      margin={(selectedVolume?.value * selectedCycle.percentage) / 100}
      time={selectedCycle?.time}
      amount={selectedVolume?.value}
      currentPrice={truncateToTwoDecimals(closePrice)}
      startPrice={truncateToTwoDecimals(startPrice)}
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
        currentPrice={truncateToTwoDecimals(currentBalance)}
        buyup={buyup}
        amountError={amountError}
        totalBalance={totalBalance}
      />
      // </View>
    )}
    <Modal
      animationType="slide"
      transparent={true}
      visible={modalVisible}
      onRequestClose={toggleModal}
    >
      <View style={styles.modalOverlay}>
        <View style={styles.modalContainer}>
          <TouchableOpacity onPress={() => setModalVisible(false)} style={{ position: 'absolute', right: 10, backgroundColor: 'red', paddingHorizontal: 10, borderRadius: 5, paddingVertical: 2 }}>
            <Text style={{ color: 'white', fontWeight: '800' }}>X</Text>
          </TouchableOpacity>
          <Text style={[styles.mTitle, { marginTop: 20 }]}>Select Balance Percentage</Text>
          <Text style={styles.balanceText}>Balance: ${totalBalance?.toFixed(2)}</Text>
          <Slider
            style={styles.slider}
            minimumValue={0.1}
            maximumValue={100}
            step={0.1}
            value={percentage}
            onValueChange={handleValueChange}
            minimumTrackTintColor="#1EB1FC"
            maximumTrackTintColor="#8B8B8B"
            thumbTintColor="#1EB1FC"
          />
          <Text style={styles.percentageText}>{percentage}%</Text>
          <Text style={styles.amountText}>Selected Amount: ${selectedAmount?.toFixed(2)}</Text>
          <View style={styles.leverageContainer}>
            <TouchableOpacity style={[styles.btn, { margin: 5, borderWidth: leverage === 20 && 1 }]} onPress={() => setLeverage(20)}>
              <Text>20x</Text>
            </TouchableOpacity>
            <TouchableOpacity style={[styles.btn, { margin: 5, borderWidth: leverage === 100 && 1 }]} onPress={() => setLeverage(100)}>
              <Text>100x</Text>
            </TouchableOpacity>
          </View>
          <TouchableOpacity onPress={toggleModal} style={[styles.mButton, { backgroundColor: buyup ? '#59e37d' : '#df294a' }]}>
            <Text style={styles.buttonText}>{buyup ? 'Buy Up' : 'Buy Down'}</Text>
          </TouchableOpacity>
        </View>
      </View>
    </Modal>
    <View>
      <View style={{ paddingHorizontal: 20 }}>
        <View>
          <Text style={{ fontSize: 35, fontWeight: '800', color: '#2ebd85', marginBottom: '20px' }}>
            {truncateToTwoDecimals(currentPrice)}
          </Text>
        </View>
        {/* <Text style={{ marginBottom: '30px' }}>Your Wallet: <Text style={{ fontSize: '18px', fontWeight: '600' }}>{truncateToTwoDecimals(totalBalance)}</Text></Text> */}
      </View>

      <View style={{ display: 'flex', flexDirection: 'row', overflow: 'scroll' }}>
        <Text style={[styles.chartFilterBtn, { borderColor: frequency === '1m' && '#f7584d' }]} onPress={() => setFrequency('1m')}>1m</Text>
        <Text style={[styles.chartFilterBtn, { borderColor: frequency === '5m' && '#f7584d' }]} onPress={() => setFrequency('5m')}>5m</Text>
        <Text style={[styles.chartFilterBtn, { borderColor: frequency === '1h' && '#f7584d' }]} onPress={() => setFrequency('1h')}>1h</Text>
        <Text style={[styles.chartFilterBtn, { borderColor: frequency === '4h' && '#f7584d' }]} onPress={() => setFrequency('4h')}>4h</Text>
        <Text style={[styles.chartFilterBtn, { borderColor: frequency === '1d' && '#f7584d' }]} onPress={() => setFrequency('1d')}>1d</Text>
        <Text style={[styles.chartFilterBtn, { borderColor: frequency === '1M' && '#f7584d' }]} onPress={() => setFrequency('1M')}>1M</Text>
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
          onPress={() => {
            setBuyUp(true)
            setShowModal(true)
          }}
        >
          <Text style={styles.buttonText}>Buy Up</Text>
        </TouchableOpacity>

        <TouchableOpacity
          style={[styles.button, styles.buyDownButton]}
          // onPress={handleBuyDown}
          // disabled={entrypoint > 0}
          onPress={() => {
            setBuyUp(false)
            setShowModal(true)
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
            marginRight: 3
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
            <Text style={[styles.PnlPrice, { color: entrypoint > 0 ? calculatePnL(currentBalance, calculateROE(entrypoint, currentPrice, currentBalance)) > 0 ? '#24b54b' : '#f7584d' : 'black' }]}>{entrypoint > 0 ? parseFloat(calculatePnL(currentBalance, calculateROE(entrypoint, currentPrice, currentBalance))) : '0.0'}</Text>
          </View>
          <View style={styles.roeContainer}>
            <Text style={[styles.pnlTitle, { borderBottomWidth: 1, borderBottomColor: "#b0b3b5", borderStyle: 'dotted' }]}>ROI</Text>
            <Text style={[styles.PnlPrice, { color: entrypoint > 0 ? buyup ? calculateROE(entrypoint, currentPrice, currentBalance) > 0 ? '#24b54b' : '#f7584d' : -calculateROE(entrypoint, currentPrice, currentBalance) > 0 ? '#24b54b' : '#f7584d' : 'black' }]}>{entrypoint > 0 ? buyup ? parseFloat(calculateROE(entrypoint, currentPrice, currentBalance)) : -parseFloat(calculateROE(entrypoint, currentPrice, currentBalance)) : '0.0'}%</Text>
          </View>
        </View>
        <View style={styles.SMRSection}>
          <View style={styles.pnlContainer}>
            <Text style={[styles.pnlTitle, { borderBottomWidth: 1, borderBottomColor: "#b0b3b5", borderStyle: 'dotted' }]}>Size (USDT)</Text>
            <Text style={styles.pnlPrice}>{entrypoint > 0 ? truncateToTwoDecimals(leverage * currentBalance) : "0.0"}</Text>
          </View>
          <View style={styles.pnlContainer}>
            <Text style={[styles.pnlTitle, { width: getFontSize(95) }]}>Margin (USDT)</Text>
            <Text style={styles.pnlPrice}>{entrypoint > 0 ? truncateToTwoDecimals(currentBalance) : '0.0'}</Text>
          </View>
          <View style={styles.roeContainer}>
            <Text style={[styles.pnlTitle, { borderBottomWidth: 1, borderBottomColor: "#b0b3b5", borderStyle: 'dotted' }]}>Margin Ratio</Text>
            <Text style={[styles.pnlPrice, { color: '#24b54b' }]}>{entrypoint > 0 ? '30' : '0'}%</Text>
          </View>
        </View>
        <View style={[styles.SMRSection, { marginVertical: '20px' }]}>
          <View style={styles.pnlContainer}>
            <Text style={[styles.pnlTitle, { borderBottomWidth: 1, borderBottomColor: "#b0b3b5", borderStyle: 'dotted' }]}>Entry Price (USDT)</Text>
            <Text style={styles.pnlPrice}>{entrypoint}</Text>
          </View>
          <View style={styles.pnlContainer}>
            <Text style={styles.pnlTitle}>Mark Price (USDT)</Text>
            <Text style={styles.pnlPrice}>{entrypoint > 0 ? truncateToTwoDecimals(currentPrice) : '0.0'}</Text>
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
    height: 400,
  },

  chartFilterBtn: {
    backgroundColor: 'black',
    color: 'white',
    textAlign: 'center',
    width: '50px',
    borderRadius: '6px',
    margin: '20px',
    padding: '8px',
    borderWidth: 2,
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
