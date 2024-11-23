import React, { useEffect, useRef, useState } from 'react';
import { FlatList, Text, View, StyleSheet, SafeAreaView } from 'react-native';

const AutoScrollFlatList = ({DATA}) => {
  const flatListRef = useRef(null);
  const [scrollIndex, setScrollIndex] = useState(0);

  useEffect(() => {
    const interval = setInterval(() => {
      setScrollIndex((prevIndex) => {
        const nextIndex = (prevIndex + 1) % DATA.length;
        flatListRef.current.scrollToIndex({ index: nextIndex, animated: true });
        return nextIndex;
      });
    }, 2000);

    return () => clearInterval(interval);
  }, []);

  const renderItem = ({ item }) => (
    <View
        style={{
            flexDirection: "row",
            gap: 20,
            justifyContent: "space-between",
            paddingBottom: 20,
            paddingHorizontal: 20,
            paddingVertical: 20,
            width:"100%"
        }}
        >
        <Text>{item?.address}</Text>
        <Text> {item?.amount}</Text>
    </View> 
  );

  return (
      <FlatList
        ref={flatListRef}
        data={DATA}
        renderItem={renderItem}
        keyExtractor={(item) => item}
        getItemLayout={(data, index) => (
          { length: 60, offset: 60 * index, index }
        )}
        showsVerticalScrollIndicator={false}
      />
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: '#fff',
  },
  item: {
    width: '100%',
    height: 60,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: '#f9c2ff',
    marginVertical: 5,
    borderRadius: 5,
  },
  title: {
    fontSize: 16,
  },
});

export default AutoScrollFlatList;
