import { useEffect, useState } from "react";

function useCurrencyInfo(fromCurrency, toCurrency) {
    const [rate, setRate] = useState(null);

    useEffect(() => {
        if (!fromCurrency || !toCurrency) return;

        const fetchRate = async () => {
            try {
                const response = await fetch(`https://cdn.jsdelivr.net/npm/@fawazahmed0/currency-api@latest/v1/currencies/${fromCurrency}.json`);
                if (!response.ok) {
                    throw new Error(`HTTP error! status: ${response.status}`);
                }
                const data = await response.json();
                setRate(data[fromCurrency][toCurrency]);
            } catch (error) {
                console.error("Fetch error:", error.message);
                setRate(null);
            }
        };

        fetchRate();
    }, [fromCurrency, toCurrency]);

    return rate;
}

export default useCurrencyInfo;
