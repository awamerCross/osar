import axios from "axios";
import { AsyncStorage, Platform } from "react-native";
import { Toast } from "native-base";
import CONST from "../consts";
import i18n from "../../locale/i18n";

export const userLogin = (phone, password, deviceId, lang, navigation) => {
  return (dispatch) => {
    dispatch({ type: "login_user" });
    axios
      .post(CONST.url + "sign-in", {
        phone,
        password,
        lang,
        device_id: deviceId,
      })
      .then((response) => handelLogin(dispatch, response.data, navigation))
      .catch((error) => console.warn(error.data));
  };
};

export const register = (data, navigation) => {
  return async (dispatch) => {
    await AsyncStorage.getItem("deviceID").then((device_id) => {
      console.log("token", device_id);
      axios({
        url: CONST.url + "sign-up",
        method: "POST",
        data: {
          name: data.username,
          phone: data.phone,
          email: data.mail,
          password: data.password,
          user_type: data.userType,
          device_id,
        },
        params: { lang: data.lang },
      }).then((response) => {
        dispatch({ type: "register", payload: response.data });
        if (response.data.success) {
          navigation.navigate("activationCode", {
            token: response.data.data.token,
          });
        }

        console.log("message", response.data.message);

        Toast.show({
          text: response.data.message,
          type: response.data.success ? "success" : "danger",
          duration: 3000,
          textStyle: {
            color: "white",
            fontFamily: "flatRegular",
            textAlign: "center",
          },
        });
      });
    });
  };
};

export const activeAccount = (code, lang, token, setSpinner) => {
  return (dispatch) => {
    setSpinner(true);
    axios({
      url: CONST.url + "activate",
      method: "POST",
      data: { code },
      params: { lang },
      headers: {
        Authorization: "Bearer " + token,
      },
    }).then((response) => {
      if (response.data.success) {
        dispatch({ type: "active_account", data: response.data });
      }
      Toast.show({
        text: response.data.message,
        type: response.data.success ? "success" : "danger",
        duration: 3000,
        textStyle: {
          color: "white",
          fontFamily: "flatRegular",
          textAlign: "center",
        },
      });
      setSpinner(false);
    });
  };
};

export const checkPhone = (phone, lang, navigation) => {
  return async (dispatch) => {
    await axios({
      url: CONST.url + "forget-password",
      method: "POST",
      data: { phone },
      params: { lang },
    }).then((response) => {
      if (response.data.success)
        navigation.navigate("changePass", { token: response.data.data.token });

      Toast.show({
        text: response.data.message,
        type: response.data.success ? "success" : "danger",
        duration: 3000,
        textStyle: {
          color: "white",
          fontFamily: "flatRegular",
          textAlign: "center",
        },
      });
    });
  };
};

export const resetPassword = (password, code, token, lang, navigation) => {
  return async (dispatch) => {
    await axios({
      url: CONST.url + "reset-password",
      method: "POST",
      data: { password, code },
      params: { lang },
      headers: {
        Authorization: "Bearer " + token,
      },
    }).then((response) => {
      console.log("response", response.data.message);
      if (response.data.success) {
        navigation.navigate("login");
      } else {
        Toast.show({
          text: response?.data?.message,
          type: response.data.success ? "success" : "danger",
          duration: 3000,
          textStyle: {
            color: "white",
            fontFamily: "flatRegular",
            textAlign: "center",
          },
        });
      }
    });
  };
};

export const getDelegateAvailable = (lang, token) => {
  return (dispatch) => {
    axios({
      url: CONST.url + "delegate-availability",
      method: "POST",
      headers: { Authorization: "Bearer " + token },
      params: { lang },
    }).then((response) => {
      dispatch({ type: "delegateIsAvailable" });
      Toast.show({
        text: response.data.message,
        type: response.data.success ? "success" : "danger",
        duration: 3000,
        textStyle: {
          color: "white",
          fontFamily: "flatRegular",
          textAlign: "center",
        },
      });
    });
  };
};

export const tempAuth = () => {
  return (dispatch) => {
    dispatch({ type: "temp_auth" });
  };
};

const handelLogin = (dispatch, data, navigation) => {
  if (!data.success) {
    loginFailed(dispatch, data, navigation);
  } else {
    loginSuccess(dispatch, data, navigation);
  }

  data?.message != "" &&
    Toast.show({
      text: data.message,
      type: data.success ? "success" : "danger",
      duration: 3000,
      textStyle: {
        color: "white",
        fontFamily: "flatRegular",
        textAlign: "center",
      },
    });
};

const loginSuccess = (dispatch, data, navigation) => {
  console.log("data, here", data?.data?.user_type);
  if (data?.data?.user_type == 2 || data?.data?.user_type == 3) {
    AsyncStorage.setItem("token", JSON.stringify(data.data.token)).then(() =>
      dispatch({ type: "login_success", data })
    );
  } else {
    Toast.show({
      text: i18n.t("noCredintials"),
      type: "danger",
      duration: 3000,
      textStyle: {
        color: "white",
        fontFamily: "flatRegular",
        textAlign: "center",
      },
    });
  }
};

const loginFailed = (dispatch, error, navigation) => {
  if (error.data.active === false) {
    navigation.navigate("activationCode", {
      token: error.data.token,
    });
  }
  dispatch({ type: "login_failed", error });
};
