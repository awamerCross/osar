import React, { useEffect, useRef, useState } from "react";
import {
  View,
  Text,
  Image,
  TouchableOpacity,
  Dimensions,
  FlatList,
  ActivityIndicator,
  Vibration,
} from "react-native";
import { Container, Content, Icon, Input } from "native-base";
import styles from "../../assets/styles";
import i18n from "../../locale/i18n";
import Swiper from "react-native-swiper";
import { useDispatch, useSelector } from "react-redux";
import { getBanners, getCategories, getCartCount } from "../actions";
import Header from "../common/Header";
import COLORS from "../consts/colors";
import * as Notifications from "expo-notifications";

const height = Dimensions.get("window").height;
const isIOS = Platform.OS === "ios";

function Home({ navigation, route }) {
  const lang = useSelector((state) => state.lang.lang);
  const token = useSelector((state) =>
    state.auth.user ? state.auth.user.data.token : null
  );
  const [search, setSearch] = useState("");
  const banners = useSelector((state) => state.banners.banners);
  const bannersLoader = useSelector((state) => state.banners.loader);
  const cartCount = useSelector((state) => state.cart.cartCount);
  const categories = useSelector((state) => state.categories.categories);
  const categoriesExtra = useSelector(
    (state) => state.categories.categoriesExtra
  );
  const categoriesLoader = useSelector((state) => state.categories.loader);
  const [screenLoader, setScreenLoader] = useState(true);

  const dispatch = useDispatch();

  function fetchData() {
    setScreenLoader(true);
    dispatch(getBanners(lang)).then(() => setScreenLoader(false));
    dispatch(getCategories(lang)).then(() => setScreenLoader(false));
    dispatch(getCartCount(lang, token));
  }
  useEffect(() => {
    fetchData();
    const unsubscribe = navigation.addListener("focus", () => {
      fetchData();
    });

    return unsubscribe;
  }, [navigation, bannersLoader, categoriesLoader]);

  useEffect(() => {
    Notifications.addNotificationReceivedListener(_handleNotification);
  }, []);

  const _handleNotification = async (notification) => {
    // console.log("notification", notification);
    // const content = notification?.request?.content;

    isIOS && Vibration.vibrate();

    Notifications.setNotificationHandler({
      handleNotification: async () => ({
        shouldShowAlert: true,
        shouldPlaySound: true,
        shouldSetBadge: false,
      }),
    });
    // !isIOS &&
    //   (await Notifications.scheduleNotificationAsync({
    //     content: {
    //       title: content.title,
    //       body: content.body,
    //     },
    //     trigger: null,
    //   }));
  };

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

  function Item({ title, image, type, id, index }) {
    return (
      <TouchableOpacity
        onPress={() =>
          navigation.navigate("category", { title, type, category_id: id })
        }
        style={[
          styles.height_200,
          styles.marginBottom_15,
          styles.marginHorizontal_7,
          { flex: 1, overflow: "hidden" },
        ]}
      >
        <View
          style={[
            styles.flexCenter,
            styles.overlay_black,
            styles.Width_100,
            { position: "absolute", bottom: 0, zIndex: 1, padding: 7 },
          ]}
        >
          <Text
            style={[
              styles.textBold,
              styles.text_White,
              styles.textSize_13,
              styles.textCenter,
            ]}
          >
            {title}
          </Text>
        </View>
        <Image
          source={{ uri: image }}
          style={[styles.Width_100, styles.heightFull]}
          resizeMode={"cover"}
        />
      </TouchableOpacity>
    );
  }

  return (
    <Container style={[styles.bg_darkRed]}>
      {renderLoader()}
      <Content contentContainerStyle={[styles.bgFullWidth, styles.bg_darkRed]}>
        <Header
          navigation={navigation}
          title={i18n.t("home")}
          cartCount={cartCount && cartCount.count ? cartCount.count : "0"}
        />

        <View
          style={[
            styles.Width_90,
            styles.SelfCenter,
            styles.marginBottom_20,
            styles.marginTop_15,
            { zIndex: -1 },
          ]}
        >
          <Input
            style={[styles.inputSearch, styles.Width_100, { flex: 0 }]}
            placeholder={i18n.t("search")}
            placeholderTextColor={"#fff"}
            onChangeText={(search) => setSearch(search)}
            value={search}
            onSubmitEditing={() =>
              navigation.navigate("resultBySearch", { search })
            }
          />

          <TouchableOpacity
            onPress={() => navigation.navigate("resultBySearch", { search })}
            style={{ position: "absolute", right: 15, top: 13 }}
          >
            <Image
              source={require("../../assets/images/searchWhite.png")}
              style={[styles.icon17]}
              resizeMode={"cover"}
            />
          </TouchableOpacity>
        </View>

        <View style={[styles.bgFullWidth, styles.bg_White, styles.Width_100]}>
          <View style={[styles.marginVertical_20, styles.paddingHorizontal_20]}>
            {banners && banners.length > 0 ? (
              <Swiper
                key={2}
                dotStyle={styles.eventdoteStyle}
                activeDotStyle={styles.eventactiveDot}
                containerStyle={styles.eventswiper}
                showsPagination={false}
                showsButtons={false}
                autoplay={true}
              >
                {banners.map((banner, i) => {
                  return (
                    <TouchableOpacity key={i}>
                      <Image
                        source={{ uri: banner.image }}
                        style={styles.swiperImg}
                        resizeMode={"cover"}
                      />
                    </TouchableOpacity>
                  );
                })}
              </Swiper>
            ) : null}
          </View>

          <View>
            <FlatList
              data={categories}
              horizontal={false}
              numColumns={2}
              showsVerticalScrollIndicator={false}
              renderItem={({ item, index }) => (
                <Item
                  title={item.name}
                  image={item.img}
                  type={item.type}
                  id={item.id}
                  index={index}
                />
              )}
              keyExtractor={(item) => item.id}
              columnWrapperStyle={[
                styles.directionRowSpace,
                styles.paddingHorizontal_15,
              ]}
            />
          </View>
        </View>
      </Content>
    </Container>
  );
}

export default Home;
