import * as FileSystem from "expo-file-system";

export const SET_PLACES = "SET_PLACES";
export const GET_PREDICTION = "GET_PREDICTION";
export const ADD_SELLERITEMS_BYCAMERA = "ADD_SELLERITEMS_BYCAMERA";

const PERDICT_LINK = "http://c433f137.ngrok.io/predict";

export const getPrediction = (image, wasteTypesDB) => {
  return async dispatch => {
    console.log("getPrediction is called");
    console.log(image.width + " " + image.height);

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

    console.log("formData, typeof image.base64");
    console.log(typeof image.base64);

    //tmp
    dispatch({
      type: GET_PREDICTION,
      results: [
        {
          class: "PETE",
          score: "0.9232149",
          xmax: "410",
          xmin: "168",
          ymax: "770",
          ymin: "32"
        },
        {
          class: "PETE",
          score: "0.9232149",
          xmax: "410",
          xmin: "168",
          ymax: "770",
          ymin: "32"
        },
        {
          class: "HDPE",
          score: "0.9232149",
          xmax: "410",
          xmin: "168",
          ymax: "770",
          ymin: "32"
        }
      ],
      wasteTypesDB
    });

    // // send an image
    // fetch(PERDICT_LINK, {
    //   method: "POST",
    //   headers: {
    //     // "content-type": "multipart/form-data"
    //     "Content-Type": "application/json"
    //   },
    //   body: JSON.stringify({ photo: image.base64 })
    // })
    //   .then(res => {
    //     return res.json();
    //   })
    //   .then(res => {
    //     console.log(res);
    //     dispatch({
    //       type: ADD_SELLERITEMS_BYCAMERA,
    //       result: res.results
    //     });
    //     return res;
    //   })
    //   .catch(error => console.log(error));
  };
};
