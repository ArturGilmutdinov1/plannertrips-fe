export const useTripModalStore = defineStore("tripStore", {
  state: () => ({
    name: "",
    country: "",
  }),

  actions: {
    setTripModalData(name, country) {
      this.name = name;
      this.country = country;
    },

    clearTripData() {
      this.name = "";
      this.country = "";
    },
  },
});
