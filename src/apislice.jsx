import { createApi, fetchBaseQuery } from "@reduxjs/toolkit/query/react";

export const apiSlice = createApi({
  reducerPath: "api",
  baseQuery: fetchBaseQuery({
    baseUrl: "http://localhost:8080/cab/zula/cab",
  }),
  endpoints: (builder) => ({
    register: builder.mutation({
      query: (credentials) => ({
        url: "/register",
        method: "POST",
        body: credentials,
      }),
    }),
    login: builder.mutation({
      query: (userData) => ({
        url: "/login",
        method: "POST",
        body: userData,
      }),
    }),
    bookcab: builder.mutation({
      query: (bookcabData) => ({
        url: "/bookcab",
        method: "POST",
        body: bookcabData,
      }),
    }),
    rideconfirm: builder.mutation({
      query: (rideconfirmData) => ({
        url: "/rideconfirmation",
        method: "POST",
        body: rideconfirmData,
      })
    }),
    customersummary: builder.mutation({
      query: (customersummaryData) => ({
        url: "/customersummary",
        method: "POST",
        body: customersummaryData,
      }),
      transformResponse: (response) => response.customersummary || [] // Ensure array
    }),
    cabsummary: builder.mutation({
      query: (cabsummaryData) => ({
        url: "/cabsummary",
        method: "POST",
        body: cabsummaryData,
      }),
       transformResponse: (response) => response.cabsummary || [] // Ensure array
    }),
    getallcabsummary: builder.mutation({
      query: (getallcabsummaryData) =>({
        url: "/getallcabsummary",
        method: "POST",
        body: getallcabsummaryData,
      }), 
      transformResponse: (response) => ({
        totalcabsummary: response.totalcabsummary || [],
        cabsummary: response.cabsummary || []
      })
    }),
    getallcustomersummary: builder.mutation({
      query: (getallcustomersummaryData) => ({
        url: "/getallcustomersummary",
        method: "POST",
        body: getallcustomersummaryData,
      }),
      transformResponse: (response) => ({
        totalcustomersummary: response.totalcustomersummary || [],
        customersummary: response.customersummary || []
      })
    }),
    addlocation: builder.mutation({
      query: (addlocationData) => ({
        url:"/addlocation",
        method: "POST",
        body: addlocationData,
      })
    }),
    logout: builder.mutation({
      query:(logoutData) => ({
        url: "/logout",
        method:"POST",
        body: logoutData
      })
    }),
    changepassword: builder.mutation({
      query: (updatepassword) =>({
        url: "/changepassword",
        method: "POST",
        body: updatepassword
      })
    })
  }),
});

export const { 
  useRegisterMutation, 
  useLoginMutation,
  useBookcabMutation,
  useRideconfirmMutation,
  useCustomersummaryMutation,
  useCabsummaryMutation,
  useGetallcabsummaryMutation,
  useGetallcustomersummaryMutation,
  useAddlocationMutation,
  useLogoutMutation
 } = apiSlice;
