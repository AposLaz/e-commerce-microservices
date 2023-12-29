import React from 'react'
import CircularProgress from '@mui/material/CircularProgress';
import { Box } from '@mui/material';

const Loading = () => {
  return (
    <Box sx={{ display: 'flex', justifyContent: 'center' }}>
        <CircularProgress size={120} />
    </Box>
  )
}

export default Loading