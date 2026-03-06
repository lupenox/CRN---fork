
import { useEffect, useRef, useState } from 'react';
import { Layout, Button, Icon } from '@ui-kitten/components'
import { StyleSheet, View } from 'react-native';
import MapView, { Marker } from 'react-native-maps';
import { AppHeader } from '../navigation/AppHeader';
import { mockResources } from '../data/mockData';

import * as Location from 'expo-location';

export default function Map(){

	const mapRef = useRef<MapView>(null);
	const subscriptionRef = useRef<Location.LocationSubscription | null>(null);
	const [location, setLocation] = useState<Location.LocationObject | null>(null);

	useEffect(()=>{
		async function startTracking(){
			const {status} = await Location.requestForegroundPermissionsAsync();
			if(status !== 'granted'){ return;}
			subscriptionRef.current = await Location.watchPositionAsync(
				{
					accuracy: Location.Accuracy.BestForNavigation,
					timeInterval: 5000,
					distanceInterval: 0,
				}, (loc)=> setLocation(loc));
		}
		startTracking();
		return ()=>{ subscriptionRef.current?.remove(); };
	}, [])

	function recenterMap(){
		if(location && mapRef.current){
			mapRef.current.animateCamera({
				center: {
					latitude: location.coords.latitude,
					longitude: location.coords.longitude,
				},
			});
		}
	}

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
		  <AppHeader title="Event Map" />
			<View style={styles.mapContainer}>
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
							coordinate={{
								latitude: location.coords.latitude,
								longitude: location.coords.longitude
							}}
							title='You'
						/>
					)}
					{mockResources.map(resource => (
						<Marker
							key={resource.id}
							coordinate={{ latitude: resource.lat, longitude: resource.lng }}
							title={resource.title}
							description={resource.location}
						/>
					))}
				</MapView>
				{location && (
					<Button
						style={styles.locateButton}
						accessoryLeft={<Icon name="navigation-2-outline" />}
						onPress={recenterMap}
					/>
				)}
			</View>
		</Layout>
	);
}

const styles = StyleSheet.create({
	layout:{
		flex: 1,
		paddingBottom: "15%"
	},
	mapContainer:{
		flex: 1,
	},
	map:{
		flex: 1
	},
	locateButton:{
		position: 'absolute',
		bottom: 20,
		right: 16,
		borderRadius: 50,
		width: 52,
		height: 52,
		paddingHorizontal: 0,
	},
});
