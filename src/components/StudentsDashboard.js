import React from 'react';
import {Paper, Table, TableBody, TableCell, TableContainer, TableHead, TableRow} from '@mui/material';

// Mock data for the table
const studentsData = [
    {id: 1, name: "John Doe", age: 16, grade: "10th", email: "johndoe@example.com"},
    {id: 2, name: "Jane Smith", age: 17, grade: "11th", email: "janesmith@example.com"},
    {id: 3, name: "Alice Johnson", age: 15, grade: "9th", email: "alicejohnson@example.com"},
];

function StudentsDashboard() {
    return (
        <div>
            <h1>Students Dashboard:</h1>
            <TableContainer component={Paper}>
                <Table aria-label="simple table">
                    <TableHead>
                        <TableRow>
                            <TableCell>ID</TableCell>
                            <TableCell>Name</TableCell>
                            <TableCell>Age</TableCell>
                            <TableCell>Grade</TableCell>
                            <TableCell>Email</TableCell>
                        </TableRow>
                    </TableHead>
                    <TableBody>
                        {studentsData.map((student) => (
                            <TableRow key={student.id}>
                                <TableCell component="th" scope="row">
                                    {student.id}
                                </TableCell>
                                <TableCell>{student.name}</TableCell>
                                <TableCell>{student.age}</TableCell>
                                <TableCell>{student.grade}</TableCell>
                                <TableCell>{student.email}</TableCell>
                            </TableRow>
                        ))}
                    </TableBody>
                </Table>
            </TableContainer>
        </div>
    );
}

export default StudentsDashboard;
