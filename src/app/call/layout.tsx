import { ReactNode } from "react";

interface Props {
    children: ReactNode;
}

const Layout = ({ children }: Props) => {
    return (
        <div className="h-screen bg-black">
            {children}
        </div>
    )
}

export default Layout;