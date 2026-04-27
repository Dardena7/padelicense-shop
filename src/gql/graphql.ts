/* eslint-disable */
import { TypedDocumentNode as DocumentNode } from '@graphql-typed-document-node/core';
export type Maybe<T> = T | null;
export type InputMaybe<T> = T | null | undefined;
export type Exact<T extends { [key: string]: unknown }> = { [K in keyof T]: T[K] };
export type MakeOptional<T, K extends keyof T> = Omit<T, K> & { [SubKey in K]?: Maybe<T[SubKey]> };
export type MakeMaybe<T, K extends keyof T> = Omit<T, K> & { [SubKey in K]: Maybe<T[SubKey]> };
export type MakeEmpty<T extends { [key: string]: unknown }, K extends keyof T> = { [_ in K]?: never };
export type Incremental<T> = T | { [P in keyof T]?: P extends ' $fragmentName' | '__typename' ? T[P] : never };
/** All built-in and custom scalars, mapped to their actual values */
export type Scalars = {
  ID: { input: string; output: string; }
  String: { input: string; output: string; }
  Boolean: { input: boolean; output: boolean; }
  Int: { input: number; output: number; }
  Float: { input: number; output: number; }
  /** An ISO 8601-encoded datetime */
  ISO8601DateTime: { input: any; output: any; }
};

export type Category = Node & {
  __typename?: 'Category';
  description?: Maybe<Scalars['String']['output']>;
  /** ID of the object. */
  id: Scalars['ID']['output'];
  name: Scalars['String']['output'];
  parent?: Maybe<Category>;
  position?: Maybe<Scalars['Int']['output']>;
  slug: Scalars['String']['output'];
  subcategories: Array<Category>;
};

/** An object with an ID. */
export type Node = {
  /** ID of the object. */
  id: Scalars['ID']['output'];
};

/** Information about pagination in a connection. */
export type PageInfo = {
  __typename?: 'PageInfo';
  /** When paginating forwards, the cursor to continue. */
  endCursor?: Maybe<Scalars['String']['output']>;
  /** When paginating forwards, are there more items? */
  hasNextPage: Scalars['Boolean']['output'];
  /** When paginating backwards, are there more items? */
  hasPreviousPage: Scalars['Boolean']['output'];
  /** When paginating backwards, the cursor to continue. */
  startCursor?: Maybe<Scalars['String']['output']>;
};

export type Product = Node & {
  __typename?: 'Product';
  basePriceCents: Scalars['Int']['output'];
  brand?: Maybe<Scalars['String']['output']>;
  category: Category;
  createdAt: Scalars['ISO8601DateTime']['output'];
  description?: Maybe<Scalars['String']['output']>;
  featured: Scalars['Boolean']['output'];
  /** ID of the object. */
  id: Scalars['ID']['output'];
  images: Array<ProductImage>;
  name: Scalars['String']['output'];
  slug: Scalars['String']['output'];
  status: ProductStatus;
  variants: Array<ProductVariant>;
};

/** The connection type for Product. */
export type ProductConnection = {
  __typename?: 'ProductConnection';
  /** A list of edges. */
  edges?: Maybe<Array<Maybe<ProductEdge>>>;
  /** A list of nodes. */
  nodes?: Maybe<Array<Maybe<Product>>>;
  /** Information to aid in pagination. */
  pageInfo: PageInfo;
};

/** An edge in a connection. */
export type ProductEdge = {
  __typename?: 'ProductEdge';
  /** A cursor for use in pagination. */
  cursor: Scalars['String']['output'];
  /** The item at the end of the edge. */
  node?: Maybe<Product>;
};

export type ProductImage = Node & {
  __typename?: 'ProductImage';
  altText?: Maybe<Scalars['String']['output']>;
  /** ID of the object. */
  id: Scalars['ID']['output'];
  imageUrl: Scalars['String']['output'];
  position: Scalars['Int']['output'];
};

/** Status of a product */
export enum ProductStatus {
  /** Product is visible and available */
  Active = 'ACTIVE',
  /** Product is no longer available */
  Archived = 'ARCHIVED',
  /** Product is not visible to customers */
  Draft = 'DRAFT'
}

export type ProductVariant = Node & {
  __typename?: 'ProductVariant';
  effectivePrice: Scalars['Int']['output'];
  /** ID of the object. */
  id: Scalars['ID']['output'];
  images: Array<ProductImage>;
  name: Scalars['String']['output'];
  priceCents?: Maybe<Scalars['Int']['output']>;
  sku: Scalars['String']['output'];
  stockQuantity: Scalars['Int']['output'];
};

