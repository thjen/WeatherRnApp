import React, {Component} from "react";
import {View, Text, Dimensions, Image, TouchableOpacity, Modal, TextInput, StyleSheet} from "react-native";

const {width, height} = Dimensions.get("window");

export default class Toolbar extends Component {
    constructor(props) {
        super(props);
        this.state = {
            modalVisible: false,
            city: "",
        };
    }

    showModal() {
        this.setState({modalVisible: true,});
    }

    render() {
        return (
            <View style={styles.toolBar}>
                <Text style={styles.toolbarTitle}>Weather</Text>
                <TouchableOpacity onPress={() => this.showModal()}>     
                        <Image source={require("../images/searchwhite.png")} 
                            style={{width: 25, height: 25}}
                        />
                </TouchableOpacity>

                <Modal
                    animationType="slide"
                    transparent={true}
                    visible={this.state.modalVisible}
                    onRequestClose={() => {
                        Alert.alert('Modal has been closed.');
                    }}>
                    <View style={styles.rootModal}>
                        <View style={styles.contentModal}>
                            <Text style={[styles.titleModal, {marginLeft: 30, marginTop: 30, fontSize: 30}]}>Search weather</Text>
                            <TextInput 
                                placeholder="Enter city"
                                value={this.state.city}
                                style={styles.searchView}
                                onChangeText={(data) => this.setState({city: data})}></TextInput>
                            <View style={styles.btGroup}>
                                <TouchableOpacity onPress={() => this.setState({modalVisible: false})}
                                    style={styles.btCancel}>
                                    <Text style={styles.textInButton}>Cancel</Text>
                                </TouchableOpacity>
                                <TouchableOpacity
                                    style={styles.btDone}
                                    onPress={() => {
                                        this.setState({modalVisible: false});
                                        this.props.callBackFromParent(this.state.city);
                                    }}>
                                    <Text style={styles.textInButton}>Done</Text>
                                </TouchableOpacity>
                            </View>
                        </View>
                    </View>
                </Modal>
            </View>
        );
    }
}

const styles = StyleSheet.create({
    toolBar: {
        marginTop: 25,
        width: width, 
        height: height/11, 
        flexDirection: "row",     
        alignItems: "center", 
        justifyContent: "flex-end", 
        paddingLeft: 30, 
        paddingRight: 30,
    },
    toolbarTitle: {
        fontSize: 20, 
        fontFamily: "edgeBold", 
        width: width-25-60,
        color: "white",
    },
    titleModal: {
        fontSize: 20, 
        fontFamily: "edgeBold", 
        width: width-25-60,
    },
    rootModal: {
        flex: 1, 
        justifyContent: "flex-end", 
        backgroundColor: "rgba(15,15,15,0.8)",
    },
    contentModal: {
        backgroundColor: "white", 
        marginLeft: 0, 
        marginRight: 0
    },
    searchView: {
        marginTop: 15,
        marginLeft: 30, 
        marginRight: 30,
        fontSize: 20,
        fontFamily: "edgeLight",
        borderColor: "#262626",
        borderWidth: 1,
        paddingTop: 5,
        paddingBottom: 5,
        paddingRight: 10,
        paddingLeft: 10,
        borderRadius: 5,
    },
    btGroup: {
        marginTop: 15,
        marginRight: 30,
        marginBottom: 30,
        flexDirection: "row", 
        justifyContent: "flex-end",
    },
    textInButton: {
        color: "white",
        fontSize: 15,
        fontFamily: "edgeLight",
    },
    btCancel: {
        justifyContent: "center",
        alignItems: "center",
        padding: 20,
        backgroundColor: "#E83151",
        borderRadius: 5,
        marginRight: 15,
        height: 30,
    },
    btDone: {
        justifyContent: "center",
        alignItems: "center",
        padding: 20,
        backgroundColor: "#3185FC",
        borderRadius: 5,
        height: 30,
    },
});