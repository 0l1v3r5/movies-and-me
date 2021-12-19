import React from "react";
import {
  FlatList,
  Text,
  StyleSheet,
  View,
  TextInput,
  Button,
  ActivityIndicator,
  SafeAreaView,
  SectionList,
  TouchableOpacity,
} from "react-native";
import FilmItem from "./FilmItem";
import { getFilmsFromApiWithSearchedText } from "../API/TMDBApi";

const DATA = [
  {
    title: "Films",
    data: [
      "Popular movie trailers",
      "Recent movie trailers",
      "Movie showtimes",
    ],
  },
  {
    title: "Streaming & TV",
    data: [
      "Popular TV trailers",
      "Recent TV trailers",
      "TV 250 TV shows",
      "Most Popular TV shows",
    ],
  },
  {
    title: "Drinks",
    data: ["Water", "Coke", "Beer"],
  },
  {
    title: "Community",
    data: ["Help center", "Polls"],
  },
];

const Item = ({ title }) => (
  <View style={styles.item}>
    <Text style={styles.title}>{title}</Text>
  </View>
);

class Search extends React.Component {
  constructor(props) {
    super(props);
    this.textToSearch = "";
    this.page = 0;
    this.totalPages = 0;
    this.state = {
      films: [],
      isLoading: false,
    };
  }

  _loadFilms() {
    if (this.textToSearch.length > 0) {
      this.setState({ isLoading: true });
      getFilmsFromApiWithSearchedText(
        this.textToSearch.length,
        this.page + 1
      ).then((data) => {
        this.page = data.page;
        this.totalPages = data.total_pages;
        this.setState({
          films: [...this.state.films, ...data.results],
          isLoading: false,
        });
      });
    }
  }

  _displayDetailForFilm = (idFilm) => {
    this.props.navigation.navigate("FilmDetail", { idFilm: idFilm });
  };

  _searchFilms() {
    this.page = 0;
    this.totalPages = 0;
    this.setState(
      {
        films: [],
      },
      () => {
        this._loadFilms();
      }
    );
  }

  _displayLoading() {
    if (this.state.isLoading) {
      return (
        <View style={styles.loading_container}>
          <ActivityIndicator size="large" color="#00ff00" />
        </View>
      );
    }
  }

  _displayCategories() {
    if (this.state.films.length == 0) {
      return (
        <SafeAreaView style={styles.categories_safe_area}>
          <SectionList
            style={styles.section_list}
            sections={DATA}
            keyExtractor={(item, index) => item + index}
            renderItem={({ item }) => (
              <TouchableOpacity
                style={styles.category}
                onPress={() => console.log("search touch")}
              >
                <Item title={item} />
              </TouchableOpacity>
            )}
            renderSectionHeader={({ section: { title } }) => (
              <Text style={styles.header}>{title}</Text>
            )}
          />
        </SafeAreaView>
      );
    }
  }

  _searchTextInputChanged(text) {
    this.textToSearch = text;
  }

  render() {
    return (
      <View style={styles.main_container}>
        <TextInput
          style={styles.textinput}
          onChangeText={(text) => this._searchTextInputChanged(text)}
          placeholder="Title of the movie"
          onSubmitEditing={() => this._searchFilms()}
        />
        <Button
          title="Search"
          style={styles.button}
          onPress={() => this._searchFilms()}
        />
        <FlatList
          style={styles.list}
          data={this.state.films}
          keyExtractor={(item) => item.id.toString()}
          renderItem={({ item }) => (
            <FilmItem
              film={item}
              displayDetailForFilm={this._displayDetailForFilm}
            />
          )}
          onEndReachedThreshold={0.5}
          onEndReached={() => {
            if (this.page < this.totalPages) {
              this._loadFilms();
            }
          }}
        />
        {this._displayLoading()}
        {this._displayCategories()}
      </View>
    );
  }
}

const styles = StyleSheet.create({
  main_container: {
    flex: 1,
    marginTop: 15,
    marginLeft: 20,
    marginRight: 20,
  },
  categories_safe_area: {},
  category: {
    width: 150,
    height: 100,
    margin: 5,
    flex: 1 / 2,
  },
  textinput: {
    height: 45,
    borderColor: "#000000",
    borderWidth: 1,
    paddingLeft: 5,
    marginBottom: 10,
  },
  list: {
    marginTop: 10,
  },
  loading_container: {
    position: "absolute",
    left: 0,
    right: 0,
    top: 100,
    bottom: 0,
    alignItems: "center",
    justifyContent: "center",
  },
  item: {
    backgroundColor: "#f9c2ff",
    padding: 20,
    height: 100,
    marginVertical: 8,
  },
  header: {
    fontSize: 32,
    backgroundColor: "#fff",
  },
  title: {
    fontSize: 18,
  },
  section_list: {},
});

export default Search;
