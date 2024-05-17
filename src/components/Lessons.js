import React, {useState} from 'react';
import {
    Box,
    Button,
    Dialog,
    DialogActions,
    DialogContent,
    DialogTitle,
    Grid,
    List,
    ListItem,
    ListItemText,
    Paper,
    Typography
} from '@mui/material';

const lessons = [
    {id: 1, date: new Date(2024, 4, 22), title: 'Lesson 1: Introduction to React'},
    {id: 2, date: new Date(2024, 4, 22), title: 'Lesson 2: React Components'},
    {id: 3, date: new Date(2024, 4, 22), title: 'Lesson 3: State and Props'},
    {id: 4, date: new Date(2024, 4, 22), title: 'Lesson 4: React Hooks'},
    {id: 5, date: new Date(2024, 4, 24), title: 'Lesson 5: React Router'},
    // Add more lessons as needed
];

function LessonsCalendar() {
    const [selectedDate, setSelectedDate] = useState(null);
    const [open, setOpen] = useState(false);

    const daysInMonth = (year, month) => new Date(year, month + 1, 0).getDate();
    const firstDayOfMonth = (year, month) => new Date(year, month, 1).getDay();

    const today = new Date();
    const [currentDate, setCurrentDate] = useState(today);

    const handlePrevMonth = () => {
        setCurrentDate(new Date(currentDate.getFullYear(), currentDate.getMonth() - 1, 1));
    };

    const handleNextMonth = () => {
        setCurrentDate(new Date(currentDate.getFullYear(), currentDate.getMonth() + 1, 1));
    };

    const handleDateClick = (date) => {
        setSelectedDate(date);
        setOpen(true);
    };

    const handleClose = () => {
        setOpen(false);
    };

    const year = currentDate.getFullYear();
    const month = currentDate.getMonth();
    const daysInCurrentMonth = daysInMonth(year, month);
    const firstDay = firstDayOfMonth(year, month);

    const dates = [];
    for (let i = 0; i < firstDay; i++) {
        dates.push(null);
    }
    for (let i = 1; i <= daysInCurrentMonth; i++) {
        dates.push(new Date(year, month, i));
    }

    const lessonsForDate = (date) => lessons.filter(lesson => lesson.date.toDateString() === date.toDateString());

    return (
        <Box>
            <Typography variant="h4" gutterBottom>
                Lessons Calendar
            </Typography>
            <Box display="flex" justifyContent="space-between" mb={2}>
                <Button onClick={handlePrevMonth}>Previous</Button>
                <Typography variant="h6">{currentDate.toLocaleString('default', {
                    month: 'long',
                    year: 'numeric'
                })}</Typography>
                <Button onClick={handleNextMonth}>Next</Button>
            </Box>
            <Grid container spacing={1}>
                {['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'].map((day) => (
                    <Grid item xs={1.7} key={day}>
                        <Typography variant="subtitle2" align="center">{day}</Typography>
                    </Grid>
                ))}
                {dates.map((date, index) => (
                    <Grid item xs={1.7} key={index}>
                        <Paper
                            elevation={2}
                            style={{
                                height: 80,
                                backgroundColor: date
                                    ? (date.toDateString() === today.toDateString() ? '#fbbc05' : lessonsForDate(date).length > 0 ? '#1a73e8' : '#f0f0f0')
                                    : 'transparent',
                                cursor: date ? 'pointer' : 'default',
                                display: 'flex',
                                flexDirection: 'column',
                                justifyContent: 'center',
                                alignItems: 'center',
                                position: 'relative',
                                overflow: 'hidden',
                                transition: 'background-color 0.3s ease',
                                color: date && (date.toDateString() === today.toDateString() || lessonsForDate(date).length > 0) ? '#fff' : '#000'
                            }}
                            onClick={() => date && handleDateClick(date)}
                            onMouseOver={(e) => date && (e.currentTarget.style.backgroundColor = date.toDateString() === today.toDateString() ? '#fbbc05' : lessonsForDate(date).length > 0 ? '#0f5ba7' : '#e0e0e0')}
                            onMouseOut={(e) => date && (e.currentTarget.style.backgroundColor = date.toDateString() === today.toDateString() ? '#fbbc05' : lessonsForDate(date).length > 0 ? '#1a73e8' : '#f0f0f0')}
                        >
                            {date && (
                                <Typography variant="body2">
                                    {date.getDate()}
                                </Typography>
                            )}
                            {date && lessonsForDate(date).length > 0 && (
                                <Typography variant="caption" style={{marginTop: 4}}>
                                    {lessonsForDate(date).length} lessons
                                </Typography>
                            )}
                        </Paper>
                    </Grid>

                ))}
            </Grid>
            {selectedDate && (
                <Dialog open={open} onClose={handleClose}>
                    <DialogTitle>Lessons for {selectedDate.toDateString()}</DialogTitle>
                    <DialogContent>
                        <List>
                            {lessonsForDate(selectedDate).map(lesson => (
                                <ListItem key={lesson.id}>
                                    <ListItemText primary={lesson.title}/>
                                </ListItem>
                            ))}
                        </List>
                    </DialogContent>
                    <DialogActions>
                        <Button onClick={handleClose} color="primary">
                            Close
                        </Button>
                    </DialogActions>
                </Dialog>
            )}
        </Box>
    );
}

export default LessonsCalendar;
