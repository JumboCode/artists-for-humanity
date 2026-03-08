/**
 * Script to clean up artwork entries with mock/invalid image URLs
 * Run with: npx ts-node scripts/cleanup-mock-artwork.ts
 */

import { PrismaClient } from '@prisma/client'

const prisma = new PrismaClient()

async function cleanupMockArtwork() {
  try {
    console.log('🧹 Starting cleanup of mock artwork entries...')

    // Find all artwork with mock-storage.com URLs
    const mockArtwork = await prisma.artwork.findMany({
      where: {
        OR: [
          { image_url: { contains: 'mock-storage.com' } },
          { thumbnail_url: { contains: 'mock-storage.com' } },
        ],
      },
    })

    console.log(`📊 Found ${mockArtwork.length} artwork entries with mock URLs`)

    if (mockArtwork.length === 0) {
      console.log('✅ No mock artwork found. Database is clean!')
      return
    }

    // Show the artwork that will be deleted
    console.log('\n🗑️  The following artwork will be deleted:')
    mockArtwork.forEach((art, index) => {
      console.log(`  ${index + 1}. ${art.title} (${art.id})`)
      console.log(`     Status: ${art.status}`)
      console.log(`     Image URL: ${art.image_url}`)
    })

    // Delete the mock artwork
    console.log('\n⏳ Deleting mock artwork...')
    const deleteResult = await prisma.artwork.deleteMany({
      where: {
        OR: [
          { image_url: { contains: 'mock-storage.com' } },
          { thumbnail_url: { contains: 'mock-storage.com' } },
        ],
      },
    })

    console.log(`✅ Successfully deleted ${deleteResult.count} artwork entries`)
    console.log('🎉 Cleanup complete!')
  } catch (error) {
    console.error('❌ Error during cleanup:', error)
    throw error
  } finally {
    await prisma.$disconnect()
  }
}

// Run the cleanup
cleanupMockArtwork()
  .then(() => {
    console.log('\n✨ Script finished successfully')
    process.exit(0)
  })
  .catch(error => {
    console.error('\n💥 Script failed:', error)
    process.exit(1)
  })
