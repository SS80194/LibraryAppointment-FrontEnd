import dayjs,{Dayjs} from 'dayjs';
import customParseFormat from 'dayjs/plugin/customParseFormat'
import {useState,useEffect,useRef} from "react"
import SeatSelector from "../components/seatselector"
import Picker from "../components/picker"
import {SeatDat} from "../types"
import {Switch,Button} from "antd"
import Navbar from "../components/navbar"

dayjs.extend(customParseFormat)

function isNight():boolean
{
    let currentHour = new Date().getHours();
    return (currentHour>21);
}
export default function AppointPage()
{
    //mode 为 true 表示预定次日座位
    const [mode,setMode]=useState<boolean>(isNight());
    const [seat,setSeat]=useState<SeatDat|null>(null);
    const pickerRef = useRef<React.ForwardRefExoticComponent<{mode: boolean;} & React.RefAttributes<unknown>>>(null);

    useEffect(()=>{
        
    },[seat]);

    //Submit:
    function submit():void
    {
        console.log("submit!");
        let startTime:Dayjs = (pickerRef.current as any)?.getStart();
        let endTime:Dayjs = (pickerRef.current as any)?.getEnd();
        console.log(startTime.toString(),endTime.toString);
        console.log(seat?.devName);
    }

    //return Components:
    return <div>
        <Navbar pageName="appoint"/>
        <Switch onChange={(e)=>setMode(e)}
            checkedChildren="预定次日座位"
            unCheckedChildren="预约今日座位"
            defaultChecked={mode}
        ></Switch>
        
        <Picker mode={mode} ref={pickerRef}/>

        <p>{seat?seat.devName:"unselected"}</p>
        
        <Button onClick={submit} disabled={!seat}>
            提交
        </Button>

        <SeatSelector onSelect={(s)=>{setSeat(s)}}/>
        {
            mode?
            <p>提示：如果您要预定次日座位，为什么不试试候补功能呢？</p>
            :<p></p>
        }
    </div>
}