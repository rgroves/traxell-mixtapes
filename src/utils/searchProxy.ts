import { MultipleQueriesOptions } from "@algolia/client-search";
import {
  MultipleQueriesQuery,
  MultipleQueriesResponse,
} from "@algolia/client-search";
import { RequestOptions } from "@algolia/transporter";
import { SearchClient } from "algoliasearch/lite";

const mockEmptyResult = () => ({
  hits: [],
  nbHits: 0,
  nbPages: 0,
  page: 0,
  processingTimeMS: 0,
  hitsPerPage: 0,
  exhaustiveNbHits: false,
  query: "",
  params: "",
});

let searchDebounceTimerId = 0;
const searchDebounceTimeoutMs = 275;

export function createSearchProxy<T>(
  algoliaClient: SearchClient
): SearchClient {
  // Helper which checks if a query has a non-empty search term present.
  const hasQueryText = ({ params }: MultipleQueriesQuery) =>
    params?.query?.trim().length ?? 0 > 0;

  // This is the custom logic that will either allow or prevent the search
  // request to Algolia.
  const customSearchLogic = async (
    resolve: (
      value:
        | Readonly<MultipleQueriesResponse<T>>
        | PromiseLike<Readonly<MultipleQueriesResponse<T>>>
    ) => void,
    reject: (reason?: any) => void,
    queries: readonly MultipleQueriesQuery[],
    requestOptions?: RequestOptions & MultipleQueriesOptions
  ) => {
    if (queries.some(hasQueryText)) {
      try {
        resolve(algoliaClient.search<T>(queries, requestOptions));
      } catch (error) {
        reject(error);
      }
    } else {
      resolve({ results: queries.map(() => mockEmptyResult()) });
    }
  };

  // Async wrapper around the custom search logic (for debouncing).
  const asyncCustomSearchLogic = async <TObject>(
    queries: readonly MultipleQueriesQuery[],
    requestOptions?: RequestOptions & MultipleQueriesOptions
  ) => {
    const asyncDebouncedResult = new Promise<
      Readonly<MultipleQueriesResponse<TObject>>
    >((resolve, reject) => {
      clearTimeout(searchDebounceTimerId);
      searchDebounceTimerId = window.setTimeout(
        customSearchLogic,
        searchDebounceTimeoutMs,
        resolve,
        reject,
        queries,
        requestOptions
      );
    });

    return await asyncDebouncedResult;
  };

  const searchProxy: SearchClient = {
    ...algoliaClient,
    search: <TObject>(
      queries: readonly MultipleQueriesQuery[],
      requestOptions?: RequestOptions & MultipleQueriesOptions
    ) => asyncCustomSearchLogic<TObject>(queries, requestOptions),
  };

  return searchProxy;
}
