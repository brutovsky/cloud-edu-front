import {Box, Typography} from "@mui/material";
import React from "react";

const Footer = () => {
    return <>
        <Box component="footer" sx={{
            p: 2,
            bgcolor: 'background.paper',
            textAlign: 'center',
            mt: 'auto',
            width: '100%'
        }}>
            <Typography variant="body1">
                My Awesome CloudEDU Portal © {new Date().getFullYear()}
            </Typography>
        </Box>
    </>;
}

export default Footer;
