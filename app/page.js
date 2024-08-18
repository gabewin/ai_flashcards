'use client'
import { ClerkProvider, SignInButton, SignedIn, SignedOut, UserButton } from '@clerk/nextjs'
import { Container, Box, Typography, AppBar, Toolbar, Button, Grid } from '@mui/material'
import getStripe from '@/utils/get-stripe'

export default function Home() {

  const handleSubmitPro = async () => {
    const checkoutSession = await fetch('/api/checkout_sessions/pro', {
      method: 'POST',
      headers: { origin: 'http://localhost:3000' },
    })
    const checkoutSessionJson = await checkoutSession.json()

    if (checkoutSession.statusCode === 500){
      console.error(checkoutSession.message)
      return
    }
  
    const stripe = await getStripe()
    const {error} = await stripe.redirectToCheckout({
      sessionId: checkoutSessionJson.id,
    })
  
    if (error) {
      console.warn(error.message)
    }
  }

  const handleSubmitBasic = async () => {
    const checkoutSession = await fetch('/api/checkout_sessions/basic', {
      method: 'POST',
      headers: { origin: 'http://localhost:3000' },
    })
    const checkoutSessionJson = await checkoutSession.json()

    if (checkoutSession.statusCode === 500){
      console.error(checkoutSession.message)
      return
    }
  
    const stripe = await getStripe()
    const {error} = await stripe.redirectToCheckout({
      sessionId: checkoutSessionJson.id,
    })
  
    if (error) {
      console.warn(error.message)
    }
  }

  return (
    <Box sx={{
      background: 'linear-gradient(to bottom, rgba(34,193,195,0.8044467787114846) 0%, rgba(229,220,139,0.7036064425770308) 100%)',
      
      minHeight: '100vh',
      color: '#000',
      display: 'flex',
      flexDirection: 'column',
      alignItems: 'center',
      justifyContent: 'center',
      padding: '20px'
    }}>
      {/* AppBar with a box and shadow */}
      <Box sx={{
        width: '100%',
        maxWidth: '1200px',
        boxShadow: '0 4px 15px rgba(0, 0, 0, 0.1)',
        background: 'rgba(255, 255, 255, 0.5)',
        borderRadius: '10px',
        overflow: 'hidden',
        mb: 4
      }}>
        <AppBar position="static" sx={{ backgroundColor: 'transparent', boxShadow: 'none' }}>
          <Toolbar>
            <Typography variant="h6" sx={{ flexGrow: 1, fontWeight: 'bold', color: '#000' }}>
              Flashcard SaaS
            </Typography>
            <SignedOut>
              <Button sx={{ backgroundColor: '#333', color: '#fff', marginRight: 1 }} href="/sign-in">
                Login
              </Button>
              <Button color="primary" variant="contained" href="/sign-up">
                Sign Up
              </Button>
            </SignedOut>
            <SignedIn>
              <UserButton />
            </SignedIn>
          </Toolbar>
        </AppBar>
      </Box>

      {/* Hero section with a box and shadow */}
      <Box sx={{
        width: '100%',
        maxWidth: '1200px',
        boxShadow: '0 4px 15px rgba(0, 0, 0, 0.1)',
        backgroundColor: 'rgba(255, 255, 255, 0.5)',
        padding: 4,
        borderRadius: 2,
        mb: 4,
        textAlign: 'center'
      }}>
        <Typography variant="h2" component="h1" gutterBottom sx={{ fontWeight: 'bold' }}>
          Welcome to Flashcard SaaS
        </Typography>
        <Typography variant="h5" component="h2" gutterBottom>
          The easiest way to create flashcards from your text.
        </Typography>
        <Button variant="contained" color="primary" sx={{ mt: 2, mr: 2 }} href="/generate">
          Get Started
        </Button>
        <Button variant="outlined" color="primary" sx={{ mt: 2, borderColor: '#000', color: '#000' }}>
          Learn More
        </Button>
      </Box>

      {/* Features section with a box  shadow */}
      <Box sx={{
        width: '100%',
        maxWidth: '1200px',
        boxShadow: '0 4px 15px rgba(0, 0, 0, 0.1)',
        backgroundColor: 'rgba(255, 255, 255, 0.5)',
        padding: 4,
        borderRadius: 2,
        mb: 4
      }}>
        <Typography variant="h4" component="h2" gutterBottom sx={{ fontWeight: 'bold', textAlign: 'center' }}>
          Features
        </Typography>
        <Grid container spacing={4} justifyContent="center">
          <Grid item xs={12} md={4}>
            <Typography variant="h6">Smart Flashcards</Typography>
            <Typography sx={{ color: '#333', mt: 1 }}>
              Our AI intelligently breaks down your text into concise flashcards, perfect for studying.
            </Typography>
          </Grid>
          <Grid item xs={12} md={4}>
            <Typography variant="h6">Accessible Anywhere</Typography>
            <Typography sx={{ color: '#333', mt: 1 }}>
              Access your flashcards from any device, at any time. Study on the go with ease.
            </Typography>
          </Grid>
        </Grid>
      </Box>

      {/* Pricing section with a box  shadow */}
      <Box sx={{
        width: '100%',
        maxWidth: '1200px',
        boxShadow: '0 4px 15px rgba(0, 0, 0, 0.1)',
        backgroundColor: 'rgba(255, 255, 255, 0.7)',
        padding: 4,
        borderRadius: 2,
        mb: 4
      }}>
        <Typography variant="h4" component="h2" gutterBottom sx={{ fontWeight: 'bold', textAlign: 'center' }}>
          Pricing
        </Typography>
        <Grid container spacing={4} justifyContent="center" alignItems="center">
          <Grid item xs={12} md={4} sx={{ textAlign: 'center' }}>
            <Typography variant="h6" sx={{ fontWeight: 'bold' }}>Basic</Typography>
            <Typography variant="h6" sx={{ mt: 1 }}>$5 / month</Typography>
            <Typography sx={{ color: '#333', mt: 1 }}>
              Limited Storage
            </Typography>
            <Button variant="contained" color="primary" sx={{ mt: 2 }} onClick={handleSubmitBasic}>
              Get Basic
            </Button>
          </Grid>
          <Grid item xs={12} md={4} sx={{ textAlign: 'center' }} >
            <Typography variant="h6" sx={{ fontWeight: 'bold' }}>Pro</Typography>
            <Typography variant="h6" sx={{ mt: 1 }}>$10 / month</Typography>
            <Typography sx={{ color: '#333', mt: 1 }}>
              Unlimited Storage
            </Typography>
            <Button variant="contained" color="primary" sx={{ mt: 2 }} onClick={handleSubmitPro}>
              Get Pro
            </Button>
          </Grid>
        </Grid>
      </Box>
    </Box>
  );
}

/*




*/



