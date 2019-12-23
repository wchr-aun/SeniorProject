import firebaseUtil from "../firebase";

// -------------------------------------- cloud function -----------------------------
const addTrashHandler = items => {
  let addWaste = firebaseUtil.functions().httpsCallable("addWaste");

  console.log(items);
  // Call firebase cloud functio
  return addWaste(items)
    .then(function(result) {
      // Read result of the Cloud Function.
      console.log("From EditTrashForSeller: addWaste added");
      console.log(result);
    })
    .catch(function(error) {
      // Getting the Error details.
      var code = error.code;
      var message = error.message;
      var details = error.details;
      console.log("From EditTrashForSeller: error code :" + code);
      console.log("From EditTrashForSeller: error message :" + message);
      console.log("From EditTrashForSeller: error details :" + details);
    });
};

export default {
  addTrashHandler
};
