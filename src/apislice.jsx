import { createApi, fetchBaseQuery } from "@reduxjs/toolkit/query/react";

export const apiSlice = createApi({
  reducerPath: "api",
  baseQuery: fetchBaseQuery({
    baseUrl: "http://localhost:8080/cab/zula/cab",
    credentials: 'include'
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
    cancelride: builder.mutation({
      query: (cancelrideData) => ({
        url: "/cancelride",
        method: "POST",
        body: cancelrideData,
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
    removelocation: builder.mutation({
      query: (removelocationData) =>({
        url: "/removelocation",
        method: "POST",
        body: removelocationData
      })
    }),
    availablecabs: builder.mutation({
      query: (availablecabsData) => ({
        url: "/checkavailablecab",
        method: "POST",
        body: availablecabsData,
      }),
       transformResponse: (response) => response.availablecabs|| [] // Ensure array
    }),
    logout: builder.mutation({
      query:(logoutData) => ({
        url: "/logout",
        method:"POST",
        body: logoutData
      })
    })
  }),
});

export const { 
  useRegisterMutation, 
  useLoginMutation,
  useBookcabMutation,
  useRideconfirmMutation,
  useCancelrideMutation,
  useCustomersummaryMutation,
  useCabsummaryMutation,
  useGetallcabsummaryMutation,
  useGetallcustomersummaryMutation,
  useAddlocationMutation,
  useRemovelocationMutation,
  useAvailablecabsMutation,
  useLogoutMutation
 } = apiSlice;
