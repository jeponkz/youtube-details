import { Box, Button, Flex, Heading, Image, Input } from "@chakra-ui/react";

function Hero(): JSX.Element {
  return (
    <Box bg="gray.50" py={16} px={{ base: 4, md: 8 }}>
      <Flex direction={{ base: "column", md: "row" }} maxW={{ xl: "1200px" }} mx="auto" align={{ base: "center", md: "stretch" }}>
        <Box flex="1">
          <Heading as="h1" size="3xl" mb={4}>
            Discover More About Your Favorite YouTube Videos
          </Heading>
          <Heading as="h2" size="lg" fontWeight="normal" mb={8}>
            Get all the information you need in one place
          </Heading>
          <Flex direction={{ base: "column", md: "row" }} maxW={{ md: "600px" }} mx="auto" mb={{ base: 4, md: 0 }}>
            <Input placeholder="Enter a YouTube video link" flex="1" mr={{ base: 0, md: 4 }} mb={{ base: 4, md: 0 }} />
            <Button colorScheme="blue">Get Video Details</Button>
          </Flex>
        </Box>
        <Box flex="1">
          <Image src="https://via.placeholder.com/600x400" alt="YouTube video" />
        </Box>
      </Flex>
    </Box>
  );
}

export default Hero;
