import React, { Component } from 'react'
import TextField from '@material-ui/core/TextField'
import Card from '@material-ui/core/Card'
import CardContent from '@material-ui/core/CardContent'
import CloseIcon from '@material-ui/icons/Close'
import ArrowDownwardIcon from '@material-ui/icons/ArrowDownward'
import ArrowUpwardIcon from '@material-ui/icons/ArrowUpward'
import { CardActions, IconButton, Typography, Divider, Button } from '@material-ui/core'

class DragAndDropQuestionForm extends Component {
  render() {
    const {
      handleChange,
      handleArrayChange,
      addAnswerOption,
      removeAnswerOption,
      swapTwoCards,
      question,
      answerOptions,
      fakeAnswerOptions
    } = this.props

    return (
      <React.Fragment>
        <TextField
          label="Kysymyksen otsikko"
          fullWidth
          value={question}
          onChange={handleChange('question')}
          className="questionField"
          placeholder="Esim. Järjestä palat siten, että rivit ovat oikeassa järjestyksessä"
          margin="normal"
        />
        <Divider variant='middle' style={{ marginTop: '20px', marginBottom: '20px' }} />
        <Typography variant="title" gutterBottom>
          Luo haluamasi oikea järjestys
        </Typography>
        {answerOptions.map((option, i) => (
          <div className='cardContainer' key={i}>
            <Card>
              <CardContent style={{ marginBottom: '-25px' }}>
                <CardActions className='cardActionArea'>
                  <IconButton aria-label="down-button" disabled={option.cardId+1 === answerOptions.length} onClick={swapTwoCards('down', i)}>
                    <ArrowDownwardIcon />
                  </IconButton>
                  <IconButton aria-label="up-button" disabled={option.cardId === 0} onClick={swapTwoCards('up', i)}>
                    <ArrowUpwardIcon />
                  </IconButton>
                  <IconButton aria-label="remove" onClick={removeAnswerOption(option, i, true)}>
                    <CloseIcon />
                  </IconButton>
                </CardActions>
                <TextField
                  label="Teksti riville"
                  fullWidth
                  value={option.value}
                  onChange={handleArrayChange(option, i, true)}
                  className="answerField"
                  helperText="Kirjoita teksti kenttään, voit lisätä tekstikenttiä painamalla '+ Lisää kenttä'"
                  margin="normal"
                />
              </CardContent>
            </Card>
          </div>
        ))}

        <Button onClick={addAnswerOption(true)} fullWidth variant="contained" color="primary" aria-label="Add">
          + Lisää kenttä
        </Button>
        <Divider variant='middle' style={{ marginTop: '20px', marginBottom: '20px' }} />
        <Typography variant='title' gutterBottom>
          Voit luoda myös vastaukseen kuulumattomia rivejä
        </Typography>

        {fakeAnswerOptions.map((option, i) => (
          <div className='cardContainer' key={i}>
            <Card>
              <CardContent style={{ marginBottom: '-25px' }}>
                <CardActions className='cardActionArea'>
                  <IconButton aria-label="remove" onClick={removeAnswerOption(option, i, false)}>
                    <CloseIcon />
                  </IconButton>
                </CardActions>
                <TextField
                  label="Teksti vastaukseen kuulumattomalle riville"
                  fullWidth
                  value={option.value}
                  onChange={handleArrayChange(option, i, false)}
                  className="answerField"
                  helperText="Kirjoita teksti riville, joka ei kuulu vastaukseen. Voit lisätä rivejä painamalla '+ Lisää vastaukseen kuulumaton rivi'"
                  margin="normal"
                />
              </CardContent>
            </Card>
          </div>
        ))}
        <Button onClick={addAnswerOption(false)} fullWidth variant="contained" color="primary" aria-label="Add">
          + Lisää vastaukseen kuulumaton rivi
        </Button>
      </React.Fragment>
    )
  }
}

export default DragAndDropQuestionForm