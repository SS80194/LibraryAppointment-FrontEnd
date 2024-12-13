import Painter from "./painter"
import { Layout, Menu, theme } from "antd";
import type {MenuProps} from "antd";
import {useState,useEffect} from "react"
import {SeatDat} from "../types"

const { Content, Sider } = Layout;

type MenuItem = Required<MenuProps>['items'][number];

export default function SeatSelector(props:{onSelect?:(x:SeatDat)=>any})
{
    const[area, setArea] = useState<string>("27");
    const[seatId, setSeatId] = useState<string>("");
    const [items,setItems] = useState<MenuItem[]>([]);

    async function getItem()
    {
      let url = "http://127.0.0.1:5000/getzoneinfo"
      try{
        let response = await fetch(url);
        let json = await response.json();
        //console.log(typeof(json));
        setItems(JSON.parse(json));
      }
      catch(e){
        console.log("Error occurred when getting seat zones")
      }
    }

    useEffect(()=>{getItem()},[]);

    const onClick: MenuProps['onClick'] = (e) => {
        console.log(e.key);
        //if(e.key === "W4-SW" || e.key === "W4-SE" || e.key === "W6-NW")
        setArea(e.key);
    }

    return <Layout >
        <Sider theme="light">
        <Menu
            onClick={onClick}
            defaultSelectedKeys={['1']}
            defaultOpenKeys={['sub1']}
            mode="inline"
            items={items}
            theme="light"
        />
        </Sider>
            <Content  style={{
              padding: 24,
              margin: 0,
              minHeight: 280,
            }}>
            
            {area&&<Painter area_id={area} onClick={props.onSelect}/>}
            </Content>
        
    </Layout>
}