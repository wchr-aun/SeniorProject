import { NavigationEvents } from "react-navigation";

const [isInOperation, setIsInOperation] = useState(false);
const [isRefreshing, setIsRefreshing] = useState(false);
const [isLoading, setIsLoading] = useState(false);
const [isInOperation, setIsInOperation] = useState(false);
const isOperationCompleted = useSelector(
  state => state.navigation.isOperationCompleted
);

//add spinner loading
if (isLoading) {
  return (
    <View style={{ flex: 1, justifyContent: "center", alignItems: "center" }}>
      <ActivityIndicator size="large" color={Colors.primary_bright_variant} />
    </View>
  );
}

// for refreshing
const checkIsOperationCompleted = () => {
  if (isOperationCompleted === true) {
    props.navigation.navigate("ShowSellerItemsScreen");
  } else {
    setIsLoading(true);
    refreshSellerItems();
    setIsLoading(false);
  }
};

<NavigationEvents onWillFocus={checkIsOperationCompleted} />;
