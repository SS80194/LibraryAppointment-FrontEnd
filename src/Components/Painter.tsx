import {Stage,Layer,Circle,Text} from "react-konva"
import Konva from "konva";
import {useState,useEffect} from "react";

//Painter is a comoponent,used to render pic&ava seat of a specific area
type PainterProps = {
    area_id?:string
}

type SeatDat = {
    devId:number;
    coordinate:string;

    [key:string]:any;
}

export default function Painter(props:PainterProps)
{
    let area_id="W4-SW";
    //研究一下怎么把这个东西倒进去
    let area_pic:string=area_id+'.jpg';
    let area_data:string=area_id+'.json';

    const [list,setList]=useState<SeatDat[]>();

    function getData()
    {
        fetch("/resources/W4-SW.json")
        .then((res)=>res.json())
        .then((json_dat)=>{
            setList(json_dat.data);
        })
    }
    useEffect(getData,[]);

    useEffect(()=>{console.log(list)},list);

    return (<img src="/resources/W4-SE.jpg" alt="逆臣乱党，都要受这灼心之刑。"/>)
}