import React, {Component} from "react";
import {View, ListView, ImageBackground, StyleSheet, Text, Image} from "react-native";
import Toolbar from "./toolbar";

const iconCloud = require("../images/clouds.png");   
const iconRain = require("../images/rain.png");
const iconDizzle = require("../images/umbrella.png");
const iconClear = require("../images/bigsun.png");
const iconSnow =require("../images/snow.png");  
const iconError = require("../images/chat.png");    
const iconMist = require("../images/mist.png")

export default class WeatherNextDay extends Component {
    constructor(props) {
        super(props);
        this.state = {
            city: "",
            dataSource: new ListView.DataSource({rowHasChanged: (r1, r2) => r1 !== r2}),
            load: true,
            day: "",
        };
    }

    componentWillMount() {
        let date = new Date();
        /**TODO: get day**/
        let day = date.getDay();
        switch (day) {
            case 0: this.setState({day: "Sunday"});break;
            case 1: this.setState({day: "Monday"});break;
            case 2: this.setState({day: "Tuesday"});break;
            case 3: this.setState({day: "Wednesday"});break;
            case 4: this.setState({day: "Thursday"});break;
            case 5: this.setState({day: "Friday"});break;
            case 6: this.setState({day: "Saturday"});break;
        }
    }

    /**TODO: list next two days**/
    nextDays(row) {
        if (this.state.day === "Sunday") {
            switch(row) {
                case 0: return "Monday";break;
                case 1: return "Tuesday";break;
                case 2: return "Wednesday";break;
                case 3: return "Thursday";break;
                case 4: return "Friday";break;
                case 5: return "Saturday";break;
                case 6: return "Sunday";break;
            }
        } else if (this.state.day === "Monday") {
            switch(row) {          
                case 0: return "Tuesday";break;
                case 1: return "Wednesday";break;
                case 2: return "Thursday";break;
                case 3: return "Friday";break;
                case 4: return "Saturday";break;
                case 5: return "Sunday";break;
                case 6: return "Monday";break;
            }
        } else if (this.state.day === "Tuesday") {
            switch(row) {           
                case 0: return "Wednesday";break;
                case 1: return "Thursday";break;
                case 2: return "Friday";break;
                case 3: return "Saturday";break;
                case 4: return "Sunday";break;
                case 5: return "Monday";break;
                case 6: return "Tuesday";break;
            }
        } else if (this.state.day === "Wednesday") {
            switch(row) {           
                case 0: return "Thursday";break;
                case 1: return "Friday";break;
                case 2: return "Saturday";break;
                case 3: return "Sunday";break;
                case 4: return "Monday";break;
                case 5: return "Tuesday";break;
                case 6: return "Wednesday";break;
            }
        } else if (this.state.day === "Thursday") {
            switch(row) {                    
                case 0: return "Friday";break;
                case 1: return "Saturday";break;
                case 2: return "Sunday";break;
                case 3: return "Monday";break;
                case 4: return "Tuesday";break;
                case 5: return "Wednesday";break;
                case 6: return "Thursday";break;
            }
        } else if (this.state.day === "Friday") {
            switch(row) {                              
                case 0: return "Saturday";break;
                case 1: return "Sunday";break;
                case 2: return "Monday";break;
                case 3: return "Tuesday";break;
                case 4: return "Wednesday";break;
                case 5: return "Thursday";break;
                case 6: return "Friday";break;
            }
        } else {
            switch(row) {                              
                case 0: return "Sunday";break;
                case 1: return "Monday";break;
                case 2: return "Tuesday";break;
                case 3: return "Wednesday";break;
                case 4: return "Thursday";break;
                case 5: return "Friday";break;
                case 6: return "Saturday";break;
            }
        }
    }

    dataFromChild = (city) => {
        this.setState({city: city, load: true});
        this.fetchApi(city);
    }

    fetchApi(city) {
        fetch(`https://api.openweathermap.org/data/2.5/forecast/daily?q=${city}&units=metric&appid=30e247f3f5d233caf872dbc1ca796785`)
        .then((response) => response.json())
        .then((responseJson) => {
            this.setState({dataSource: this.state.dataSource.cloneWithRows(responseJson.list), load: false,})
        }).catch((error) => {
        });
    }

    componentDidMount() {
        this.fetchApi(this.props.navigation.getParam("city", "Washington"));
    }

    render() {
        return (
            <ImageBackground style={{flex: 1}}
                source={require("../images/bgerror.jpg")}>
                <View style={{flex: 1, paddingBottom: 10}}>
                    <Toolbar callBackFromParent={this.dataFromChild}/>
                    <ListView
                        dataSource={this.state.dataSource}
                        renderRow={(row, sectionId, rowId) => (
                            <View style={styles.item}>
                                <View>
                                    <Text style={styles.itemTittleWeather}>{row.weather[0].main}</Text>
                                    <Text style={styles.itemTittleDay}>{this.nextDays(parseInt(rowId))}</Text>
                                </View>
                                <View style={{flexDirection: "row", alignItems: "center"}}>
                                    <Text style={styles.itemTemp}>{row.temp.day.toFixed(0)}°</Text>
                                    <Image style={styles.iconItem}
                                        source={row.weather[0].main === "Rain" ? iconRain :
                                            row.weather[0].main === "Clear" ? iconClear :
                                            row.weather[0].main === "Clouds" ? iconCloud :
                                            row.weather[0].main === "Drizzle" ? iconDizzle :
                                            row.weather[0].main === "Snow" ? iconSnow :
                                            row.weather[0].main === "Mist" ? iconMist :
                                            iconError}>
                                    </Image>
                                </View>
                            </View>
                        )}>
                    </ListView>
                </View>
            </ImageBackground>
        );
    }
}

const styles = StyleSheet.create({
    item: {
        marginTop: 10,
        marginLeft: 10,
        marginRight: 10,
        paddingLeft: 20,
        paddingRight: 20,
        backgroundColor: 'rgba(14,14,14,0.5)',
        flexDirection: "row",
        justifyContent: "space-between",
        alignItems: "center",
        paddingBottom: 10,
    },
    itemTittleWeather: {
        fontSize: 25,
        fontFamily: "edgeBold",
        color: "white",
    },
    itemTittleDay: {
        fontSize: 15,
        fontFamily: "edgeLight",
        color: "white",
    },
    itemTemp: {
        fontSize: 45,
        fontFamily: "edgeBold",
        marginRight: 20,
        color: "white",
    },
    iconItem: {
        width: 30,
        height: 30,
    },
});