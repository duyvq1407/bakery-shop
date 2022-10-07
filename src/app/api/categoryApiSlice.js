import { apiSlice } from './apiSlice';

export const categoryApiSlice = apiSlice.injectEndpoints({
  endpoints: (builder) => ({
    getAllCategory: builder.query({
      query: () => 'product/type',
      providesTags: ['Category'],
    }),
    updateCategory: builder.mutation({
      query: ({id, ...rest}) => ({
        url: `product/type/${id}`,
        method: 'PATCH',
        body: rest,
      }),
      invalidatesTags: ['Category'],
    }),
    removeCategory: builder.mutation({
      query: (id) => ({
        url: `product/type/${id}`,
        method: 'DELETE',
      }),
      invalidatesTags: ['Category'],
    }),
    addCategory: builder.mutation({
      query: (data) => ({
        url: `product/type`,
        method: 'POST',
        body: data
      }),
      invalidatesTags: ['Category'],
    }),
  }),
});

export const {
    useGetAllCategoryQuery,
    useUpdateCategoryMutation,
    useRemoveCategoryMutation,
    useAddCategoryMutation
} = categoryApiSlice