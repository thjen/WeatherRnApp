import React, {Component} from "react";
import {View, Text, ListView, StyleSheet, Image, Dimensions, TouchableOpacity, ActivityIndicator, Modal,
    ImageBackground, StatusBar} from "react-native";
import Toolbar from "./toolbar";

const {height, width} = Dimensions.get("window");

/**TODO: set icon weather current**/
const iconCloud = require("../images/clouds.png");   
const iconRain = require("../images/rain.png");
const iconDizzle = require("../images/umbrella.png");
const iconClear = require("../images/bigsun.png");
const iconSnow =require("../images/snow.png");  
const iconError = require("../images/chat.png");    
const iconMist = require("../images/mist.png")
/*const iconSun = require("../images/sun.png")*/

/**TODO: background **/
const bgCloud = require("../images/bgclouds.jpg");
const bgDrizzle = require("../images/bgdrizzle.jpg");
const bgMist = require("../images/bgmist.jpg");
const bgRain = require("../images/bgrain.jpg");
const bgSnow = require("../images/bgsnow.jpg");
const bgClear = require("../images/bgsun.jpg");
const bgError = require("../images/bgerror.jpg");

export default class Main extends Component {
    constructor(props) {
        super(props);
        this.state = {
            day: "",
            message: "",
            good: "",
            load: true,
            /**infomation location **/
            locationCity: "",
            countyName: "",
            flag: "",
            /**infomation weather current**/
            weather: [],
            main: "",
            description: "",
            info: [],
            tempmax: 0,
            tempmin: 0,
            temp: 0.0,
            humidity: 0,
            wind: [],
            speed: 0,
            /**list 7 day**/
            list: [],
            dataSource: new ListView.DataSource({rowHasChanged: (r1, r2) => r1 !== r2}),
        };
    }

    goWeatherNextDay() {
        this.props.navigation.navigate("NextDay", {city: this.state.locationCity,});
    }

