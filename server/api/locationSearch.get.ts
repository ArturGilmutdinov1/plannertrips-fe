import CountriesData from '@innovayse/geo-atlas/lite'

export default defineEventHandler((event) => {
  const data = CountriesData.getCountries ( )
  return data
})

