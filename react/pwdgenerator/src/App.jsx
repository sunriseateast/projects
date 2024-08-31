import { useCallback, useState,useEffect,useRef} from "react";
function App() {
  const[Length,setLength]=useState(8)
  const[Character,setCharacter]=useState(false)
  const [numberAllowed,setnumberAllowed]=useState(false)
  const [passwd,setPasswd]=useState('')

  const pwdref=useRef(null)

  const passgenerator=useCallback(()=>{
    let pass = '';
    let str = 'ABCDEFGHIJKLMNOPQRSTUVWXYZ' +
        'abcdefghijklmnopqrstuvwxyz';
    if (numberAllowed) str+="01234567890"
    if (Character) str+="{}/<>!@#$%^&*()~`"
    for (let i = 1; i <= Length; i++) {
      let char = Math.floor(Math.random()*str.length+1);
      pass+=str.charAt(char)
    }
    setPasswd(pass)
  },[Length,Character,numberAllowed,passwd])

  const pwdcopy=useCallback(()=>{
    window.navigator.clipboard.writeText(passwd)
  },[passwd])

  useEffect(()=>{
    passgenerator()
  },[Length,Character,numberAllowed])

  return (
    <>
      <h1 className="text-white text-4xl flex justify-center">Password Generator</h1>
      <div className="flex justify-center mt-5">
        <div className="bg-neutral-700 h-32 w-1/2 rounded-lg">
          <div className="mt-5 flex">
            <input className="ml-24 w-3/5 h-10 rounded-l-lg px-3 text-2xl text-orange-500" readOnly placeholder="Password" value={passwd} ref={pwdref}/>
            <button className="bg-blue-700 h-10 text-2xl text-white px-2 rounded-r-lg flex text-centre" onChange={pwdcopy()}>copy</button>
          </div>
          <div className="flex justify-center gap-x-4 mt-4">
            <input type="range" min={8} max={16} value={Length} onChange={(e)=>{setLength(e.target.value)}}/>
            <label className="text-orange-500 text-1xl">Length:{Length}</label>
            <input type="checkbox" id="number" defaultChecked={numberAllowed} onChange={()=>setnumberAllowed((prev)=>!prev)}/>
            <label className="text-orange-500 text-1xl" for="number">Numbers</label>
            <input type="checkbox" id="character" onChange={()=>setCharacter((prev)=>!prev)}/>
            <label className="text-orange-500 text-1xl" for="character">Characters</label>
          </div>
        </div>
      </div>
    </>
  )
}
export default App
