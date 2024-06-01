import React, {useState} from 'react';
import {
    Button,
    Dialog,
    DialogActions,
    DialogContent,
    DialogContentText,
    DialogTitle,
    FormControl,
    FormHelperText,
    InputLabel,
    MenuItem,
    Select,
    TextField
} from '@mui/material';

const validTypes = ["CSV", "JSON"];

const tasksMap = {
    "CSV": "CSV_TO_FIRESTORE",
    "JSON": "SQL_TO_FIRESTORE"
};
const getDefaultType = (type) => validTypes.includes(type) ? type : "";

const TaskFormDialog = ({showTaskForm, handleTaskFormClose, selectedFile, selectedSchool, getAccessTokenSilently}) => {
    const [taskType, setTaskType] = useState(getDefaultType(selectedFile.type));
    const [schoolId, setSchoolId] = useState('');
    const [fileLocation, setFileLocation] = useState('');
    const [entityType, setEntityType] = useState('');

    const handleTypeChange = (event) => {
        setTaskType(event.target.value);
    };

    const handleSchoolIdChange = (event) => {
        setSchoolId(event.target.value);
    };

    const handleFileLocationChange = (event) => {
        setFileLocation(event.target.value);
    };

    const handleEntityTypeChange = (event) => {
        setEntityType(event.target.value);
    };

    const isValidType = validTypes.includes(taskType);

    const createTask = async (file) => {
        try {
            const token = await getAccessTokenSilently();
            // ?type=CSV_TO_FIRESTORE&entityType=STUDENTS_INFO&schoolId=default-school&filename=students.csv
            const queryParams = new URLSearchParams({
                type: tasksMap[taskType],
                entityType: entityType,
                schoolId: selectedSchool,
                filename: selectedFile.filename
            }).toString();

            const response = await fetch(`${process.env.REACT_APP_API_ENDPOINT}/api/v1/tasks?${queryParams}`, {
                method: "post",
                headers: {
                    Authorization: `Bearer ${token}`
                }
            });
            const result = await response.data;
            console.log(result);
            if (result) {

            }
        } catch (error) {
            console.error('Error creating a task:', error);
        } finally {
            handleTaskFormClose();
        }
    };

    return (
        <Dialog open={showTaskForm} onClose={handleTaskFormClose}>
            <DialogTitle>Create New Task for {selectedFile.filename} file</DialogTitle>
            <DialogContent>
                {!isValidType ?
                    (<FormHelperText style={{color: 'red'}}><h2>Invalid file type selected</h2></FormHelperText>)
                    :
                    (
                        <>
                            <DialogContentText>
                                Please fill out the form below to create a new task.
                            </DialogContentText>
                            <FormControl fullWidth margin="normal">
                                <InputLabel shrink={true}>Type</InputLabel>
                                <Select value={taskType} displayEmpty defaultValue={""}>
                                    <MenuItem value="CSV">Csv To Firestore</MenuItem>
                                    <MenuItem value="JSON">MySQL To Firestore</MenuItem>
                                </Select>
                            </FormControl>
                        </>
                    )
                }
                <TextField
                    fullWidth
                    margin="normal"
                    label="School ID"
                    value={selectedSchool}
                />
                <TextField
                    fullWidth
                    margin="normal"
                    label="File Location"
                    value={selectedFile.fullpath}
                />
                <FormControl fullWidth margin="normal">
                    <InputLabel shrink>Type of Entity</InputLabel>
                    <Select value={entityType} onChange={handleEntityTypeChange}>
                        <MenuItem value="STUDENTS_INFO">Students Info</MenuItem>
                        <MenuItem value="TEACHER_INFO">Teachers Info</MenuItem>
                    </Select>
                </FormControl>

            </DialogContent>
            <DialogActions>
                <Button onClick={handleTaskFormClose} color="primary">
                    Close
                </Button>
                <Button disabled={!isValidType} onClick={async () => {
                    await createTask()
                    console.log(selectedFile)
                }} color="primary">
                    Create Task
                </Button>
            </DialogActions>
        </Dialog>
    );
};

export default TaskFormDialog;
