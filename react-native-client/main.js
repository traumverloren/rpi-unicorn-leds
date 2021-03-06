import Exponent from "exponent";
import React, { Component } from "react";
import { Entypo, FontAwesome } from "@exponent/vector-icons";
import io from "socket.io-client/socket.io";
import { Font } from "exponent";
import DropdownAlert from "react-native-dropdownalert";

import {
  StyleSheet,
  Text,
  View,
  Linking,
  TouchableHighlight,
  TouchableOpacity
} from "react-native";

const socket = io("https://light-art.herokuapp.com", {});

socket.on("connect", () => {
  console.log("React Native is connected to the Server!");
});

class App extends Component {
  async componentDidMount() {
    await Font.loadAsync({
      "PressStart2P-Regular": require("./assets/fonts/PressStart2P-Regular.ttf"),
      "VT323-Regular": require("./assets/fonts/VT323-Regular.ttf")
    });
    this.setState({ fontLoaded: true });
  }

  constructor() {
    super();
    this.state = {
      piConnected: true,
      fontLoaded: false,
      selectedColor: { hex: "#FCCB00", rgb: { r: 252, g: 203, b: 0 } }
    };
    this.fetchPiStatus();

    socket.on("connect", () => {
      socket.emit("authentication", { key: process.env.REACT_APP_SOCKET_KEY });

      socket.on("unauthorized", err => {
        console.log("There was an error with the authentication:", err.message);
      });

      socket.on("authenticated", () => {
        console.log("React Web app authenticated!");
      });

      socket.emit("clientConnected");
    });
  }

  handleColorSelected = color => {
    this.setState({ color: color });
  };

  fetchPiStatus = () => {
    // if pi is connected, set state to true
    socket.on("piConnected", () => {
      this.setState({ piConnected: true });
    });

    // if pi is disconnected, set state to false
    socket.on("piDisconnected", () => {
      this.setState({ piConnected: false });
      this.showAlert("error");
    });
  };

  showAlert = type => {
    switch (type) {
      case "error":
        this.dropdown.alertWithType(
          type,
          "oh nooos!  (╯°□°）╯︵ ┻━┻ ",
          "The raspberry pi is currently offline. Try again later."
        );
        break;
      case "custom":
        this.dropdown.alertWithType(
          type,
          "yay!  \\ (•◡•) /",
          "Light Design Submitted to the Raspberry Pi! Thanks for creating art!"
        );
        break;
    }
  };

  closeAlert = () => {
    this.dropdown.onClose();
  };
  onClose(data) {
    console.log(data);
  }

  sendMessage = (message, data) => {
    socket.emit(message, data);
  };

  handleChangeComplete = color => {
    this.setState({ selectedColor: color });
  };

  render() {
    return (
      <View style={styles.container}>
        <Header fontLoaded={this.state.fontLoaded} />
        <ColorSelector
          selectedColor={this.state.selectedColor}
          onChangeComplete={this.handleChangeComplete}
        />
        <Board
          selectedColor={this.state.selectedColor}
          sendMessage={this.sendMessage}
          showAlert={this.showAlert}
          piConnected={this.state.piConnected}
          fontLoaded={this.state.fontLoaded}
        />
        <Footer fontLoaded={this.state.fontLoaded} />
        <DropdownAlert
          ref={ref => (this.dropdown = ref)}
          closeInterval={5000}
          onCancel={data => this.onClose(data)}
          containerStyle={{
            backgroundColor: "limegreen"
          }}
          titleStyle={{
            marginTop: 20,
            fontSize: 16,
            textAlign: "left",
            fontWeight: "bold",
            color: "white",
            backgroundColor: "transparent"
          }}
          showCancel={true}
        />
      </View>
    );
  }
}

class Board extends Component {
  constructor(props) {
    super();
    this.state = this.getBoard();
  }

  getBoard = () => {
    const squares = [];

    // i is the square number 0 - 63.
    var i = 0;

    // Loop through to generate the x,y coords.
    for (let y = 0; y < 8; y++) {
      for (let x = 0; x < 8; x++) {
        squares.push({
          id: i,
          coords: [x, y],
          isSelected: false,
          color: { r: 44, g: 62, b: 80 }
        });
        i++;
      }
    }

    // set initial state with 64-array of squares
    return { squares, isSubmitted: false };
  };

  clearBoard = () => {
    this.setState(this.getBoard());
  };

  submitBoard = () => {
    this.setState({ isSubmitted: true });
    this.props.sendMessage("stateChanged", {
      message: "Light Design Submitted",
      squares: this.state.squares
    });
    this.props.showAlert("custom");
  };

