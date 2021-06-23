import {useState, useEffect} from 'react'
import { BrowserRouter as Router, Route} from 'react-router-dom'
import Header from './components/Header'
import Footer from './components/Footer'
import Tasks from './components/Tasks'
import AddTask from './components/AddTask'
import About from './components/About'
function App() {
  const [showAddTask, setShowAddTask] = useState(false)

  const DB_URL = 'http://localhost:5000/tasks';
  useEffect(()=> {
    const getTasks = async () => {
      const tasksFromServer = await fetchTasks()
      setTasks(tasksFromServer)
    }
    
    getTasks()
  }, [])
  const [tasks, setTasks] = useState([]) 

  // Fetch tasks
  const fetchTasks = async () => {
      const res = await fetch(`${DB_URL}`)
      const data = await res.json()

      return data;
    }

// Fetch task
const fetchTask = async (id) => {
      const res = await fetch(`${DB_URL}/${id}`)
      const data = await res.json()

      return data;
    }

  // Add Tasks
  const addTask =  async (task) => {
    const res = await fetch(`${DB_URL}`, 
    {
      method: 'POST',
      headers: {
        'Content-type': 'application/json'
      },
      body: JSON.stringify(task)
    })

    const data = await res.json()

    setTasks([...tasks, data])
    // const id = Math.floor(Math.random() * 10000) + 1
    // const newTask = { id , ...task}
    // setTasks([...tasks, newTask])
  }





  // Delete Task
  const deleteTask = async (id) => {
    await fetch(`${DB_URL}/${id}`, {method: 'DELETE'})
    setTasks(tasks.filter((task) => task.id!==id))
  }

  // Toggle Reminder 
  const toggleReminder = async (id) => {

    let taskToToggle = await fetchTask(id)
    const updatedTask = { ...taskToToggle, reminder: !taskToToggle.reminder}

    const res = await fetch(`${DB_URL}/${id}`, 
    {
      method:'PUT',
      headers: { 
        'Content-type': 'application/json'
      },
      body: JSON.stringify(updatedTask)
    })

    const data = await res.json()

    setTasks( 
      tasks.map((task) => 
       task.id  === id ?
      { ...task, reminder: data.reminder}: task
     )
     )}
    
  

  return (
    <Router>
        <div className="container">
          <Header 
            onShowAdd = {() => setShowAddTask(!showAddTask)} 
            showAddTask = {showAddTask}/>
            
          <Route path='/' exact render= {( props) => (
            <>
            {showAddTask && <AddTask onAdd={addTask}/>}
            { tasks.length > 0 ? 
              (<Tasks 
                  tasks = { tasks} 
                  onDelete = {deleteTask} 
                  onToggle= {toggleReminder}/>) :
              ('No Tasks To Show')
              }
              </>
              )} 
          />
          <Route path='/about' component={About} />
          <Footer/>
        </div>
    </Router>
  );
}

export default App;
