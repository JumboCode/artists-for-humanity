import { Box, Paper, Typography } from '@mui/material'
import Image from 'next/image'

export interface ArtworkInfo {
  id: string
  name: string
  title: string
  medium: string
  year: number
  image: string
}

function ArtworkCarouselItem({ art }: Readonly<{ art: ArtworkInfo }>) {
  return (
    <Paper
      elevation={0}
      sx={{
        mx: { xs: 1, sm: 2 },
        borderRadius: '10px',
        overflow: 'hidden',
        backgroundColor: 'white',
        cursor: 'pointer',
      }}
    >
      {/* Image Section */}
      <Box
        sx={{
          width: '100%',
          height: { xs: 300, sm: 400, md: 500 },
          overflow: 'hidden',
          position: 'relative',
          borderRadius: '8px',
        }}
      >
        <Image
          src={art.image}
          alt={art.title}
          fill
          style={{
            objectFit: 'cover',
            borderRadius: '8px',
          }}
          sizes="(max-width: 768px) 100vw, (max-width: 1200px) 80vw, 1200px"
        />
      </Box>

      {/* Artwork Info Section */}
      <Box p={2}>
        <Box
          display="flex"
          justifyContent="space-between"
          alignItems="center"
          flexWrap="wrap"
          gap={1}
        >
          {/* Left side: Artist + Title */}
          <Box display="flex" alignItems="center" gap={1} flexWrap="wrap">
            <Typography variant="body1" fontWeight="600" color="text.primary">
              {art.name}
            </Typography>
            <Typography
              variant="body1"
              fontWeight="300"
              sx={{ color: 'text.disabled' }}
            >
              |
            </Typography>
            <Typography variant="body1" sx={{ color: 'text.secondary' }}>
              {art.title}
            </Typography>
          </Box>

          {/* Right side: Medium + Year */}
          <Box
            display="flex"
            alignItems="center"
            gap={1}
            flexShrink={0}
            sx={{ color: 'text.secondary' }}
          >
            <Typography variant="body1" component="span" color="inherit">
              {art.medium}
            </Typography>
            <Typography
              variant="body1"
              component="span"
              sx={{ color: 'text.disabled' }}
            >
              |
            </Typography>
            <Typography variant="body1" component="span" color="inherit">
              {art.year}
            </Typography>
          </Box>
        </Box>
      </Box>
    </Paper>
  )
}

export { ArtworkCarouselItem }