    componentWillMount() {
        /**TODO: handle hello user with current time**/
        let date = new Date();
        let hour = date.getHours();
        if (hour >= 4 && hour < 12) {
            this.setState({good: "Good morning"});
        } else if (hour >= 12 && hour < 19) {
            this.setState({good: "Good afternoon"});
        } else {
            this.setState({good: "Good evening"});
        }
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
    nextTwoDay(row) {
        if (this.state.day === "Sunday") {
            if (row == 0) {
                return "Monday";
            } else {
                return "Tuesday";
            }
        } else if (this.state.day === "Monday") {
            if (row == 0) {
                return "Tuesday";
            } else {
                return "Wednesday";
            }
        } else if (this.state.day === "Tuesday") {
            if (row == 0) {
                return "Wednesday";
            } else {
                return "Thursday";
            }
        } else if (this.state.day === "Wednesday") {
            if (row == 0) {
                return "Thursday";
            } else {
                return "Friday";
            }
        } else if (this.state.day === "Thursday") {
            if (row == 0) {
                return "Friday";
            } else {
                return "Saturday";
            } 
        } else if (this.state.day === "Friday") {
            if (row == 0) {
                return "Saturday";
            } else {
                return "Sunday";
            }
        } else {
            if (row == 0) {
                return "Sunday"; 
            } else {
                return "Monday";
            }
        }
    }

    showModalSearch() {
        this.setState({searchModalVisible: true});
    }

    dataFromChild = (city) => {
        this.setState({locationCity: city});
        // refresh data
        this.setState({load: true});
        this.fetchDataFromApi(city);
    }

    fetchDataFromApi(city) {
        /**TODO: fetch data weather api when have location**/
        /**FIXME: not Tp Ho Chi Minh, it have to saigon**/
        fetch(`https://api.openweathermap.org/data/2.5/weather?q=${city}&units=metric&appid=30e247f3f5d233caf872dbc1ca796785`)
        .then((response) => response.json())
        .then((responseJson) => {
            //console.log("weather", responseJson);
            this.setState({weather: responseJson.weather});
            this.setState({main: this.state.weather[0].main, description: this.state.weather[0].description});
        
            /**TODO: handle description to uppercase first word**/
            let des1 = (this.state.description).substr(1, (this.state.description).length); // cut str 1 -> length
            let des2 = (this.state.description).toUpperCase(); // uppercase str
            let des3 = des2.substr(0, 1); // cut first word str when have been uppercase
            let result = des3.concat(des1); // concat str;
            this.setState({description: result});
            
            this.setState({info: responseJson.main});
            this.setState({temp: this.state.info.temp, tempmax: this.state.info.temp_max, 
                            tempmin: this.state.info.temp_min, humidity: this.state.info.humidity});
            this.setState({wind: responseJson.wind});
            this.setState({speed: this.state.wind.speed});

            /**TODO: handle message for client when know weather current**/
            if (this.state.main === "Clouds") {
                this.setState({message: "We should go out with our friends."});
            } else if (this.state.main === "Rain") {
                this.setState({message: "Can we see a movie today?"});
            } else if (this.state.main === "Clear") {
                this.setState({message: "It seems like a great day out for a stroll around the city."});
            } else if (this.state.main === "Snow") {
                this.setState({message: "We should go to snowboarding."});
            } else {
                this.setState({message: "If we go out. We should bring an umbrella."});
            }
            
            this.setState({load: false,});
        }).catch((error) => {
            this.setState({load: false,});
        });

        /**TODO: fetch data weather api 2 day after when have location**/
        fetch(`https://api.openweathermap.org/data/2.5/forecast/daily?q=${city}&units=metric&cnt=2&appid=30e247f3f5d233caf872dbc1ca796785`)
            .then((response) => response.json())
            .then((responseJson) => {
                this.setState({dataSource: this.state.dataSource.cloneWithRows(responseJson.list)});                
            }).catch((error) => {});
    }

    componentDidMount() {
        /**TODO: fetch ipstack api get location**/
        /**FIXME: not get city orther hanoi**/
        fetch("http://api.ipstack.com/check?access_key=0d9c89ad40a1149f511d052fb98dbac2")
        .then((response) => response.json())
        .then((responseJson) => {
            this.setState({locationCity: responseJson.city, countyName: responseJson.country_name,});
            this.setState({locationCity: "Hanoi",});
            this.fetchDataFromApi(this.state.locationCity);

        }).catch((error) => {
            this.setState({locationCity: "Washington", countyName: "USA",});
            this.fetchDataFromApi(this.state.locationCity);
        });
    }

    render() {
        
        const iconset = this.state.main === "Clouds" ? iconCloud : 
            this.state.main === "Rain" ? iconRain :
            this.state.main === "Drizzle" ? iconDizzle :
            this.state.main === "Snow" ? iconSnow :
            this.state.main === "Clear" ? iconClear :
            this.state.main === "Mist" ? iconMist :
            iconError;

        const bgSet = 
            this.state.main === "Clouds" ? bgCloud :
            this.state.main === "Clear" ? bgClear :
            this.state.main === "Rain" ? bgRain :
            this.state.main === "Drizzle" ? bgDrizzle :
            this.state.main === "Snow" ? bgSnow :
            this.state.main === "Mist" ? bgMist :
            bgError;
            
        return (
            <ImageBackground
                    style={{flex: 1}}
                    source={bgSet}>
                <StatusBar backgroundColor="transparent"
                    translucent={true}></StatusBar>
                <View style={{flex: 1}}>
                    <Toolbar callBackFromParent={this.dataFromChild}/>
                    <View style={styles.weatherCurrent}>
                        <Image style={styles.iconWeatherCurrent}
                            source={iconset}>
                        </Image>
                        <View style={styles.wrraperOne}>
                            <View>
                                <Text style={styles.textWeatherCurrent}>{this.state.main}</Text>
                                <Text style={styles.textCity}>{this.state.locationCity}</Text>                     
                            </View>
                            <View>
                                {/* <Text style={styles.textTemp}>40&#x25E6;</Text> */}
                                <Text style={styles.textTemp}>{(this.state.temp).toFixed(0)}°</Text>
                            </View>
                        </View>
                        <View style={{marginTop: 20}}>
                            <View style={styles.detail}>
                                <Text style={styles.textDetail}>Temperature max: {this.state.tempmax}</Text>
                                <Text style={styles.textDetail}>Humidity: {this.state.humidity}</Text>
                            </View>                           
                            <View style={styles.detail}>
                                <Text style={styles.textDetail}>Temperature min: {this.state.tempmin}</Text>
                                <Text style={styles.textDetail}>Wind speed: {this.state.speed}</Text>
                            </View>
                        </View>
                        <View style={styles.description}>
                            <Text style={styles.textHello}>{this.state.good}</Text>
                            <Text style={styles.textDetail}>{this.state.description}. {this.state.message}</Text>
                        </View>
                    </View>

                    <View style={{flexDirection: "row", justifyContent: "flex-end", paddingRight: 10}}>
                        <Text style={styles.smallTitle}>Next days</Text>
                    </View>
                    
                    <View>
                        <ListView
                            dataSource={this.state.dataSource}
                            renderRow={(row, sectionid, rowid) => (
                                <View style={styles.item}>
                                    <View>
                                        <Text style={styles.itemTittleWeather}>{row.weather[0].main}</Text>
                                        <Text style={styles.itemTittleDay}>{this.nextTwoDay(rowid)}</Text>
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
                            )}
                        />
                    </View>
                    <View style={styles.viewButtonShowmore}>
                        <TouchableOpacity onPress={() => this.goWeatherNextDay()}>
                            <Text style={styles.textDetail}>Show more</Text>
                        </TouchableOpacity>
                    </View>

                    <Modal 
                        transparent={true}
                        animationType="none"
                        visible={this.state.load}
                        onRequestClose={() => {
                                Alert.alert('Modal has been closed.');
                        }}>
                        <View style={styles.rootViewModalIndicator}>
                            <View style={styles.contentViewModalIndicator}>
                                <ActivityIndicator animating={this.state.load} size="large" color="#D72638" />
                            </View>
                            <View style={styles.wrapperContent}>
                                <Text style={styles.textViewLoad}>Just a moment</Text>
                            </View>
                        </View>
                    </Modal>
                </View>
            </ImageBackground>
        );
    }
}

const styles = StyleSheet.create({
    weatherCurrent: {
        paddingTop: 10,
        paddingLeft: 30,
        paddingRight: 30,
    },
    textWeatherCurrent: {
        fontSize: 30,
        fontFamily: "edgeBold",
        color: "white",
    },
    textCity: {
        fontSize: 15,
        fontFamily: "edgeLight",
        color: "white",
    },
    textTemp: {
        fontSize: 60,
        fontFamily: "edgeLight",
        color: "white",
    },
    iconWeatherCurrent: {
        width: 60,
        height: 60,
    },
    wrraperOne: {
        flexDirection: "row",
        justifyContent: "space-between",
        alignItems: "center",
        height: height/10,
    },
    description: {
        paddingTop: 20,
        paddingBottom: 20,
    },
    textHello: {
        fontFamily: "edgeBold",
        fontSize: 20,
        color: "white",
    },
    textDetail: {
        fontSize: 15,
        fontFamily: "edgeLight",
        color: "white",
    },
    smallTitle: {
        fontSize: 13,
        fontFamily: "edgeItalic",
        justifyContent: "space-between",
        color: "white",
    },
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
    itemTittleDay: {
        fontSize: 15,
        fontFamily: "edgeLight",
        color: "white",
    },
    itemTittleWeather: {
        fontSize: 25,
        fontFamily: "edgeBold",
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
    viewButtonShowmore: {
        flexDirection: "row", 
        justifyContent: "flex-end", 
        paddingLeft: 30, 
        paddingRight: 10,
        paddingTop: 15
    },
    rootViewModalIndicator: {
        flex: 1, 
        alignItems: 'center', 
        flexDirection: 'column', 
        justifyContent: 'center', 
        backgroundColor: 'rgba(15,15,15,0.8)'
    },
    contentViewModalIndicator: {
        height: 100, 
        width: 100, 
        borderRadius: 10, 
        display: 'flex', 
        alignItems: 'center', 
        justifyContent: 'space-around'
    },
    textViewLoad: {
        fontFamily: "edgeBold",
        fontSize: 20,
    },
    wrapperContent: {
        backgroundColor: "white",
        marginTop: 15,
        borderRadius: 5,
        padding: 10,
    }, 
    detail: {
        flexDirection: "row",
        justifyContent: "space-between",
    }
});