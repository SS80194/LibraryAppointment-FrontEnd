import dayjs,{Dayjs} from 'dayjs';
import customParseFormat from 'dayjs/plugin/customParseFormat'
import minMax from 'dayjs/plugin/minMax'
import utc from 'dayjs/plugin/utc'
import {useState,useEffect,useRef} from "react"
import SeatSelector from "../components/seatselector"
import Picker from "../components/picker"
import {SeatDat} from "../types"
import {Switch,Button,notification} from "antd"
import Navbar from "../components/navbar"
import { TimeProvider } from "../context";

dayjs.extend(customParseFormat)
dayjs.extend(minMax)
dayjs.extend(utc);

//Your pre_defined token(hardcoded)
let ACCESS_TOKEN = "x114514";

function isNight():boolean
{
    let currentHour = new Date().getHours();
    return (currentHour>21);
}
function getTodayStr():string
{
    let week_arr = ["星期日",  "星期一", "星期二", "星期三", "星期四", "星期五", "星期六"];
    let str_date = dayjs().format('YYYY-MM-DD');
    let str_day = week_arr[dayjs().day()];
    return "今日: "+str_date+str_day;
}
function getTomStr():string
{
    let week_arr = ["星期日",  "星期一", "星期二", "星期三", "星期四", "星期五", "星期六"];
    let tmd=dayjs().add(1,'day');
    let str_date = tmd.format('YYYY-MM-DD');
    let str_day = week_arr[tmd.day()];
    return "次日: "+str_date+str_day;
}
//当日座位可预约的条件 (!before22)||!mode
//代表加入任务计划（当前座位不可直接预约）的条件 before22&&mode
function before22():boolean{
    let todayAt22 = dayjs().hour(22).minute(0).second(0).millisecond(0); // 今天22:00
    //当前时间在 22 点之前，且 time 是在明天，则 time 也是可以预约的。
    if(dayjs().isBefore(todayAt22)) return true;
    return false;
}
export default function AppointPage()
{
    //mode 为 true 表示预定次日座位
    const [mode,setMode]=useState<boolean>(isNight());
    //const [status,setStatus]= useState<boolean>(false);
    const [seat,setSeat]=useState<SeatDat|null>(null);
    const pickerRef = useRef<React.ForwardRefExoticComponent<{mode: boolean;} & React.RefAttributes<unknown>>>(null);

    useEffect(()=>{
        
    },[seat]);

    //Submit:
    async function submit()
    {
        console.log("submit!");
        let startTime:Dayjs = (pickerRef.current as any)?.getStart();
        let endTime:Dayjs = (pickerRef.current as any)?.getEnd();
        //console.log(startTime.toISOString(),endTime.toISOString);
        //console.log(seat?.devName,seat?.devId);
        let submit_mode:boolean = !(mode&&before22);
        //submit_mode = 1:addtoPlan =0 reserve
        if(!submit_mode) startTime = dayjs.max(startTime,dayjs());
        
        //startTime should be set to now if reservation mode is today
        let body = {
            "seat_id":seat?.devId,
            "start_time":startTime.utc().format('YYYY-MM-DDTHH:mm:ss[Z]'),
            "end_time":endTime.utc().format('YYYY-MM-DDTHH:mm:ss[Z]')
        };
        let msg = {
            method:"POST",
            headers:{
                "Content-Type": "application/json",
                "token":ACCESS_TOKEN?ACCESS_TOKEN:""
            },
            body:JSON.stringify(body)
        }
        
        console.log(msg)
        let base_url = "http://127.0.0.1:5000", url="";
        let response,status_code;
        if(!submit_mode){
            url = base_url + "/reserve";
            
        } else {
            //TODO:reservation/add to plan.
            url = base_url + "/addtoplan"
        }
        response = await fetch(url,msg);
        status_code = response.status
        response = await response.json();
        console.log(status_code);
        console.log(response);
        //openNotification();
        if(status_code === 200){
            notification.success({
            message:`${response.status}`,
            description:(<>
                <p>{response.message}</p>
                <p>座位号:{seat?.devName}</p>
                <p>开始时间{startTime.format('YYYY-MM-DD HH:mm')}</p>
                <p>结束时间:{endTime.format('YYYY-MM-DD HH:mm')}</p>
            </>),
            placement:'top',
            duration:3
            })
        }else{
            notification.error({
                message:`${response.status}`,
                description:`${response.message}`,
                duration:3,
                placement:'top',
            })
        }
        
    }


    //return Components:
    return <div>
        <TimeProvider>
        <Navbar pageName="appoint"/>
        <Switch onChange={(e)=>setMode(e)}
            checkedChildren={getTomStr()}
            unCheckedChildren={getTodayStr()}
            defaultChecked={mode}
        ></Switch>

        <br></br>
        
        <Picker mode={mode} ref={pickerRef} />

        <p>{seat?seat.devName:"unselected"}</p>
        
        <Button onClick={submit} disabled={!seat}>
            {!(mode&&before22())?"直接预约座位":"加入抢座计划"}
        </Button>

        <SeatSelector onSelect={(s)=>{setSeat(s)}}/>
            
        </TimeProvider>
        {
            mode?
            <p>提示：如果您要预定次日座位，为什么不试试候补功能呢？</p>
            :<p></p>
        }
    </div>
}