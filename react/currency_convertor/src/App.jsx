import React from 'react'
import Curinput from './Curinput.jsx'
import { useState } from 'react'
import useCurrencyInfo from "./hooks/useCurrenyInfo"
function App() {
  const [amount,setAmount]=useState(0)
  const [convertedamount,setConvertedAmount]=useState(0)
  const [currencyfrom,setCurrencyFrom]=useState('usd')
  const [currencyto,setCurrencyTo]=useState('inr')
  

  const currenyInfo=useCurrencyInfo(currencyfrom)
  const currencyOptions=Object.keys(currenyInfo)


  const conversion=()=>{
    setConvertedAmount(Math.floor((amount*currenyInfo[currencyto])*1000)/1000)
  }

  const swap=()=>{
    setCurrencyFrom(currencyto)
    setCurrencyTo(currencyfrom)
    setConvertedAmount(amount)
    setAmount(convertedamount)
  }

  
  return(
    <div className='flex justify-center items-center h-screen'>
      <div className='bg-gray-500 w-1/2 h-96 bg-opacity-10 backdrop-blur-sm border rounded-md border-gray-500 hover:bg-opacity-40'>
          <div className="grid justify-items-center relative">
              <Curinput label={"From"} onAmountChanged={(newamount)=>setAmount(newamount)} oncurrencyChange={(newcurrency)=>setCurrencyFrom(newcurrency)} amountDisabled={false} amount={amount} options={currencyOptions} selectcurrency={currencyfrom}/>
              <div className='absolute inset-y-32 pt-1'>
                <button type="button" className='border w-20 h-12 rounded-lg bg-pink-600 active:bg-pink-700 text-white font-medium text-sm' onClick={swap}>swap</button>
              </div>
              <Curinput label={"To"} amountDisabled={true} amount={convertedamount} options={currencyOptions} oncurrencyChange={(newcurrency)=>setCurrencyTo(newcurrency)} selectcurrency={currencyto}/>
            <button type="button" className='border-2 mt-5 w-48 h-12 rounded-lg text-white text-xl font-semibold hover:scale-105 hover:bg-pink-600 active:bg-pink-700' onClick={conversion}>convert</button>
          </div>
      </div>
    </div>
  )
}
export default App
