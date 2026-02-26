
import { useEffect, useRef, useState } from 'react';
import { Layout } from '@ui-kitten/components'
import { StyleSheet } from 'react-native';
import MapView, { Marker, MapMarker } from 'react-native-maps';

import * as Location from 'expo-location';

export default function Map(){

	const mapRef = useRef<MapView>(null);
	const userMarkerRef = useRef<MapMarker>(null);
	const [location, setLocation] = useState<Location.LocationObject | null>(null);

	let subscription: Location.LocationSubscription;

	async function getUserLocation(){
		const {status} = await Location.requestForegroundPermissionsAsync();
		if(status !== 'granted'){ return;}
		subscription = await Location.watchPositionAsync(
			{
				accuracy: Location.Accuracy.BestForNavigation,
				timeInterval: 5000,
				distanceInterval: 0,
			}, (loc)=> setLocation(loc));
	}

	useEffect(()=>{
		if(location && mapRef.current) {
			userMarkerRef.current?.animateMarkerToCoordinate({
				latitude: location.coords.latitude,
				longitude: location.coords.longitude,
			})

			mapRef.current.animateCamera({
				center: {
					latitude: location.coords.latitude,
					longitude: location.coords.longitude,
				},
			})
		}
		getUserLocation();

		return ()=>{
			subscription?.remove();
		};
	}, [location])

	//Milwaukee by default
	const defaultLocation = {
		latitude: 43.0389,
		longitude: -87.90647,
	}
	let locationInfo = {
		latitude: defaultLocation.latitude,
		longitude: defaultLocation.longitude,

		//deltas control the zoom on the map
		latitudeDelta: 0.01, 
		longitudeDelta: 0.01,
	};

	return(
		<Layout style={styles.layout}>
			<MapView
				ref={mapRef}	
				style={styles.map}
				initialRegion={{
					latitude: locationInfo.latitude,
					longitude: locationInfo.longitude,
					latitudeDelta: locationInfo.latitudeDelta,
					longitudeDelta: locationInfo.longitudeDelta,
				}}
			>
				{location && (
					<Marker 
						ref={userMarkerRef}
						coordinate={{ 
							latitude: locationInfo.latitude, 
							longitude: locationInfo.longitude 
						}}
						title='You'
					/>
				)}
			</MapView>
		</Layout>
	);
}

const styles = StyleSheet.create({
	layout:{
		flex: 1,
		paddingBottom: "15%"
	},
	map:{
		flex: 1
	}	
});
