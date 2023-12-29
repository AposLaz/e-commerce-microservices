import * as React from 'react';
import Avatar from '@mui/material/Avatar';
import Button from '@mui/material/Button';
import TextField from '@mui/material/TextField';
import FormControlLabel from '@mui/material/FormControlLabel';
import Checkbox from '@mui/material/Checkbox';
import Grid from '@mui/material/Grid';
import Box from '@mui/material/Box';
import Typography from '@mui/material/Typography';
import Container from '@mui/material/Container';
import {Divider, Link as LinkMUI }from '@mui/material';
import Link from 'next/link';
import { GetServerSidePropsContext, InferGetServerSidePropsType } from 'next';
import { getProviders, signIn, useSession } from 'next-auth/react';
import { getServerSession } from 'next-auth';
import { authOptions } from '@/pages/api/auth/[...nextauth]';
import Providers from '@/components/Auth/Providers';
import LockOpenIcon from '@mui/icons-material/LockOpen';
import { useRouter } from 'next/router';

function Copyright(props: any) {
  return (
    <Typography variant="body2" color="text.secondary" align="center" {...props}>
      {'Copyright © '}
      <LinkMUI color="inherit" href="https://www.aplaz.gr">
        Aplaz
      </LinkMUI>{' '}
      {new Date().getFullYear()}
      {'.'}
    </Typography>
  );
}

type ErrorArray = {
    field?: string;
    message: string;
}

export default function SignIn({ providers }: InferGetServerSidePropsType<typeof getServerSideProps>) {
  const [errorMsgUsername, setErrorMsgUsername] = React.useState<string>('')
  const [errorMsgPassword, setErrorMsgPassword] = React.useState<string>('')
  const router = useRouter()

  const handleSubmit = async (event: any) => {
    event.preventDefault();
    setErrorMsgUsername('')
    setErrorMsgPassword('')
    const data = new FormData(event.currentTarget);

    const responseLogin = await signIn("credentials",{
            username: data.get('username'),
            password: data.get('password'),
            redirect: false
    })

    if(responseLogin?.error){
            const jsonError = JSON.parse(responseLogin.error)
            jsonError.errors.map((msg: ErrorArray)=>{
                if(msg.field === "username"){
                    setErrorMsgUsername(msg.message)
                }else{
                    setErrorMsgPassword(msg.message)
                }
            })
    }
    else{
        router.push('/')
    }
        
  };

  return (
      <Container component="main" maxWidth="sm">
        <Box
          sx={{
            marginTop: 8,
            display: 'flex',
            flexDirection: 'column',
            alignItems: 'center',
            boxShadow: 3,
            borderRadius: 2,
            px: 4,
            py: 6,
          }}
        >
          <Avatar sx={{ m: 1, bgcolor: 'green' }}>
            <LockOpenIcon />
          </Avatar>
          <Typography component="h1" variant="h5">
            Sign In
          </Typography>
          <Box component="form" noValidate onSubmit={handleSubmit} sx={{ mt: 3 }}>
                <Grid container spacing={2}>
                <Grid item xs={12}>
                    <TextField
                    autoComplete="given-name"
                    name="username"
                    required
                    fullWidth
                    id="username"
                    label="Username"
                    autoFocus
                    />
                    <small style={{color: '#cc0000'}}>{errorMsgUsername}</small>
                </Grid>
                <Grid item xs={12}>
                    <TextField
                    required
                    fullWidth
                    name="password"
                    label="Password"
                    type="password"
                    id="password"
                    autoComplete="new-password"
                    />
                    <small style={{color: '#cc0000'}}>{errorMsgPassword}</small>
                </Grid>
                <Grid item xs={12}>
                    <FormControlLabel
                    control={<Checkbox value="allowExtraEmails" color="primary" />}
                    label="I want to receive inspiration, marketing promotions and updates via email."
                    />
                </Grid>
                </Grid>
                <Button
                type="submit"
                fullWidth
                variant="contained"
                sx={{ mt: 3, mb: 2, fontWeight: 600 }}
                >
                Sign In
                </Button>
                <Divider sx={{fontSize: '12px'}}>OR</Divider>
            </Box>
            <Providers providers={providers}/>
            <Grid container justifyContent="flex-end">
              <Grid item>
                <Link href="/auth/register" style={{fontSize: '0.875rem', lineHeight: '1.43', color: '#1971C2'}}>
                  {"Don't have an account? Sign Up"}
                </Link>
              </Grid>
            </Grid>
          
        </Box>
        <Copyright sx={{ mt: 5 }} />
      </Container>
  );
}

export async function getServerSideProps(context: GetServerSidePropsContext) {
    const session = await getServerSession(context.req, context.res, authOptions);
    // console.log(session)
    // If the user is already logged in, redirect.
    // Note: Make sure not to redirect to the same page
    // To avoid an infinite loop!
    if (session) {
      return { redirect: { destination: "/" } };
    }
  
    const providers = await getProviders();
    return {
      props: { providers: providers ?? [] },
    }
  }
  
  
  