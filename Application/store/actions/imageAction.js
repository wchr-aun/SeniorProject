import * as FileSystem from "expo-file-system";

export const SET_PLACES = "SET_PLACES";
export const GET_PREDICTION = "GET_PREDICTION";
export const ADD_SELLERITEMS_BYCAMERA = "ADD_SELLERITEMS_BYCAMERA";
export const CONFIRM_SELLERITEMSCAMERA = "CONFIRM_SELLERITEMSCAMERA";

// Image constant
const PERDICT_LINK = "http://35.197.147.180:5000/predict";
const SELLERITEMS_UPLOAD_FILEDIR = "sellReq_imgs/";

export const confirmSellerItemsCamera = sellerItemsCameraObj => {
  return async dispatch => {
    console.log("confirmSellerItemsCamera");

    dispatch({ type: CONFIRM_SELLERITEMSCAMERA, sellerItemsCameraObj });
  };
};

// export const uploadingImg = image => {
//   return async dispatch => {
//     console.log("uploadingImg action!");
//     console.log(image.width + " " + image.height);

//     const fileName = image.uri.split("/").pop();

//     const response = await fetch(uri);
//     const blob = await response.blob();

//     var ref = firebase
//       .storage()
//       .ref()
//       .child(SELLERITEMS_UPLOAD_FILEDIR + fileName);
//     return ref.put(blob);
//   };
// };

export const getPrediction = (image, wasteTypesDB) => {
  return async dispatch => {
    console.log("getPrediction action!");

    // Move to new directory
    const fileName = image.uri.split("/").pop();
    const newImageUrl = FileSystem.documentDirectory + fileName;

    try {
      await FileSystem.copyAsync({
        from: image.uri,
        to: newImageUrl
      });
    } catch (err) {
      console.log(err);
      throw err;
    }

    // Infer the type of the image
    const match = /\.(\w+)$/.exec(fileName);
    const type = match ? `image/${match[1]}` : `image`;

    //base64
    let formData = new FormData();

    formData.append("photo", {
      uri: newImageUrl,
      name: fileName,
      type
    });

    // // //tmp
    // dispatch({
    //   type: GET_PREDICTION,
    //   results: [
    //     {
    //       class: "PETE",
    //       score: "0.9232149",
    //       xmax: "410",
    //       xmin: "168",
    //       ymax: "770",
    //       ymin: "32"
    //     },
    //     {
    //       class: "PETE",
    //       score: "0.9232149",
    //       xmax: "410",
    //       xmin: "168",
    //       ymax: "770",
    //       ymin: "32"
    //     },
    //     {
    //       class: "HDPE",
    //       score: "0.9232149",
    //       xmax: "410",
    //       xmin: "168",
    //       ymax: "770",
    //       ymin: "32"
    //     }
    //   ],
    //   wasteTypesDB
    // });

    // send an image
    fetch(PERDICT_LINK, {
      method: "POST",
      headers: {
        "Content-Type": "application/json"
      },
      body: JSON.stringify({ photo: image.base64 })
    })
      .then(res => {
        return res.json();
      })
      .then(res => {
        dispatch({
          type: GET_PREDICTION,
          results: res.results,
          wasteTypesDB
        });
        return res;
      })
      .catch(error => console.log(error));
  };
};
