import { useState, useEffect } from 'react';
import { InputBox } from './components';
import useCurrencyInfo from './hooks/useCurrencyInfo';

function App() {
    const [amount, setAmount] = useState(0);
    const [from, setFrom] = useState("usd");
    const [to, setTo] = useState("inr");
    const [convertedAmount, setConvertedAmount] = useState(0);
    const [currencyList, setCurrencyList] = useState([]);
    const [loading, setLoading] = useState(false);
    const [isRotated, setIsRotated] = useState(false);


    const exchangeRate = useCurrencyInfo(from, to);

    // Load all currency codes for dropdown from API once
    useEffect(() => {
       fetch('https://cdn.jsdelivr.net/npm/@fawazahmed0/currency-api@latest/v1/currencies.json')

            .then(res => res.json())
            .then(data => {
                const currencyCodes = Object.keys(data);
                setCurrencyList(currencyCodes);
            })
            .catch(err => {
                console.error("Currency list fetch error:", err.message);
            });
    }, []);

    const swap = () => {
  setIsRotated(true); // start rotation
  setTimeout(() => {
    setFrom(prevFrom => {
      setTo(prevFrom);
      return to;
    });
    setAmount(convertedAmount);
    setConvertedAmount(amount);
    setIsRotated(false); // reset rotation
  }, 300); // duration of animation
};


    const convert = () => {
    if (!exchangeRate) return;
    setLoading(true); // show loading spinner

    setTimeout(() => {
        setConvertedAmount(amount * exchangeRate);
        setLoading(false);  // hide loading spinner after conversion
    }, 1000);
};

    
    return (
       
        <div
          
            className="w-full h-screen flex flex-wrap justify-center items-center bg-cover bg-no-repeat"
            style={{
                backgroundImage: `url('https://t3.ftcdn.net/jpg/04/34/58/54/360_F_434585463_zpdtTpTEbqQFfsp6RVEW6IIxEM9dHf86.jpg')`,
            }}
        >
            <div className="w-full">
                <div className="w-full max-w-md mx-auto border border-gray-60 rounded-lg p-5 backdrop-blur-sm bg-white/30">
                    <form
  onSubmit={(e) => {
    e.preventDefault();
    convert();
  }}
>
  <div className="w-full mb-1">
    <InputBox
      label="From"
      amount={amount}
      currencyOptions={currencyList}
      onCurrencyChange={(currency) => setFrom(currency)}
      selectCurrency={from}
      onAmountChange={(value) => setAmount(value)}
    />
  </div>

  <div className="relative w-full h-0.5">
    <button
  type="button"
  className={`absolute left-1/2 -translate-x-1/2 -translate-y-1/2 border-2 border-white rounded-md bg-blue-600 text-white px-2 py-0.5 cursor-pointer transition-transform duration-300 ${
    isRotated ? 'rotate-180' : ''
  }`}
  onClick={swap}
>
  Swap
</button>

  </div>

  <div className="w-full mt-1 mb-4">
    <InputBox
      label="To"
      amount={convertedAmount}
      currencyOptions={currencyList}
      onCurrencyChange={(currency) => setTo(currency)}
      selectCurrency={to}
      amountDisable
    />
  </div>

  <button
    type="submit"
    className="w-full bg-blue-600 hover:bg-blue-700 text-white px-4 py-3 rounded-lg cursor-pointer
               active:scale-95 transition transform duration-150 flex justify-center items-center gap-2"
    disabled={loading}
>
    {loading ? (
        <svg
            className="animate-spin h-5 w-5 text-white"
            xmlns="http://www.w3.org/2000/svg"
            fill="none"
            viewBox="0 0 24 24"
        >
            <circle
                className="opacity-25"
                cx="12"
                cy="12"
                r="10"
                stroke="currentColor"
                strokeWidth="4"
            ></circle>
            <path
                className="opacity-75"
                fill="currentColor"
                d="M4 12a8 8 0 018-8v8z"
            ></path>
        </svg>
    ) : null}
    {loading ? "Converting..." : `Convert ${from.toUpperCase()} to ${to.toUpperCase()}`}
</button>

</form>

                </div>
            </div>
        </div>
    );
}

export default App;
