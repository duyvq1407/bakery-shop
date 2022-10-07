import { apiSlice } from './apiSlice';

export const ingredientApiSlice = apiSlice.injectEndpoints({
  endpoints: (builder) => ({
    getAllIngredient: builder.query({
      query: () => 'ingredient',
      providesTags: ['Ingredient'],
    }),
    updateIngredient: builder.mutation({
      query: ({id, ...rest}) => ({
        url: `ingredient/${id}`,
        method: 'PATCH',
        body: rest,
      }),
      invalidatesTags: ['Ingredient'],
    }),
    removeIngredient: builder.mutation({
      query: (id) => ({
        url: `ingredient/${id}`,
        method: 'DELETE',
      }),
      invalidatesTags: ['Ingredient'],
    }),
    addIngredient: builder.mutation({
      query: (data) => ({
        url: `ingredient`,
        method: 'POST',
        body: data
      }),
      invalidatesTags: ['Ingredient'],
    }),
  }),
});

export const {
    useGetAllIngredientQuery,
    useUpdateIngredientMutation,
    useRemoveIngredientMutation,
    useAddIngredientMutation
} = ingredientApiSlice