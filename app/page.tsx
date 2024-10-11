'use client'

import { useState, useEffect } from 'react'
import { Plus, Trash2, CheckCircle, Circle,  } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import Cookies from 'js-cookie'
import Header from '@/components/Header'

interface Todo {
  id: number
  title: string
  is_completed: boolean
  created_at: string
  updated_at: string
}



function DraggableTodoItem({
	todo,
	deleteTodo,
	handleDragStart,
	updateTodoStatus,  // Add updateTodoStatus as a prop
  }: {
	todo: Todo
	deleteTodo: (id: number) => void
	handleDragStart: (id: number) => void
	updateTodoStatus: (id: number, newStatus: boolean) => void // Define the function type
  }) {
	return (
	  <li
		className="bg-white p-4 rounded-lg shadow-md transition-all duration-200 hover:shadow-lg cursor-move"
		draggable
		onDragStart={() => handleDragStart(todo.id)}
	  >
		<div className="flex items-center justify-between">
		  <div className="flex items-center space-x-3">
			<Button
			  onClick={(e) => {
				e.stopPropagation()
				updateTodoStatus(todo.id, !todo.is_completed)  // Toggle the status when clicked
			  }}
			  variant={"ghost"}
			  onDragStart={(e) => e.preventDefault()}  // Prevent dragging on click
			  className="focus:outline-none"
			>
			  {todo.is_completed ? (
				<CheckCircle className="h-5 w-5 text-green-500" />
			  ) : (
				<Circle className="h-5 w-5 text-gray-400" />
			  )}
			</Button>
			<span
			  className={`flex-grow ${todo.is_completed ? 'line-through text-gray-400' : 'text-gray-700'}`}
			>
			  {todo.title}
			</span>
		  </div>
		  <div className="flex items-center space-x-2">
			<Badge variant="secondary" className="p-2 bg-blue-100 text-blue-800">
			  {new Date(todo.created_at).toLocaleDateString()}
			</Badge>
			<Button
			  size="sm"
			  variant="destructive"
			  onClick={(e) => {
				e.stopPropagation();
				deleteTodo(todo.id);
			  }}
			>
			  <Trash2 className="size-3" />
			</Button>
		  </div>
		</div>
	  </li>
	)
  }
  
  
function TodoContainer({ id, title, todos, deleteTodo, handleDragStart, handleDrop, isDropTarget, updateTodoStatus }: { id: string; title: string; todos: Todo[]; deleteTodo: (id: number) => void; handleDragStart: (id: number) => void; handleDrop: (e: React.DragEvent) => void; isDropTarget: boolean,updateTodoStatus }) {
  return (
    <Card
      className={`w-full h-full transition-all duration-300 ${
        isDropTarget ? 'ring-4 ring-blue-400 ring-opacity-50 bg-blue-50' : ''
      }`}
      onDragOver={(e) => e.preventDefault()}
      onDrop={handleDrop}
    >
      <CardHeader className={`bg-gradient-to-r from-blue-500 to-purple-500 text-white rounded-t-lg ${
        isDropTarget ? 'animate-pulse' : ''
      }`}>
        <CardTitle>{title}</CardTitle>
      </CardHeader>
      <CardContent className="p-4 h-[calc(100%-4rem)] overflow-y-auto">
        <ul className="space-y-2">
          {todos.map((todo) => (
            <DraggableTodoItem key={todo.id} todo={todo} deleteTodo={deleteTodo} handleDragStart={handleDragStart} updateTodoStatus={updateTodoStatus}/>
          ))}
        </ul>
      </CardContent>
    </Card>
  )
}

