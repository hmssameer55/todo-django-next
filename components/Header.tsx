'use client';

import { LogOut } from 'lucide-react';
import Cookies from 'js-cookie';
import { LayoutGrid } from 'lucide-react'


export default function Header() {

	const onLogout = () => {
		Cookies.remove('token');
		window.location.href = '/auth';
	};

	return (
		<header className="bg-gradient-to-r from-blue-600 to-purple-600 text-white py-4 px-6 shadow-lg">
			<div className="container mx-auto flex items-center justify-between">
				<div className="flex items-center space-x-2">
					<LayoutGrid className="h-8 w-8" />
					<h1 className="text-2xl font-bold">NexDjango Tasks</h1>
				</div>
				<nav>
					<ul className="flex space-x-4">
						<li className="hover:text-blue-200 transition-colors flex gap-2 cursor-pointer"
							onClick={onLogout}
						>
							<LogOut />
							Logout
						</li>
					</ul>
				</nav>
			</div>
		</header>
	)
}
