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
  NativeSelect,
} from "@chakra-ui/react";
import {
  FaMapMarkerAlt,
  FaSearch,
  FaHandsHelping,
  FaCar,
  FaUtensils,
  FaTag,
  FaThList,
} from "react-icons/fa";
import { POST_TYPE_VALUES, SearchAndFilterProps } from "@/types/post";
import { postsText } from "@/features/posts/lib/utils";
import type { IconType } from "react-icons";

const POST_TYPE_LABELS: Record<(typeof POST_TYPE_VALUES)[number], string> = {
  other: "Other",
  childcare: "Childcare",
  ride_share: "Ride Share",
  food: "Food",
};

const POST_TYPE_ICONS: Record<
  "all" | (typeof POST_TYPE_VALUES)[number],
  IconType
> = {
  all: FaThList,
  other: FaTag,
  childcare: FaHandsHelping,
  ride_share: FaCar,
  food: FaUtensils,
};

export const SearchAndFilter = ({ state, actions }: SearchAndFilterProps) => {
  const { zipcodeInput, queryInput, postTypeInput, canResetSearch } = state;
  const {
    onZipcodeInputChange,
    onQueryInputChange,
    onPostTypeInputChange,
    onSearchSubmit,
    onSearchReset,
  } = actions;
  const selectedPostTypeIcon = POST_TYPE_ICONS[postTypeInput];

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
              Post type
            </Fieldset.Legend>
            <Fieldset.Content>
              <NativeSelect.Root>
                <Box
                  position="absolute"
                  left={3}
                  top="50%"
                  transform="translateY(-50%)"
                  color="fg.subtle"
                  zIndex={1}
                  pointerEvents="none"
                >
                  <Icon as={selectedPostTypeIcon} fontSize="sm" />
                </Box>
                <NativeSelect.Field
                  value={postTypeInput}
                  onChange={(event) =>
                    onPostTypeInputChange(
                      event.target.value as typeof postTypeInput,
                    )
                  }
                  borderRadius="md"
                  bg="bg"
                  borderColor="border"
                  pl={9}
                >
                  <option value="all">All types</option>
                  {POST_TYPE_VALUES.map((postType) => (
                    <option key={postType} value={postType}>
                      {POST_TYPE_LABELS[postType]}
                    </option>
                  ))}
                </NativeSelect.Field>
                <NativeSelect.Indicator />
              </NativeSelect.Root>
            </Fieldset.Content>
          </Fieldset.Root>

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
                  placeholder={postsText.searchZipPlaceholder}
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
                  placeholder={postsText.searchQueryPlaceholder}
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
