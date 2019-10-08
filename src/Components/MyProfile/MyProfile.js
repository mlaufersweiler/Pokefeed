import React, { Component } from "react";
import axios from "axios";
import { setUser } from "../../ducks/reducer";
import { withRouter } from "react-router-dom";
import { connect } from "react-redux";
import Pokemon from "../Pokemon/Pokemon";

class MyProfile extends Component {
  state = {
    editProfilePic: false,
    profile_pic: ``,
    myPokemon: [],
    myFavorite: [],
    myFavoriteID: 0,
    allPokemon: [],
    profilePic: [],
    addPokemon: false,
    pokemonSelected: false,
    pokemonSelectedID: 0,
    nick_name: "",
    shiny: false,
    editPokemon: false,
    editPokemonID: 0,
    pokemon_image: `https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/pokemon/0.png`,
    type_1: "",
    pokemonSearch: "",
    nameCheck: ""
  };
  getNewProfilePic = (username, profile_pic, trainer_id) => {
    this.props.setUser({ username, profile_pic, trainer_id });
    this.toggleEditProfilePic();
  };
  updateProfilePic = () => {
    // changes the user's profile pic
    const { trainer_id, username } = this.props;
    const { profile_pic } = this.state;

    axios
      .put(`/api/profile-pics`, { profile_pic, trainer_id })
      .then(this.getNewProfilePic(username, profile_pic, trainer_id))
      .catch(err => console.log(`it no workie`));
  };
  toggleEditProfilePic = () => {
    //opens and closes the interface for updating the user's profile pic
    this.setState({
      editProfilePic: !this.state.editProfilePic,
      newProfilePic: ``
    });
  };
  toggleAdd = () => {
    // this function makes the content for adding a pokemon appear or disappear
    this.setState({
      addPokemon: !this.state.addPokemon
    });
  };
  toggleShiny = () => {
    // this toggles the shininess of a pokemon and updates the image
    if (this.state.shiny === false) {
      this.setState({
        shiny: !this.state.shiny,
        pokemon_image: `https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/pokemon/shiny/${this.state.pokemonSelectedID}.png`
      });
    } else {
      this.setState({
        shiny: !this.state.shiny,
        pokemon_image: `https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/pokemon/${this.state.pokemonSelectedID}.png`
      });
    }
  };
  toggleSelect = (pokemonID, pokemonName) => {
    // makes input boxes appear when you select a pokemon and it is supposed to make a pokemon appear in the image
    if (this.state.pokemonSelected === false) {
      this.setState({
        pokemonSelected: true
      });
    }
    this.setState({
      // pokemonSelectedID: pokemonID,
      nick_name: pokemonName,
      nameCheck: pokemonName
      // pokemon_image: `https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/pokemon/${pokemonID}.png`
    });
    if (this.state.shiny === true) {
      axios
        .get(`https://pokeapi.co/api/v2/pokemon/${pokemonName}`)
        .then(pokemon =>
          this.setState({
            pokemonSelectedID: pokemon.data.id,
            pokemon_image: pokemon.data.sprites.front_shiny,
            type_1: pokemon.data.types.filter(el => el.slot === 1)[0].type.name
          })
        );
    } else {
      axios
        .get(`https://pokeapi.co/api/v2/pokemon/${pokemonName}`)
        .then(pokemon =>
          this.setState({
            pokemonSelectedID: pokemon.data.id,
            pokemon_image: pokemon.data.sprites.front_default,
            type_1: pokemon.data.types.filter(el => el.slot === 1)[0].type.name
          })
        );
    }
  };
  getPokemon = () => {
    // this function makes the user's pokemon appear on the page
    axios
      .get(`/api/pokemon?username=${this.props.match.params.username}`)
      .then(pokemon => {
        this.setState({
          myPokemon: pokemon.data.sort((a, b) => {
            return a.pokemon_id - b.pokemon_id;
          })
        });
        this.getFavorite();
      })
      .catch(err => console.log(`couldn't find pokemon`));
  };
  // getProfilePic = () => { // this used to be used to display the user's profile pic but I don't think it's necessary anymore
  //     axios.get(`/api/trainers?username=${this.props.username}`).then(pic =>
  //         this.setState({
  //             profilePic: pic.data
  //         })
  //     )
  // }
  getAllPokemon = () => {
    // this gets every pokemon name and puts them in the list that appears in the add pokemon menu
    axios
      .get(`https://pokeapi.co/api/v2/pokemon/?offset=0&limit=802`)
      .then(res => {
        this.setState({
          allPokemon: res.data.results
        });
      })
      .catch(err => console.log(err));
  };
  addPokemon = () => {
    // this adds the selected pokemon from the list to the user's pokemon then calls the function to get the user's pokemon and profile pic
    const { trainer_id } = this.props;
    const { nick_name, pokemon_image, type_1 } = this.state;
    if (nick_name.length > 15) {
      return alert(`your pokemon's name can't be that long!`);
    }
    axios
      .post(`/api/pokemon`, { trainer_id, pokemon_image, nick_name, type_1 })
      .then(res => {
        this.getPokemon();
        // this.getProfilePic()
      })
      .catch(err => {
        alert("something went wrong please try again");
      });
    this.setState({
      addPokemon: false,
      pokemonSelected: false,
      pokemonSelectedID: 0,
      nick_name: "",
      shiny: false,
      pokemonSearch: "",
      pokemon_image: `https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/pokemon/${0}.png`
    });
  };
  handleChange(e, key) {
    // this is for handling change in input boxes. Right now it's only for the pokemon nicknames
    this.setState({
      [key]: e.target.value
    });
  }
  handleChangeEdit(pokemonID) {
    // opens the interface for editing a pokemon
    this.setState({
      editPokemon: true,
      editPokemonID: pokemonID
    });
  }
  cancelEdit() {
    // closes the interface for editing a pokemon
    this.setState({
      editPokemon: false,
      editPokemonID: 0
    });
    this.getPokemon();
  }
  // checkUser = () => {
  //     if(this.props.username !== this.props.match.params.username) {
  //         this.props.history.push(`/my-profile/${this.props.username}`)
  //     }
  // }
  componentDidMount() {
    // on mount functions run to get the list of all pokemon and the array of the user's pokemon
    // this.getProfilePic()
    // this.checkUser()
    this.getAllPokemon();
    this.getPokemon();
    this.getPokemon();
  }
  shinyCheck = () => {
    // this checks if a selected pokemon is shiny or not and updates the pokemon image
    if (this.state.shiny === true) {
      this.setState({
        pokemon_image: `https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/pokemon/shiny/${this.state.pokemonSelectedID}.png`
      });
    } else {
      this.setState({
        pokemon_image: `https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/pokemon/${this.state.pokemonSelectedID}.png`
      });
    }
  };
  releasePokemon(pokemon_id) {
    axios
      .delete(
        `/api/pokemon?trainer_id=${this.props.trainer_id}&pokemon_id=${pokemon_id}`
      )
      .then(
        this.getPokemon()
        // this.getProfilePic()
      )
      .catch(err => {
        alert(`you can't delete your favorite pokemon!`);
        console.log(`couldn't delete`);
      });
  }
  getFavorite = () => {
    axios
      .get(`/api/favorite/pokemon?trainer_id=${this.props.trainer_id}`)
      .then(res => {
        this.setState({
          myFavorite: res.data,
          myFavoriteID: res.data[0].pokemon_id
        });
      })
      .catch(err => console.log(`couldn't get favorite`));
  };
  // getType = (pokedexID) => {
  //     axios.get(`https://pokeapi.co/api/v2/pokemon/${pokedexID}`).then(res => {
  //         // console.log(res.data.types.filter(el => el.slot === 1)[0].type.name)
  //         this.setState({ type1: res.data.types.filter(el => el.slot === 1)[0].type.name })
  //         // console.log(this.state.type1)
  //     })
  //         .catch(err => console.log(`couldn't update type`))
  // }
  render() {
    const pokemonMap = this.state.myPokemon
      // .filter(el => el.pokemon_id !== this.state.myFavoriteID)
      .map((
        el,
        i // this displays a user's pokemon
      ) => (
        <Pokemon
          key={i}
          editFn={() => this.handleChangeEdit(el.pokemon_id)}
          cancelEditFn={() => this.cancelEdit()}
          pokemon={el}
          releaseFn={() => this.releasePokemon(el.pokemon_id)}
          editID={this.state.editPokemonID}
          edit={this.state.editPokemon}
          getPokemonFn={() => this.getPokemon()}
        />
      ));
    const favoriteMap = this.state.myFavorite.map((
      el,
      i // this is the same as pokemonMap except it is only used for displaying the favorite pokemon
    ) => (
      <Pokemon
        key={i}
        editFn={() => this.handleChangeEdit(el.pokemon_id)}
        cancelEditFn={() => this.cancelEdit()}
        pokemon={el}
        releaseFn={() => this.releasePokemon(el.pokemon_id)}
        editID={this.state.editPokemonID}
        edit={this.state.editPokemon}
        getPokemonFn={() => this.getPokemon()}
      />
    ));
    const allPokemonMap = this.state.allPokemon
      .filter(el => el.name.includes(this.state.pokemonSearch.toLowerCase())) // checks to see if the pokemon name contains this.state.pokemonSearch
      .map((
        el,
        i // this displays the list of all pokemon and the user can select from the list and name the pokemon if they want and choose whether or not it is shiny before they add it
      ) => (
        <div className="add-pokemon" key={i}>
          {el.name === this.state.nameCheck ? (
            <h4
              className="pokemon-name name-border"
              // id={this.state.}
              onClick={() => this.toggleSelect(i + 1, el.name)}
            >
              {el.name}
            </h4>
          ) : (
            <h4
              className="pokemon-name"
              // id={this.state.}
              onClick={() => this.toggleSelect(i + 1, el.name)}
            >
              {el.name}
            </h4>
          )}
        </div>
      ));
    return (
      <div className="MyProfile">
        {/* <div className="chart-container">
                <PokemonChart/></div> */}
        <p className="trainer-tip">
          Click on Poké to view posts from other users
        </p>
        <p className="trainer-tip">
          Click on your Pokémon below to make changes
        </p>
        <h1 onClick={() => console.log(this.props)}>{this.props.username}</h1>
        <img className="profile-pic" src={this.props.profile_pic} alt="" />
        {this.state.editProfilePic ? (
          <>
            <input
              className="profile-pic-input"
              placeholder="new image url"
              type="text"
              onChange={e => this.handleChange(e, "profile_pic")}
            />
            <button className="confirm-pic" onClick={this.updateProfilePic}>
              Confirm
            </button>
            <button className="cancel-pic" onClick={this.toggleEditProfilePic}>
              Cancel
            </button>
          </>
        ) : (
          <>
            <button
              className="new-pic-button"
              onClick={this.toggleEditProfilePic}
            >
              change profile pic
            </button>
          </>
        )}

        {this.state.addPokemon ? (
          <>
            <button className="find-button" onClick={this.toggleAdd}>
              Cancel
            </button>
            <div className="selection-container">
              <input
                className="search-input"
                type="text"
                placeholder="Search"
                onChange={e => this.handleChange(e, "pokemonSearch")}
              />
              <div className="list-and-image">
                <img src={this.state.pokemon_image} alt="" />
                <div className="pokemon-list">{allPokemonMap}</div>
              </div>
              {this.state.pokemonSelected ? (
                <div className="input-container">
                  <h2>Name your pokemon here!</h2>
                  <input
                    maxLength="15"
                    className="nickname"
                    type="text"
                    value={this.state.nick_name}
                    onChange={e => this.handleChange(e, "nick_name")}
                  />
                  <div className="shiny-box-container">
                    Shiny?
                    <input
                      className="shiny-box"
                      type="checkbox"
                      onChange={this.toggleShiny}
                    />
                  </div>
                </div>
              ) : null}
              <button className="catch-button" onClick={this.addPokemon}>
                Catch pokemon!
              </button>
            </div>
          </>
        ) : (
          <>
            <button className="find-button" onClick={this.toggleAdd}>
              Find pokemon
            </button>
          </>
        )}
        {favoriteMap}
        <div className="pokemon-map">{pokemonMap}</div>
      </div>
    );
  }
}
function mapStateToProps(reduxState) {
  const { username, trainer_id, profile_pic } = reduxState;
  return { username, trainer_id, profile_pic };
}

export default connect(
  mapStateToProps,
  { setUser }
)(withRouter(MyProfile));
