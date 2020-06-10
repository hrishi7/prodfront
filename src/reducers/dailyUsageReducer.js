import isEmpty from "../utils/isEmpty";
const initialState = {
  dailyUsage: [],
};

export default function (state = initialState, action) {
  switch (action.type) {
    case "INSERT_DAILY_USAGE":
      return {
        ...state,
        dailyUsage: [action.payload, ...state.dailyUsage],
      };
    case "UPDATE_DAILY_USAGE":
      let dUsage = state.dailyUsage;
      state.dailyUsage.map((element, index) => {
        if (element._id == action.payload._id) {
          dUsage.push(action.payload);
        } else {
          dUsage.push(element);
        }
      });
      return {
        ...state,
        dailyUsage: dUsage,
      };
    case "READ_DAILY_USAGE":
      return {
        ...state,
        dailyUsage: action.payload,
      };
    case "DELETE_DAILY_USAGE":
      return {
        ...state,
        dailyUsage: state.dailyUsage.filter(
          (item) => item._id !== action.payload
        ),
      };
    default:
      return state;
  }
}
