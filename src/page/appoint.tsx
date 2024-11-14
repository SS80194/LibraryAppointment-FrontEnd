import Painter from "../components/painter"
import dayjs,{Dayjs} from 'dayjs';
import customParseFormat from 'dayjs/plugin/customParseFormat'
import {useState,useEffect} from "react"
import SeatSelector from "../components/seatselector"
import {SeatDat} from "../types"
import {Switch,TimePicker,Button} from "antd"
import Navbar from "../components/navbar"

dayjs.extend(customParseFormat)

function isNight():boolean
{
    let currentHour = new Date().getHours();
    return (currentHour>21);
}

function range(l:number,r:number):number[]
{
    let t:number[] = [];
    for(let i=l;i<=r;i++) t=[...t,i];
    return t;
}

function disabledTime (date:Dayjs,appoint:boolean)
{
    const hour:number = new Date().getHours(); // 获取当前的小时
    const min:number = new Date().getMinutes(); // 获取当前的分钟
    
    if(appoint){
        return {
            disabledHours: () => [...range(0, 7),...range(22,24)],
        }
    }
    else if (date?.hour() === hour) {
        return {
            disabledHours: () => range(0, 24).splice(0, hour),
            disabledMinutes: () => range(0, 60).splice(0, min)
        };
    }
    else {
        return {
            disabledHours: () => range(0, 24).splice(0, hour)
        };
    }
};
export default function AppointPage()
{
    //mode 为 true 表示预定次日座位
    const [mode,setMode]=useState<boolean>(isNight());
    const [seat,setSeat]=useState<SeatDat|null>(null);

    useEffect(()=>{
        
    },[seat]);

    let defaultStartTime: Dayjs = mode?dayjs('8:00', 'HH:mm'):dayjs();
    let defaultEndTime: Dayjs = dayjs('22:00', 'HH:mm');
    const format = "HH:mm";

    const [startTime,setStart] = useState<Dayjs>(defaultStartTime);
    const [endTime,setEnd] = useState<Dayjs>(defaultEndTime);
    const setRange = (times:[Dayjs,Dayjs])=>{setStart(times[0]);setEnd(times[1]);}

    useEffect(()=>{
        if(!mode){
            if(startTime < dayjs())
                setStart(dayjs());
        }
    },[mode])

    //Submit:
    function submit():void
    {
        console.log("submit!");
        console.log(startTime.toString(),endTime.toString());
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
        
        
        <TimePicker.RangePicker 
            needConfirm={false}
            disabledTime={(e)=>disabledTime(e,mode)}
            defaultValue={[defaultStartTime, defaultEndTime]} format={format} >
        </TimePicker.RangePicker>

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