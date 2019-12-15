import React from "react";
import {
  View,
  Text,
  Image,
  StyleSheet,
  Button,
  ScrollView
} from "react-native";
import { useSelector, useDispatch } from "react-redux";

import Colors from "../../constants/Colors";
import ThaiTitleText from "../../components/ThaiTitleText";
import ThaiText from "../../components/ThaiText";

export default SellingTransactionDetailScreen = props => {
  // Get a parameter that sent from the previous page.
  const transactionItem = props.navigation.getParam("transactionItem");
  console.log(transactionItem);

  //   // Get data from redux store
  //   const selectedProduct = useSelector(reducers =>
  //     reducers.productsReducer.availableProducts.find(
  //       prod => prod.id === productId
  //     )
  //   );

  //   const dispatch = useDispatch();

  return (
    // <ScrollView>
    //   <Image style={styles.image} source={{ uri: selectedProduct.imageUrl }} />
    //   <View style={styles.actions}>
    //     <Button
    //       color={Colors.secondary}
    //       title="Add to Cart"
    //       onPress={() => {
    //         dispatch(cartActions.addToCart(selectedProduct));
    //       }}
    //     />
    //   </View>
    //   <Text style={styles.price}>{selectedProduct.price}</Text>
    //   <Text style={styles.description}>{selectedProduct.description}</Text>
    // </ScrollView>
    <View>
      <ThaiText>{transactionItem.buyerName}</ThaiText>
    </View>
  );
};

// ProductDetailScreen.navigationOptions = navData => {
//   return {
//     headerTitle: navData.navigation.getParam("productTitle")
//   };
// };

const styles = StyleSheet.create({
  image: {
    width: "100%",
    height: 300
    // backgroundColor: 'red'
  },
  actions: {
    marginVertical: 10,
    alignItems: "center"
  },
  price: {
    fontSize: 20,
    color: Colors.accent,
    textAlign: "center",
    marginVertical: 20
  },
  description: {
    fontSize: 14,
    textAlign: "center",
    marginHorizontal: 20
  }
});
