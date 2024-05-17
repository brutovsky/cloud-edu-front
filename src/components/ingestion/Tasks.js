// Tasks.js
import React, {useContext, useEffect, useState} from 'react';
import {
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

const mockTasks = [
    {id: 1, entity: 'Task 1', operation: 'Upload', progress: 50, status: 'In Progress'},
    {id: 2, entity: 'Task 2', operation: 'Download', progress: 100, status: 'Completed'},
    {id: 3, entity: 'Task 3', operation: 'Process', progress: 25, status: 'In Progress'},
    // Add more mock tasks as needed
];

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
        console.log('i fire once');
    }, [selectedSchool, user]);


    const handleInfoClick = (task) => {
        setCurrentTask(task);
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
                            <Grid item xs={12} key={task.id}>
                                <Paper elevation={3} style={{padding: '16px'}}>
                                    <Typography variant="h6">{task.dataflowJobId}</Typography>
                                    {/*<Typography variant="body1">Operation: {task.operation}</Typography>*/}
                                    <Typography variant="body2">Status: {task.status}</Typography>
                                    {/*<Box display="flex" alignItems="center">*/}
                                    {/*    <Box width="100%" mr={1}>*/}
                                    {/*        <LinearProgress variant="determinate" value={task.progress} />*/}
                                    {/*    </Box>*/}
                                    {/*    <Box minWidth={35}>*/}
                                    {/*        <Typography variant="body2" color="textSecondary">{`${task.progress}%`}</Typography>*/}
                                    {/*    </Box>*/}
                                    {/*</Box>*/}
                                    <IconButton
                                        color="primary"
                                        onClick={(e) => {
                                            e.stopPropagation();
                                            handleInfoClick(task);
                                        }}
                                    >
                                        <InfoIcon style={{color: '#1a73e8'}}/>
                                    </IconButton>
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
                            Dataflow Job ID: {currentTask.dataflowJobId}
                            Status: {currentTask.status}
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
