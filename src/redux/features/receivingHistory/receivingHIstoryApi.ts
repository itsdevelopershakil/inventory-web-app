import { baseApi } from "../../api/baseApi";

const expensesApi = baseApi.injectEndpoints({
  endpoints: (builder) => ({
    getReceivingHistory: builder.query({
      query: (args = {}) => {
        const {
          page,
          limit = 20,
          search = "",
          dateRange = "all_time",
        } = args || {};

        const queryParams = new URLSearchParams();
        if (search) queryParams.append("search", search);
        if (page) queryParams.append("page", page);
        if (limit) queryParams.append("limit", limit);
        if (dateRange) queryParams.append("dateRange", dateRange);

        return {
          url: `/receivings?${queryParams.toString()}`,
          method: "GET",
        };
      },
      providesTags: ["receivingsHistory"],
      transformResponse: (response) => response?.data,
    }),
    deleteReceivingHistory: builder.mutation({
      query: (id) => ({
        url: `/receivings/${id}`,
        method: "DELETE",
      }),
      invalidatesTags: ["receivingsHistory"],
    }),
    updateReceivingHistory: builder.mutation({
      query: ({ id, ...body }) => ({
        url: `/receivings/${id}`,
        method: "PUT",
        body: body,
      }),
      invalidatesTags: ["receivingsHistory"],
    }),
    returnReceives: builder.mutation({
      query: ({ id, returnData }) => ({
        url: `/receivings/${id}/refund`,
        method: "PATCH",
        body: returnData,
      }),
      invalidatesTags: ["receivingsHistory"],
    }),
    getReceiveHistoryById: builder.query({
      query: (receiveId) => ({
        url: `/receivings/${receiveId}`,
        method: "GET",
      }),
      providesTags: ["saleHistory"],
      transformResponse: (response) => response?.data,
    }),
  }),
});

export const {
  useGetReceivingHistoryQuery,
  useDeleteReceivingHistoryMutation,
  useUpdateReceivingHistoryMutation,
  useReturnReceivesMutation,
  useGetReceiveHistoryByIdQuery,
} = expensesApi;
