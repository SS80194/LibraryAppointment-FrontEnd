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
export default function AppointPage()
{
    //mode 为 true 表示预定次日座位
    const [mode,setMode]=useState<boolean>(isNight());
    const [seat,setSeat]=useState<SeatDat|null>(null);
    const pickerRef = useRef<React.ForwardRefExoticComponent<{mode: boolean;} & React.RefAttributes<unknown>>>(null);

    useEffect(()=>{
        
    },[seat]);

    const [api, contextHolder] = notification.useNotification();

    const openNotification = () => {
        api.open({
        message: 'Notification Title',
        description:
            'I will never close automatically. This is a purposely very very long description that has many many characters and words.',
        duration: 3,
        });
    };

    //Submit:
    async function submit()
    {
        console.log("submit!");
        let startTime:Dayjs = (pickerRef.current as any)?.getStart();
        let endTime:Dayjs = (pickerRef.current as any)?.getEnd();
        //console.log(startTime.toISOString(),endTime.toISOString);
        //console.log(seat?.devName,seat?.devId);
        if(!mode) startTime = dayjs.max(startTime,dayjs());
        
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
        if(!mode){
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
            duration:3
            })
        }else{
            notification.error({
                message:`${response.status}`,
                description:`${response.message}`,
                duration:3
            })
        }
        
    }

    //return Components:
    return <div>
        <Navbar pageName="appoint"/>
        <Switch onChange={(e)=>setMode(e)}
            checkedChildren="预定次日座位"
            unCheckedChildren="预约今日座位"
            defaultChecked={mode}
        ></Switch>

        <br></br>
        
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