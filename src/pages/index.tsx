import { use, useState } from 'react'
import { Input, Button, Heading, Text, Image, Container, Table, Tbody, Tr, Td, Th, Spinner, useToast } from '@chakra-ui/react'
import Head from 'next/head'
import axios from 'axios'

type VideoDetails = {
  title: string
  description: string
  thumbnailUrl: string
  publishedAt: string
}

export default function Home() {
  const [videoUrl, setVideoUrl] = useState('')
  const [videoDetails, setVideoDetails] = useState<VideoDetails | null>(null)
  const [isLoading, setIsLoading] = useState(false)
  const [invalidVideo, setInvalidVideo] = useState(false)
  const toast = useToast()
  
  const handleSubmit = async (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault()

    // Disable the button if the video URL is blank
    if (!videoUrl) {
      return
    }
    const videoIdMatch = videoUrl.match(/(?:youtube\.com\/(?:[^\/]+\/.+\/|(?:v|e)\/|.*[?&]v=)|youtu\.be\/)([^"&?\/ ]{11})/)
  
    if (!videoIdMatch) {
      // Invalid YouTube video URL
      toast({
        title: "Invalid YouTube video URL.",
        description: "Please enter a valid URL.",
        status: "error",
        duration: 5000,
        isClosable: true,
        position: "top",
      })
      setInvalidVideo(true)
      return
    } else {
      setInvalidVideo(false)
    }
    const videoId = videoIdMatch[1]
  
    setIsLoading(true)
  
    try {
      const { data } = await axios.get(
        `https://www.googleapis.com/youtube/v3/videos?part=snippet&id=${videoId}&key=${process.env.NEXT_PUBLIC_YOUTUBE_API_KEY}`
      )

      const video = data.items[0]

      if (!video) {
        // Video not found
        toast({
          title: 'Video not found',
          status: 'error',
          duration: 5000,
          isClosable: true,
          position: 'top'
        })
        setIsLoading(false)
        setVideoDetails(null)
        return
      }

      setVideoDetails({
        title: video.snippet.title,
        description: video.snippet.description,
        thumbnailUrl: video.snippet.thumbnails.medium.url,
        publishedAt: video.snippet.publishedAt,
      })

    } catch (error) {
      // Request failed
      toast({
        title: 'An error occurred',
        status: 'error',
        duration: 5000,
        isClosable: true,
        position: 'top'
      })
    }

  
    setIsLoading(false)
  }

  return (
    <>
      <Head>
        <title>YouTube Video Details | My App</title>
        <meta
          name="description"
          content="Get details for any YouTube video including title, description, thumbnail, and publish date."
        />
      </Head>
      <Container maxW="xl" my={8}>
        <Heading as="h1" size="2xl" mb={4}>
          YouTube Video Details
        </Heading>
        <form onSubmit={handleSubmit}>
          <Input
            value={videoUrl}
            onChange={(event) => setVideoUrl(event.target.value)}
            placeholder="Enter a YouTube video URL"
            size="lg"
            mb={4}
            isInvalid={invalidVideo}
          />
          <Button type="submit" colorScheme="blue" isDisabled={!videoUrl}>
            {isLoading ? <Spinner size="sm" color="white" mr={2} /> : null}
            Get Video Details
          </Button>
        </form>

        {videoDetails && (
          <>
            <Heading as="h2" size="lg" my={4}>
              {videoDetails.title}
            </Heading>
            <Image src={videoDetails.thumbnailUrl} alt={videoDetails.title} />
            <Table my={4} size="md">
              <Tbody>
                <Tr>
                  <Th>Title</Th>
                  <Td>{videoDetails.title}</Td>
                </Tr>
                <Tr>
                  <Th>Description</Th>
                  <Td>{videoDetails.description}</Td>
                </Tr>
                <Tr>
                  <Th>Thumbnail</Th>
                  <Td>
                    <Image src={videoDetails.thumbnailUrl} alt={videoDetails.title} />
                  </Td>
                </Tr>
                <Tr>
                  <Th>Published on</Th>
                  <Td>{new Date(videoDetails.publishedAt).toLocaleDateString()}</Td>
                </Tr>
              </Tbody>
            </Table>
          </>
        )}
      </Container>
    </>
  )
}
