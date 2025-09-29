import React from 'react'
import { Link } from 'react-router-dom'
import useAuthStore from '../../contexts/useAuthStore'

export const TopNavBar = () => {

    const clearToken = useAuthStore(state => state.clearToken);

    const links = [
        { path: "/profile", desc: "Profile" },
        { path: "/courses", desc: "Courses" },
    ]

    return (
        <div className="flex items-center flex-shrink-0 h-16 px-8 border-b border-gray-300">
            <div className="text-sm breadcrumbs ">
                <ul>
                    <li><a>Home</a></li>
                    <li><a>Documents</a></li>
                    <li>Add Document</li>
                </ul>
            </div>

            <button className="relative ml-auto text-sm focus:outline-none group">
                <div className="dropdown dropdown-end">
                    <label tabIndex={0} className="btn btn-ghost hover:bg-transparent">
                        <div className="flex items-center justify-between w-10 h-10 rounded">
                            <div className="block relative">
                                <img
                                    alt="profil"
                                    src="https://www.tailwind-kit.com/images/person/6.jpg"
                                    className="mx-auto object-cover rounded-full h-10 w-10 hover:rounded "
                                />
                            </div>
                        </div>
                    </label>
                    <ul tabIndex={0} className="menu dropdown-content p-2 shadow bg-base-100 rounded-box w-52 mt-4">
                        {links.map((route, key) => <li key={key}><Link to={route.path}>{route.desc}</Link></li>)}
                        <li><a onClick={() => clearToken} className="w-full px-4 py-2 text-left hover:bg-blue-500 hover:text-white">Sign out</a></li>
                    </ul>
                </div>
            </button>
        </div>
    )
}
