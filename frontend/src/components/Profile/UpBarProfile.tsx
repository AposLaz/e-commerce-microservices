import { Avatar, Box, Typography } from '@mui/material'
import { useSession } from 'next-auth/react';
import React from 'react'

const styles = {
    UpBarProfileStyles: {
        borderRadious: '15px',
        boxShadow: 'rgba(17, 17, 26, 0.1) 0px 0px 16px',
        marginTop: '2rem',
        padding: '1.5rem 3rem',
        display: 'flex'
    }
}

const UpBarProfile = () => {
    const {data: session} = useSession();

  return (
    <Box sx={styles.UpBarProfileStyles}>
        <Box sx={{display: 'flex'}}>
            {
              session?.user?.image ?
                (<Avatar 
                    sx={{
                        width:'150px', 
                        height: '150px',
                        border: '1px solid #333'
                    }} 
                    alt={session?.user?.name!} 
                    src={session?.user?.image!} 
                />):(
                    <Avatar 
                    sx={{
                        width:'150px', 
                        height: '150px',
                        border: '1px solid #333',
                        fontSize: '8rem'
                    }} 
                    alt={session?.user?.name!} 
                    src={session?.user?.image!} 
                    >
                        {session?.user?.name!.charAt(0).toLocaleUpperCase()}
                    </Avatar>
                )
            }
            <Box sx={{margin: '1rem'}}>
                <Typography sx={{fontWeight: 'bold',fontSize:'28px'}}>{session?.user?.name}</Typography>
                <Typography sx={{fontSize:'20px'}}>{session?.user?.email}</Typography>
                <Typography variant="overline" sx={{fontSize:'13px',color:'gray'}}>{session?.user?.email}</Typography>
            </Box>
        </Box>
    </Box>
  )
}

export default UpBarProfile