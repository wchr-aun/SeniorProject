import React, { useState, useEffect } from "react";
import {
  StyleSheet,
  View,
  Button,
  Modal,
  Alert
} from "react-native";
import Colors from "../constants/Colors";
import {
  widthPercentageToDP as wp,
  heightPercentageToDP as hp
} from "react-native-responsive-screen";
import MapView, { Marker } from "react-native-maps";
import MapViewDirections from "react-native-maps-directions";
import { GOOGLE_API_KEY } from "react-native-dotenv";
import { getStatusBarHeight } from "react-native-status-bar-height";

const ASPECT_RATIO = wp("100%") / hp("100%");
const LATITUDE_DELTA = 0.005; //adjust this for initial zoomin-zoomout
const LONGTITUDE_DELTA = LATITUDE_DELTA * ASPECT_RATIO;

export default ModalShowInteractMap = props => {
  const [zoomCord, setZoomCord] = useState({
    latitudeDelta: LATITUDE_DELTA,
    longitudeDelta: LONGTITUDE_DELTA
  });
  const [selectedLocation, setSelectedLocation] = useState();
  const [markerCoordinates, setMarkerCoordinates] = useState({
    latitude: props.origin.latitude,
    longitude: props.origin.longitude
  });

  useEffect(() => {
    setSelectedLocation({
      lat: props.origin.latitude,
      lng: props.origin.longitude
    })
  }, [])

  const isPathOptimize = props.pathOptimize ? true : false

  const mapRegion = {
    latitude: markerCoordinates.latitude
      ? markerCoordinates.latitude
      : props.origin.latitude,
    longitude: markerCoordinates.longitude
      ? markerCoordinates.longitude
      : props.origin.longitude,
    latitudeDelta: zoomCord.latitudeDelta,
    longitudeDelta: zoomCord.longitudeDelta
  };

  const selectLocationHandler = event => {
    setSelectedLocation({
      lat: event.nativeEvent.coordinate.latitude,
      lng: event.nativeEvent.coordinate.longitude
    });
    setMarkerCoordinates({
      latitude: event.nativeEvent.coordinate.latitude,
      longitude: event.nativeEvent.coordinate.longitude
    });
  };

  const confirmLocationHandler = () => {
    console.log(selectedLocation)
    props.setSellerAddr({
      latitude: selectedLocation.lat,
      longitude: selectedLocation.lng,
      readable: props.addrReadable
    });
    props.setModalVisible(false);
  };

  return (
    <Modal
      animationType="slide"
      presentationStyle={"overFullScreen"}
      transparent={false}
      visible={props.modalVisible}
      onRequestClose={() => {
        Alert.alert("Modal has been closed.");
      }}
    >
      <View
        style={{
          width: wp("100%"),
          height: hp("100%")
        }}
      >
        <View
          style={{
            width: "100%",
            height: "85%"
          }}
        >
          <MapView
            style={styles.map}
            region={mapRegion}
            onPress={selectLocationHandler}
          >
            {
              isPathOptimize ?
              <MapViewDirections
                origin = {markerCoordinates}
                destination = {{latitude: props.destination.latitude, longitude: props.destination.longitude}}
                apikey = {GOOGLE_API_KEY}
                strokeWidth = {3}
                strokeColor = "hotpink"
              /> :
              (<Marker coordinate={markerCoordinates} />)
            }
          </MapView>
        </View>
        <View style={{ width: "100%", height: "10%", flexDirection: "row" }}>
          <View
            style={{ width: "40%", height: "100%", paddingVertical: wp("3%") }}
          >
            <Button
              title="ยกเลิก"
              onPress={() => props.setModalVisible(false)}
              color={Colors.primary}
            />
          </View>
          <View
            style={{ width: "40%", height: "100%", paddingVertical: wp("3%") }}
          >
            <Button
              title="ยืนยัน"
              onPress={confirmLocationHandler}
              color={Colors.primary_variant}
            />
          </View>
        </View>
      </View>
    </Modal>
  );
};

const styles = StyleSheet.create({
  map: {
    flex: 1
  }
});
