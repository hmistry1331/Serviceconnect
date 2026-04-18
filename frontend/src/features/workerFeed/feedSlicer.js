const initialFeedState = {
  jobs: [],
  loading: false,
  error: "",
  search: "",
  statusMessage: "",
  hiddenIds: [],
  loadingActionIds: [],
  quoteDrafts: {},
};

export const createFeedSlice = (set) => ({
  workerFeed: initialFeedState,

  setWorkerFeedSearch: (search) =>
    set((state) => ({
      workerFeed: {
        ...state.workerFeed,
        search,
      },
    })),

  setWorkerFeedLoading: (loading) =>
    set((state) => ({
      workerFeed: {
        ...state.workerFeed,
        loading,
      },
    })),

  setWorkerFeedError: (error) =>
    set((state) => ({
      workerFeed: {
        ...state.workerFeed,
        error,
      },
    })),

  setWorkerFeedStatusMessage: (statusMessage) =>
    set((state) => ({
      workerFeed: {
        ...state.workerFeed,
        statusMessage,
      },
    })),

  setWorkerFeedJobs: (jobsOrUpdater) =>
    set((state) => {
      const nextJobs =
        typeof jobsOrUpdater === "function"
          ? jobsOrUpdater(state.workerFeed.jobs)
          : jobsOrUpdater;

      return {
        workerFeed: {
          ...state.workerFeed,
          jobs: Array.isArray(nextJobs) ? nextJobs : [],
        },
      };
    }),

  resetWorkerFeedState: () =>
    set(() => ({
      workerFeed: initialFeedState,
    })),
});