  handlePress = id => {
    const squares = this.state.squares.slice();
    squares[id].isSelected = !squares[id].isSelected;
    squares[id].color = this.props.selectedColor.rgb;
    this.setState({ squares: squares });
  };

  render() {
    return (
      <View style={styles.board}>
        <View style={styles.squares}>
          {this.state.squares.map(square => (
            <View key={square.id} style={styles.square}>
              <Square
                id={square.id}
                isSelected={square.isSelected}
                coords={square.coords}
                color={square.color}
                onPress={() => this.handlePress(square.id)}
              />
            </View>
          ))}
        </View>
        <View style={styles.buttons}>
          <Button
            name="Submit"
            isSubmitted={this.state.isSubmitted}
            piConnected={this.props.piConnected}
            fontLoaded={this.props.fontLoaded}
            onPress={() => this.submitBoard()}
          />
          <Button
            name="Reset"
            isSubmitted={this.state.isSubmitted}
            piConnected={this.props.piConnected}
            fontLoaded={this.props.fontLoaded}
            onPress={() => this.clearBoard()}
          />
        </View>
      </View>
    );
  }
}

export const Square = ({ isSelected, onPress, color }) => {
  var squareStyle;

  if (isSelected) {
    squareStyle = {
      backgroundColor: "rgb(" + color.r + "," + color.g + "," + color.b + ")",
      width: 38,
      height: 38
    };
  } else {
    squareStyle = { backgroundColor: "#2c3e50", width: 38, height: 38 };
  }

  return (
    <View>
      <TouchableHighlight onPress={onPress} style={squareStyle}>
        <View />
      </TouchableHighlight>
    </View>
  );
};

export const Button = ({
  name,
  isSubmitted,
  piConnected,
  fontLoaded,
  onPress
}) => {
  if (!piConnected) {
    var submitButtonStyling = styles.submitButtonDisabled;
    var resetButtonStyling = styles.resetButtonDisabled;
  } else if (isSubmitted) {
    var submitButtonStyling = styles.submitButtonDisabled;
    var resetButtonStyling = styles.resetButton;
  } else {
    var submitButtonStyling = styles.submitButton;
    var resetButtonStyling = styles.resetButton;
  }

  return (
    <View>
      <TouchableHighlight
        disabled={(name === "Submit" && isSubmitted) || !piConnected}
        underlayColor={name === "Submit" ? "#32CD32" : "#b22222"}
        style={name === "Submit" ? submitButtonStyling : resetButtonStyling}
        onPress={onPress}
      >
        <View>
          {fontLoaded ? (
            <Text style={{ ...Font.style("VT323-Regular"), fontSize: 18 }}>
              {name}
            </Text>
          ) : null}
        </View>
      </TouchableHighlight>
    </View>
  );
};

export const Header = ({ fontLoaded }) => {
  return (
    <View style={styles.header}>
      {fontLoaded ? (
        <View style={{ flex: 1, alignItems: "center" }}>
          <Text
            style={{
              ...Font.style("PressStart2P-Regular"),
              fontSize: 16,
              marginTop: 20
            }}
          >
            Make Pixel LED Art
          </Text>
          <Text
            style={{
              ...Font.style("VT323-Regular"),
              fontSize: 18,
              marginTop: 10,
              marginBottom: 4,
              textAlign: "center",
              color: "blue"
            }}
          >
            <FontAwesome name="magic" size={14} /> Pick colors.
          </Text>
          <Text
            style={{
              ...Font.style("VT323-Regular"),
              fontSize: 18,
              marginBottom: 4,
              textAlign: "center",
              color: "teal"
            }}
          >
            <FontAwesome name="hand-pointer-o" size={14} /> Touch squares.
          </Text>
          <Text
            style={{
              ...Font.style("VT323-Regular"),
              fontSize: 18,
              marginBottom: 4,
              textAlign: "center",
              color: "limegreen"
            }}
          >
            <FontAwesome name="envelope-o" size={14} /> Send a design to my
            Raspberry Pi!
          </Text>
        </View>
      ) : null}
    </View>
  );
};

export const Footer = ({ fontLoaded }) => {
  openURL = () => {
    const url = "https://traumverloren.github.io";
    Linking.canOpenURL(url).then(() => {
      return Linking.openURL(url);
    });
  };

  return (
    <View style={styles.footer}>
      {fontLoaded ? (
        <TouchableHighlight onPress={this.openURL}>
          <Text style={{ ...Font.style("VT323-Regular"), fontSize: 18 }}>
            Made with <Entypo name="heart-outlined" size={20} color="red" /> by
            Stephanie{" "}
          </Text>
        </TouchableHighlight>
      ) : null}
    </View>
  );
};

