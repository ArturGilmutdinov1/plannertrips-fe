type CountryOption = {
  label: string;
  value: string;
};

export const useTripModalStore = defineStore("tripStore", {
  state: () => ({
    name: "",
    country: null as CountryOption | null,
  }),

  actions: {
    setTripModalData(name: string, country: CountryOption | null) {
      this.name = name;
      this.country = country;
    },

    clearTripData() {
      this.name = "";
      this.country = null;
    },
  },
});
