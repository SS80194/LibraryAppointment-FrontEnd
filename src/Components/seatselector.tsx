import Painter from "./painter"
import { Layout, Menu, theme } from "antd";
import type {MenuProps} from "antd";
import {useState} from "react"
import {SeatDat} from "../types"

const { Content, Sider } = Layout;

type MenuItem = Required<MenuProps>['items'][number];

const items: MenuItem[] = [
  {
    key: 'L',
    label: '闵行校区-主馆',
    children: [
      {
        key: 'B2',
        label: '主馆二楼',
        children: [
          { key: 'LB2-E', label: 'B200-东区(E)' },
          { key: 'LB2-M', label: 'B200-中区(M)' },
          { key: 'LB2-W', label: 'B200-西区(W)' },
        ],
      },
      {
        key: 'B3',
        label: '主馆三楼',
        children: [
            { key: 'LB3-E', label: 'B300-东区(E)' },
            { key: 'LB3-M', label: 'B300-中区(M)' },
            { key: 'LB3-W', label: 'B300-西区(W)' },
        ],
      },
      {
        key: 'B4',
        label: '主馆四楼',
        children: [
            { key: 'LB4-E', label: 'B400-东区(E)' },
            { key: 'LB4-M', label: 'B400-中区(M)' },
            { key: 'LB4-W', label: 'B400-西区(W)' },
        ],
      },
    ],
  },
  {
    type: 'divider',
  },
  {
    key: 'W',
    label: '闵行校区-包玉刚图书馆',
    children: [
      {
        key: 'W3',
        label: '包玉刚图书馆三楼',
        children: [
          { key: 'W3-NW', label: '三楼西北区(NW)' },
          { key: 'W3-SW', label: '三楼西南区(SW)' },
          { key: 'W3-SE', label: '三楼东南区(SE)' },
        ],
      },
      {
        key: 'W4',
        label: '包玉刚图书馆四楼',
        children: [
          { key: 'W4-NW', label: '四楼西北区(NW)' },
          { key: 'W4-SW', label: '四楼西南区(SW)' },
          { key: 'W4-SE', label: '四楼东南区(SE)' },
        ],
      },
      {
        key: 'W6',
        label: '包玉刚图书馆六楼',
        children: [
          { key: 'W6-NW', label: '四楼西北区(NW)' },
          { key: 'W6-SW', label: '四楼西南区(SW)' },
          { key: 'W6-NE', label: '四楼东北区(NE)' },
          { key: 'W6-SE', label: '四楼东南区(SE)' },
        ],
      },
    ],
  },
  {
    type: 'divider',
  },
  {
    key: 'sub4',
    label: 'Navigation Three',
    children: [
      { key: '9', label: 'Option 9' },
      { key: '10', label: 'Option 10' },
      { key: '11', label: 'Option 11' },
      { key: '12', label: 'Option 12' },
    ],
  },
  
];

export default function SeatSelector(props:{onSelect?:(x:SeatDat)=>any})
{
    const[area, setArea] = useState<string>("");
    const[seatId, setSeatId] = useState<string>("");

    const onClick: MenuProps['onClick'] = (e) => {
        console.log(e.key);
        if(e.key === "W4-SW" || e.key === "W4-SE" || e.key === "W6-NW")
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