export default function ImprovedTodoList() {
  const [todos, setTodos] = useState<Todo[]>([])
  const [newTodoTitle, setNewTodoTitle] = useState('')
  const [draggedTodoId, setDraggedTodoId] = useState<number | null>(null)
  const [dropTarget, setDropTarget] = useState<string | null>(null)
  const backendURL = process.env.NEXT_PUBLIC_BACKEND_URL


  useEffect(() => {
    fetchTodos()
  }, [])

  const fetchTodos = async () => {
    const token = Cookies.get('token')

    try {
      const response = await fetch(`${backendURL}/api/todo/`, {
        headers: {
          Authorization: `Token ${token}`,
        },
      })

      if (response.ok) {
        const data = await response.json()
        setTodos(data)
      }
    } catch (error) {
      console.error('Error fetching todos:', error)
    }
  }

  const createTodo = async (e: React.FormEvent) => {
    e.preventDefault()
    const token = Cookies.get('token')

    try {
      const response = await fetch(`${backendURL}/api/todo/`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Token ${token}`,
        },
        body: JSON.stringify({ title: newTodoTitle, description: '' }),
      })

      if (response.ok) {
        const data = await response.json()
        setTodos([...todos, data])
        setNewTodoTitle('')
      }
    } catch (error) {
      console.error('Error creating todo:', error)
    }
  }

  const deleteTodo = async (id: number) => {
    const token = Cookies.get('token')

    try {
      const response = await fetch(`${backendURL}/api/todo/${id}/`, {
        method: 'DELETE',
        headers: {
          Authorization: `Token ${token}`,
        },
      })

      if (response.ok) {
        setTodos(todos.filter((todo) => todo.id !== id))
      }
    } catch (error) {
      console.error('Error deleting todo:', error)
    }
  }

  const updateTodoStatus = async (id: number, newStatus: boolean) => {
    const token = Cookies.get('token')

    try {
      const response = await fetch(`${backendURL}/api/todo/${id}/`, {
        method: 'PATCH',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Token ${token}`,
        },
        body: JSON.stringify({ is_completed: newStatus }),
      })

      if (response.ok) {
        const updatedTodo = await response.json()
        setTodos(todos.map((todo) => (todo.id === id ? updatedTodo : todo)))
      }
    } catch (error) {
      console.error('Error updating todo:', error)
    }
  }

  const handleDragStart = (id: number) => {
    setDraggedTodoId(id)
  }

  const handleDragEnter = (containerId: string) => {
    setDropTarget(containerId)
  }

  const handleDragLeave = () => {
    setDropTarget(null)
  }

  const handleDrop = (newStatus: boolean) => (e: React.DragEvent) => {
    e.preventDefault()
    if (draggedTodoId !== null) {
      updateTodoStatus(draggedTodoId, newStatus)
      setDraggedTodoId(null)
    }
    setDropTarget(null)
  }

  const incompleteTodos = todos.filter((todo) => !todo.is_completed)
  const completedTodos = todos.filter((todo) => todo.is_completed)

  return (
    <>
      <Header />
      <main className="min-h-screen bg-gradient-to-br from-blue-100 to-purple-100 py-8">
        <div className="container mx-auto px-4">
          <Card className="w-full max-w-4xl mx-auto shadow-lg">
            <CardHeader className="bg-gradient-to-r from-blue-500 to-purple-500 text-white rounded-t-lg">
              <CardTitle className="text-3xl font-bold text-center">Task Manager</CardTitle>
              <CardDescription className="text-center text-blue-100">
                Drag and drop tasks to change their status
              </CardDescription>
            </CardHeader>
            <CardContent className="p-6">
			<form onSubmit={createTodo} className="flex items-center space-x-2 mb-6">
				<Input
					type="text"
					placeholder="Add a new task..."
					value={newTodoTitle}
					onChange={(e) => setNewTodoTitle(e.target.value)}
					className="text-base flex-grow px-4 py-5 rounded-lg bg-gradient-to-r from-blue-50 to-purple-50 text-gray-700 border border-transparent focus:border-transparent focus:ring-2 focus:ring-offset-2 focus:ring-blue-400 focus:bg-white shadow-sm transition-all duration-300"
				/>
				<Button
					type="submit"
					disabled={!newTodoTitle.trim()}
					className="bg-blue-500 hover:bg-blue-600 text-white rounded-lg shadow-md px-3 py-5 transition-all duration-200"
				>
					<Plus className="size-5" />
				</Button>
				</form>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div
                  onDragEnter={() => handleDragEnter('Incomplete')}
                  onDragLeave={handleDragLeave}
				  className='h-[450px] overflow-y-auto'
                >
                  <TodoContainer
                    id="Incomplete"
                    title="Incomplete"
                    todos={incompleteTodos}
                    deleteTodo={deleteTodo}
                    handleDragStart={handleDragStart}
                    handleDrop={handleDrop(false)}
                    isDropTarget={dropTarget === 'Incomplete'}
					updateTodoStatus={updateTodoStatus}  // Pass the function here
                  />
                </div>
                <div
                  onDragEnter={() => handleDragEnter('Completed')}
                  onDragLeave={handleDragLeave}
				  className='h-[450px] overflow-y-auto'
                >
                  <TodoContainer
                    id="Completed"
                    title="Completed"
                    todos={completedTodos}
                    deleteTodo={deleteTodo}
                    handleDragStart={handleDragStart}
                    handleDrop={handleDrop(true)}
                    isDropTarget={dropTarget === 'Completed'}
					updateTodoStatus={updateTodoStatus}  // Pass the function here
                  />
                </div>
              </div>
            </CardContent>
            <CardFooter className="bg-gray-50 rounded-b-lg">
              <p className="text-sm text-gray-500 w-full text-center">
                You have {todos.length} task{todos.length !== 1 ? 's' : ''}
              </p>
            </CardFooter>
          </Card>
        </div>
      </main>
    </>
  )
}