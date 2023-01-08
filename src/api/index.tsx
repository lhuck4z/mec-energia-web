import { CreateConsumerUnitRequestPayload } from "@/types/consumerUnit";
import { CreateDistributorRequestPayload, CreateDistributorResponsePayload, DistributorPropsTariffs } from "@/types/distributor";
import { GetSubgroupsResponsePayload } from "@/types/subgroups";
import { createApi, fetchBaseQuery } from "@reduxjs/toolkit/query/react";
import { getSession } from "next-auth/react";

const baseUrl = process.env.NEXT_PUBLIC_API_URL;

const baseQuery = fetchBaseQuery({
  baseUrl,
  prepareHeaders: async (headers) => {
    const session = await getSession();

    if (session) {
      headers.set("Authorization", `Token ${session.user.token}`);
    }

    return headers;
  },
});

export const mecEnergiaApi = createApi({
  reducerPath: "mecEnergiaApi",
  baseQuery,
  tagTypes: ['Distributors', 'ConsumerUnit', 'Subgroups'],
  endpoints: (builder) => ({
    example: builder.query<void, void>({
      query: () => "distributors",
    }),
    getSubgroups: builder.query<GetSubgroupsResponsePayload, void>({
      query: () => "/contracts/list-subgroups/",
      providesTags: ['Subgroups']
    }),
    getDistributors: builder.query<Array<DistributorPropsTariffs>, number>({
      query: (universityId) => `distributors/?university_id=${universityId}`,
      providesTags: ["Distributors"]
    }),
    createDistributor: builder.mutation<CreateDistributorResponsePayload, CreateDistributorRequestPayload>({
      query: (body) => ({
        url: "distributors/",
        method: "POST",
        body
      }),
      invalidatesTags: ["Distributors"]
    }),
    createConsumerUnit: builder.mutation<string, CreateConsumerUnitRequestPayload>({
      query: (body) => ({
        url: "consumer-units/create_consumer_unit_and_contract/",
        method: "POST",
        body
      })
    })
  }),
});

export const {
  useExampleQuery,
  useGetSubgroupsQuery,
  useGetDistributorsQuery,
  useCreateDistributorMutation,
  useCreateConsumerUnitMutation,
} = mecEnergiaApi;
