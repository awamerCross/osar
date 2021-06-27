const INIT_STATE = { user: null, userRates: [] };

export default (state = INIT_STATE, action) => {
  switch (action.type) {
    case "profile_data":
      //   return INIT_STATE;
      return { ...state, user: action.data.data, loader: action.data.success };
    case "update_profile":
      //   return INIT_STATE;

      return { ...state, user: action.data };
    // case ('logout'):
    //     return ({ user: null });

    case "user_Rates":
      return {
        ...state,
        userRates: action.payload,
      };
    default:
      return state;
  }
};
