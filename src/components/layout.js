import * as React from "react"
import { Link } from "gatsby"
import "../assets/index.scss";
import logo from "../images/logos/linco-logo.png";
import Seo from "./seo";

const Layout = ({ location, title, children }) => {
    const rootPath = `${__PATH_PREFIX__}/`
    const isRootPath = location.pathname === rootPath
    let header

    if (isRootPath) {
        header = (
            <div className='lc-header-wrap'>
                <h1>
                    <Link to="/" id='lcLogo'>
                        <img src={logo} alt="Linco logo"/>
                        <span>{title}</span>
                    </Link>
                </h1>
                <div className='lc-header-text'>
                    <p>마음 속의 아이디어를 현실로 잇는 창조의 링크</p>
                    <p>Linco Developer Page</p>
                </div>
            </div>
        )
    } else {
        header = (
            <div className='lc-header-wrap'>
                <h1>
                    <Link to="/" id='lcLogo'>
                        <img src={logo} alt="Linco logo"/>
                        <span>{title}</span>
                    </Link>
                </h1>
                <div className='lc-header-text'>
                    <p>마음 속의 아이디어를 현실로 잇는 창조의 링크</p>
                    <p>Linco Developer Page</p>
                </div>
            </div>
        )
    }

    return (
        <div className="global-wrapper" data-is-root-path={isRootPath}>
            <header className="global-header">{header}</header>
            <main>{children}</main>
            <footer className='global-footer'>
                © {new Date().getFullYear()}, Built with
                {` `}
                <a href="https://www.gatsbyjs.com">Gatsby</a>
            </footer>
        </div>
    )
}

export default Layout
