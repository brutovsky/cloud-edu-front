import React, {useEffect, useState} from 'react';
import {
    Checkbox,
    Container,
    Paper,
    Table,
    TableBody,
    TableCell,
    TableContainer,
    TableHead,
    TablePagination,
    TableRow,
    Typography
} from '@mui/material';
import {useAuth0} from "@auth0/auth0-react";
import LoadingSmall from "./LoadingSmall";

const StudentList = () => {
    const [students, setStudents] = useState([]);
    const [loading, setLoading] = useState(true);
    const [page, setPage] = useState(0);
    const [prevPage, setPrevPage] = useState(0);
    const [rowsPerPage, setRowsPerPage] = useState(5);
    const [totalStudents, setTotalStudents] = useState(0);
    const [selected, setSelected] = useState([]);
    const {getAccessTokenSilently} = useAuth0();

    useEffect(() => {
        fetchStudents(page, rowsPerPage);
    }, [page, rowsPerPage]);

    const fetchStudents = async (page, rowsPerPage) => {
        setLoading(true);
        try {
            const token = await getAccessTokenSilently();
            let queryParams = `pageSize=${rowsPerPage}`
            if (students) {
                const firstCursor = students.firstCursor;
                const lastCursor = students.lastCursor;
                if (prevPage < page) {
                    queryParams += `&cursorLast=${lastCursor}`
                }
                if (prevPage > page) {
                    queryParams += `&cursorFirst=${firstCursor}`
                }
            }
            const response = await fetch(`${process.env.REACT_APP_API_ENDPOINT}/api/v1/schools/default-school/students/paginate?${queryParams}`, {
                method: "get",
                headers: {Authorization: `Bearer ${token}`},
                params: {
                    pageSize: rowsPerPage
                }
            });
            const data = await response.json();
            if (data && data.entity && data.entity.students) {
                setStudents(data.entity.students);
                setTotalStudents(data.entity.students.totalCount)
            }
        } catch (error) {
            console.error('Error fetching students:', error);
        } finally {
            setLoading(false);
        }
    };

    const handleChangePage = (event, newPage) => {
        setPrevPage(page)
        setPage(newPage);
    };

    const handleChangeRowsPerPage = (event) => {
        setRowsPerPage(parseInt(event.target.value));
        setPage(0);
        setPrevPage(0);
    };

    const handleDeleteSelected = async () => {
        // try {
        //     await Promise.all(selected.map(id => axios.delete(`/api/v1/schools/default-school/students/${id}`)));
        //     fetchStudents(page, rowsPerPage); // Refresh the list after deletion
        //     setSelected([]);
        // } catch (error) {
        //     console.error('Error deleting students:', error);
        // }
    };

    const handleSelectAllClick = (event) => {
        if (event.target.checked) {
            const newSelected = students.result.map((n) => n.id);
            setSelected(newSelected);
            return;
        }
        setSelected([]);
    };

    const handleClick = (event, id) => {
        const selectedIndex = selected.indexOf(id);
        let newSelected = [];

        if (selectedIndex === -1) {
            newSelected = newSelected.concat(selected, id);
        } else if (selectedIndex === 0) {
            newSelected = newSelected.concat(selected.slice(1));
        } else if (selectedIndex === selected.length - 1) {
            newSelected = newSelected.concat(selected.slice(0, -1));
        } else if (selectedIndex > 0) {
            newSelected = newSelected.concat(
                selected.slice(0, selectedIndex),
                selected.slice(selectedIndex + 1),
            );
        }

        setSelected(newSelected);
    };

    const isSelected = (id) => selected.indexOf(id) !== -1;

    return (
        <Container>
            <Typography variant="h4" gutterBottom>
                Students List
            </Typography>
            {loading ? (
                <LoadingSmall/>
            ) : (
                <Paper>
                    <TableContainer>
                        <Table>
                            <TableHead>
                                <TableRow>
                                    <TableCell padding="checkbox">
                                        <Checkbox
                                            indeterminate={selected.length > 0 && selected.length < students.length}
                                            checked={students.length > 0 && selected.length === students.length}
                                            onChange={handleSelectAllClick}
                                            inputProps={{'aria-label': 'select all students'}}
                                        />
                                    </TableCell>
                                    <TableCell>ID</TableCell>
                                    <TableCell>First Name</TableCell>
                                    <TableCell>Last Name</TableCell>
                                    <TableCell>Email</TableCell>
                                    <TableCell>Grade</TableCell>
                                </TableRow>
                            </TableHead>
                            <TableBody>
                                {students.result !== undefined && students.result.map((student) => {
                                    const isItemSelected = isSelected(student.id);
                                    const labelId = `enhanced-table-checkbox-${student.id}`;

                                    return (
                                        <TableRow
                                            hover
                                            onClick={(event) => handleClick(event, student.id)}
                                            role="checkbox"
                                            aria-checked={isItemSelected}
                                            tabIndex={-1}
                                            key={student.id}
                                            selected={isItemSelected}
                                        >
                                            <TableCell padding="checkbox">
                                                <Checkbox
                                                    checked={isItemSelected}
                                                    inputProps={{'aria-labelledby': labelId}}
                                                />
                                            </TableCell>
                                            <TableCell component="th" id={labelId} scope="student" padding="none">
                                                {student.id}
                                            </TableCell>
                                            <TableCell>{student.firstName}</TableCell>
                                            <TableCell>{student.lastName}</TableCell>
                                            <TableCell>{student.email}</TableCell>
                                            <TableCell>{student.grade}</TableCell>
                                        </TableRow>
                                    );
                                })}
                            </TableBody>
                            {/*<TableBody>*/}
                            {/*    {students.result.map((student) => (*/}
                            {/*        <TableRow key={student.id}>*/}
                            {/*            <TableCell>{student.id}</TableCell>*/}
                            {/*            <TableCell>{student.firstName}</TableCell>*/}
                            {/*            <TableCell>{student.lastName}</TableCell>*/}
                            {/*            <TableCell>{student.email}</TableCell>*/}
                            {/*            <TableCell>{student.grade}</TableCell>*/}
                            {/*        </TableRow>*/}
                            {/*    ))}*/}
                            {/*</TableBody>*/}
                        </Table>
                    </TableContainer>
                    <TablePagination
                        labelRowsPerPage={"Rows per page"}
                        rowsPerPageOptions={[5, 10, 25, 50]}
                        component="div"
                        count={totalStudents}
                        page={page}
                        onPageChange={handleChangePage}
                        rowsPerPage={rowsPerPage}
                        onRowsPerPageChange={handleChangeRowsPerPage}
                    />
                </Paper>
            )}
        </Container>
    );
};

export default StudentList;
