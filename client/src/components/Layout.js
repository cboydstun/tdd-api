import { Outlet } from "react-router-dom"
import TopBar from "./TopBar"

const Layout = () => {
    return (
        <main className="App">
            <TopBar />
            <Outlet />
        </main>
    )
}

export default Layout