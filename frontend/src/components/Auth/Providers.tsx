import { Box, Button } from '@mui/material';
import React from 'react'
import GitHubIcon from '@mui/icons-material/GitHub';
import { signIn } from 'next-auth/react';
import { InferGetServerSidePropsType } from 'next';
import { getServerSideProps } from '@/pages/auth/login';
import GoogleIcon from '@mui/icons-material/Google';

const Providers = ({providers}: InferGetServerSidePropsType<typeof getServerSideProps>) => {
  return (
    <Box sx={{ width: '100%' }}>
        {providers && Object.values(providers).map((provider) => {
            if(provider.name === "Username") return null;
                return (
                <Box key={provider.name}>
                    <Button type="submit" 
                            fullWidth 
                            color="success"
                            variant="contained" 
                            sx={{ mt: 2, mb: 2, boxShadow: 2, fontWeight: 600, 
                                '&:hover': { background: "#f8f8f8"} }} 
                            onClick={() => signIn(provider.id)}>
                        Sign in with {provider.name} {provider.name === "GitHub" ? <GitHubIcon sx={{ml: 1}} /> : <GoogleIcon sx={{ml: 1, color: '#ed1259'}}/>}
                      </Button>
                </Box>
                )
            })}
    </Box>
  )
}

export default Providers