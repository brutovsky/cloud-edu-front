import React, {useContext, useEffect, useRef, useState} from 'react';
import {
    Button,
    Checkbox,
    Container,
    Dialog,
    DialogActions,
    DialogContent,
    DialogContentText,
    DialogTitle,
    Grid,
    IconButton,
    Pagination,
    Paper,
    Typography
} from '@mui/material';
import DescriptionIcon from '@mui/icons-material/Description';
import InsertDriveFileIcon from '@mui/icons-material/InsertDriveFile';
import DeleteIcon from '@mui/icons-material/Delete';
import InfoIcon from '@mui/icons-material/Info';
import DownloadIcon from '@mui/icons-material/Download';
import SingleFileUploader from "./SingleFileUploader";
import {useAuth0} from "@auth0/auth0-react";
import LoadingSmall from "../LoadingSmall";
import {SchoolContext} from "../../context/SchoolContext";
import TaskFormDialog from "./TaskFormDialog";

const FileGrid = () => {
    const [showTaskForm, setShowTaskForm] = useState(false);
    const [files, setFiles] = useState([]);
    const [selectedFiles, setSelectedFiles] = useState([]);
    const [infoOpen, setInfoOpen] = useState(false);
    const [currentFile, setCurrentFile] = useState(null);
    const [page, setPage] = useState(1);
    const [rowsPerPage, setRowsPerPage] = useState(5);
    const [loading, setLoading] = useState(true);
    const [addFileOpen, setAddFileOpen] = useState(false);
    const filesPerPage = 10;
    const {getAccessTokenSilently} = useAuth0();
    const {selectedSchool} = useContext(SchoolContext);
    const {user, isAuthenticated, isLoading} = useAuth0();

    useEffect(() => {
        fetchFields(page, rowsPerPage);
    }, [page, rowsPerPage, selectedSchool, user]);

    const fetchFields = async (page, rowsPerPage) => {
        setLoading(true);
        try {
            const token = await getAccessTokenSilently();
            let queryParams = `schoolId=${user.app_metadata.school}`
            const response = await fetch(`${process.env.REACT_APP_API_ENDPOINT}/api/v1/files?${queryParams}`, {
                method: "get",
                headers: {Authorization: `Bearer ${token}`}
            });
            const data = await response.json();
            console.log(data)
            if (data && data.entity) {
                setFiles(data.entity);
            }
        } catch (error) {
            console.error('Error fetching students:', error);
        } finally {
            setLoading(false);
        }
    };

    const deleteFile = async (file) => {
        try {
            const token = await getAccessTokenSilently();
            let queryParams = `schoolId=${user.app_metadata.school}`
            const response = await fetch(`${process.env.REACT_APP_API_ENDPOINT}/api/v1/files/${file.filename}?${queryParams}`, {
                method: "delete",
                headers: {Authorization: `Bearer ${token}`}
            });
            const result = await response.ok;
            if (result) {
                setFiles(files.filter(f => f.id !== file.id));
            }
        } catch (error) {
            console.error('Error deleting file:', error);
        } finally {
            setLoading(false);
        }
    };

    const createTask = async (file) => {
        try {
            const token = await getAccessTokenSilently();
            let queryParams = `schoolId=${user.app_metadata.school}`
            const response = await fetch(`${process.env.REACT_APP_API_ENDPOINT}/api/v1/files/${file.filename}?${queryParams}`, {
                method: "delete",
                headers: {Authorization: `Bearer ${token}`}
            });
            const result = await response.ok;
            if (result) {
                setFiles(files.filter(f => f.id !== file.id));
            }
        } catch (error) {
            console.error('Error deleting file:', error);
        } finally {
            setLoading(false);
        }
    };


    const handleInfoClick = (file) => {
        setCurrentFile(file);
        setInfoOpen(true);
    };

    const handleInfoClose = () => {
        setInfoOpen(false);
    };

    const handleTaskFormClose = () => {
        setShowTaskForm(false);
        setSelectedFiles([]);
    };

    const handleDelete = async (file) => {
        await deleteFile(file);
    };

    const handleTaskCreate = async () => {
        // await createTask(selectedFiles[0]);
        setShowTaskForm(true);
    }

    const handleBatchDelete = async () => {
        await deleteFile(selectedFiles[0]);
        setSelectedFiles([]);
    };

    const handleSelect = (file) => {
        setSelectedFiles(selectedFiles.includes(file) ? [] : [file]);
    };

    const handlePageChange = (event, value) => {
        setPage(value);
    };

    const handleAddFileOpen = () => {
        setAddFileOpen(true);
    };

    const handleAddFileClose = () => {
        setAddFileOpen(false);
    };

    const iframeRef = useRef(null);

    const handleFileDownload = (url) => {
        // Create a temporary iframe and set its source to the signed URL
        const iframe = document.createElement('iframe');
        iframe.style.display = 'none';
        iframe.src = url;
        document.body.appendChild(iframe);
        iframe.onload = () => {
            document.body.removeChild(iframe);
        };
    };

    const handleDownload = async (file) => {
        if (file) {
            try {
                const token = await getAccessTokenSilently();
                let queryParams = `schoolId=${user.app_metadata.school}`
                const response = await fetch(`${process.env.REACT_APP_API_ENDPOINT}/api/v1/files/${file.filename}?${queryParams}`, {
                    method: "get",
                    headers: {Authorization: `Bearer ${token}`}
                });
                const data = await response.json();
                console.log(data)
                if (data && data.entity) {
                    handleFileDownload(data.entity)
                }
            } catch (error) {
                console.error('Error downloading file: ', error);
            }
        }
    };

    const handleFileUpload = (file) => {
        if (file) {
            const newFile = {
                id: files.length + 1,
                filename: file.name,
                type: file.name.split('.').pop().toUpperCase(),
                content: file,
            };
            setFiles([...files, newFile]);
            setAddFileOpen(false);
        }
    };

    const displayedFiles = files.slice((page - 1) * filesPerPage, page * filesPerPage);

    return (
        <Container>
            <Typography variant="h4" gutterBottom>
                User Uploaded Files
            </Typography>
            {loading ? (
                <LoadingSmall/>
            ) : (
                <>
                    <Grid container spacing={3}>
                        {displayedFiles.map((file, index) => (
                            <Grid item xs={2.4} key={index}>
                                <Paper
                                    elevation={3}
                                    style={{
                                        padding: '16px',
                                        textAlign: 'center',
                                        position: 'relative',
                                        backgroundColor: '#f1f3f4',
                                        aspectRatio: '1 / 1',
                                        display: 'flex',
                                        flexDirection: 'column',
                                        justifyContent: 'center',
                                        alignItems: 'center'
                                    }}
                                >
                                    <Checkbox
                                        checked={selectedFiles.includes(file)}
                                        onChange={(e) => {
                                            e.stopPropagation();
                                            handleSelect(file);
                                        }}
                                        style={{position: 'absolute', top: '8px', left: '8px'}}
                                    />
                                    {file.type === 'CSV' ? (
                                        <DescriptionIcon fontSize="large" style={{color: 'green'}}/>
                                    ) : (
                                        <InsertDriveFileIcon fontSize="large" style={{color: 'grey'}}/>
                                    )}
                                    <Typography variant="body1" style={{color: '#202124'}}>{file.filename}</Typography>
                                    <IconButton
                                        color="secondary"
                                        onClick={async (e) => {
                                            e.stopPropagation();
                                            await handleDelete(file);
                                        }}
                                        style={{position: 'absolute', bottom: '8px', right: '8px'}}
                                    >
                                        <DeleteIcon style={{color: '#ea4335'}}/>
                                    </IconButton>
                                    <IconButton
                                        color="primary"
                                        onClick={(e) => {
                                            e.stopPropagation();
                                            handleInfoClick(file);
                                        }}
                                        style={{position: 'absolute', top: '8px', right: '8px'}}
                                    >
                                        <InfoIcon style={{color: '#1a73e8'}}/>
                                    </IconButton>
                                    <IconButton
                                        color="primary"
                                        onClick={async (e) => {
                                            e.stopPropagation();
                                            await handleDownload(file);
                                        }}
                                        style={{position: 'absolute', bottom: '8px', left: '8px'}}
                                    >
                                        <DownloadIcon style={{color: '#1a73e8'}}/>
                                    </IconButton>
                                </Paper>
                            </Grid>
                        ))}
                    </Grid>
                    <Pagination count={Math.ceil(files.length / filesPerPage)} page={page} onChange={handlePageChange}
                                style={{marginTop: '16px'}} color="primary"/>
                    <Button
                        onClick={handleTaskCreate}
                        disabled={selectedFiles.length !== 1}
                        style={{
                            marginTop: '16px',
                            marginRight: '8px',
                            color: selectedFiles.length > 0 ? '#1a73e8' : '#a0a0a0'
                        }}
                    >
                        Create a New Task From File
                    </Button>
                    <Button
                        onClick={async () => {
                            await handleBatchDelete();
                        }}
                        disabled={selectedFiles.length !== 1}
                        style={{
                            marginTop: '16px',
                            marginRight: '8px',
                            color: selectedFiles.length > 0 ? '#1a73e8' : '#a0a0a0'
                        }}
                    >
                        Delete Selected Files
                    </Button>
                    <Button
                        onClick={handleAddFileOpen}
                        style={{
                            marginTop: '16px',
                            color: '#1a73e8'
                        }}
                    >
                        Add New File
                    </Button>
                    {currentFile && (
                        <Dialog open={infoOpen} onClose={handleInfoClose}>
                            <DialogTitle>{currentFile.filename}</DialogTitle>
                            <DialogContent>
                                <DialogContentText>
                                    Description for {currentFile.filename}
                                </DialogContentText>
                            </DialogContent>
                            <DialogActions>
                                <Button onClick={handleInfoClose} color="primary">
                                    Close
                                </Button>
                            </DialogActions>
                        </Dialog>
                    )}
                    {showTaskForm && (
                        <TaskFormDialog
                            showTaskForm={showTaskForm}
                            handleTaskFormClose={handleTaskFormClose}
                            selectedFile={selectedFiles[0]}
                            selectedSchool={selectedSchool}
                            getAccessTokenSilently={getAccessTokenSilently}
                        />
                    )}
                    <Dialog open={addFileOpen} onClose={handleAddFileClose}>
                        <DialogTitle>Add New File</DialogTitle>
                        <DialogContent>
                            <SingleFileUploader onFileUpload={handleFileUpload}/>
                        </DialogContent>
                        <DialogActions>
                            <Button onClick={handleAddFileClose} color="primary">
                                Cancel
                            </Button>
                        </DialogActions>
                    </Dialog>
                </>
            )}
        </Container>
    );
};

export default FileGrid;
