import React, { useState }  from 'react';
import axios from 'axios';
import { useEffectOnce } from '../hooks/useEffectOnce';
import LoadingPage from './LoadingPage';

const Weather = () => {

    const [ weather, setWeather ] = useState()
    const [ temperature, setTemperature ] = useState(0)
    const [ isCelsius, setIsCelsius ] = useState(true)

    const weatherIcon = weather && weather.weather?.[0].icon
    
    
    useEffectOnce(() => {
        
        function success(pos) {
            const crd = pos.coords;
            const apiKey = "050cbfec9ad0f4fe20d51d885442025f"
          
            axios.get(`https://api.openweathermap.org/data/2.5/weather?lat=${crd.latitude}&lon=${crd.longitude}&appid=${apiKey}`)
            .then(res => {
                setWeather(res.data)
                setTemperature(res.data.main.temp-273.5)
            })
          }
          
          function error(err) {
            console.warn(`ERROR(${err.code}): ${err.message}`);
            alert("Es necesario permitir la ubicación")
          }
          
          navigator.geolocation.getCurrentPosition(success, error);
      }, [])
    
      // ver arreglo
      //console.log(weather);

      const changeScale = () => {
          if (isCelsius){
            setTemperature(temperature*1.8+32)
            setIsCelsius(false)
          }else{
            setTemperature(((temperature-32)/1.8))
            setIsCelsius(true) 
          }
      }

    return (



        <div className='Weather-card'>

            { weather ? 
            <>
            <h3>{weather.name}, {weather.sys?.country}</h3>
            
            <ul className='Weather-main'>
                <li><span className='weather-description'>{capitalize(weather.weather?.[0].description)}</span></li>
                <li><img src={/* weatherIcon &&  */`http://openweathermap.org/img/wn/${weatherIcon}@2x.png`} alt="" width="150px"/></li>
                <li><span className='temperature'>{Math.round(temperature)} ℃</span></li>
                <li><button className='grades-btn' onClick={changeScale}>{isCelsius ? "℉" : "℃"}</button></li>
            </ul>
       
        <section className='Weather-info'>
            <ul>
                <li><b>Clouds</b> {weather.clouds?.all}%</li>
                <li><b>Humidity</b> {weather.main?.humidity}%</li>
                <li><b>Wind speed</b> {weather.wind?.speed} m/s</li>
            </ul>
        </section>
            </> :
        <LoadingPage />
        }
            
            

        </div>
    );
};

export default Weather;

const capitalize = str => str?.charAt(0).toUpperCase() + str?.slice(1)