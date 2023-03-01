import {
  CreateConsumerUnitRequestPayload,
  EditConsumerUnitRequestPayload,
  InvoicesPayload,
} from "@/types/consumerUnit";
import {
  GetContractsResponsePayload,
  RenewContractRequestPayload,
  RenewContractResponsePayload,
} from "@/types/contract";
import {
  CreateDistributorRequestPayload,
  CreateDistributorResponsePayload,
  DistributorPropsTariffs,
  EditDistributorRequestPayload,
  EditDistributorResponsePayload,
} from "@/types/distributor";
import {
  CurrentEneryBillResponsePayload,
  EditEnergyBillRequestPayload,
  EditEnergyBillResponsePayload,
  PostEnergyBillRequestPayload,
  PostEnergyBillResponsePayload,
} from "@/types/energyBill";
import { GetSubgroupsResponsePayload } from "@/types/subgroups";
import { Recommendation, RecommendationSettings } from "@/types/recommendation";
import { createApi, fetchBaseQuery } from "@reduxjs/toolkit/query/react";
import { getSession } from "next-auth/react";
import { ConsumerUnit, ConsumerUnitsPayload } from "@/types/consumerUnit";
import {
  CreateTariffRequestPayload,
  CreateTariffResponsePayload,
  EditTariffRequestPayload,
  EditTariffResponsePayload,
} from "@/types/tariffs";
import {
  CreateInstitutionRequestPayload,
  CreateInstitutionResponsePayload,
  EditInstitutionRequestPayload,
  EditInstitutionResponsePayload,
  GetInstitutionResponsePayload,
} from "@/types/institution";

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
  tagTypes: [
    "Distributors",
    "ConsumerUnit",
    "Subgroups",
    "CurrentContract",
    "Invoices",
    "Recommendation",
    "Tariffs",
    "Institution",
    "Person",
  ],
  endpoints: (builder) => ({
    fetchConsumerUnits: builder.query<ConsumerUnitsPayload, number>({
      query: (universityId) => `consumer-units?university_id=${universityId}`,
    }),
    getConsumerUnit: builder.query<ConsumerUnit, number>({
      query: (consumerUnitId) => `consumer-units/${consumerUnitId}`,
      providesTags: ["ConsumerUnit"],
    }),
    fetchInvoices: builder.query<InvoicesPayload, number>({
      query: (consumerUnitId) =>
        `energy-bills?consumer_unit_id=${consumerUnitId}`,
      providesTags: ["Invoices"],
    }),
    getSubgroups: builder.query<GetSubgroupsResponsePayload, void>({
      query: () => "/contracts/list-subgroups/",
      providesTags: ["Subgroups"],
    }),
    getDistributors: builder.query<Array<DistributorPropsTariffs>, number>({
      query: (universityId) => `distributors/?university_id=${universityId}`,
      providesTags: ["Distributors"],
    }),
    getDistributor: builder.query<DistributorPropsTariffs, number>({
      query: (distributorId) => `distributors/${distributorId}/`,
      providesTags: ["Distributors"],
    }),
    createDistributor: builder.mutation<
      CreateDistributorResponsePayload,
      CreateDistributorRequestPayload
    >({
      query: (body) => ({
        url: "distributors/",
        method: "POST",
        body,
      }),
      invalidatesTags: ["Distributors"],
    }),
    editDistributor: builder.mutation<
      EditDistributorResponsePayload,
      EditDistributorRequestPayload
    >({
      query: (body) => ({
        url: `distributors/${body.id}/`,
        method: "PUT",
        body,
      }),
      invalidatesTags: ["Distributors"],
    }),
    createConsumerUnit: builder.mutation<
      string,
      CreateConsumerUnitRequestPayload
    >({
      query: (body) => ({
        url: "consumer-units/create_consumer_unit_and_contract/",
        method: "POST",
        body,
      }),
      invalidatesTags: ["ConsumerUnit", "CurrentContract"],
    }),
    editConsumerUnit: builder.mutation<string, EditConsumerUnitRequestPayload>({
      query: (body) => ({
        url: "consumer-units/edit_consumer_unit_and_contract/",
        method: "POST",
        body,
      }),
      invalidatesTags: ["ConsumerUnit", "CurrentContract"],
    }),
    getContract: builder.query<GetContractsResponsePayload, number>({
      query: (consumerunitId) =>
        `contracts/get-current-contract-of-consumer-unit/?consumer_unit_id=${consumerunitId}`,
      providesTags: (result, error, arg) =>
        result
          ? [
              { type: "CurrentContract", arg },
              "CurrentContract",
              "Recommendation",
            ]
          : ["CurrentContract", "Recommendation"],
    }),
    renewContract: builder.mutation<
      RenewContractResponsePayload,
      RenewContractRequestPayload
    >({
      query: (body) => ({
        url: "contracts/",
        method: "POST",
        body,
      }),
      invalidatesTags: ["CurrentContract", "Recommendation"],
    }),
    postInvoice: builder.mutation<
      PostEnergyBillResponsePayload,
      PostEnergyBillRequestPayload
    >({
      query: (body) => ({
        url: "/energy-bills/",
        method: "POST",
        body,
      }),
      invalidatesTags: ["Invoices", "Recommendation"],
    }),
    editInvoice: builder.mutation<
      EditEnergyBillResponsePayload,
      EditEnergyBillRequestPayload
    >({
      query: (body) => ({
        url: `/energy-bills/${body.id}/`,
        method: "PUT",
        body,
      }),
      invalidatesTags: ["Invoices", "Recommendation"],
    }),
    getCurrentInvoice: builder.query<CurrentEneryBillResponsePayload, number>({
      query: (energyBillId) => `energy-bills/${energyBillId}/`,
      providesTags: (result, error, arg) =>
        result
          ? [{ type: "Invoices", arg }, "Invoices", "Recommendation"]
          : ["Invoices", "Recommendation"],
    }),
    createTariff: builder.mutation<
      CreateTariffResponsePayload,
      CreateTariffRequestPayload
    >({
      query: (body) => ({
        url: "/tariffs/",
        method: "POST",
        body,
      }),
      invalidatesTags: ["Tariffs", "Recommendation"],
    }),
    editTariff: builder.mutation<
      EditTariffResponsePayload,
      EditTariffRequestPayload
    >({
      query: (body) => ({
        url: `/tariffs/${body.id}`,
        method: "PUT",
        body,
      }),
      invalidatesTags: ["Tariffs", "Recommendation"],
    }),
    getInstitution: builder.query<GetInstitutionResponsePayload, number>({
      query: (institutionId) => `universities/${institutionId}/`,
      providesTags: ["Institution"],
    }),
    createInstitution: builder.mutation<
      CreateInstitutionResponsePayload,
      CreateInstitutionRequestPayload
    >({
      query: (body) => ({
        url: "universities/",
        method: "POST",
        body,
      }),
      invalidatesTags: ["Institution"],
    }),
    editInstitution: builder.mutation<
      EditInstitutionResponsePayload,
      EditInstitutionRequestPayload
    >({
      query: (body) => ({
        url: `universities/${body.id}/`,
        method: "PUT",
        body,
      }),
      invalidatesTags: ["Institution"],
    }),
    recommendation: builder.query<Recommendation, number>({
      query: (consumerUnitId) => `recommendation/${consumerUnitId}`,
      providesTags: ["Recommendation"],
    }),
    recommendationSettings: builder.query<RecommendationSettings, void>({
      query: () => "recommendation-settings",
      keepUnusedDataFor: 120,
      providesTags: ["Recommendation"],
    }),
  }),
});

export const {
  useGetSubgroupsQuery,
  useGetDistributorsQuery,
  useGetDistributorQuery,
  useCreateDistributorMutation,
  useEditDistributorMutation,
  useEditConsumerUnitMutation,
  useCreateConsumerUnitMutation,
  useGetContractQuery,
  useRenewContractMutation,
  usePostInvoiceMutation,
  useEditInvoiceMutation,
  useGetCurrentInvoiceQuery,
  useFetchConsumerUnitsQuery,
  useGetConsumerUnitQuery,
  useFetchInvoicesQuery,
  useCreateTariffMutation,
  useEditTariffMutation,
  useGetInstitutionQuery,
  useCreateInstitutionMutation,
  useEditInstitutionMutation,
  useRecommendationQuery,
  useRecommendationSettingsQuery,
} = mecEnergiaApi;
