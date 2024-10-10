'use client';

import { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import {
	Card,
	CardContent,
	CardDescription,
	CardHeader,
	CardTitle,
} from '@/components/ui/card';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import Cookies from 'js-cookie';

export default function AuthPage() {


	const backendURL = process.env.NEXT_PUBLIC_BACKEND_URL

	const [isSignIn, setIsSignIn] = useState(true);

	const handleLogin = async (e: React.FormEvent<HTMLFormElement>) => {
		e.preventDefault();

		const data = e.currentTarget;

		const username = data.username.value;
		const password = data.password.value;

		try {
			const response = await fetch(backendURL+'/api-token-auth/', {
				method: 'POST',
				headers: {
					'Content-Type': 'application/json',
				},
				body: JSON.stringify({ username, password }),
			});

			const { token } = await response.json();
			console.log('token: ', token);
			if (token) {
				Cookies.set('token', token);
				window.location.href = '/';
			}
		} catch (error) {
			console.error('An error occurred:', error);
		}
	};

	const handleSignup = async (e: React.FormEvent<HTMLFormElement>) => {
		e.preventDefault();

		const data = e.currentTarget;

		const username = data.username.value;
		const email = data.email.value;
		const password = data.password.value;
		const first_name = 'test';
		const last_name = 'test';

		try {
			const response = await fetch(backendURL + '/api/register/', {
				method: 'POST',
				headers: {
					'Content-Type': 'application/json',
				},
				body: JSON.stringify({
					username,
					email,
					password,
					first_name,
					last_name,
				}),
			});
			const { token } = await response.json();
			if (token) {
				Cookies.set('token', token);
				window.location.href = '/';
			}

		} catch (error) {
			console.error('An error occurred:', error);
		}
	};

	return (
		<div className="min-h-screen flex items-center justify-center">
			<Card className="w-full max-w-md">
				<CardHeader>
					<CardTitle>{isSignIn ? 'Sign In' : 'Sign Up'}</CardTitle>
					<CardDescription>
						{isSignIn
							? 'Enter your credentials to access your account'
							: 'Create a new account to get started'}
					</CardDescription>
				</CardHeader>
				<CardContent>
					<Tabs defaultValue="signin" className="w-full">
						<TabsList className="grid w-full grid-cols-2">
							<TabsTrigger value="signin" onClick={() => setIsSignIn(true)}>
								Sign In
							</TabsTrigger>
							<TabsTrigger value="signup" onClick={() => setIsSignIn(false)}>
								Sign Up
							</TabsTrigger>
						</TabsList>
						<TabsContent value="signin">
							<form onSubmit={handleLogin} className="space-y-4">
								<div className="space-y-2">
									<Label htmlFor="username">Username</Label>
									<Input id="username" type="text" required />
								</div>
								<div className="space-y-2">
									<Label htmlFor="password">Password</Label>
									<Input id="password" type="password" required />
								</div>
								<Button type="submit" className="w-full">
									Sign In
								</Button>
							</form>
						</TabsContent>
						<TabsContent value="signup">
							<form onSubmit={handleSignup} className="space-y-3">
								<div className="space-y-2">
									<Label htmlFor="username">Username</Label>
									<Input id="username" type="text" required />
								</div>
								<div className="space-y-2">
									<Label htmlFor="email">Email</Label>
									<Input
										id="email"
										type="email"
										placeholder="m@example.com"
										required
									/>
								</div>
								<div className="space-y-2">
									<Label htmlFor="password">Password</Label>
									<Input id="password" type="password" required />
								</div>
								<Button type="submit" className="w-full">
									Sign Up
								</Button>
							</form>
						</TabsContent>
					</Tabs>
				</CardContent>

			</Card>
		</div>
	);
}
