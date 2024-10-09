import { Box, Button, Card, CardActions, CardContent, MenuItem, Modal, Select, SelectChangeEvent, TextField } from "@mui/material";
import { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import axios, { AxiosResponse } from 'axios';

const style = {
  position: 'absolute',
  top: '50%',
  left: '50%',
  transform: 'translate(-50%, -50%)',
  width: 400,
  bgcolor: 'background.paper',
  border: '2px solid #000',
  boxShadow: 24,
  p: 4,
};

export enum ETaskStatus {
  TO_DO = 'TO_DO',
  IN_PROGRESS = 'IN_PROGRESS',
  DONE = 'DONE',
  ALL = 'ALL'
}


interface Task {
  id: string,
  name: string;
  description: string;
  status: ETaskStatus;
  ownerId: string
}

function Task() {
  const [open, setOpen] = useState(false);
  const [idUpdate, setIdUpdate] = useState<string | null>(null)
  const { userId } = useParams();
  const [tasks, setTasks] = useState<Task[]>([]);
  const [task, setTask] = useState({
    name: '',
    description: '',
    status: ETaskStatus.TO_DO
  })
  const [filterStatus, setFilterStatus] = useState<ETaskStatus>(ETaskStatus.ALL)
  useEffect(() => {
    fetchTask()
  }, [filterStatus]);

  const renderStatus = (status: string) => {
    if (status === 'TO_DO') {
      return <div style={{ color: 'blue', }}>To Do</div>
    }
    if (status === 'IN_PROGRESS') {
      return <div style={{ color: 'orange', borderRadius: 10, padding: 10 }}>In Progress</div>
    }
    return <div style={{ color: 'green', borderRadius: 10, padding: 10 }}>Done</div>
  }

  const renderTasks = () => {
    return tasks.map((task) => <Card sx={{ maxWidth: '100%' }} style={{ marginBottom: 20 }}>
      <CardContent>
        <div style={{ display: 'flex', justifyContent: 'space-between' }}>
          <div>Name:</div>
          <div>{task.name}</div>
        </div>
        <div style={{ display: 'flex', justifyContent: 'space-between' }} >
          <div>Description:</div>
          <div>{task.description}</div>
        </div>
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
          <div>Status:</div>
          {renderStatus(task.status)}
        </div>
      </CardContent>
      <CardActions>
        <Button onClick={() => handleOpenUpdateModal(task)} style={{ marginRight: 10 }} size="small">Update</Button>
        <Button onClick={() => deleteTask(task.id)} size="small">Delete</Button>
      </CardActions>
    </Card>);
  };

  const handleOpen = () => setOpen(true);
  const handleClose = () => setOpen(false);

  const handleOpenUpdateModal = (task: Task) => {
    setOpen(true)
    setIdUpdate(task.id)
    setTask({
      name: task.name,
      description: task.description,
      status: task.status
    })
  }

  const fetchTask = async () => {
    let query = `?ownerId=${userId}`
    if (filterStatus !== ETaskStatus.ALL) {
      query = `?ownerId=${userId}&status=${filterStatus}`
    }
    const res: AxiosResponse = await axios.get(`http://localhost:9000/tasks${query}`, {
      headers: {
        'Content-Type': 'application/json',
      },
    })

    if (res.data) {
      setTasks(res.data)
    }
  }

  const handleSave = async () => {
    if (idUpdate) {
      updateTask()
    }
    else {

      const res = await axios.post('http://localhost:9000/tasks', {
        name: task.name,
        description: task.description,
        status: task.status,
        ownerId: userId
      }, {
        headers: {
          'Content-Type': 'application/json',
        }
      })
      if (res) {
        setTask({
          name: '',
          description: '',
          status: ETaskStatus.TO_DO
        })
        handleClose()
        fetchTask()
      }
    }
  }

  const updateTask = async () => {
    const res = await axios.put(`http://localhost:9000/tasks/${idUpdate}`, {
      name: task.name,
      description: task.description,
      status: task.status,
    }, {
      headers: {
        'Content-Type': 'application/json',
      }
    })
    if (res) {
      setTask({
        name: '',
        description: '',
        status: ETaskStatus.TO_DO
      })
      setIdUpdate(null)
      handleClose()
      fetchTask()
    }
  }

  const deleteTask = async (id: string) => {
    const res = await axios.delete(`http://localhost:9000/tasks/${id}`, {
      headers: {
        'Content-Type': 'application/json',
      }
    })
    if (res) {
      fetchTask()
    }
  }

  return (
    <>
      <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
        <div style={{ fontWeight: 'bold', fontSize: 20 }}>Your Task</div>
        <div style={{ display: 'flex', alignItems: 'center' }}>
          <div style={{ marginRight: 10 }}>
            <Select
              labelId="demo-simple-select-label"
              id="demo-simple-select"
              value={filterStatus}
              label="Age"
              onChange={(e: SelectChangeEvent<ETaskStatus>) => {
                setFilterStatus(e.target.value as ETaskStatus);
              }}
            >
              <MenuItem value={ETaskStatus.ALL}>All</MenuItem>
              <MenuItem value={ETaskStatus.TO_DO}>To do</MenuItem>
              <MenuItem value={ETaskStatus.IN_PROGRESS}>In progress</MenuItem>
              <MenuItem value={ETaskStatus.DONE}>Done</MenuItem>
            </Select>
          </div>
          <Button variant="contained" onClick={handleOpen}>Create Task </Button>
        </div>
      </div>
      <div style={{ display: "flex", flexDirection: 'column', marginTop: 50 }}>
        {renderTasks()}
      </div>

      {/* Modal Create */}
      <Modal
        open={open}
        onClose={handleClose}
        aria-labelledby="modal-modal-title"
        aria-describedby="modal-modal-description"
      >
        <Box sx={style}>
          <div style={{ marginBottom: 10 }}>
            <TextField
              fullWidth
              id="outlined-controlled"
              label="Name"
              value={task.name}
              onChange={(event: React.ChangeEvent<HTMLInputElement>) => {
                setTask({ ...task, name: event.target.value });
              }}
            />
          </div>
          <div style={{ marginBottom: 10 }}>
            <TextField
              fullWidth
              id="outlined-controlled"
              label="Description"
              value={task.description}
              onChange={(event: React.ChangeEvent<HTMLInputElement>) => {
                setTask({ ...task, description: event.target.value });
              }}
            />
          </div>
          <div style={{ marginBottom: 10 }}>
            <Select
              labelId="demo-simple-select-label"
              id="demo-simple-select"
              value={task.status}
              label="Age"
              onChange={(e: SelectChangeEvent<ETaskStatus>) => {
                setTask({ ...task, status: e.target.value as ETaskStatus });
              }}
            >
              <MenuItem value={ETaskStatus.TO_DO}>To do</MenuItem>
              <MenuItem value={ETaskStatus.IN_PROGRESS}>In progress</MenuItem>
              <MenuItem value={ETaskStatus.DONE}>Done</MenuItem>
            </Select>
          </div>
          <Button onClick={handleSave}>{idUpdate ? 'Update' : 'Create'}</Button>
        </Box>
      </Modal >

    </>
  );
}

export default Task;
