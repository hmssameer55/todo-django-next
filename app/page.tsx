'use client';

import { useEffect, useState } from 'react';
import { Plus, Pencil, Trash2, CheckCircle, Circle } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import {
	Card,
	CardContent,
	CardDescription,
	CardFooter,
	CardHeader,
	CardTitle,
} from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import Cookies from 'js-cookie';
import Header from '@/components/Header';

interface Todo {
	id: number;
	title: string;
	is_completed: boolean;
	created_at: string;
	updated_at: string;
}

export default function LandingPage() {
	const [todos, setTodos] = useState<Todo[]>([]);
	const [newTodoTitle, setNewTodoTitle] = useState('');
	const [isLoading, setIsLoading] = useState(true);
	const [error, setError] = useState<string | null>(null);


	const backendURL = process.env.NEXT_PUBLIC_BACKEND_URL


	useEffect(() => {
		fetchTodos();
	}, []);

	const fetchTodos = async () => {
		const token = Cookies.get('token');
		setIsLoading(true);
		setError(null);

		try {
			const response = await fetch(backendURL + '/api/todo/', {
				headers: {
					Authorization: `Token ${token}`,
				},
			});

			if (response.ok) {
				const data = await response.json();
				setTodos(data);
			} else {
				setError('Failed to fetch todos');
			}
		} catch (error) {
			setError('Error fetching todos');
		} finally {
			setIsLoading(false);
		}
	};

	const deleteTodo = async (id: number) => {
		const token = Cookies.get('token');

		try {
			const response = await fetch(backendURL +`/api/todo/${id}/`, {
				method: 'DELETE',
				headers: {
					Authorization: `Token ${token}`,
				},
			});

			if (response.ok) {
				setTodos(todos.filter((todo) => todo.id !== id));
			} else {
				setError('Failed to delete todo');
			}
		} catch (error) {
			setError('Error deleting todo');
		}
	};

	const createTodo = async (e: React.FormEvent) => {
		e.preventDefault();
		const token = Cookies.get('token');

		try {
			const response = await fetch(backendURL + '/api/todo/', {
				method: 'POST',
				headers: {
					'Content-Type': 'application/json',
					Authorization: `Token ${token}`,
				},
				body: JSON.stringify({ title: newTodoTitle, description:'', }),
			});

			if (response.ok) {
				const data = await response.json();
				setTodos([...todos, data]);
				setNewTodoTitle('');
			} else {
				setError('Failed to create todo');
			}
		} catch (error) {
			setError('Error creating todo');
		}
	};

	const updateTodoStatus = async (id: number, newStatus: boolean) => {
		const token = Cookies.get('token');

		try {
			const response = await fetch(backendURL+`/api/todo/${id}/`, {
				method: 'PATCH',
				headers: {
					'Content-Type': 'application/json',
					Authorization: `Token ${token}`,
				},
				body: JSON.stringify({ is_completed: newStatus }),
			});

			if (response.ok) {
				const data = await response.json();
				setTodos(todos.map((todo) => (todo.id === id ? data : todo)));
			} else {
				setError('Failed to update todo');
			}
		} catch (error) {
			setError('Error updating todo');
		}
	};

	return (
		<>
			<Header />
			<main className="min-h-screen bg-gray-100 py-8">
				<div className="container mx-auto px-4">
					<Card className="w-full max-w-2xl mx-auto">
						<CardHeader>
							<CardTitle className="text-2xl font-bold text-center">
								NexDjango Tasks
							</CardTitle>
							<CardDescription className="text-center">
								Manage your tasks with ease
							</CardDescription>
						</CardHeader>
						<CardContent>
							<form onSubmit={createTodo} className="flex space-x-2 mb-6">
								<Input
									type="text"
									placeholder="Add a new task..."
									value={newTodoTitle}
									onChange={(e) => setNewTodoTitle(e.target.value)}
									className="flex-grow"
								/>
								<Button type="submit" disabled={!newTodoTitle.trim()}>
									<Plus className="h-4 w-4 mr-2" />
									Add Task
								</Button>
							</form>
							{isLoading ? (
								<div className="text-center">Loading tasks...</div>
							) : error ? (
								<div className="text-center text-red-500">{error}</div>
							) : (
								<ul className="space-y-2">
									{todos?.map((todo) => (
										<li
											key={todo.id}
											className="flex items-center justify-between bg-white p-4 rounded-lg shadow"
										>
											<div className="flex items-center space-x-3">
												<Button
													size="icon"
													variant="ghost"
													onClick={() =>
														updateTodoStatus(todo.id, !todo.is_completed)
													}
													className="text-gray-500 hover:text-green-500"
												>
													{todo.is_completed === true ? (
														<CheckCircle className="h-5 w-5" />
													) : (
														<Circle className="h-5 w-5" />
													)}
												</Button>
												<span
													className={`flex-grow ${
														todo.is_completed === true
															? 'line-through text-gray-500'
															: ''
													}`}
												>
													{todo.title}
												</span>
											</div>
											<div className="flex items-center space-x-2">
												<Badge variant={'secondary'} className="p-2">
													{new Date(todo.created_at).toDateString()}
												</Badge>
												<Button
													size="icon"
													variant="ghost"
													onClick={() => deleteTodo(todo.id)}
													className="text-gray-500 hover:text-red-500"
												>
													<Trash2 className="h-4 w-4" />
												</Button>
											</div>
										</li>
									))}
								</ul>
							)}
						</CardContent>
						<CardFooter>
							<p className="text-sm text-gray-500 w-full text-center">
								You have {todos?.length} task{todos?.length !== 1 ? 's' : ''}
							</p>
						</CardFooter>
					</Card>
				</div>
			</main>
		</>
	);
}
