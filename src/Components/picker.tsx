import dayjs,{Dayjs} from 'dayjs';
import {Switch,TimePicker,Button} from "antd"
import {useState, useEffect, useImperativeHandle, forwardRef,useContext} from "react"
import minMax from 'dayjs/plugin/minMax'
import {TimeContext} from "../context"

dayjs.extend(minMax)

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
    //组件
    const { setSelectedTime } = useContext(TimeContext);
    // 使用 forwardRef 将 ref 转发给子组件
    // 使用 useImperativeHandle 暴露子组件的特定状态或方法
    useImperativeHandle(ref, () => ({
      getStart: () => (props.mode?timeRange[0].add(1,'day'):timeRange[0]), // 提供访问状态的方法
      getEnd: () => (props.mode?timeRange[1].add(1,'day'):timeRange[1]),
    }));

    function setDefault(){
        let mode = props.mode;
        let defaultStartTime: Dayjs = mode?dayjs('8:00', 'HH:mm'):dayjs.max(dayjs(),dayjs('8:00', 'HH:mm'));
        let defaultEndTime: Dayjs = dayjs('21:59', 'HH:mm');
        settRange([defaultStartTime,defaultEndTime]);
    }
    
    const format = "HH:mm";
    
    const [timeRange,settRange] = useState<[start:Dayjs,end:Dayjs]>([dayjs(),dayjs()]);
    const setRange = (dates:any,dateStrings:[string,string])=>{
        settRange([dayjs(dateStrings[0], 'HH:mm'),dayjs(dateStrings[1], 'HH:mm')])
        
        //props.onChange((props.mode?dayjs(dateStrings[0], 'HH:mm').add(1,'day'):dayjs(dateStrings[0], 'HH:mm')))
    }

    useEffect(()=>{
        setDefault();
    },[])
    useEffect(()=>{
        setDefault();
    },[props.mode])

    useEffect(()=>{
        //在timeRange改变后更新Context
        let start_stamp = (props.mode?timeRange[0].add(1,'day'):timeRange[0]).valueOf();
        let end_stamp = (props.mode?timeRange[1].add(1,'day'):timeRange[1]).valueOf();
        setSelectedTime([start_stamp,end_stamp]);
    },[timeRange])

    return <>
        <TimePicker.RangePicker 
            needConfirm={false}
            disabledTime={(e)=>disabledTime(e,props.mode)}
            defaultValue={[dayjs(), dayjs()]} 
            onChange={setRange}
            value={timeRange}
            format={format} >
        </TimePicker.RangePicker>
    </>
})

export default Picker;