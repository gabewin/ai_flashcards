'use client'
import { useUser } from '@clerk/nextjs'
import { useState } from 'react'
import { doc, collection, setDoc, getDoc, writeBatch } from 'firebase/firestore'
import { db } from '@/firebase'
import {
  Container,
  Box,
  Typography,
  TextField,
  Button,
  Grid,
  Card,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogContentText,
  DialogActions
} from '@mui/material';

export default function Generate() {
  const [setName, setSetName] = useState('')
  const [text, setText] = useState('')
  const [flashcards, setFlashcards] = useState([])
  const [dialogOpen, setDialogOpen] = useState(false)
  const handleOpenDialog = () => setDialogOpen(true)
  const handleCloseDialog = () => setDialogOpen(false)

  const saveFlashcards = async () => {
    if (!setName.trim()) {
      alert('Please enter a name for your flashcard set.')
      return
    }
  
    try {
      const userDocRef = doc(collection(db, 'users'), user.id)
      const userDocSnap = await getDoc(userDocRef)
  
      const batch = writeBatch(db)
  
      if (userDocSnap.exists()) {
        const userData = userDocSnap.data()
        const updatedSets = [...(userData.flashcardSets || []), { name: setName }]
        batch.update(userDocRef, { flashcardSets: updatedSets })
      } else {
        batch.set(userDocRef, { flashcardSets: [{ name: setName }] })
      }
  
      const setDocRef = doc(collection(userDocRef, 'flashcardSets'), setName)
      batch.set(setDocRef, { flashcards })
  
      await batch.commit()
  
      alert('Flashcards saved successfully!')
      handleCloseDialog()
      setSetName('')
    } catch (error) {
      console.error('Error saving flashcards:', error)
      alert('An error occurred while saving flashcards. Please try again.')
    }
  }

  const handleSubmit = async () => {
    if (!text.trim()) {
      alert('Please enter some text to generate flashcards.')
      return
    }
  
    try {
      const response = await fetch('/api/generate', {
        method: 'POST',
        body: text,
      })
  
      if (!response.ok) {
        throw new Error('Failed to generate flashcards')
      }
  
      const data = await response.json()
      setFlashcards(data)
    } catch (error) {
      console.error('Error generating flashcards:', error)
      alert('An error occurred while generating flashcards. Please try again.')
    }
  }

  return (
    <Container maxWidth={false} disableGutters sx={{ 
      background: 'linear-gradient(to bottom, rgba(34,193,195,0.8) 0%, rgba(229,220,139,0.7) 100%)', 
      minHeight: '100vh',
      display: 'flex',
      flexDirection: 'column',
      alignItems: 'center'
    }}>
      <Box sx={{ my: 4, p: 4, borderRadius: 2, boxShadow: '0 4px 15px rgba(0, 0, 0, 0.1)', backgroundColor: '#fff', width: '100%', maxWidth: '1200px' }}>
        <Typography variant="h4" component="h1" gutterBottom sx={{ fontWeight: 'bold' }}>
          Generate Flashcards
        </Typography>
        <TextField
          value={text}
          onChange={(e) => setText(e.target.value)}
          label="Enter text"
          fullWidth
          multiline
          rows={4}
          variant="outlined"
          sx={{ mb: 3, backgroundColor: '#fff', borderRadius: 1 }}
        />
        <Button
          variant="contained"
          color="primary"
          onClick={handleSubmit}
          fullWidth
          sx={{ 
            p: 1, 
            borderRadius: '8px', 
            fontWeight: 'bold', 
            backgroundColor: '#000', 
            ':hover': { backgroundColor: '#333' } 
          }}
        >
          Generate Flashcards
        </Button>
      </Box>
  
      {flashcards.length > 0 && (
        <Box sx={{ mt: 6, position: 'relative', width: '100%', maxWidth: '1200px', padding: '0 16px' }}>
          <Typography variant="h5" component="h2" gutterBottom sx={{ fontWeight: 'bold', textAlign: 'center' }}>
            Generated Flashcards
          </Typography>
          <Button
            variant="contained"
            color="primary"
            onClick={handleOpenDialog}
            sx={{
              position: 'fixed', 
              bottom: 16, //  the distance from the bottom
              right: 16, //  distance from the right
              p: 1,
              borderRadius: '8px',
              fontWeight: 'bold',
              backgroundColor: '#000',
              ':hover': { backgroundColor: '#333' }
            }}
          >
            Save Flashcards
          </Button>
          <Grid container spacing={4} justifyContent="center">
            {flashcards.map((flashcard, index) => (
              <Grid item xs={12} sm={6} md={4} key={index}>
                <Card sx={{ 
                  borderRadius: 2, 
                  boxShadow: '0 4px 10px rgba(0, 0, 0, 0.1)', 
                  position: 'relative',
                  height: 200,
                  overflow: 'hidden',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  perspective: '1000px'
                }}>
                  <Box sx={{ 
                    position: 'absolute',
                    width: '100%',
                    height: '100%',
                    transition: 'transform 0.6s',
                    transformStyle: 'preserve-3d',
                    '&:hover': {
                      transform: 'rotateY(180deg)'
                    }
                  }}>
                    <Box sx={{ 
                      position: 'absolute',
                      width: '100%',
                      height: '100%',
                      backfaceVisibility: 'hidden',
                      display: 'flex',
                      flexDirection: 'column',
                      justifyContent: 'center',
                      alignItems: 'center',
                      p: 2,
                      backgroundColor: '#fff'
                    }}>
                      <Typography variant="h6" sx={{ fontWeight: 'bold', fontSize: '1.2rem' }}>{flashcard.front}</Typography>
                    </Box>
                    <Box sx={{ 
                      position: 'absolute',
                      width: '100%',
                      height: '100%',
                      backfaceVisibility: 'hidden',
                      display: 'flex',
                      flexDirection: 'column',
                      justifyContent: 'center',
                      alignItems: 'center',
                      p: 2,
                      backgroundColor: '#f5f5f5',
                      transform: 'rotateY(180deg)'
                    }}>
                      <Typography variant="h6" sx={{ fontWeight: 'bold', fontSize: '1.2rem' }}>{flashcard.back}</Typography>
                    </Box>
                  </Box>
                </Card>
              </Grid>
            ))}
          </Grid>
          <Dialog open={dialogOpen} onClose={handleCloseDialog}>
            <DialogTitle sx={{ fontWeight: 'bold' }}>Save Flashcard Set</DialogTitle>
            <DialogContent sx={{ p: 3 }}>
              <DialogContentText>
                Please enter a name for your flashcard set.
              </DialogContentText>
              <TextField
                autoFocus
                margin="dense"
                label="Set Name"
                type="text"
                fullWidth
                value={setName}
                onChange={(e) => setSetName(e.target.value)}
                sx={{ mt: 2 }}
              />
            </DialogContent>
            <DialogActions sx={{ p: 2 }}>
              <Button onClick={handleCloseDialog} sx={{ fontWeight: 'bold' }}>Cancel</Button>
              <Button onClick={saveFlashcards} color="primary" sx={{ fontWeight: 'bold' }}>
                Save
              </Button>
            </DialogActions>
          </Dialog>
        </Box>
      )}
    </Container>
  )
}
