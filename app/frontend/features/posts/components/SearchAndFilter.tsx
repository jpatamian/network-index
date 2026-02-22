import {
  Box,
  Heading,
  Text,
  Stack,
  HStack,
  Button,
  chakra,
  createListCollection,
} from "@chakra-ui/react";
import { FaMapMarkerAlt, FaSearch, FaThList } from "react-icons/fa";
import { POST_TYPE_VALUES, SearchAndFilterProps } from "@/types/post";
import { postsText } from "@/features/posts/lib/utils";
import { FilterField } from "./FilterField";

const POST_TYPE_LABELS: Record<(typeof POST_TYPE_VALUES)[number], string> = {
  other: "Other",
  childcare: "Childcare",
  ride_share: "Ride Share",
  food: "Food",
};

const POST_TYPE_OPTIONS = [
  { value: "all", label: "All types" },
  ...POST_TYPE_VALUES.map((postType) => ({
    value: postType,
    label: POST_TYPE_LABELS[postType],
  })),
];

const radiusOptions = createListCollection({
  items: [
    { label: "5 miles", value: "5" },
    { label: "10 miles", value: "10" },
    { label: "15 miles", value: "15" },
    { label: "20 miles (default)", value: "20" },
    { label: "30 miles", value: "30" },
    { label: "50 miles", value: "50" },
  ],
});

export const SearchAndFilter = ({ state, actions }: SearchAndFilterProps) => {
  const {
    zipcodeInput,
    queryInput,
    postTypeInput,
    radiusInput,
    canResetSearch,
  } = state;
  const {
    onZipcodeInputChange,
    onQueryInputChange,
    onPostTypeInputChange,
    onRadiusInputChange,
    onSearchSubmit,
    onSearchReset,
  } = actions;

  return (
    <Box
      bg="bg"
      borderWidth="1px"
      borderColor="border.subtle"
      borderRadius="lg"
      p={4}
      boxShadow="sm"
    >
      <chakra.form
        gap={3}
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

        <Stack direction="column" gap={3}>
          <FilterField
            type="select"
            label="Post type"
            icon={FaThList}
            value={postTypeInput}
            onChange={(value) => onPostTypeInputChange(value as any)}
            options={POST_TYPE_OPTIONS}
          />

          <FilterField
            type="input"
            label="Zipcode"
            icon={FaMapMarkerAlt}
            value={zipcodeInput}
            onChange={onZipcodeInputChange}
            placeholder={postsText.searchZipPlaceholder}
          />

          {zipcodeInput.trim() && (
            <FilterField
              type="select"
              label="Search radius"
              icon={FaSearch}
              value={radiusInput}
              onChange={onRadiusInputChange}
              options={radiusOptions.items.map((item) => ({
                value: item.value,
                label: item.label,
              }))}
            />
          )}

          <FilterField
            type="input"
            label="Search text"
            icon={FaSearch}
            value={queryInput}
            onChange={onQueryInputChange}
            placeholder={postsText.searchQueryPlaceholder}
          />
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
