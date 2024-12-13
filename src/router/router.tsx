import AppointPage from "../page/appoint"
import History from "../page/history"
import Plan from "../page/plan"
import Login from "../page/login"
import Preference from "../page/preference"
import { BrowserRouter, Route, Routes, useNavigate } from "react-router-dom"


export default function AppRouter()
{
    //let navigate = useNavigate();

    return (
    <BrowserRouter>
        <Routes>
            <Route path="/" element={<AppointPage/>}/>
            <Route path="/appoint" element={<AppointPage/>}/>
            <Route path="/history" element={<History/>}/>
            <Route path="/plan" element={<Plan/>}/>
        </Routes>
    </BrowserRouter>
    )
}