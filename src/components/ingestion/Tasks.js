// Tasks.js
import React, {useContext, useEffect, useState} from 'react';
import {
    Box,
    Button,
    Container,
    Dialog,
    DialogActions,
    DialogContent,
    DialogContentText,
    DialogTitle,
    Grid,
    IconButton,
    Paper,
    Typography
} from '@mui/material';
import {useAuth0} from "@auth0/auth0-react";
import {SchoolContext} from "../../context/SchoolContext";
import LoadingSmall from "../LoadingSmall";
import InfoIcon from "@mui/icons-material/Info";
import CheckCircleIcon from '@mui/icons-material/CheckCircle';
import ErrorIcon from '@mui/icons-material/Error';
import HourglassEmptyIcon from '@mui/icons-material/HourglassEmpty';

const Tasks = () => {

    const [tasks, setTasks] = useState([]);
    const [currentTask, setCurrentTask] = useState(null);
    const [infoOpen, setInfoOpen] = useState(false);
    const [loading, setLoading] = useState(true);
    const {getAccessTokenSilently} = useAuth0();
    const {
        selectedSchool,
    } = useContext(SchoolContext);
    const {user} = useAuth0();

    useEffect(() => {
        fetchTasks();
    }, [selectedSchool, user]);


    const handleInfoClick = async (task) => {
        const taskInfo = await fetchGetTaskInfo(task);
        setCurrentTask(taskInfo);
        setInfoOpen(true);
    };

    const handleInfoClose = () => {
        setInfoOpen(false);
    };

    const fetchTasks = async () => {
        setLoading(true);
        try {
            const token = await getAccessTokenSilently();
            let queryParams = `schoolId=${user.app_metadata.school}`
            const response = await fetch(`${process.env.REACT_APP_API_ENDPOINT}/api/v1/tasks?${queryParams}`, {
                method: "get",
                headers: {Authorization: `Bearer ${token}`}
            });
            const data = await response.json();
            console.log(data)
            if (data && data.entity) {
                setTasks(data.entity);
            }
        } catch (error) {
            console.error('Error fetching students:', error);
        } finally {
            setLoading(false);
        }
    };

    const fetchGetTaskInfo = async (task) => {
        try {
            const token = await getAccessTokenSilently();
            let queryParams = `schoolId=${user.app_metadata.school}`
            const response = await fetch(`${process.env.REACT_APP_API_ENDPOINT}/api/v1/tasks/${task.taskId}?${queryParams}`, {
                method: "get",
                headers: {Authorization: `Bearer ${token}`}
            });
            const data = await response.json();
            console.log(data)
            return data.entity
            // if (data && data.entity) {
            //     setTasks(data.entity);
            // }
        } catch (error) {
            console.error('Error fetching task info:', error);
        } finally {
            setLoading(false);
        }
    };

    const getStatusIcon = (status) => {
        switch (status) {
            case 'FINISHED':
                return <CheckCircleIcon style={{ color: 'green' }} />;
            case 'FAILED':
                return <ErrorIcon style={{ color: 'red' }} />;
            case 'PENDING':
            default:
                return <HourglassEmptyIcon style={{ color: 'gray' }} />;
        }
    };

    return (
        <Container>
            <Typography variant="h4" gutterBottom>
                Tasks
            </Typography>
            {loading ? (
                <LoadingSmall/>
            ) : (
                <>
                    <Grid container spacing={3}>
                        {tasks.map((task) => (
                            <Grid item xs={12} key={task.taskId}>
                                <Paper elevation={3} style={{ padding: '16px' }}>
                                    <Box display="flex" alignItems="center" justifyContent="space-between">
                                        <Box display="flex" alignItems="center">
                                            {getStatusIcon(task.status)}
                                            <Box ml={2}>
                                                <Typography variant="h6">Task #{task.taskId}</Typography>
                                            </Box>
                                        </Box>
                                        <IconButton
                                            color="primary"
                                            onClick={(e) => {
                                                e.stopPropagation();
                                                handleInfoClick(task);
                                            }}
                                        >
                                            <InfoIcon style={{ color: '#1a73e8' }} />
                                        </IconButton>
                                    </Box>
                                    {/*<Typography variant="body2">Task Type: {task.type}</Typography>*/}
                                    <Typography variant="body2">Job Name: {task.dataflowJobName}</Typography>
                                    <Typography variant="body2">Status: {task.status}</Typography>
                                </Paper>
                            </Grid>
                        ))}
                    </Grid>
                </>
            )}
            {currentTask && (
                <Dialog open={infoOpen} onClose={handleInfoClose}>
                    <DialogTitle>{currentTask.name}</DialogTitle>
                    <DialogContent>
                        <DialogContentText>
                            <h2>Task Info</h2>
                            <p>Dataflow Job ID: {currentTask.dataflowJobId}</p>
                            <p>Dataflow Job Name: {currentTask.dataflowJobName}</p>
                            <p>Task Status: {currentTask.status}</p>
                            <h2>Dataflow Job Info</h2>
                            <p>Type: {currentTask.jobInfo.jobType}</p>
                        </DialogContentText>
                    </DialogContent>
                    <DialogActions>
                        <Button onClick={handleInfoClose} color="primary">
                            Close
                        </Button>
                    </DialogActions>
                </Dialog>
            )}
        </Container>
    );
};

export default Tasks;
