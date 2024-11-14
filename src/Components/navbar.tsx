import {Menu} from "antd"
import type { MenuProps } from 'antd';
import {useState} from "react"
import {useNavigate} from "react-router-dom"

type MenuItem = Required<MenuProps>['items'][number];

const items: MenuItem[] = [
    {
      label: '正常预约',
      key: 'appoint',
    },
    {
      label: '候补预约',
      key: 'candidate',
      disabled: true,
    },
    {
        label: '设置座位偏好',
        key : 'preference',
        disabled: true,
    },
    {
        label: '我的预约',
        key : 'history',
        disabled: false
    }
  ];

export default function Navbar(props:{pageName:string})
{
    const [current, setCurrent] = useState(props.pageName);

    let navigate = useNavigate();

    const onClick: MenuProps['onClick'] = (e) => {
        console.log('click ', e.key);
        setCurrent(e.key);
        navigate("/" + e.key);
    }; 

    return <Menu onClick={onClick} selectedKeys={[current]} mode="horizontal" items={items} />;
}