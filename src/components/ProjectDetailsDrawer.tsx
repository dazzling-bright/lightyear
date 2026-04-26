// components/ProjectDetailsDrawer.tsx
import {
  Drawer,
  DrawerBody,
  DrawerFooter,
  DrawerHeader,
  DrawerOverlay,
  DrawerContent,
  DrawerCloseButton,
  Image,
  Text,
  Box,
  HStack,
  VStack,
  Button,
  Badge,
  Divider,
} from "@chakra-ui/react";
import { BiCalendar } from "react-icons/bi";
import { CgViewList } from "react-icons/cg";

interface ProjectDetails {
  image: string;
  category: string;
  title: string;
  year: string;
  units: string;
  description?: string;
  location?: string;
  duration?: string;
  scope?: string[];
}

interface ProjectDetailsDrawerProps {
  isOpen: boolean;
  onClose: () => void;
  project: ProjectDetails | null;
}

export default function ProjectDetailsDrawer({
  isOpen,
  onClose,
  project,
}: ProjectDetailsDrawerProps) {
  if (!project) return null;

  return (
    <Drawer isOpen={isOpen} onClose={onClose} size="lg" placement="right">
      <DrawerOverlay backdropFilter="blur(4px)" />
      <DrawerContent
        bg="stellar.surface"
        borderLeft="1px solid"
        borderColor="stellar.border"
      >
        <DrawerCloseButton color="stellar.text" />
        <DrawerHeader
          borderBottomWidth="1px"
          borderBottomColor="stellar.border"
          pt={6}
        >
          <VStack align="start" spacing={2}>
            <Badge
              colorScheme="orange"
              fontSize="xs"
              px={3}
              py={1}
              borderRadius="full"
            >
              {project.category}
            </Badge>
            <Text fontSize="2xl" fontWeight="bold" color="stellar.text">
              {project.title}
            </Text>
          </VStack>
        </DrawerHeader>

        <DrawerBody>
          <VStack spacing={6} align="stretch">
            <Image
              src={project.image}
              alt={project.title}
              borderRadius="lg"
              objectFit="cover"
              maxH="300px"
              w="full"
            />

            <HStack spacing={6} justify="space-between">
              <HStack>
                <BiCalendar
                 color="brand.500" />
                <Text fontSize="sm" color="stellar.muted">
                  Completed: {project.year}
                </Text>
              </HStack>
              <HStack>
                <CgViewList color="brand.500" />
                <Text fontSize="sm" color="stellar.muted">
                  {project.units}
                </Text>
              </HStack>
            </HStack>

            <Divider borderColor="stellar.border" />

            {project.description && (
              <Box>
                <Text fontWeight="semibold" mb={2} color="stellar.text">
                  Project Overview
                </Text>
                <Text color="stellar.muted" lineHeight="tall">
                  {project.description}
                </Text>
              </Box>
            )}

            {project.location && (
              <Box>
                <Text fontWeight="semibold" mb={2} color="stellar.text">
                  Location
                </Text>
                <Text color="stellar.muted">{project.location}</Text>
              </Box>
            )}

            {project.duration && (
              <Box>
                <Text fontWeight="semibold" mb={2} color="stellar.text">
                  Duration
                </Text>
                <Text color="stellar.muted">{project.duration}</Text>
              </Box>
            )}

            {project.scope && (
              <Box>
                <Text fontWeight="semibold" mb={2} color="stellar.text">
                  Project Scope
                </Text>
                <VStack align="start" spacing={1}>
                  {project.scope.map((item, idx) => (
                    <Text key={idx} color="stellar.muted" fontSize="sm">
                      • {item}
                    </Text>
                  ))}
                </VStack>
              </Box>
            )}
          </VStack>
        </DrawerBody>

        <DrawerFooter borderTopWidth="1px" borderTopColor="stellar.border">
          <Button variant="outline" onClick={onClose} mr={3}>
            Close
          </Button>
          <Button
            bg="brand.500"
            color="white"
            _hover={{ bg: "brand.600" }}
            onClick={() => window.open("/contact", "_blank")}
          >
            Request Details
          </Button>
        </DrawerFooter>
      </DrawerContent>
    </Drawer>
  );
}
