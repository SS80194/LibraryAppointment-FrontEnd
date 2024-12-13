import {Stage,Layer,Circle,Image} from "react-konva"
import Konva from "konva";
import {useState,useEffect,useRef} from "react";
import useImage from "use-image"
import useResizeAware from "react-resize-aware";
import {SeatDat} from "../types"

type PinProps={
    seat_status:SeatDat;
    width:number;
    height:number;
    onClick:(arg0:SeatDat)=>any;
}

type KimgProps={
    src:string;
    maxWidth:number;
    maxHeight:number;
    [key:string]:any;
}
function KonvaImage(props:KimgProps)
{
    const [image] = useImage(props.src);
    if(!image) return null;
    let scale: number
        = Math.min(props.maxWidth/(image as any).width,props.maxHeight/(image as any).height);
    return <Image image={image} scaleX={scale} scaleY={scale}/>
}

//Painter is a comoponent,used to render pic&ava seat of a specific area
//A Painter a map of library seats
type PainterProps = {
    area_id:string;
    onClick?:(arg0:SeatDat)=>any;
    
}
export default function Painter(props:PainterProps)
{
    //let area_id=props.area_id;
    //研究一下怎么把这个东西倒进去
    //let res_path="/resources/";
    //let area_pic:string=area_id+'.jpg';
    //let area_data:string=area_id+'.json';
    
    const [area_pic,setAreaPic]=useState<string>("");
    async function getAreaPic()
    {
        let area_pic_resp = await fetch (`http://127.0.0.1:5000/getseatpic?zone=${props.area_id}`,{})
        let area_pic_url = await area_pic_resp.text()
        console.log(area_pic_url)
        setAreaPic(area_pic_url)
    }
    useEffect(()=>{getAreaPic()},[])
    useEffect(()=>{getAreaPic()},[props.area_id])

    const [area_data,setAreaData]=useState<string>("/resources/W4-SW.json");

    const [list,setList]=useState<SeatDat[]>();

    //定义窗口长宽变量，并监听窗口大小的变化。
    const [width,setWidth]=useState<number>(window.innerWidth);
    const [height,setHeight]=useState<number>(window.innerHeight);
    const elementRef = useRef<HTMLDivElement>(null);
    function resizeChange(){
        if (elementRef.current) {
            const { width, height } = elementRef.current.getBoundingClientRect();
            setWidth(width);
            setHeight(height);
        }
        else console.log("Null");
    }
    useEffect(() => {
	    window.addEventListener('resize', resizeChange);
        resizeChange();
	    return () => window.removeEventListener('resize', resizeChange);
	}, []);
    //定义图片宽高变量，并加载图片
    const [picW,setpicW] = useState<number>(1920);
    const [picH,setpicH] = useState<number>(1920);
    const [scale,setScale] = useState<number>(1);
    const [imgld,setImgld] = useState<boolean>(false);
    const [BGimage,img_status] = useImage(area_pic);
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
    useEffect(getScale,[width,height,imgld]);
    if(img_status ==='loaded'&&!imgld) setImgld(true);
    //console.log((image as any).height);
    //图片宽高
    

    async function getData()
    {
        //area_id
        let tomorrow:string = "false" 
        let url:string = `http://127.0.0.1:5000/getseatmap?zone=${props.area_id}&nextday=${tomorrow}`
        let res = await fetch(url);
        let jsonData = await res.json();
        setList(jsonData.data);
    }
    useEffect(()=>{getData()},[]);
    useEffect(()=>{getData()},[props.area_id]);

    function showInfo()
    {
        //用来console.log一些所需要的信息
    }
    //showInfo();
 
    //选择座位
    function selectSeat(selectedSeat:SeatDat)
    {
        //console.log(selectedSeat.devName);
        //console.log(typeof(props.onClick));
        props.onClick?.(selectedSeat);
    }
    
    //子组件：彩色的
    function ColoredPin(props:PinProps)
    {
        let parts:string[]=props.seat_status.coordinate.split(',');
        if(parts.length<2) throw new Error("Invalid Coordinate");
        const [x_string,y_string]=parts;
        //How to use TS here?
        let x: number = Number(x_string);
        let y: number = Number(y_string);
        return (<Circle x={(x/100)*props.width} y={(y/100)*props.height} 
        onClick={()=>props.onClick(props.seat_status)}
        radius={5} fill="green"/>)
    }
    //本组件
    return (
    <div ref = {elementRef}>
    <Stage width={width} height={height}>

        <Layer>
            {
            <KonvaImage src={area_pic} 
            maxWidth={width} maxHeight={height}/>
            }
        </Layer>
        <Layer>
        {
            list&&
            list.map(seat_status=><ColoredPin 
                seat_status={seat_status}
                width={picW} height={picH}
                onClick={props.onClick?props.onClick:selectSeat}
                key={seat_status.devId}/>)
        }
        </Layer>
    </Stage></div>)
}