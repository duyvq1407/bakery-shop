import { apiSlice } from './apiSlice';

export const unitApiSlice = apiSlice.injectEndpoints({
  endpoints: (builder) => ({
    getAllUnit: builder.query({
      query: () => 'unit',
      providesTags: ['Unit'],
    }),
    updateUnit: builder.mutation({
      query: ({id, ...rest}) => ({
        url: `unit/${id}`,
        method: 'PATCH',
        body: rest,
      }),
      invalidatesTags: ['Unit'],
    }),
    removeUnit: builder.mutation({
      query: (id) => ({
        url: `unit/${id}`,
        method: 'DELETE',
      }),
      invalidatesTags: ['Unit'],
    }),
    addUnit: builder.mutation({
      query: (data) => ({
        url: `unit`,
        method: 'POST',
        body: data
      }),
      invalidatesTags: ['Unit'],
    }),
  }),
});

export const {
    useGetAllUnitQuery,
    useUpdateUnitMutation,
    useRemoveUnitMutation,
    useAddUnitMutation
} = unitApiSlice