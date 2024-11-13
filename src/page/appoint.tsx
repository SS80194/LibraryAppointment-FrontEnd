import Painter from "../components/painter"
import {useState,useEffect} from "react"
import SeatSelector from "../components/seatselector"
import {SeatDat} from "../types"

export default function AppointPage()
{
    const [seat,setSeat]=useState<SeatDat|null>(null);

    useEffect(()=>{
        
    },[seat]);

    return <div>
        <SeatSelector onSelect={(s)=>{setSeat(s)}}/>
    </div>
}