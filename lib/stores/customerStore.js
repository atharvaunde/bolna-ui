import { create } from "zustand";
import { toast } from "sonner";
import api from "@/lib/api";

const useCustomerStore = create((set, get) => ({
    customers: [],
    selectedCustomer: null,
    products: [],
    transactions: [],
    calls: [],
    callsPagination: null,
    riskSummary: null,
    dashboardStats: null,
    monthlyTransactions: [],
    financialSummary: null,
    pagination: null,
    transactionPagination: null,
    isLoading: false,
    isLoadingProducts: false,
    isLoadingTransactions: false,
    isLoadingCalls: false,
    isLoadingRisk: false,
    isLoadingStats: false,
    isLoadingMonthlyTxns: false,
    isLoadingFinancialSummary: false,
    isRecalculatingRisk: false,
    isGeneratingKB: false,
    isPreviewingKB: false,
    kbPreviewData: null,
    dashboardTrends: null,
    isLoadingDashboardTrends: false,
    error: null,

    setCustomers: (data) => set({ customers: data }),
    setSelectedCustomer: (data) => set({ selectedCustomer: data }),
    setProducts: (data) => set({ products: data }),
    setTransactions: (data) => set({ transactions: data }),

    fetchCustomers: async (params = {}) => {
        try {
            set({ isLoading: true, error: null });
            const {
                page = 1,
                limit = 10,
                sortBy = "createdAt",
                sortOrder = "desc",
                name,
                riskLevel,
            } = params;

            const queryParams = new URLSearchParams({
                page: String(page),
                limit: String(limit),
                sortBy,
                sortOrder,
            });
            if (name) queryParams.set("name", name);
            if (riskLevel) queryParams.set("riskLevel", riskLevel);

            const response = await api.get(`/customers?${queryParams.toString()}`);

            if (response.data.success) {
                set({
                    customers: response.data.data.customers,
                    pagination: response.data.data.pagination,
                    isLoading: false,
                });
            }

            return response.data;
        } catch (error) {
            const errorMessage =
                error.response?.data?.message || "Failed to load customers";
            set({ error: errorMessage, isLoading: false });
            toast.error(errorMessage);
            throw error;
        }
    },

    fetchCustomerById: async (customerId) => {
        try {
            set({ isLoading: true, error: null });
            const response = await api.get(`/customers/${customerId}`);

            if (response.data.success) {
                set({
                    selectedCustomer: response.data.data,
                    isLoading: false,
                });
            }

            return response.data;
        } catch (error) {
            const errorMessage =
                error.response?.data?.message || "Failed to load customer details";
            set({ error: errorMessage, isLoading: false });
            toast.error(errorMessage);
            throw error;
        }
    },

    fetchProducts: async (customerId) => {
        try {
            set({ isLoadingProducts: true });
            const response = await api.get(`/products/${customerId}`);

            if (response.data.success) {
                set({
                    products: response.data.data,
                    isLoadingProducts: false,
                });
            }

            return response.data;
        } catch (error) {
            const errorMessage =
                error.response?.data?.message || "Failed to load products";
            set({ isLoadingProducts: false });
            toast.error(errorMessage);
            throw error;
        }
    },

    fetchTransactions: async (customerId, params = {}) => {
        try {
            set({ isLoadingTransactions: true });
            const {
                page = 1,
                limit = 10,
                sortBy = "transactionDate",
                sortOrder = "desc",
                startDate,
                endDate,
                instrument,
                transactionType,
                category,
                productId,
            } = params;

            const queryParams = new URLSearchParams({
                page: String(page),
                limit: String(limit),
                sortBy,
                sortOrder,
            });
            if (startDate) queryParams.set("startDate", startDate);
            if (endDate) queryParams.set("endDate", endDate);
            if (instrument) queryParams.set("instrument", instrument);
            if (transactionType) queryParams.set("transactionType", transactionType);
            if (category) queryParams.set("category", category);
            if (productId) queryParams.set("productId", productId);

            const response = await api.get(
                `/transactions/${customerId}?${queryParams.toString()}`
            );

            if (response.data.success) {
                set({
                    transactions: response.data.data.transactions,
                    transactionPagination: response.data.data.pagination,
                    isLoadingTransactions: false,
                });
            }

            return response.data;
        } catch (error) {
            const errorMessage =
                error.response?.data?.message || "Failed to load transactions";
            set({ isLoadingTransactions: false });
            toast.error(errorMessage);
            throw error;
        }
    },

    fetchCalls: async (customerId, params = {}) => {
        try {
            set({ isLoadingCalls: true });
            const { page = 1, limit = 20 } = params;
            const queryParams = new URLSearchParams({
                page: String(page),
                limit: String(limit),
            });
            const response = await api.get(
                `/calls/${customerId}/?${queryParams.toString()}`
            );
            if (response.data.success) {
                set({
                    calls: response.data.data.calls,
                    callsPagination: response.data.data.pagination,
                    isLoadingCalls: false,
                });
            }
            return response.data;
        } catch (error) {
            const errorMessage =
                error.response?.data?.message || "Failed to load calls";
            set({ isLoadingCalls: false });
            toast.error(errorMessage);
            throw error;
        }
    },

    fetchRiskSummary: async (customerId) => {
        try {
            set({ isLoadingRisk: true });
            const response = await api.get(
                `/risk/summary/${customerId}/`
            );

            if (response.data.success) {
                set({
                    riskSummary: response.data.data,
                    isLoadingRisk: false,
                });
            }

            return response.data;
        } catch (error) {
            const errorMessage =
                error.response?.data?.message || "Failed to load risk summary";
            set({ isLoadingRisk: false });
            toast.error(errorMessage);
            throw error;
        }
    },

    fetchDashboardStats: async () => {
        try {
            set({ isLoadingStats: true });

            const [allCustomersRes, highRiskRes] = await Promise.all([
                api.get("/customers?limit=1&page=1"),
                api.get("/customers/high-risk?limit=1&page=1"),
            ]);

            const totalCustomers =
                allCustomersRes.data?.data?.pagination?.total || 0;
            const highRiskTotal =
                highRiskRes.data?.data?.pagination?.total || 0;

            const mediumRiskRes = await api.get(
                "/customers?riskLevel=MEDIUM&limit=1&page=1"
            );
            const mediumRiskTotal =
                mediumRiskRes.data?.data?.pagination?.total || 0;

            const lowRiskRes = await api.get(
                "/customers?riskLevel=LOW&limit=1&page=1"
            );
            const lowRiskTotal =
                lowRiskRes.data?.data?.pagination?.total || 0;

            const criticalRiskRes = await api.get(
                "/customers?riskLevel=CRITICAL&limit=1&page=1"
            );
            const criticalRiskTotal =
                criticalRiskRes.data?.data?.pagination?.total || 0;

            const stats = {
                totalCustomers,
                highRiskCustomers: highRiskTotal,
                mediumRiskCustomers: mediumRiskTotal,
                lowRiskCustomers: lowRiskTotal,
                criticalRiskCustomers: criticalRiskTotal,
                riskDistribution: [
                    { name: "Low", value: lowRiskTotal, fill: "var(--color-low)" },
                    { name: "Medium", value: mediumRiskTotal, fill: "var(--color-medium)" },
                    { name: "High", value: highRiskTotal - criticalRiskTotal, fill: "var(--color-high)" },
                    { name: "Critical", value: criticalRiskTotal, fill: "var(--color-critical)" },
                ],
            };

            set({ dashboardStats: stats, isLoadingStats: false });

            return stats;
        } catch (error) {
            const errorMessage =
                error.response?.data?.message || "Failed to load dashboard stats";
            set({ isLoadingStats: false });
            toast.error(errorMessage);
            throw error;
        }
    },

    triggerAICall: async (customerId) => {
        try {
            const response = await api.post(`/customers/${customerId}/trigger-call`);
            toast.success("Outbound AI call triggered");
            return response.data;
        } catch (error) {
            const errorMessage =
                error.response?.data?.message || "Failed to trigger AI call";
            toast.error(errorMessage);
            throw error;
        }
    },

    fetchMonthlyTransactions: async (months = 6) => {
        try {
            set({ isLoadingMonthlyTxns: true });
            const response = await api.get(
                `/analytics/monthly-transactions?months=${months}`
            );

            if (response.data.success) {
                set({
                    monthlyTransactions: response.data.data,
                    isLoadingMonthlyTxns: false,
                });
            }

            return response.data;
        } catch (error) {
            const errorMessage =
                error.response?.data?.message || "Failed to load monthly transactions";
            set({ isLoadingMonthlyTxns: false });
            toast.error(errorMessage);
            throw error;
        }
    },

    fetchFinancialSummary: async (customerId) => {
        try {
            set({ isLoadingFinancialSummary: true });
            const response = await api.get(
                `/analytics/financial-summary/${customerId}`
            );

            if (response.data.success) {
                set({
                    financialSummary: response.data.data,
                    isLoadingFinancialSummary: false,
                });
            }

            return response.data;
        } catch (error) {
            const errorMessage =
                error.response?.data?.message || "Failed to load financial summary";
            set({ isLoadingFinancialSummary: false });
            toast.error(errorMessage);
            throw error;
        }
    },

    recalculateRisk: async (customerId) => {
        try {
            set({ isRecalculatingRisk: true });
            const response = await api.get(
                `/risk/calculate/${customerId}`
            );

            if (response.data.success) {
                set({
                    riskSummary: {
                        riskScore: response.data.data.riskScore,
                        riskLevel: response.data.data.riskLevel,
                        riskBreakdown: response.data.data.breakdown,
                        topRiskFactors: [],
                    },
                    isRecalculatingRisk: false,
                });
                toast.success("Risk score recalculated successfully");

                const customerData = get().selectedCustomer;
                if (customerData) {
                    set({
                        selectedCustomer: {
                            ...customerData,
                            riskScore: response.data.data.riskScore,
                            riskLevel: response.data.data.riskLevel,
                        },
                    });
                }
            }

            return response.data;
        } catch (error) {
            const errorMessage =
                error.response?.data?.message || "Failed to recalculate risk";
            set({ isRecalculatingRisk: false });
            toast.error(errorMessage);
            throw error;
        }
    },

    generateKnowledgebase: async () => {
        try {
            set({ isGeneratingKB: true });
            const response = await api.post("/knowledgebase/generate-kb");

            if (response.data.success) {
                set({ isGeneratingKB: false });
                toast.success(
                    `Knowledgebase uploaded! RAG ID: ${response.data.data?.ragId ?? "—"}`,
                    {
                        description: `${response.data.data?.customersProcessed ?? 0} customers processed · ${response.data.data?.markdownSizeKB ?? 0}KB · Status: ${response.data.data?.bolnaStatus ?? "—"}`,
                        duration: 8000,
                    }
                );
            }

            return response.data;
        } catch (error) {
            const errorMessage =
                error.response?.data?.message || "Failed to generate knowledgebase";
            set({ isGeneratingKB: false });
            toast.error(errorMessage);
            throw error;
        }
    },

    previewKnowledgebase: async () => {
        try {
            set({ isPreviewingKB: true });
            const response = await api.post("/knowledgebase/preview-kb");

            if (response.data.success) {
                set({
                    kbPreviewData: {
                        markdown: response.data.data?.markdown ?? "",
                        customersProcessed: response.data.data?.customersProcessed,
                        markdownSizeKB: response.data.data?.markdownSizeKB,
                    },
                    isPreviewingKB: false,
                });
            }

            return response.data;
        } catch (error) {
            const errorMessage =
                error.response?.data?.message ||
                "Failed to load knowledgebase preview";
            set({ isPreviewingKB: false });
            toast.error(errorMessage);
            throw error;
        }
    },

    fetchDashboardTrends: async () => {
        try {
            set({ isLoadingDashboardTrends: true });
            const response = await api.get("/dashboard/transaction-trends");

            if (response.data.success) {
                set({
                    dashboardTrends: response.data.data,
                    isLoadingDashboardTrends: false,
                });
            }

            return response.data;
        } catch (error) {
            const errorMessage =
                error.response?.data?.message ||
                "Failed to load transaction trends";
            set({ isLoadingDashboardTrends: false });
            toast.error(errorMessage);
            throw error;
        }
    },

    clearSelectedCustomer: () =>
        set({
            selectedCustomer: null,
            products: [],
            transactions: [],
            riskSummary: null,
            financialSummary: null,
            transactionPagination: null,
        }),
}));

export { useCustomerStore };
export default useCustomerStore;
