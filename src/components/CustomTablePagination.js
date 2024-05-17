import React from 'react';
import { IconButton, TablePagination, useTheme } from '@mui/material';
import DeleteIcon from '@mui/icons-material/Delete';
import FirstPageIcon from '@mui/icons-material/FirstPage';
import LastPageIcon from '@mui/icons-material/LastPage';
import KeyboardArrowLeft from '@mui/icons-material/KeyboardArrowLeft';
import KeyboardArrowRight from '@mui/icons-material/KeyboardArrowRight';

const CustomTablePagination = (props) => {
    const { count, page, rowsPerPage, onPageChange, onDeleteSelected, rowsPerPageOptions, onRowsPerPageChange } = props;
    const theme = useTheme();

    const handleFirstPageButtonClick = (event) => {
        onPageChange(event, 0);
    };

    const handleBackButtonClick = (event) => {
        onPageChange(event, page - 1);
    };

    const handleNextButtonClick = (event) => {
        onPageChange(event, page + 1);
    };

    const handleLastPageButtonClick = (event) => {
        onPageChange(event, Math.max(0, Math.ceil(count / rowsPerPage) - 1));
    };

    return (
        <div style={{ display: 'flex', alignItems: 'center' }}>
            <IconButton onClick={onDeleteSelected} aria-label="delete selected">
                <DeleteIcon />
            </IconButton>
            <TablePagination
                component="div"
                count={count}
                page={page}
                onPageChange={onPageChange}
                rowsPerPage={rowsPerPage}
                onRowsPerPageChange={onRowsPerPageChange}
                rowsPerPageOptions={rowsPerPageOptions}
                ActionsComponent={() => (
                    <div style={{ flexShrink: 0, marginLeft: theme.spacing(2.5) }}>
                        <IconButton
                            onClick={handleFirstPageButtonClick}
                            disabled={page === 0}
                            aria-label="first page"
                        >
                            {theme.direction === 'rtl' ? <LastPageIcon /> : <FirstPageIcon />}
                        </IconButton>
                        <IconButton
                            onClick={handleBackButtonClick}
                            disabled={page === 0}
                            aria-label="previous page"
                        >
                            {theme.direction === 'rtl' ? <KeyboardArrowRight /> : <KeyboardArrowLeft />}
                        </IconButton>
                        <IconButton
                            onClick={handleNextButtonClick}
                            disabled={page >= Math.ceil(count / rowsPerPage) - 1}
                            aria-label="next page"
                        >
                            {theme.direction === 'rtl' ? <KeyboardArrowLeft /> : <KeyboardArrowRight />}
                        </IconButton>
                        <IconButton
                            onClick={handleLastPageButtonClick}
                            disabled={page >= Math.ceil(count / rowsPerPage) - 1}
                            aria-label="last page"
                        >
                            {theme.direction === 'rtl' ? <FirstPageIcon /> : <LastPageIcon />}
                        </IconButton>
                    </div>
                )}
            />
        </div>
    );
};

export default CustomTablePagination;
