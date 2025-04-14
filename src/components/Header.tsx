import React from "react";
import { NavLink } from "react-router-dom";

const Header: React.FC = () => {
    const linkClass = ({ isActive }: { isActive: boolean }) =>
        `px-4 py-2 rounded-md font-semibold transition ${
            isActive
                ? "bg-white text-blue-600 shadow"
                : "text-white hover:bg-blue-500 hover:text-white"
        }`;

    return (
        <header className="bg-blue-600 px-6 py-3 shadow-md sticky top-0 z-10">
            <nav className="flex items-center justify-between max-w-7xl mx-auto">
                <h1 className="text-white font-bold text-xl">My RAG 챗봇</h1>
                <div className="space-x-4">
                    <NavLink to="/chat" className={linkClass}>챗봇</NavLink>
                    <NavLink to="/admin" className={linkClass}>관리자</NavLink>
                </div>
            </nav>
        </header>
    );
};

export default Header;
