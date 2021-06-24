import React, { useEffect, useRef, useState } from "react";
import {
  View,
  Text,
  Image,
  TouchableOpacity,
  Dimensions,
  FlatList,
  I18nManager,
  ActivityIndicator,
  Vibration,
} from "react-native";
import { Container, Content, Icon, Input } from "native-base";
import styles from "../../../assets/styles";
import i18n from "../../../locale/i18n";
import Swiper from "react-native-swiper";
import { useSelector, useDispatch } from "react-redux";
import Header from "../../common/Header";
import COLORS from "../../consts/colors";
import { getDelegateOrders, updateLocation } from "../../actions";
import { useIsFocused } from "@react-navigation/native";
import * as Permissions from "expo-permissions";
import * as Location from "expo-location";
import * as Notifications from "expo-notifications";

const latitudeDelta = 0.922;
const longitudeDelta = 0.521;

const height = Dimensions.get("window").height;
const isIOS = Platform.OS === "ios";

function Home({ navigation, route }) {
  const lang = useSelector((state) => state.lang.lang);
  const token = useSelector((state) =>
    state.auth.user ? state.auth.user.data.token : null
  );
  const delegateOrders = useSelector((state) => state.orders.delegateOrders);
  const [screenLoader, setScreenLoader] = useState(true);
  const locFrom =
    route.params && route.params.locFrom ? route.params.locFrom : "";

  const [mapRegion, setMapRegion] = useState({
    latitude: 24.774265,
    longitude: 46.738586,
    latitudeDelta,
    longitudeDelta,
  });

  const isFocused = useIsFocused();

  const dispatch = useDispatch();

  const fetchData = () => {
    setScreenLoader(true);
    dispatch(
      getDelegateOrders(
        lang,
        route.params ? route.params.latitude : null,
        route.params ? route.params.longitude : null,
        "READY",
        token
      )
    ).then(() => {
      dispatch(
        updateLocation(
          lang,
          route.params ? route.params.latitude : 24.774265,
          route.params ? route.params.longitude : 46.738586,
          token
        )
      );
      setScreenLoader(false);
    });
  };

  useEffect(() => {
    // Notifications.addListener(_handleNotification);
    Notifications.addNotificationReceivedListener(_handleNotification);
  }, []);

  const _handleNotification = async (notification) => {
    // Vibration.vibrate();
    // let notificationId = await Notifications.presentLocalNotificationAsync({
    //   title: notification.data.title,
    //   body: notification.data.body,
    //   ios: {
    //     sound: true,
    //     _displayInForeground: true,
    //   },
    // });

    isIOS && Vibration.vibrate();

    Notifications.setNotificationHandler({
      handleNotification: async () => ({
        shouldShowAlert: true,
        shouldPlaySound: true,
        shouldSetBadge: false,
      }),
    });
  };

  useEffect(() => {
    (async () => {
      if (isFocused) {
        if (locFrom == "current") {
          setScreenLoader(true);
          try {
            let { status } = await Permissions.askAsync(Permissions.LOCATION);
            let userLocation = {};
            if (status !== "granted") {
              alert("صلاحيات تحديد موقعك الحالي ملغاه");
              fetchData();
              setScreenLoader(false);
            } else {
              const {
                coords: { latitude, longitude },
              } = await Location.getCurrentPositionAsync({
                // accuracy: Platform.OS == 'ios' ?Location.Accuracy.Lowest: Location.Accuracy.Low
                accuracy: Location.Accuracy.Balanced,
              });
              userLocation = {
                latitude,
                longitude,
                latitudeDelta,
                longitudeDelta,
              };
              dispatch(
                getDelegateOrders(lang, latitude, longitude, "READY", token)
              ).then(() => {
                dispatch(updateLocation(lang, latitude, longitude, token));
                setScreenLoader(false);
              });
            }
          } catch (error) {
            setScreenLoader(false);
          }
        } else {
          // If not From Current Location
          fetchData();
        }
      }
    })();
  }, [isFocused]);

  function Item({ name, image, date, orderNum, type, index }) {
    return (
      <TouchableOpacity
        onPress={() =>
          navigation.navigate(
            type === "special" ? "specialOrderDetails" : "normalOrderDetails",
            { id: orderNum }
          )
        }
        style={[
          styles.borderGray,
          styles.marginBottom_20,
          styles.directionRow,
          styles.Radius_5,
          { flex: 1, padding: 10 },
        ]}
      >
        <View style={[styles.directionRow, { flex: 1 }]}>
          <Image
            source={{ uri: image }}
            style={[styles.icon60, styles.Radius_7]}
            resizeMode={"cover"}
          />
          <View style={[styles.paddingHorizontal_10, { flex: 1 }]}>
            <Text
              style={[
                styles.textRegular,
                styles.text_gray,
                styles.textSize_14,
                styles.marginBottom_5,
                styles.alignStart,
                { lineHeight: 20 },
              ]}
            >
              {name}
            </Text>
            <Text
              style={[
                styles.textRegular,
                styles.text_midGray,
                styles.textSize_14,
                styles.alignStart,
              ]}
            >
              {date}
            </Text>
          </View>
        </View>
        <View
          style={[
            { borderLeftWidth: 1, borderLeftColor: "#ddd", paddingLeft: 15 },
            styles.heightFull,
            styles.centerContext,
          ]}
        >
          <Text
            style={[
              styles.textRegular,
              styles.text_darkRed,
              styles.textSize_14,
              styles.marginBottom_5,
            ]}
          >
            {i18n.t("orderNum")}
          </Text>
          <Text
            style={[styles.textRegular, styles.text_gray, styles.textSize_14]}
          >
            {orderNum}
          </Text>
        </View>
      </TouchableOpacity>
    );
  }

  function renderLoader() {
    if (screenLoader) {
      return (
        <View style={[styles.loading, styles.flexCenter, { height: "100%" }]}>
          <ActivityIndicator
            size="large"
            color={COLORS.darkRed}
            style={{ alignSelf: "center" }}
          />
        </View>
      );
    }
  }

  function renderNoData() {
    if (delegateOrders && delegateOrders.length <= 0) {
      return (
        <View
          style={[
            styles.directionColumnCenter,
            styles.Width_100,
            styles.heightFull,
          ]}
        >
          <Image
            source={require("../../../assets/images/note.png")}
            resizeMode={"contain"}
            style={{ alignSelf: "center", width: 200, height: 200 }}
          />
        </View>
      );
    }

    return null;
  }

  return (
    <Container style={[styles.bg_darkRed]}>
      {renderLoader()}
      <Content contentContainerStyle={[styles.bgFullWidth, styles.bg_darkRed]}>
        <Header
          navigation={navigation}
          title={i18n.t("home")}
          delegate={true}
        />

        <View
          style={[
            styles.bgFullWidth,
            styles.bg_White,
            styles.Width_100,
            styles.paddingHorizontal_20,
            styles.paddingVertical_20,
            { overflow: "hidden" },
          ]}
        >
          {delegateOrders && delegateOrders.length > 0 ? (
            <FlatList
              data={delegateOrders}
              horizontal={false}
              showsVerticalScrollIndicator={false}
              renderItem={({ item, index }) => (
                <Item
                  id={item.order_id}
                  name={item.provider.name}
                  image={item.provider.avatar}
                  date={item.date}
                  orderNum={item.order_id}
                  type={item.type}
                  index={index}
                />
              )}
              keyExtractor={(item) => item.order_id}
              style={[styles.marginBottom_35]}
            />
          ) : (
            renderNoData()
          )}
        </View>
      </Content>
    </Container>
  );
}

export default Home;