export type Query = {
  __typename?: 'Query';
  /** List root categories (without parent) */
  categories: Array<Category>;
  /** Fetches an object given its ID. */
  node?: Maybe<Node>;
  /** Fetches a list of objects given a list of IDs. */
  nodes?: Maybe<Array<Maybe<Node>>>;
  /** Find a product by slug */
  product?: Maybe<Product>;
  /** List products with optional filters */
  products: ProductConnection;
};


export type QueryNodeArgs = {
  id: Scalars['ID']['input'];
};


export type QueryNodesArgs = {
  ids: Array<Scalars['ID']['input']>;
};


export type QueryProductArgs = {
  slug: Scalars['String']['input'];
};


export type QueryProductsArgs = {
  after?: InputMaybe<Scalars['String']['input']>;
  before?: InputMaybe<Scalars['String']['input']>;
  categorySlug?: InputMaybe<Scalars['String']['input']>;
  featured?: InputMaybe<Scalars['Boolean']['input']>;
  first?: InputMaybe<Scalars['Int']['input']>;
  last?: InputMaybe<Scalars['Int']['input']>;
};

export type GetProductsQueryVariables = Exact<{
  first?: InputMaybe<Scalars['Int']['input']>;
  categorySlug?: InputMaybe<Scalars['String']['input']>;
  featured?: InputMaybe<Scalars['Boolean']['input']>;
}>;


export type GetProductsQuery = { __typename?: 'Query', products: { __typename?: 'ProductConnection', nodes?: Array<{ __typename?: 'Product', id: string, name: string, slug: string, brand?: string | null, basePriceCents: number, featured: boolean, category: { __typename?: 'Category', name: string, slug: string }, variants: Array<{ __typename?: 'ProductVariant', id: string, name: string, effectivePrice: number, stockQuantity: number }>, images: Array<{ __typename?: 'ProductImage', imageUrl: string, altText?: string | null, position: number }> } | null> | null, pageInfo: { __typename?: 'PageInfo', hasNextPage: boolean, endCursor?: string | null } } };


export const GetProductsDocument = {"kind":"Document","definitions":[{"kind":"OperationDefinition","operation":"query","name":{"kind":"Name","value":"GetProducts"},"variableDefinitions":[{"kind":"VariableDefinition","variable":{"kind":"Variable","name":{"kind":"Name","value":"first"}},"type":{"kind":"NamedType","name":{"kind":"Name","value":"Int"}}},{"kind":"VariableDefinition","variable":{"kind":"Variable","name":{"kind":"Name","value":"categorySlug"}},"type":{"kind":"NamedType","name":{"kind":"Name","value":"String"}}},{"kind":"VariableDefinition","variable":{"kind":"Variable","name":{"kind":"Name","value":"featured"}},"type":{"kind":"NamedType","name":{"kind":"Name","value":"Boolean"}}}],"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"products"},"arguments":[{"kind":"Argument","name":{"kind":"Name","value":"first"},"value":{"kind":"Variable","name":{"kind":"Name","value":"first"}}},{"kind":"Argument","name":{"kind":"Name","value":"categorySlug"},"value":{"kind":"Variable","name":{"kind":"Name","value":"categorySlug"}}},{"kind":"Argument","name":{"kind":"Name","value":"featured"},"value":{"kind":"Variable","name":{"kind":"Name","value":"featured"}}}],"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"nodes"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"id"}},{"kind":"Field","name":{"kind":"Name","value":"name"}},{"kind":"Field","name":{"kind":"Name","value":"slug"}},{"kind":"Field","name":{"kind":"Name","value":"brand"}},{"kind":"Field","name":{"kind":"Name","value":"basePriceCents"}},{"kind":"Field","name":{"kind":"Name","value":"featured"}},{"kind":"Field","name":{"kind":"Name","value":"category"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"name"}},{"kind":"Field","name":{"kind":"Name","value":"slug"}}]}},{"kind":"Field","name":{"kind":"Name","value":"variants"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"id"}},{"kind":"Field","name":{"kind":"Name","value":"name"}},{"kind":"Field","name":{"kind":"Name","value":"effectivePrice"}},{"kind":"Field","name":{"kind":"Name","value":"stockQuantity"}}]}},{"kind":"Field","name":{"kind":"Name","value":"images"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"imageUrl"}},{"kind":"Field","name":{"kind":"Name","value":"altText"}},{"kind":"Field","name":{"kind":"Name","value":"position"}}]}}]}},{"kind":"Field","name":{"kind":"Name","value":"pageInfo"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"hasNextPage"}},{"kind":"Field","name":{"kind":"Name","value":"endCursor"}}]}}]}}]}}]} as unknown as DocumentNode<GetProductsQuery, GetProductsQueryVariables>;