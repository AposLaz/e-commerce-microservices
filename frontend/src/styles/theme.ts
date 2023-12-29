// Theme for project
import { createTheme } from '@mui/material/styles';

const theme = createTheme({
    palette: {
        mode: 'light',
        primary: {
            main: '#1971C2',
        },
        secondary: {
            main: '#B72025',
        },
        success: {
            main: '#fff',
        },
        error: {
            main: '#CF000F',
        },
    },
    typography: {
        fontFamily: 'sans-serif',
    },
});

export default theme;
