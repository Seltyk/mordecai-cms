import React, { Component } from "react";
import Alert from 'react-s-alert';

import css from "./App.css";
import EventList from "./EventList.js";
import EventDetail from "./EventDetail.js";

const emptyEvent = {
  description: "",
  end: "",
  location: "",
  media: "",
  media_credit: "",
  metadata: "",
  place: "",
  pos: 0,
  source: "",
  source_url: "",
  start: "",
  title: "New Event",
  video: "",
}

class App extends Component {
  constructor() {
    super();
    this.state = {
      timemaps: [],
      selectedMap: null
    };
  }

  componentDidMount() {
    try {
      const cookie = document.cookie.split(';').find(a => a.trim().startsWith('csrftoken='))
      this.csrfToken = cookie.split('csrftoken=')[1];
    } catch (e) {
      console.error('CSRF Token not found in cookies, please log out')
    }

    fetch("/api/v1/timemap/1/")
           .then(response => {
              response.json().then(json => {
                this.setState({ timemaps: [json] });
              })
           });
  }

  saveItem(event, pos) {
    let newMap = this.state.timemaps[0]
    Alert.closeAll();

    newMap.data[pos] = event
    fetch("/api/v1/timemap/1/",
          {
            method: 'PUT',
            body: JSON.stringify(newMap),
            credentials: 'include',
            headers: {
              'X-CSRFToken': this.csrfToken,
              'Content-Type': 'application/json',
            },
          })
      .then(response => {
        if (!response.ok) {
          throw(response);
        }
        this.setState({timemaps: [newMap]});
        Alert.success('Information saved', {
          position: 'top-right',
          effect: 'scale',
          beep: false,
          timeout: 2000,
          onClose: Alert.closeAll(),
        });
      })
      .catch(() => {
        Alert.error('Error saving information', {
          position: 'top-right',
          effect: 'scale',
          beep: false,
          timeout: 2000,
          onClose: Alert.closeAll(),
        });
      });
  }
  addEvent() {
    let newMap = this.state.timemaps
    newMap[0].data.push(emptyEvent)
    this.setState({timemaps: newMap}, () => this.selectItem(newMap[0].data.length - 1))
  }
  selectItem(id) {
    const event = this.state.timemaps[0]
    this.setState({ selectedMap: {...event.data[id], pos: id} })
  }

  render() {
    const event = this.state.timemaps[0];
    if (!event) {
      return null;
    }
    Alert.closeAll();
    return (
      <div id="footer-wrapper" className="footerWrapper" ref="asdf">
        <header className="style1">
          <h2>TimeMapper CMS</h2>
        </header>
        <div className="row">
          <div className="3u">
            <EventList {...event}
              selectItem={this.selectItem.bind(this)}
              addEvent={this.addEvent.bind(this)}
            />
          </div>
          <div className="9u">
            <EventDetail onSubmit={this.saveItem.bind(this)}
              selectedMap={this.state.selectedMap}/>
          </div>
        </div>
      </div>
    );
  }
}

export default App;
