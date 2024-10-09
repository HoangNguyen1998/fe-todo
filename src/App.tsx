
import './App.css'
import Button from '@mui/material/Button';
import { useNavigate } from 'react-router-dom';

const UserList = [{
  name: "Alex",
  id: "One"
},
{
  name: "Peter",
  id: "Two"
},
{
  name: "Sam",
  id: "Three"
}]

function App() {
  const navigate = useNavigate();

  const renderUserList = () => {
    return UserList.map((user) => {
      return <Button style={{
        padding: 10,
        margin: 10
      }} onClick={() => navigate(`/user/${user.id}`)}>{user.name}</Button>
    })
  }

  return (
    <>
      <div>
        Choose User
      </div>
      <div style={{ display: 'flex', marginTop: '10px' }}>
        {
          renderUserList()
        }
      </div>

    </>
  )
}

export default App
