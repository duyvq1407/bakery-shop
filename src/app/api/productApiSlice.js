import { apiSlice } from './apiSlice';

export const productApiSlice = apiSlice.injectEndpoints({
  endpoints: (builder) => ({
    getAllProduct: builder.query({
      query: () => 'product',
      providesTags: ['Product'],
    }),
    getProduct: builder.query({
      query: (id) => `product/${id}`,
      providesTags: ['Product'],
    }),
    updateProduct: builder.mutation({
      query: ({id, ...rest}) => ({
        url: `product/${id}`,
        method: 'PATCH',
        body: rest,
      }),
      invalidatesTags: ['Product'],
    }),
    removeProduct: builder.mutation({
      query: (id) => ({
        url: `product/${id}`,
        method: 'DELETE',
      }),
      invalidatesTags: ['Product'],
    }),
    addProduct: builder.mutation({
      query: (data) => ({
        url: `product`,
        method: 'POST',
        body: data
      }),
      invalidatesTags: ['Product'],
    }),
  }),
});

export const {
    useGetAllProductQuery,
    useGetProductQuery,
    useUpdateProductMutation,
    useRemoveProductMutation,
    useAddProductMutation
} = productApiSlice