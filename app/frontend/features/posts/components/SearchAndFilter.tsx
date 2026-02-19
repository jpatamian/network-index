import {
  Box,
  Heading,
  Text,
  Stack,
  HStack,
  Button,
  Input,
  Icon,
  Fieldset,
  chakra,
} from "@chakra-ui/react";
import { FaMapMarkerAlt, FaSearch } from "react-icons/fa";
import { SearchAndFilterProps } from "@/types/post";

export const SearchAndFilter = ({ state, actions }: SearchAndFilterProps) => {
  const { zipcodeInput, queryInput, canResetSearch } = state;
  const {
    onZipcodeInputChange,
    onQueryInputChange,
    onSearchSubmit,
    onSearchReset,
  } = actions;

  return (
    <Box
      bg="bg"
      borderWidth="1px"
      borderColor="border.subtle"
      borderRadius="lg"
      p={6}
      boxShadow="sm"
    >
      <chakra.form
        gap={4}
        onSubmit={onSearchSubmit}
        display="flex"
        flexDirection="column"
      >
        <Stack gap={1}>
          <Heading size="md" color="fg" fontWeight="700">
            Find the right posts
          </Heading>
          <Text fontSize="sm" color="fg.muted">
            Combine zipcode with keywords to quickly surface what&apos;s
            relevant to you.
          </Text>
        </Stack>

        <Stack direction={{ base: "column", md: "row" }} gap={4}>
          <Fieldset.Root flex="1" gap={2}>
            <Fieldset.Legend fontSize="sm" color="fg.muted">
              Zipcode
            </Fieldset.Legend>
            <Fieldset.Content>
              <Box position="relative">
                <Icon
                  as={FaMapMarkerAlt}
                  color="fg.subtle"
                  fontSize="sm"
                  position="absolute"
                  left={3}
                  top="50%"
                  transform="translateY(-50%)"
                  pointerEvents="none"
                />
                <Input
                  value={zipcodeInput}
                  onChange={(e) => onZipcodeInputChange(e.target.value)}
                  placeholder="Enter zipcode"
                  borderRadius="md"
                  bg="bg"
                  borderColor="border"
                  pl={9}
                />
              </Box>
            </Fieldset.Content>
          </Fieldset.Root>

          <Fieldset.Root flex="1" gap={2}>
            <Fieldset.Legend fontSize="sm" color="fg.muted">
              Search text
            </Fieldset.Legend>
            <Fieldset.Content>
              <Box position="relative">
                <Icon
                  as={FaSearch}
                  color="fg.subtle"
                  fontSize="sm"
                  position="absolute"
                  left={3}
                  top="50%"
                  transform="translateY(-50%)"
                  pointerEvents="none"
                />
                <Input
                  value={queryInput}
                  onChange={(e) => onQueryInputChange(e.target.value)}
                  placeholder={'Try "rides to market"'}
                  borderRadius="md"
                  bg="bg"
                  borderColor="border"
                  pl={9}
                />
              </Box>
            </Fieldset.Content>
          </Fieldset.Root>
        </Stack>

        <HStack justify="flex-end" gap={3}>
          <Button
            type="button"
            variant="ghost"
            onClick={onSearchReset}
            disabled={!canResetSearch}
            fontWeight="600"
          >
            Clear
          </Button>
          <Button
            type="submit"
            bg="teal.600"
            color="white"
            fontWeight="600"
            borderRadius="md"
            _hover={{
              bg: "teal.700",
              transform: "translateY(-1px)",
              boxShadow: "md",
            }}
          >
            Apply filters
          </Button>
        </HStack>
      </chakra.form>
    </Box>
  );
};
