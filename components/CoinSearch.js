import React, { useState } from 'react';
import {
    View,
    TextInput,
    FlatList,
    Image,
    Text,
    StyleSheet,
    Dimensions,
} from 'react-native';

const CoinSearchComponent = ({coins}) => {

    const [searchText, setSearchText] = useState('');
    const [filteredCoins, setFilteredCoins] = useState(coins);

    // Handle search logic
    const handleSearch = (text) => {
        setSearchText(text);
        const filtered = coins.filter((coin) =>
            coin.name.toLowerCase().includes(text.toLowerCase())
        );
        setFilteredCoins(filtered);
    };

    // Render individual coin items
    const renderCoinItem = ({ item }) => (
        <View style={styles.coinItem}>
            <Image
                source={{ uri: item.image }}
                style={styles.coinImage}
            />
            <View style={styles.coinTextWrapper}>
                <Text style={styles.coinName}>{item.name}</Text>
                <Text style={styles.coinPrice}>{item.price}</Text>
            </View>
        </View>
    );

    return (
        <View style={styles.container}>
            <TextInput
                placeholder="Search coin pairs"
                style={styles.searchInput}
                value={searchText}
                onChangeText={handleSearch}
            />
            {searchText !== '' && (
                <View style={styles.coinList}>
                    {filteredCoins.length > 0 ? (
                        <FlatList
                            data={filteredCoins}
                            keyExtractor={(item) => item.id}
                            renderItem={renderCoinItem}
                            contentContainerStyle={styles.listContent}
                            showsVerticalScrollIndicator={false}
                            keyboardShouldPersistTaps="handled"
                        />
                    ) : (
                        <View style={styles.notFoundContainer}>
                            <Text style={styles.notFoundText}>coin not found</Text>
                        </View>
                    )}
                </View>
            )}
        </View>
    );
};

const styles = StyleSheet.create({
    container: {
        flex: 1,
        paddingTop: 10, 
        alignItems: 'center', 
        backgroundColor: '#fff',
    },
    searchInput: {
        borderWidth: 1,
        borderColor: '#ccc',
        borderRadius: 20,
        paddingHorizontal: 15,
        height: 50,
        fontSize: 16,
        width: '90%',
        marginBottom: 10,
        zIndex: 10, 
    },
    coinList: {
        position: 'absolute',
        top: 70, // Position it below the search bar
        width: '90%', 
        maxHeight: 300, // Limit the height for the list
        backgroundColor: '#fff',
        borderRadius: 10,
        borderWidth: 1,
        borderColor: '#ddd',
        zIndex: 9,
        overflow:'scroll'
    },
    listContent: {
        paddingBottom: 20,
    },
    coinItem: {
        flexDirection: 'row',
        alignItems: 'center',
        padding: 10,
        borderBottomWidth: 1,
        borderBottomColor: '#eee',
    },
    coinImage: {
        width: 40,
        height: 40,
        borderRadius: 20,
        marginRight: 15,
    },
    coinTextWrapper: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        flex: 1,
        alignItems: 'center',
    },
    coinName: {
        fontSize: 16,
        fontWeight: 'bold',
    },
    coinPrice: {
        fontSize: 14,
        color: '#555',
        textAlign: 'right',
    },
    notFoundContainer: {
        alignItems: 'center',
        justifyContent: 'center',
        paddingVertical: 20,
    },
    notFoundText: {
        fontSize: 16,
        color: '#555',
    },
});

export default CoinSearchComponent;
