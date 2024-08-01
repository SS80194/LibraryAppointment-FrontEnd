import {Stage,Layer,Circle,Image} from "react-konva"
import Konva from "konva";
import {useState,useEffect} from "react";
import useImage from "use-image"

//Painter is a comoponent,used to render pic&ava seat of a specific area
type PainterProps = {
    area_id?:string
}

type SeatDat = {
    devId:number;
    coordinate:string;

    [key:string]:any;
}

type PinProps={
    seat_status:SeatDat;
    width:number;
    height:number;
}
function ColoredPin(props:PinProps)
{
    let parts:string[]=props.seat_status.coordinate.split(',');
    if(parts.length<2) throw new Error("Invalid Coordinate");
    const [x_string,y_string]=parts;
    //How to use TS here?
    let x:number=Number(x_string);
    let y:number=Number(y_string);
    //if(props.seat_status.devId==1962) return (<Circle x={(x/100)*props.width} y={(y/100)*props.height} radius={5} fill="yellow"/>);
    return (<Circle x={(x/100)*props.width} y={(y/100)*props.height} radius={5} fill="green"/>)
}

type KimgProps={
    src:string;
    maxWidth:number;
    maxHeight:number;
    [key:string]:any;
}
function KonvaImage(props:KimgProps)
{
    const [image]=useImage(props.src);
    if(!image) return null;
    //console.log((image as any).height);
    let scale:number=Math.min(props.maxWidth/(image as any).width,props.maxHeight/(image as any).height);
    //let scale=1;
    return <Image image={image} scaleX={scale} scaleY={scale}/>
}

//Paint a map of library seats
export default function Painter(props:PainterProps)
{
    let area_id="W4-SE";
    //研究一下怎么把这个东西倒进去
    let area_pic:string=area_id+'.jpg';
    let area_data:string=area_id+'.json';
    
    const [list,setList]=useState<SeatDat[]>();

    //定义窗口长宽变量
    const [width,setWidth]=useState<number>(window.innerWidth);
    const [height,setHeight]=useState<number>(window.innerHeight);
    useEffect(()=>{setWidth(window.innerWidth)},[window.innerWidth]);
    useEffect(()=>{setHeight(window.innerHeight)},[window.innerHeight]);
    //定义图片宽高变量，并加载图片
    const [picW,setpicW]=useState<number>(1920);
    const [picH,setpicH]=useState<number>(1080);
    const [scale,setScale]=useState<number>(1);
    //加载图片
    const [BGimage]=useImage("/resources/W4-SE.jpg");
    function getScale(){
        let scale_t:number;
        if(BGimage)
        {
            scale_t=Math.min(width/(BGimage as any).width,height/(BGimage as any).height);
            setpicW((BGimage as any).width*scale_t);
            setpicH((BGimage as any).height*scale_t);
        }
        else scale_t=1;
        setScale(scale_t);
    }
    useEffect(getScale,[width,height]);
    
    //console.log((image as any).height);
    //图片宽高
    
    useEffect(()=>{
        
    },[width,height]);

    function getData()
    {
        fetch("/resources/W4-SE.json")
        .then((res)=>res.json())
        .then((json_dat)=>{
            setList(json_dat.data);
        })
    }
    useEffect(getData,[]);

    //useEffect(()=>{console.log(list)},list);

    //return (<img src="/resources/W4-SE.jpg" alt="逆臣乱党，都要受这灼心之刑。"/>)
    return (<Stage width={window.innerWidth} height={window.innerHeight}>

        <Layer>
            {
                <KonvaImage src="/resources/W4-SE.jpg" maxWidth={window.innerWidth} maxHeight={window.innerHeight}/>
            //<img src="/resources/W4-SE.jpg" alt="逆臣乱党，都要受这灼心之刑。"/>
            }
        </Layer><Layer>
        {
            list?
            list.map(seat_status=><ColoredPin 
                seat_status={seat_status}
                width={picW} height={picH}
                key={seat_status.devId}/>)
            :<></>
        }
        </Layer>
    </Stage>)
}