import React, {useState} from 'react';
import {Box, Button, TextField, Typography} from '@mui/material';
import {useNavigate} from 'react-router-dom';

const RequestNewSchool = () => {
    const navigate = useNavigate();
    const [formData, setFormData] = useState({
        fullName: '',
        phoneNumber: '',
        email: '',
        numberOfStudents: '',
        region: '',
        address: '',
        typeOfEducation: ''
    });

    const handleChange = (e) => {
        const {name, value} = e.target;
        setFormData({...formData, [name]: value});
    };

    const handleBackButtonClick = (e) => {
        navigate('/');
    };

    const makeRequest = async (formData) => {
        try {
            const response = await fetch(`${process.env.REACT_APP_API_ENDPOINT}/api/v1/schools/requests/new`, {
                method: "POST",
                headers: {
                    "Content-Type": "application/json"
                },
                body: JSON.stringify(formData)
            });
            if (!response.ok) {
                throw new Error('Network response was not ok');
            }
            const result = await response.json();
            console.log(result);
        } catch (error) {
            console.error('Error making a request:', error);
        }
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        // Handle form submission logic here
        console.log(formData);
        await makeRequest();
        navigate('/');
    };

    return (
        <Box sx={{p: 3}}>
            <Typography variant="h4" gutterBottom>
                Make a Request
            </Typography>
            <Box component="form" onSubmit={handleSubmit} noValidate>
                <TextField
                    margin="dense"
                    name="fullName"
                    label="Full Name"
                    type="text"
                    fullWidth
                    value={formData.fullName}
                    onChange={handleChange}
                    required
                />
                <TextField
                    margin="dense"
                    name="phoneNumber"
                    label="Phone Number"
                    type="text"
                    fullWidth
                    value={formData.phoneNumber}
                    onChange={handleChange}
                    required
                />
                <TextField
                    margin="dense"
                    name="email"
                    label="Email"
                    type="email"
                    fullWidth
                    value={formData.email}
                    onChange={handleChange}
                    required
                />
                <TextField
                    margin="dense"
                    name="numberOfStudents"
                    label="Number of Students"
                    type="number"
                    fullWidth
                    value={formData.numberOfStudents}
                    onChange={handleChange}
                    required
                />
                <TextField
                    margin="dense"
                    name="region"
                    label="Region"
                    type="text"
                    fullWidth
                    value={formData.region}
                    onChange={handleChange}
                    required
                />
                <TextField
                    margin="dense"
                    name="address"
                    label="Address"
                    type="text"
                    fullWidth
                    value={formData.address}
                    onChange={handleChange}
                    required
                />
                <TextField
                    margin="dense"
                    name="typeOfEducation"
                    label="Type of Education"
                    type="text"
                    fullWidth
                    value={formData.typeOfEducation}
                    onChange={handleChange}
                    required
                />
                <Box sx={{display: 'flex', justifyContent: 'flex-end', mt: 2}}>
                    <Button
                        variant="contained"
                        color="primary"
                        sx={{mr: 2}} // Add margin-right for spacing between buttons
                        onClick={handleBackButtonClick}
                    >
                        Back
                    </Button>
                    <Button
                        variant="contained"
                        sx={{backgroundColor: 'green'}} // Add custom green background color
                        type="submit"
                    >
                        Submit
                    </Button>
                </Box>
            </Box>
        </Box>
    );
};

export default RequestNewSchool;
