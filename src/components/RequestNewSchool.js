import React, {useState} from 'react';
import {Box, Button, FormControl, InputLabel, MenuItem, Select, TextField, Typography} from '@mui/material';
import {useNavigate} from 'react-router-dom';
import {toast, ToastContainer} from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';

const regionsOfUkraine = [
    "Cherkasy", "Chernihiv", "Chernivtsi", "Dnipropetrovsk", "Donetsk", "Ivano-Frankivsk", "Kharkiv", "Kherson",
    "Khmelnytskyi", "Kirovohrad", "Kyiv", "Luhansk", "Lviv", "Mykolaiv", "Odessa", "Poltava", "Rivne",
    "Sumy", "Ternopil", "Vinnytsia", "Volyn", "Zakarpattia", "Zaporizhzhia", "Zhytomyr"
];

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

    const [errors, setErrors] = useState({});
    const [isSubmitting, setIsSubmitting] = useState(false);

    const handleChange = (e) => {
        const {name, value} = e.target;
        setFormData({...formData, [name]: value});
    };

    const validate = () => {
        let tempErrors = {};
        tempErrors.fullName = formData.fullName ? "" : "Full Name is required.";
        tempErrors.phoneNumber = (/^\+?(\d.*){3,}$/).test(formData.phoneNumber) ? "" : "Phone Number is not valid.";
        tempErrors.email = (/^$|.+@.+..+/).test(formData.email) ? "" : "Email is not valid.";
        tempErrors.numberOfStudents = formData.numberOfStudents >= 1 ? "" : "Number of Students must be at least 1.";
        tempErrors.region = formData.region ? "" : "Region is required.";
        tempErrors.address = formData.address ? "" : "Address is required.";
        tempErrors.typeOfEducation = formData.typeOfEducation ? "" : "Type of Education is required.";
        setErrors(tempErrors);
        return Object.values(tempErrors).every(x => x === "");
    };

    const handleBackButtonClick = () => {
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
            toast.success(`Request successful: ${JSON.stringify(result.message)}`);
            // navigate('/');
        } catch (error) {
            toast.error(`Error making a request: ${error.message}`);
            setIsSubmitting(false);
        }
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        if (validate()) {
            setIsSubmitting(true);
            await makeRequest(formData);
        }
    };

    return (
        <Box sx={{p: 3}}>
            <Typography variant="h4" gutterBottom>
                Make a Request to Join
            </Typography>
            <Typography variant="p" gutterBottom color="gray">
                Fill info about your school
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
                    error={!!errors.fullName}
                    helperText={errors.fullName}
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
                    error={!!errors.phoneNumber}
                    helperText={errors.phoneNumber}
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
                    error={!!errors.email}
                    helperText={errors.email}
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
                    error={!!errors.numberOfStudents}
                    helperText={errors.numberOfStudents}
                    inputProps={{min: 1}}
                />
                <FormControl fullWidth margin="dense" required error={!!errors.region}>
                    <InputLabel>Region</InputLabel>
                    <Select
                        name="region"
                        value={formData.region}
                        onChange={handleChange}
                        label="Region"
                    >
                        {regionsOfUkraine.map((region) => (
                            <MenuItem key={region} value={region}>
                                {region}
                            </MenuItem>
                        ))}
                    </Select>
                    {errors.region && <Typography color="error" variant="caption">{errors.region}</Typography>}
                </FormControl>
                <TextField
                    margin="dense"
                    name="address"
                    label="Address"
                    type="text"
                    fullWidth
                    value={formData.address}
                    onChange={handleChange}
                    required
                    error={!!errors.address}
                    helperText={errors.address}
                />
                <FormControl fullWidth margin="dense" required error={!!errors.typeOfEducation}>
                    <InputLabel>Type of Education</InputLabel>
                    <Select
                        name="typeOfEducation"
                        value={formData.typeOfEducation}
                        onChange={handleChange}
                        label="Type of Education"
                    >
                        <MenuItem value="Remote">Remote</MenuItem>
                        <MenuItem value="Offline">Offline</MenuItem>
                        <MenuItem value="Mixed">Mixed</MenuItem>
                    </Select>
                    {errors.typeOfEducation &&
                        <Typography color="error" variant="caption">{errors.typeOfEducation}</Typography>}
                </FormControl>
                <Box sx={{display: 'flex', justifyContent: 'flex-end', mt: 2}}>
                    <Button
                        variant="contained"
                        color="primary"
                        sx={{mr: 2}}
                        onClick={handleBackButtonClick}
                    >
                        Back
                    </Button>
                    <Button
                        variant="contained"
                        sx={{backgroundColor: 'green'}}
                        type="submit"
                        disabled={isSubmitting}
                    >
                        Submit
                    </Button>
                </Box>
            </Box>
            <ToastContainer/>
        </Box>
    );
};

export default RequestNewSchool;
