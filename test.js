import React, { useState, useEffect } from 'react';

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

// Example usage of the PnlRoiDisplay component
const App = () => {
    const time = 30;
    const percentage = 3;
    const amount = 200;
    const [index, setIndex] = useState(0);
    const [data, setData] = useState([]);

    useEffect(() => {
        // Generate data based on the provided inputs
        const generatedData = generatePnlRoiData(time, percentage, amount);
        setData(generatedData);

        // Start updating the index every second
        const interval = setInterval(() => {
            setIndex(prevIndex => {
                if (prevIndex < generatedData.length - 1) {
                    return prevIndex + 1;
                } else {
                    clearInterval(interval);
                    return prevIndex;
                }
            });
        }, 1000);

        return () => clearInterval(interval);
    }, [time, percentage, amount]);

    return (
        <div>
            {data.length > 0 && (
                <h1>
                    P&L: {data[index].pnl} | ROI: {data[index].roi}
                </h1>
            )}
        </div>
    );
};

export default App;
