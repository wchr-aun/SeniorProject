import React, { useState, useEffect } from "react";
import { StyleSheet, View, Button, Modal, Alert } from "react-native";
import Colors from "../constants/Colors";
import {
  widthPercentageToDP as wp,
  heightPercentageToDP as hp
} from "react-native-responsive-screen";
import MapView, { Marker, Polyline, Circle } from "react-native-maps";
import { getStatusBarHeight } from "react-native-status-bar-height";
import libary from "../utils/libary";
import { useReducer } from "react";

const ASPECT_RATIO = wp("100%") / hp("100%");
const LATITUDE_DELTA = 0.005; //adjust this for initial zoomin-zoomout
const LONGTITUDE_DELTA = LATITUDE_DELTA * ASPECT_RATIO;

const polylineReducer = (state, action) => {
  return {coords: action}
};

export default ModalShowInteractMap = props => {
  console.log("HEYYYYYYYYYYYYYYYYYYYYYYYYYYYYYYYYYYYYYYYYYYYYYYYYYYYYYYYY")
  console.log(props)
  const [zoomCord, setZoomCord] = useState({
    latitudeDelta: LATITUDE_DELTA,
    longitudeDelta: LONGTITUDE_DELTA
  });
  const [selectedLocation, setSelectedLocation] = useState();
  const [selectedLocationReadable, setSelectedLocationReadable] = useState();
  const [markerCoordinates, setMarkerCoordinates] = useState({
    latitude: props.origin.latitude,
    longitude: props.origin.longitude
  });
  const [polylineState, dispatchPolyline] = useReducer(
    polylineReducer,
    { coords: [] }
  );

  const isPathOptimize = props.pathOptimize ? true : false;

  useEffect(() => {
    setSelectedLocation({
      lat: props.origin.latitude,
      lng: props.origin.longitude
    });
    if (isPathOptimize)
      libary.getDirections(props.origin, props.destination).then(polyline => {
        dispatchPolyline(polyline)
      })
  }, []);

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

  const confirmLocationHandler = async () => {
    let selectedLocationReadable = "";
    if (!props.signupMode) {
      selectedLocationReadable = await libary.getPostalcodeAddressFromCord(
        selectedLocation.lat,
        selectedLocation.lng
      );
    }

    props.setSellerAddr({
      latitude: selectedLocation.lat,
      longitude: selectedLocation.lng,
      readable: props.signupMode
        ? props.addrReadable
        : selectedLocationReadable[0],
      zipcode: props.signupMode
        ? props.zipcode
        : parseInt(selectedLocationReadable[0].postalCode, 10)
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
            height: "5%",
            flexDirection: "row",
            backgroundColor: Colors.soft_primary_dark,
            paddingVertical: 10,
            alignItems: "center"
          }}
        >
          <View style={{ width: "100%", height: "100%", alignItems: "center" }}>
            <ThaiBoldText
              style={{
                color: Colors.on_primary_dark.low_constrast,
                fontSize: 15
              }}
            >
              เลือกตำแหน่งของคุณ
            </ThaiBoldText>
          </View>
        </View>
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
            showsMyLocationButton = {true}
            showsUserLocation = {true}
            followsUserLocation = {true}
          >
            {isPathOptimize ? (
              <>
                <Polyline
                  coordinates={polylineState.coords}
                  strokeWidth={4}
                  strokeColor="hotpink"
                />
                {props.destination.map(destination => (
                  <Marker
                    key={destination.txId}
                    coordinate={{
                      latitude: destination.latitude,
                      longitude: destination.longitude
                    }}
                  />
                ))}
              </>
            ) : (
              <Marker coordinate={markerCoordinates} />
            )}
          </MapView>
        </View>
        <View
          style={{
            width: "100%",
            height: "10%",
            flexDirection: "row",
            justifyContent: "space-around",
            alignItems: "center",
            backgroundColor: Colors.hard_primary_dark
          }}
        >
          <CustomButton
            style={{
              width: "40%",
              height: "100%",
              borderRadius: 8,
              maxHeight: 50
            }}
            btnColor={Colors.button.cancel.btnBackground}
            onPress={() => props.setModalVisible(false)}
            btnTitleColor={Colors.button.cancel.btnText}
            btnTitleFontSize={14}
          >
            <ThaiRegText
              style={{
                fontSize: 12
              }}
            >
              ปิดหน้าต่าง
            </ThaiRegText>
          </CustomButton>

          <CustomButton
            style={{
              width: "40%",
              height: "100%",
              borderRadius: 8,
              maxHeight: 50
            }}
            btnColor={Colors.button.submit_primary_bright.btnBackground}
            onPress={confirmLocationHandler}
            btnTitleColor={Colors.button.submit_primary_bright.btnText}
            btnTitleFontSize={14}
          >
            <ThaiRegText
              style={{
                fontSize: 12
              }}
            >
              ยืนยัน
            </ThaiRegText>
          </CustomButton>
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
