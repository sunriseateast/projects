import Dropdown from 'react-dropdown'; 
import React, {useId} from 'react'

function Curinput({label,onAmountChanged,amountDisabled,amount,options,oncurrencyChange,selectcurrency}) {
    const inputChange=(event)=>{
        onAmountChanged(event.target.value)
    }
    const dropdownChange=(option)=>{
        oncurrencyChange(option.value)
    }
    const id=useId()

    return(
        <div className="bg-white w-5/6 h-32 mt-5 rounded-lg">
            <div className="flex grid-cols-2 justify-between mt-5">
                <div className='pl-5'>
                    <label htmlFor={id} className="block text-lg text-gray-500 w-full md:w-auto">{label}</label><br></br>
                    <input type="number" id={id} className="block w-full md:w-20 text-lg font-medium outline-0" min={0} value={amount} onChange={inputChange} disabled={amountDisabled} />
                </div>
                <div className="pr-5">
                    <label className="block text-lg text-gray-500 w-full md:w-auto">Currency Type</label><br></br>
                    <div className='pl-8'>
                        <Dropdown options={options} value={selectcurrency} className=" bg-slate-50 block w-full md:w-20 border rounded-md text-center" menuClassName="max-h-40 overflow-y-auto absolute z-50 bg-slate-50 border rounded-md" onChange={dropdownChange}/>
                    </div>
                </div>
            </div>
        </div>
    )
  }
  export default Curinput