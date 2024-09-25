import React, { useEffect, useState } from 'react';
import { View, Text, FlatList, TextInput, StyleSheet } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import DepositRecordCard from '../components/DepositRecordCard';
import { useSelector } from 'react-redux';
import { api_url } from '../config';
import { Ionicons } from '@expo/vector-icons';
import { ScrollView } from "react-native-virtualized-view"



const DepositRecord = ({navigation}) => {
    const user = useSelector((state) => state?.userReducer?.currentUser);
    const token = useSelector((state) => state?.userReducer?.currentUser?.token);
    const [filter, setFilter] = useState('All');
    const [data, setData] = useState(null);
    const filteredData = data?.filter(item => filter === 'All' || item?.status === filter);
    const fetchUserData = async () => {
        try {
            const response = await fetch(`${api_url}/deposit/getAllById/${user?._id}`, {
                method: 'GET',
                headers: {
                    // Add any headers if needed
                    'Authorization': `Bearer ${token}`, // Assuming you need to send an access token
                    'Content-Type': 'application/json',
                },
            });
            const responseData = await response.json();
            console.log(response)
            setData(responseData?.response);
        } catch (error) {
            console.error('Error fetching user data:', error);
        }
    };

    useEffect(() => {
        fetchUserData();
    }, []);


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
            Deposit History
          </Text>
        </View>
            <View style={styles.divider} />
            <View >
                <View style={styles.tabContainer}>
                    {['All', 'Pending', 'Rejected', 'Success'].map(tab => (
                        <Text
                            key={tab}
                            style={[styles.tab, { backgroundColor: tab === filter ? 'aqua' : '' }]}
                            onPress={() => setFilter(tab)}
                        >
                            {tab}
                        </Text>
                    ))}
                </View>
                <FlatList
                    data={filteredData}
                    keyExtractor={item => item?._id}
                    renderItem={({ item }) => (
                        <View >
                            <DepositRecordCard item={item} />
                        </View>
                    )}
                />
            </View>
            </ScrollView>
        </SafeAreaView>

    );
};


const styles = StyleSheet.create({
    tabContainer: {
        flexDirection: 'row',
        justifyContent: 'space-around',
        paddingVertical: 10,
    },
    tab: {
        paddingHorizontal: 20,
        paddingVertical: 10,
        borderRadius: 20,
    },
    item: {
        padding: 20,
        marginVertical: 8,
        marginHorizontal: 16,
        borderWidth: 1,
        borderColor: 'lightgray',
        borderRadius: 5,
    },
    divider: {
        borderBottomColor: '#000',
        borderBottomWidth: 1,
        marginVertical: 10, // Adjust the vertical margin as needed
      }
});


export default DepositRecord;
