/**
 * Sample React Native App
 * https://github.com/facebook/react-native
 */
'use strict';

var React = require('react-native');
var {
  AppRegistry,
  StyleSheet,
  Text,
  View,
  Image,
  NavigatorIOS,
  ActivityIndicatorIOS,
  ListView,
  TouchableHighlight,
  WebView,
  PixelRatio,
} = React;

var ReactNativeSample = React.createClass({
  render: function() {
    // FIXME: tintColor does not work
    return (
      <NavigatorIOS
         style={styles.navigator}
         initialRoute={{component: FeedView, title: 'Popular Shots'}}
         tintColor="#4A90C7"
      />
    );
  }
});

var FeedView = React.createClass({
  getInitialState: function() {
    return {
      items: null,
      loaded: false
    };
  },

  componentDidMount: function() {
    this.fetchData();
  },

  fetchData: function() {
    fetch('http://api.dribbble.com/shots/popular')
    .then((response) => response.json())
    .then((responseData) => {
      this.setState({
        items: responseData.shots,
        loaded: true
      });
    })
    .done();
  },

  openItem: function(rowData) {
    this.props.navigator.push({
      title: rowData.title,
      component: WebView,
      passProps: {url: rowData.url}
    });
  },

  renderLoadingView: function() {
    return (
      <View style={styles.container}>
        <ActivityIndicatorIOS animating={true} size='large' />
      </View>
    );
  },

  render: function() {
    if (!this.state.loaded) {
      return this.renderLoadingView();
    }

    return (
      <NewsList
        items={this.state.items}
        onPressItem={this.openItem}
      />
    );
  }
});

var NewsList = React.createClass({
  propTypes: {
    items: React.PropTypes.array.isRequired,
    onPressItem: React.PropTypes.func.isRequired
  },

  componentWillMount: function() {
    this.dataSource = new ListView.DataSource({
      rowHasChanged: (row1, row2) => row1 !== row2
    });
  },

  render: function() {
    var dataSource = this.dataSource.cloneWithRows(this.props.items);
    return (
      <ListView
        dataSource={dataSource}
        renderRow={(rowData) =>
          <NewsListItem
             item={rowData}
             onPress={() => this.props.onPressItem(rowData)}
          />
        }
        style={styles.listView}
      />
    );
  }
});

var NewsListItem = React.createClass({
  propTypes: {
    item: React.PropTypes.object.isRequired,
    onPress: React.PropTypes.func.isRequired
  },

  _onPress: function() {
    this.props.onPress();
  },

  render: function() {
    var item = this.props.item;
    if(!item.image_400_url){
      return null;
    }
    return (
      <View>
        <TouchableHighlight onPress={this._onPress}>
          <View style={styles.container}>
            <View style={styles.topContainer}>
              <Image
                source={{uri: item.player.avatar_url}}
                style={styles.profileImage}
              />
              <View style={styles.container}>
                <Text style={styles.userName}>{item.player.name}</Text>
                <Text style={styles.date}>{new Date(item.created_at).toDateString()}</Text>
              </View>
            </View>

            <View style={styles.middleContainer}>
              <Text style={styles.title}>{item.title}</Text>
              <Image
                source={{uri: item.image_400_url}}
                style={styles.image}
              />
            </View>

            <View style={styles.bottomContainer}>
              <Text style={styles.description}>{(item.description||"").replace(/(<([^>]+)>)/ig,"").substring(0, 100)}</Text>
            </View>
          </View>
        </TouchableHighlight>
        <View style={styles.cellBorder}/>
      </View>
    );
  }
});

var styles = StyleSheet.create({
  navigator: {
    flex: 1,
  },

  container: {
    flex: 1,
    flexDirection: 'column',
    justifyContent: 'center',
    alignItems: 'flex-start',
    backgroundColor: '#ffffff'
  },

  topContainer: {
    flex: 1,
    flexDirection: 'row',
    justifyContent: 'flex-start',
    alignItems: 'flex-start',
    marginTop: 12,
    marginLeft: 16,
  },

  middleContainer: {
    marginTop: 16,
  },

  bottomContainer: {
    marginLeft: 10,
  },

  image: {
    marginLeft: 16,
    width: 340,
    height: 340,
  },

  title: {
    fontSize: 26,
    fontWeight: 'bold',
    marginBottom: 16,
    marginLeft: 16,
    textAlign: 'left',
    color: '#44444',
  },

  description: {
    fontSize: 16,
    marginTop: 12,
    marginBottom: 32,
    marginLeft: 12,
    color: '#9ba5a8',
    textAlign: 'left',
  },

  userName: {
    fontSize: 18,
    marginLeft: 10,
    marginTop: 2,
    color: '#ea4c89',
  },

  date: {
    fontSize: 14,
    marginLeft: 10,
    color: "gray",
  },

  profileImage: {
    width: 42,
    height: 42,
  },

  listView: {
  },

  cellBorder: {
    backgroundColor: 'rgba(0, 0, 0, 0.4)',
    height: 1 / PixelRatio.get(),
    marginLeft: 12,
    marginRight: 12,
  },
});

AppRegistry.registerComponent('ReactNativeSample', () => ReactNativeSample);
