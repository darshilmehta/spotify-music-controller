import React, { Component } from "react";
import {
  Grid,
  Typography,
  Card,
  IconButton,
  LinearProgress,
  Button,
} from "@material-ui/core";
import PlayArrowIcon from "@material-ui/icons/PlayArrow";
import PauseIcon from "@material-ui/icons/Pause";
import SkipNextIcon from "@material-ui/icons/SkipNext";
import { Collapse } from "@material-ui/core";
import Alert from "@material-ui/lab/Alert";

export default class MusicPlayer extends Component {
  constructor(props) {
    super(props);
    this.state = {
      errorMsg: "",
      successMsg: "",
    }
  }

  skipSong() {
    const requestOptions = {
      method: "POST",
      headers: { "Content-Type": "application/json" },
    };
    fetch("/spotify/skip", requestOptions)
      .then((response) => {
        if(!response.ok) {
          this.setState({
            errorMsg: "Spotify Premium Required for skipping the song ..."
          })
        } else {
          this.setState({
            successMsg: 'Song Skipped!'
          })
        }
      });
  }

  pauseSong() {
    const requestOptions = {
      method: "PUT",
      headers: { "Content-Type": "application/json" },
    };
    fetch("/spotify/pause", requestOptions)
      .then((response) => {
        if(response.status === 200) {
          this.setState({
            successMsg: "Song Paused!"
          })
        } else if(response.status === 403) {
            this.setState({
              errorMsg: 'Spotify Premium Required for pausing the song ...'
            })
        } else if(response.status === 404) {
            this.setState({
              errorMsg: 'Only host has the control to pause the song ...'
            })
        }
      });
  }

  playSong() {
    const requestOptions = {
      method: "PUT",
      headers: { "Content-Type": "application/json" },
    };
    fetch("/spotify/play", requestOptions)
      .then((response) => {
        if(response.status === 200) {
          this.setState({
            successMsg: "Song Resumed!"
          })
        } else if(response.status === 403) {
            this.setState({
              errorMsg: 'Spotify Premium Required for resuming the song ...'
            })
        } else if(response.status === 404) {
            this.setState({
              errorMsg: 'Only host has the control to resume the song ...'
            })
        }
      });
  }

  render() {
    const songProgress = (this.props.time / this.props.duration) * 100;

    return (
      <div className="music-player-box">
        <Grid item xs={12} align="center">
          <Collapse
            in={this.state.errorMsg != "" || this.state.successMsg != ""}
          >
            {this.state.successMsg != "" ? (
              <Alert
                severity="success"
                onClose={() => {
                  this.setState({ successMsg: "" });
                }}
                style={{marginBottom: "20px"}}
              >
                {this.state.successMsg}
              </Alert>
            ) : (
              <Alert
                severity="error"
                onClose={() => {
                  this.setState({ errorMsg: "" });
                }}
                style={{marginBottom: "20px"}}
              >
                {this.state.errorMsg}
              </Alert>
            )}
          </Collapse>
        </Grid>
        <Grid item xs={12} align="center" style={{marginBottom: "20px"}}>
          <Typography variant="h3" compact="h3" color="#ffffff">
            Room Code : {this.props.roomCode}
          </Typography>
        </Grid>
        <Card style={{marginBottom: "20px"}}>
          <Grid container alignItems="center">
            <Grid item align="center" xs={4}>
              <img src={this.props.image_url} height="100%" width="100%" style={{marginLeft: "5px", marginTop: "5px"}}/>
            </Grid>
            <Grid item align="center" xs={8}>
              <Typography component="h5" variant="h5">
                {this.props.title}
              </Typography>
              <Typography color="textSecondary" variant="subtitle1">
                {this.props.artist}
              </Typography>
              <div style={{display: "flex", flexDirection: "row", height: "40px", justifyContent: "space-around"}}>
                <IconButton
                  onClick={() => {
                    this.props.is_playing ? this.pauseSong() : this.playSong();
                  }}
                >
                  {this.props.is_playing ? <PauseIcon /> : <PlayArrowIcon />}
                </IconButton>
                <Typography style={{lineHeight: "40px"}}>Votes : {this.props.votes} / {this.props.votes_required}</Typography>
                <IconButton onClick={() => this.skipSong()}>
                  <SkipNextIcon />
                </IconButton>
              </div>
            </Grid>
          </Grid>
          <LinearProgress variant="determinate" value={songProgress} />
        </Card>
      </div>
    );
  }
}
