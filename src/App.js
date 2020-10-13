import {
  Card,
  CardContent,
  FormControl,
  MenuItem,
  Select,
} from "@material-ui/core"
import React, { useEffect, useState } from "react"
import "./App.css"
import InfoBox from "./InfoBox"
import Table from "./Table.js"
import Map from "./Map"
import { sortData } from "./util.js"
import LineGraph from "./LineGraph"

function App() {
  const [countries, setCountries] = useState([])
  const [country, setCountry] = useState("Worldwide")
  const [countryInfo, setCountryInfo] = useState({})
  const [tableData, setTableData] = useState([])

  const handleCountryChange = async e => {
    const countryCode = e.target.value
    const url =
      countryCode === "Worldwide"
        ? "https://disease.sh/v3/covid-19/all"
        : `https://disease.sh/v3/covid-19/countries/${countryCode}`
    await fetch(url)
      .then(response => response.json())
      .then(data => {
        setCountry(countryCode)
        setCountryInfo(data)
        console.log(JSON.stringify(data))
      })
  }

  useEffect(() => {
    fetch("https://disease.sh/v3/covid-19/all")
      .then(response => response.json())
      .then(data => setCountryInfo(data))
  }, [])

  useEffect(() => {
    // api call
    const getCountriesData = async () => {
      await fetch("https://disease.sh/v3/covid-19/countries")
        .then(response => response.json())
        .then(data => {
          const countries = data.map(country => ({
            name: country.country,
            value: country.countryInfo.iso2,
          }))
          const sortedData = sortData(data)
          setTableData(sortedData)
          setCountries(countries)
        })
    }
    getCountriesData()
  }, [])

  return (
    <div className="app">
      <div className="app__left">
        <div className="app__header">
          <h1>Covid19</h1>

          <FormControl className="app__dropdown">
            <Select
              variant="outlined"
              value={country}
              onChange={handleCountryChange}
            >
              <MenuItem value="Worldwide">Worldwide</MenuItem>
              {countries.map(country => {
                return (
                  <MenuItem key={country.value} value={country.value}>
                    {country.name}
                  </MenuItem>
                )
              })}
            </Select>
          </FormControl>
        </div>
        <div className="app__stats">
          <InfoBox
            title="Covid19 cases"
            cases={countryInfo.todayCases}
            total={countryInfo.cases}
          />
          <InfoBox
            title="Recovered cases"
            cases={countryInfo.todayRecovered}
            total={countryInfo.recovered}
          />
          <InfoBox
            title="Death cases"
            cases={countryInfo.todayDeaths}
            total={countryInfo.deaths}
          />
        </div>
        <Map />
      </div>
      <Card className="app__right">
        <CardContent>
          <h3>Live cases by country</h3>
          <Table countries={tableData} />
          <LineGraph />
        </CardContent>
      </Card>
    </div>
  )
}

export default App
