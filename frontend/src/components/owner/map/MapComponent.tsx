import React from "react";
import { StyleSheet, View } from "react-native";
import MapView, { Marker, PROVIDER_GOOGLE } from "react-native-maps";
import { colors, radii } from "@/src/theme";
import mapStyle from "@/src/theme/mapStyle";

export default function MapComponent() {
    console.log("[MapComponent Native] Rendering...");

    const initialRegion = {
        latitude: 48.8566,
        longitude: 2.3522,
        latitudeDelta: 0.0922,
        longitudeDelta: 0.0421,
    };

    React.useEffect(() => {
        console.log("[MapComponent Native] Mounted");
    }, []);

    return (
        <View style={styles.container}>
            <MapView
                style={styles.map}
                initialRegion={initialRegion}
                provider={PROVIDER_GOOGLE}
                customMapStyle={mapStyle}
                showsUserLocation={true}
                toolbarEnabled={false}
            >
                <Marker
                    coordinate={{ latitude: 48.8566, longitude: 2.3522 }}
                    title="Appartement Paris"
                    description="2 pièces - 45m2"
                    pinColor={colors.primary}
                />
                <Marker
                    coordinate={{ latitude: 45.7640, longitude: 4.8357 }}
                    title="Maison Lyon"
                    description="5 pièces - 120m2"
                    pinColor={colors.secondary}
                />
            </MapView>
        </View>
    );
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        overflow: "hidden",
        borderRadius: radii.xl,
        margin: 10,
    },
    map: {
        width: "100%",
        height: "100%",
    },
});
