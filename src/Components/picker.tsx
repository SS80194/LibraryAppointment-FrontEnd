import dayjs,{Dayjs} from 'dayjs';
import {Switch,TimePicker,Button} from "antd"
import {useState, useEffect, useImperativeHandle, forwardRef} from "react"

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
            disabledHours: () => [...range(0, 21).splice(0, hour),...range(22,24)],
            disabledMinutes: () => range(0, 60).splice(0, min)
        };
    }
    else {
        return {
            disabledHours: () => [...range(0, 21).splice(0, hour),...range(22,24)]
        };
    }
};

const Picker = forwardRef((props:{mode:boolean},ref)=>
{
    // 使用 forwardRef 将 ref 转发给子组件
    // 使用 useImperativeHandle 暴露子组件的特定状态或方法
    useImperativeHandle(ref, () => ({
      getStart: () => startTime, // 提供访问状态的方法
      getEnd: () => endTime,
    }));

    let mode = props.mode;
    let defaultStartTime: Dayjs = mode?dayjs('8:00', 'HH:mm'):dayjs();
    let defaultEndTime: Dayjs = dayjs('21:59', 'HH:mm');
    const format = "HH:mm";

    const [startTime,setStart] = useState<Dayjs>(defaultStartTime);
    const [endTime,setEnd] = useState<Dayjs>(defaultEndTime);
    const setRange = (dates:any,dateStrings:[string,string])=>{
        
        setStart(dayjs(dateStrings[0], 'HH:mm'));
        setEnd(dayjs(dateStrings[1], 'HH:mm'));
    }

    useEffect(()=>{
        if(!mode){
            if(startTime < dayjs())
                setStart(dayjs());
        }
    },[mode])

    useEffect(()=>{
        //console.log(startTime,endTime);
    },[startTime,endTime])


    return <>
        <TimePicker.RangePicker 
            needConfirm={false}
            disabledTime={(e)=>disabledTime(e,mode)}
            defaultValue={[defaultStartTime, defaultEndTime]} 
            onChange={setRange}
            format={format} >
        </TimePicker.RangePicker>
    </>
})

export default Picker;