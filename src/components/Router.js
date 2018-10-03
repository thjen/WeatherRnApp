import {createStackNavigator} from "react-navigation";
import Main from "./Main";
import WeatherNextDay from "./WeatherNextDay";

export const mainRouter = createStackNavigator({
    Main: {
        screen: Main,
        navigationOptions: {
            header: null,
        },
    },
    NextDay: {
        screen: WeatherNextDay,
        navigationOptions: {
            header: null,
        },
    },
});