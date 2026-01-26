import { useState, useEffect, useRef } from 'react'
import { fetchTodos, addTodo, updateTodo, deleteTodo } from '../../data/todos'

// SVG icon components (small, inline, use currentColor)
const PlusIcon = ({ className = 'w-4 h-4' }) => (
  <svg className={className} viewBox="0 0 16 16" fill="none" xmlns="http://www.w3.org/2000/svg">
    <path d="M8 3v10M3 8h10" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round" strokeLinejoin="round" />
  </svg>
)

const CloseIcon = ({ className = 'w-4 h-4' }) => (
  <svg className={className} viewBox="0 0 16 16" fill="none" xmlns="http://www.w3.org/2000/svg">
    <path d="M3 3l10 10M13 3L3 13" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round" strokeLinejoin="round" />
  </svg>
)

const CheckIcon = ({ className = 'w-4 h-4' }) => (
  <svg className={className} viewBox="0 0 16 16" fill="none" xmlns="http://www.w3.org/2000/svg">
    <path d="M3.5 8.5l2.5 2.5L12.5 4.5" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round" strokeLinejoin="round" />
  </svg>
)

const ClockIcon = ({ className = 'w-4 h-4' }) => (
  <svg className={className} viewBox="0 0 16 16" fill="none" xmlns="http://www.w3.org/2000/svg">
    <circle cx="8" cy="8" r="6" stroke="currentColor" strokeWidth="1.2" />
    <path d="M8 4.8v3.2l2 1" stroke="currentColor" strokeWidth="1.2" strokeLinecap="round" strokeLinejoin="round" />
  </svg>
)

const TrashIcon = ({ className = 'w-4 h-4' }) => (
  <svg className={className} viewBox="0 0 16 16" fill="none" xmlns="http://www.w3.org/2000/svg">
    <path d="M4 2h8M3 3h10v8.5c0 1.1-.9 2-2 2H5c-1.1 0-2-.9-2-2V3Z" stroke="currentColor" strokeWidth="1.2" strokeLinecap="round" strokeLinejoin="round" />
    <path d="M6.5 6.5v5M9.5 6.5v5" stroke="currentColor" strokeWidth="1.2" strokeLinecap="round" strokeLinejoin="round" />
  </svg>
)