export const ColorSelector = ({ selectedColor, colors, onChangeComplete }) => {
  const handleChange = color => {
    onChangeComplete(color);
  };
  return (
    <View style={styles.card}>
      {colors.map(color => (
        <ColorSwatch
          color={color}
          key={color.hex}
          selectedColor={selectedColor}
          onPress={() => handleChange(color)}
        />
      ))}
    </View>
  );
};

ColorSelector.defaultProps = {
  colors: [
    { hex: "#FF0000", rgb: { r: 184, g: 0, b: 0 } },
    { hex: "#DB3E00", rgb: { r: 219, g: 62, b: 0 } },
    { hex: "#FCCB00", rgb: { r: 252, g: 203, b: 0 } },
    { hex: "#32cd32", rgb: { r: 50, g: 205, b: 50 } },
    { hex: "#7BA328", rgb: { r: 123, g: 163, b: 40 } },
    { hex: "#1273DE", rgb: { r: 18, g: 115, b: 222 } },
    { hex: "#004DCF", rgb: { r: 0, g: 77, b: 207 } },
    { hex: "#5300EB", rgb: { r: 83, g: 0, b: 235 } },
    { hex: "#EB9694", rgb: { r: 235, g: 150, b: 148 } },
    { hex: "#FAD0C3", rgb: { r: 250, g: 208, b: 195 } },
    { hex: "#FEF3BD", rgb: { r: 254, g: 243, b: 189 } },
    { hex: "#C1E1C5", rgb: { r: 193, g: 225, b: 197 } },
    { hex: "#CADAA9", rgb: { r: 202, g: 218, b: 169 } },
    { hex: "#C4DEF6", rgb: { r: 196, g: 222, b: 246 } },
    { hex: "#BED3F3", rgb: { r: 190, g: 211, b: 243 } },
    { hex: "#D4C4FB", rgb: { r: 212, g: 196, b: 251 } }
  ]
};

export const ColorSwatch = ({ selectedColor, color, onPress }) => {
  var isSelected = selectedColor.hex === color.hex;

  return (
    <TouchableOpacity
      style={[
        styles.swatch,
        {
          backgroundColor:
            "rgb(" + color.rgb.r + "," + color.rgb.g + "," + color.rgb.b + ")"
        },
        isSelected && styles.selectedSwatch
      ]}
      onPress={onPress}
      color={color}
    >
      <View />
    </TouchableOpacity>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#fff",
    alignItems: "center",
    justifyContent: "space-between",
    flexDirection: "column"
  },
  header: {
    flex: 0.2,
    marginTop: 20
  },
  footer: {
    flex: 0.1,
    marginBottom: 2
  },
  card: {
    flex: 0.1,
    flexDirection: "row",
    flexWrap: "wrap",
    width: 220,
    backgroundColor: "#fff"
  },
  swatch: {
    width: 25,
    height: 25
  },
  selectedSwatch: {
    borderStyle: "solid",
    borderWidth: 2,
    borderColor: "#fff",
    borderRadius: 3
  },
  square: {
    width: 38,
    height: 38,
    margin: -1,
    borderWidth: 1,
    borderStyle: "solid",
    borderColor: "black"
  },
  board: {
    flex: 0.6,
    alignItems: "center",
    justifyContent: "center",
    flexDirection: "column"
  },
  squares: {
    flex: 0.8,
    marginTop: 15,
    flexDirection: "row",
    flexWrap: "wrap",
    alignItems: "center",
    justifyContent: "center",
    width: 300
  },
  buttons: {
    flex: 0.2,
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center"
  },
  submitButton: {
    backgroundColor: "#00FF00",
    borderWidth: 4,
    borderStyle: "solid",
    borderColor: "limegreen",
    padding: 4,
    margin: 5
  },
  resetButton: {
    backgroundColor: "red",
    borderWidth: 4,
    borderStyle: "solid",
    borderColor: "firebrick",
    padding: 4,
    margin: 5
  },
  submitButtonDisabled: {
    backgroundColor: "#00FF00",
    borderWidth: 4,
    borderStyle: "solid",
    borderColor: "limegreen",
    padding: 4,
    margin: 5,
    opacity: 0.4
  },
  resetButtonDisabled: {
    backgroundColor: "red",
    borderWidth: 4,
    borderStyle: "solid",
    borderColor: "firebrick",
    padding: 4,
    margin: 5,
    opacity: 0.4
  }
});

Exponent.registerRootComponent(App);
