import { useQuery } from "@apollo/client/react";
import {
  useFragment as getFragmentData,
  type FragmentType,
} from "@/gql/fragment-masking";
import { graphql } from "@/gql";

export const CATEGORY_FIELDS_FRAGMENT = graphql(`
  fragment CategoryFields on Category {
    id
    name
    position
    productsCount
    translations {
      locale
      name
      slug
      description
    }
  }
`);

const ADMIN_CATEGORIES_QUERY = graphql(`
  query AdminCategories {
    categories {
      ...CategoryFields
      subcategories {
        ...CategoryFields
        subcategories {
          ...CategoryFields
        }
      }
    }
  }
`);

type CategoryFragment = FragmentType<typeof CATEGORY_FIELDS_FRAGMENT>;

const unmask = (fragment: CategoryFragment) =>
  getFragmentData(CATEGORY_FIELDS_FRAGMENT, fragment);

export const useAdminCategories = () => {
  const { data, loading } = useQuery(ADMIN_CATEGORIES_QUERY, {
    fetchPolicy: "cache-and-network",
  });

  const categories = (data?.categories ?? []).map((cat) => ({
    ...unmask(cat),
    subcategories: cat.subcategories?.map((sub) => ({
      ...unmask(sub),
      subcategories: sub.subcategories?.map(unmask),
    })),
  }));

  return { categories, loading };
};