function Todo() {
  const [todos, setTodos] = useState([])

  useEffect(() => {
    fetchTodos().then(data => setTodos(data)).catch(err => console.error(err))
  }, [])

  // Auto-refresh every 2 seconds to sync with backend changes
  useEffect(() => {
    const interval = setInterval(() => {
      fetchTodos().then(data => setTodos(data)).catch(err => console.error(err))
    }, 2000)
    
    return () => clearInterval(interval)
  }, [])

  // event handlers
  const deleteClick = async (id) => {
    try {
      await deleteTodo(id)
      setTodos(todos.filter((todo) => todo.id !== id))
    } catch (err) {
      console.error('Failed to delete todo:', err)
    }
  }

  const waitingClick = async (id) => {
    try {
      const todoSelected = todos.find((todo) => todo.id === id)
      await updateTodo(id, { completed: true })
      todoSelected.completed = true
      setTodos([...todos])
    } catch (err) {
      console.error('Failed to update todo:', err)
    }
  }

  const addClick = async (title) => {
    try {
      const newItem = await addTodo({ title })
      setTodos([...todos, newItem])
    } catch (err) {
      console.error('Failed to add todo:', err)
    }
  }

  // modal handlers
  const [show, setShow] = useState(false)
  const newTitleRef = useRef()
  const handleClose = () => setShow(false)
  const handleShow = () => setShow(true)

  return (
    <div className="min-h-screen p-8">
      {/* modal */}
      {show && (
        <div className="fixed inset-0 flex items-center justify-center bg-black/30 backdrop-blur-sm z-50 p-4">
          <div className="bg-white rounded-2xl shadow-2xl w-full max-w-md p-8 transform transition-all duration-200">
            <div className="flex justify-between items-center mb-6">
              <h3 className="text-2xl font-semibold text-slate-900 flex items-center gap-3">
                <div className="w-10 h-10 bg-blue-100 rounded-lg flex items-center justify-center">
                  <PlusIcon className="w-5 h-5 text-blue-600" />
                </div>
                Add Todo
              </h3>
              <button 
                className="text-slate-400 hover:text-slate-600 p-2 hover:bg-slate-100 rounded-lg transition-all" 
                onClick={handleClose}
              >
                <CloseIcon className="w-5 h-5" />
              </button>
            </div>
            <div className="mb-6">
              <label className="block text-sm font-semibold text-slate-700 mb-3">What needs to be done?</label>
              <input 
                ref={newTitleRef} 
                className="w-full border-2 border-slate-200 rounded-lg px-4 py-3 text-slate-900 placeholder-slate-400 focus:outline-none focus:border-blue-500 focus:ring-2 focus:ring-blue-200 transition-all text-base" 
                type="text" 
                placeholder="Enter your todo..."
                autoFocus 
              />
            </div>
            <div className="flex justify-end gap-3">
              <button 
                className="px-5 py-2.5 rounded-lg bg-slate-100 text-slate-700 font-medium hover:bg-slate-200 transition-all duration-200 cursor-pointer" 
                onClick={handleClose}
              >
                Cancel
              </button>
              <button
                className="px-5 py-2.5 rounded-lg bg-blue-600 text-white font-medium hover:bg-blue-700 active:scale-95 transition-all duration-200 cursor-pointer flex items-center gap-2"
                onClick={() => {
                  const title = newTitleRef.current.value.trim()
                  if (title === '') {
                    alert('Title cannot be empty')
                    newTitleRef.current.value = ''
                    newTitleRef.current.focus()
                  } else {
                    addClick(title)
                    newTitleRef.current.value = ''
                    handleClose()
                  }
                }}
              >
                <PlusIcon className="w-4 h-4" />
                Add
              </button>
            </div>
          </div>
        </div>
      )}

      {/* header */}
      <div className="mb-8">
        <h1 className="text-5xl font-bold text-slate-900 mb-2">Todos</h1>
        <p className="text-slate-500 text-lg">Keep track of what matters</p>
      </div>

      {/* table container */}
      <div className="bg-white rounded-2xl shadow-lg border border-slate-200 overflow-hidden">
        {todos.length === 0 ? (
          <div className="p-16 text-center">
            <div className="w-16 h-16 bg-slate-100 rounded-full flex items-center justify-center mx-auto mb-4">
              <PlusIcon className="w-8 h-8 text-slate-400" />
            </div>
            <p className="text-slate-500 text-lg font-medium">No todos yet</p>
            <p className="text-slate-400 text-sm mt-1">Create your first one to get started</p>
          </div>
        ) : (
          <table className="w-full">
            <thead>
              <tr className="border-b border-slate-200 bg-gradient-to-r from-slate-50 to-slate-100">
                <th className="px-6 py-4 text-left text-xs font-bold text-slate-600 uppercase tracking-wider">ID</th>
                <th className="px-6 py-4 text-left text-xs font-bold text-slate-600 uppercase tracking-wider">Title</th>
                <th className="px-6 py-4 text-left text-xs font-bold text-slate-600 uppercase tracking-wider">Status</th>
                <th className="px-6 py-4 text-right text-xs font-bold text-slate-600 uppercase tracking-wider">
                  <button 
                    className="ml-auto inline-flex items-center gap-2 bg-blue-600 hover:bg-blue-700 active:scale-95 text-white px-4 py-2 rounded-lg font-semibold transition-all duration-200 cursor-pointer text-sm" 
                    onClick={handleShow}
                  >
                    <PlusIcon className="w-4 h-4" />
                    Add
                  </button>
                </th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100">
              {todos.map((todo, idx) => (
                <tr 
                  key={todo.id} 
                  className={`hover:bg-slate-50 transition-colors duration-150 ${idx % 2 === 0 ? 'bg-white' : 'bg-slate-50/40'}`}
                >
                  <td className="px-6 py-4">
                    <span className="inline-flex items-center justify-center bg-gradient-to-br from-blue-50 to-blue-100 text-blue-700 rounded-lg w-10 h-10 text-sm font-bold border border-blue-200">
                      {todo.id}
                    </span>
                  </td>
                  <td className="px-6 py-4">
                    <span className={`text-base font-medium ${todo.completed ? 'text-slate-400 line-through' : 'text-slate-900'}`}>
                      {todo.title}
                    </span>
                  </td>
                  <td className="px-6 py-4">
                    {todo.completed ? (
                      <div className="inline-flex items-center gap-2 bg-emerald-50 text-emerald-700 px-4 py-2 rounded-lg text-sm font-semibold border border-emerald-200">
                        <CheckIcon className="w-4 h-4" />
                        Done
                      </div>
                    ) : (
                      <div className="inline-flex items-center gap-2 bg-amber-50 text-amber-700 px-4 py-2 rounded-lg text-sm font-semibold border border-amber-200">
                        <ClockIcon className="w-4 h-4" />
                        Pending
                      </div>
                    )}
                  </td>
                  <td className="px-6 py-4">
                    <div className="flex justify-end gap-2">
                      {!todo.completed && (
                        <button 
                          className="p-2 hover:bg-emerald-100 rounded-lg transition-all duration-200 text-emerald-600 hover:text-emerald-700 cursor-pointer active:scale-90" 
                          onClick={() => waitingClick(todo.id)}
                          title="Mark as done"
                        >
                          <CheckIcon className="w-5 h-5" />
                        </button>
                      )}
                      <button 
                        className="inline-flex items-center gap-2 bg-red-500 hover:bg-red-600 text-white px-3 py-2 rounded-lg font-medium transition-all duration-200 cursor-pointer active:scale-95" 
                        onClick={() => deleteClick(todo.id)}
                        title="Delete"
                      >
                        <TrashIcon className="w-4 h-4" />
                      </button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        )}
      </div>
    </div>
  )
}

export default Todo
