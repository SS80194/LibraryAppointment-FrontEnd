import Navbar from "../components/navbar"
import {useState,useEffect} from "react"
import {Card,Button,Space} from "antd"

type PlanCardProps={
    id:number,
    seat_tag:string,
    start_time:string,
    end_time:string,
    onDelete:()=>any;
}

function PlanCard(props:PlanCardProps)
{
    const startDate = new Date(props.start_time);
    const endDate = new Date(props.end_time);

    // 使用 toLocaleString 转换为东八区（北京时间）

    const start_str = startDate.toLocaleString('zh-CN');
    const end_str = endDate.toLocaleString('zh-CN')

    return <Card title={props.seat_tag} extra={<Button onClick={props.onDelete}>delete</Button>} style={{ width: 300 }}>
        <p>座位号：{props.seat_tag}</p>
        <p>开始时间：{start_str}</p>
        <p>结束时间：{end_str}</p>
    </Card>
}

export default function Plan()
{
    //get list
    const[list,setList]=useState<PlanCardProps[]>([]);
    async function getList()
    {
        let response = await fetch("http://127.0.0.1:5000/showplan")
        let data = await response.json()
        setList(data)
    }
    useEffect(()=>{getList()},[])

    //delete func
    async function deletePlan(id:number)
    {
        console.log(id)
        let response = await fetch("http://127.0.0.1:5000/deleteplan",{
            method:"POST",
            headers:{
                "Content-Type": "application/json",
                //"token":ACCESS_TOKEN?ACCESS_TOKEN:""
            },
            body:JSON.stringify({"id":id})
        })
        console.log(await response.text())
        getList();
    }
    
    return <div>
        <Navbar pageName="plan"></Navbar>
        <Space direction="vertical" size={16}>
            {
                list?.map((resv)=><PlanCard
                key={resv.id} {...resv} onDelete={()=>deletePlan(resv.id)}
                />)
            }
        </Space>
    </div>
}