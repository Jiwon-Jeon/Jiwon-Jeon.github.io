import * as React from 'react';
import {Link} from 'gatsby';
import '../assets/index.scss';
import logo from '../images/logos/linco-logo.png';
//import Seo from './seo';

const Layout = ({location, title, children, goHome}) => {
    const rootPath = `${__PATH_PREFIX__}/`;
    const isRootPath = location.pathname === rootPath;
    let header;

    if (isRootPath) {
        header = (
            <div className="lc-header-wrap">
                <h1>
                    <Link to="/" id="lcLogo" onClick={goHome}>
                        <img src={logo} alt="Linco logo" />
                        <span>{title}</span>
                    </Link>
                </h1>
            </div>
        );
    } else {
        header = (
            <div className="lc-header-wrap">
                <h1>
                    <Link to="/" id="lcLogo">
                        <img src={logo} alt="Linco logo" />
                        <span>{title}</span>
                    </Link>
                </h1>
            </div>
        );
    }

    return (
        <div className="global-wrapper" data-is-root-path={isRootPath}>
            <header className="global-header">{header}</header>
            <main>{children}</main>
            <footer className="global-footer">
                © {new Date().getFullYear()} <a href="https://linco.co.kr">Linco</a>, Built with
                {` `}
                <a href="https://www.gatsbyjs.com">Gatsby</a>
            </footer>
        </div>
    );
};

export default Layout;
