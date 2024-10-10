'use client';

import Link from 'next/link';
import { Button } from '@/components/ui/button';
import { LogOut } from 'lucide-react';
import { useEffect, useState } from 'react';
import Cookies from 'js-cookie';

export default function Header() {
	const [user, setUser] = useState<{
		id: number;
		username: string;
		email: string;
	} | null>(null);

	const token = Cookies.get('token');

	const backendURL = process.env.NEXT_PUBLIC_BACKEND_URL


	// useEffect(() => {
	// 	const fetchUserDetail = async () => {
	// 		try {
	// 			const response = await fetch(backendURL + 'http://127.0.0.1:8000/api/user/', {
	// 				headers: {
	// 					Authorization: `Token ${token}`,
	// 				},
	// 			});

	// 			if (response.ok) {
	// 				const data = await response.json();
	// 				setUser(data);
	// 			}
	// 		} catch (error) {
	// 			console.error('An error occurred:', error);
	// 		}
	// 	};

	// 	fetchUserDetail();
	// }, []);

	const onLogout = () => {
		Cookies.remove('token');
		window.location.href = '/auth';
	};

	return (
		<header className="sticky top-0 z-50 w-full border-b bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60 px-10 py-4">
			<div className="container flex h-14 items-center">
				<div className="mr-4 hidden md:flex">
					<Link href="/" className="mr-6 flex items-center space-x-2">
						<span className="hidden font-bold sm:inline-block text-xl">
							NexDjango Tasks
						</span>
					</Link>
				</div>
				<div className="flex flex-1 items-center justify-between space-x-2 md:justify-end">
					<nav className="flex items-center">
						<span className="text-sm text-muted-foreground mr-4">
							Welcome, {user?.username}
						</span>
						<Button
							variant="ghost"
							size="sm"
							onClick={onLogout}
							className="flex items-center"
						>
							<LogOut className="h-4 w-4 mr-2" />
							Logout
						</Button>
					</nav>
				</div>
			</div>
		</header>
	);
}
