import React, { useState, useEffect } from "react";
import { View, Image } from "react-native";

export default ImageCircle = props => {
  return (
    <View // image need to config exactly number
      style={{
        ...props.style,
        width: props.avariableWidth, // width --> 0.8(all) - 0.25(this) = 0.55 (description container)
        height: props.avariableWidth,
        borderRadius: props.avariableWidth / 2, // divide 2 to make circle
        overflow: "hidden",
        alignSelf: "center"
      }}
    >
      <Image
        source={{
          uri: props.imgUrl
        }}
        style={{
          width: props.avariableWidth,
          height: props.avariableWidth
        }}
        resizeMode="cover"
      />
    </View>
  );
};
