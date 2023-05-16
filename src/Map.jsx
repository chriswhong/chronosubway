import React, { useRef, useEffect, useState } from 'react'
import mapboxgl from 'mapbox-gl'
import mapboxGeocoder from '@mapbox/mapbox-gl-geocoder'

import 'mapbox-gl/dist/mapbox-gl.css'
import '@mapbox/mapbox-gl-geocoder/dist/mapbox-gl-geocoder.css'
import accessToken from './access-token'

import stopsData from './assets/data/stops.json'
import routesData from './assets/data/subway-routes.json'
import subwayLayerStyles from './subway-layer-styles'
import StationHeader from './StationHeader'

import stations from './assets/data/stations.json'

mapboxgl.accessToken = accessToken

const dummyFC = {
    type: 'FeatureCollection',
    features: []
}

const Map = (
    { }
) => {
    const mapContainer = useRef(null)
    const geocoderRef = useRef(null)
    let [activeStopId, setActiveStopId] = useState()
    let [mapLoaded, setMapLoaded] = useState(false)


    let mapRef = useRef(null)

    if (!mapRef) {
        mapRef = useRef(null)
    }


    useEffect(() => {
        console.log('mapeffect')
        const map = (mapRef.current = new mapboxgl.Map({
            container: mapContainer.current,
            style: 'mapbox://styles/mapbox/dark-v11',
            bounds: [-74.28423, 40.48451, -73.73228, 40.91912],
            accessToken,
            hash: true
        }))

        const geocoder = new mapboxGeocoder({
            accessToken: mapboxgl.accessToken,
            mapboxgl: mapboxgl
        })
        map.addControl(geocoder)

        if (geocoderRef) {
            geocoderRef.current = geocoder
        }

        map.addControl(new mapboxgl.NavigationControl())


        map.on('load', () => {




            map.addSource('isochrone', {
                type: 'geojson',
                data: dummyFC
            })



            map.addLayer({
                id: 'fill-isochrone-40',
                type: 'fill',
                source: 'isochrone',
                paint: {
                    'fill-color': '#f1eef6'
                },
                filter: ['==', ['get', 'duration'], '40']
            })



            map.addLayer({
                id: 'fill-isochrone-30',
                type: 'fill',
                source: 'isochrone',
                paint: {
                    'fill-color': '#bdc9e1'
                },
                filter: ['==', ['get', 'duration'], '30']
            })

            map.addLayer({
                id: 'fill-isochrone-20',
                type: 'fill',
                source: 'isochrone',
                paint: {
                    'fill-color': '#74a9cf'
                },
                filter: ['==', ['get', 'duration'], '20']
            })

            map.addLayer({
                id: 'fill-isochrone-10',
                type: 'fill',
                source: 'isochrone',
                paint: {
                    'fill-color': '#0570b0'
                },
                filter: ['==', ['get', 'duration'], '10']
            })

            map.addLayer({
                id: 'line-isochrone-40',
                type: 'line',
                source: 'isochrone',
                paint: {
                    'line-color': '#aaa'
                },
            })

            map.addSource('nyc-subway-stops', {
                type: 'geojson',
                data: stopsData
            })

            map.on('mouseenter', 'subway_stations', (e) => {
                const { features } = e
                const { stop_id } = features[0].properties
                if (stop_id !== activeStopId) {
                    setActiveStopId(stop_id)
                }
            })

            map.on('mouseleave', 'subway_stations', (e) => {
                setActiveStopId(null)
            })

            // add geojson sources for subway routes and stops
            map.addSource('nyc-subway-routes', {
                type: 'geojson',
                data: routesData
            });

            // add layers by iterating over the styles in the array defined in subway-layer-styles.js
            subwayLayerStyles.forEach((style) => {
                map.addLayer(style)
            })

            setMapLoaded(true)
        })



    }, [])

    useEffect(() => {
        if (!mapLoaded) return

        if (activeStopId) {
            const isochronePath = `/isochrones/${activeStopId}.geojson`
            mapRef.current.getSource('isochrone').setData(isochronePath)
        } else {
            mapRef.current.getSource('isochrone').setData(dummyFC)
        }

    }, [activeStopId])

    const getStation = (stop_id) => {
        return stations.find(d => d.stop_id === stop_id)
    }

    const station = getStation(activeStopId)


    return (
        <>
            <div ref={mapContainer} className='map-container h-full' />
            {station && (
                <div className='absolute top-5 left-5 z5 text-white'>
                    <StationHeader station={station} />
                </div>
            )}
        </>
    )
}

export default Map