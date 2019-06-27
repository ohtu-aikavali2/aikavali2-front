import React, { Component } from 'react'
// import { connect } from 'react-redux'
import TextField from '@material-ui/core/TextField'
import Button from '@material-ui/core/Button'
import Checkbox from '@material-ui/core/Checkbox'
import FormGroup from '@material-ui/core/FormGroup'
import FormControlLabel from '@material-ui/core/FormControlLabel'
import Card from '@material-ui/core/Card'
import CardContent from '@material-ui/core/CardContent'
import CloseIcon from '@material-ui/icons/Close'
import './admin.css'
import SimpleDialog from '../common/Dialog'
import { CardActions, IconButton, FormControl, FormLabel, RadioGroup, Radio } from '@material-ui/core'

class GeneralQuestionForm extends Component {
  render() {
    const { handleClickOpen, selectedValue, modalOpen, handleClose, questions, question, handleChange, selectedValueForRadioButton, answerOptions, removeAnswerOption, handleArrayChange, handleCheckForCorrectAnswers, addAnswerOption } = this.props
    return (
      <React.Fragment>
        <Button
          variant="contained"
          color="primary"
          onClick={handleClickOpen}
        >
          Valitse kysymys listasta
        </Button>
        <div>
          <SimpleDialog
            selectedValue={selectedValue}
            open={modalOpen}
            onClose={handleClose}
            questions={questions}
          />
        </div>
        <div>
          <TextField
            label="Kysymyksesi"
            multiline
            fullWidth
            rowsMax="6"
            value={question}
            onChange={handleChange('question')}
            className="questionField"
            helperText="Kirjoita tähän kysymyksesi"
            margin="normal"
          />
        </div>
        <div className="radioButtonForm">
          <FormControl component="fieldset" className="RadioButtonFormControl">
            <FormLabel component="legend">Montako vastausta käyttäjä voi valita?</FormLabel>
            <RadioGroup
              aria-label="howManyAnswers"
              name="howManyAnswers"
              className="Radiogroup"
              value={selectedValueForRadioButton}
              onChange={handleChange('selectedValueForRadioButton')}
            >
              <FormControlLabel value="selectOne" control={<Radio color="primary" />} label="Voi valita yhden vastauksen" />
              <FormControlLabel value="selectMany" control={<Radio color="primary" />} label="Voi valita monta vastausta" />
            </RadioGroup>
          </FormControl>
        </div>

        {
          answerOptions.map((option, i) => (
            <div key={i} className='cardContainer'>
              <Card>
                <CardContent style={{ marginBottom: '-25px' }}>
                  <CardActions className='cardActionArea'>
                    <IconButton aria-label="remove" onClick={removeAnswerOption(option, i, null)}>
                      <CloseIcon />
                    </IconButton>
                  </CardActions>
                  <TextField
                    key={i}
                    label="Vastaus"
                    fullWidth
                    multiline={true}
                    inputProps={{
                      maxLength: 45
                      // if card content rendering multiple rows gets fixed, change length to higher:
                      // maxLength: 255
                    }}
                    value={option.value}
                    onChange={handleArrayChange(option, i, null)}
                    className="answerField"
                    helperText="Kirjoita vastausvaihtoehto kysymyksellesi, lisää vaihtoehtoja painamalla '+ Lisää vastausvaihtoehto'"
                    margin="normal"
                  />
                  <FormGroup>
                    <FormControlLabel
                      control={
                        <Checkbox
                          label="Oikea vastaus"
                          onChange={handleCheckForCorrectAnswers(option, i)}
                          checked={option.checked}
                          color='primary'
                        />
                      }
                      label="Oikea vastaus"
                    />
                  </FormGroup>
                </CardContent>
              </Card>
            </div>
          ))
        }
        <div className="addButtonContainer">
          <Button onClick={addAnswerOption(null)} fullWidth variant="contained" color="primary" aria-label="Add">
            + Lisää vastausvaihtoehto
          </Button>
        </div>
      </React.Fragment >
    )
  }
}

export default GeneralQuestionForm