import React, { Component } from 'react'
import { TextField, Grid, Button, Typography, Chip } from '@material-ui/core'
import AddIcon from '@material-ui/icons/Add'

class FillQuestionForm extends Component {
  render() {
    const {
      handleChange,
      handleArrayChange,
      addWord,
      handleWordDelete,
      updateAllAnswerOptions,
      question,
      answerOptions
    } = this.props
    return (
      <React.Fragment>
        <div>
          <TextField
            label="Kysymyksesi"
            multiline
            fullWidth
            rowsMax="3"
            value={question}
            onChange={handleChange('question')}
            className="questionField"
            helperText="Kirjoita tähän kysymyksesi ja TYHJÄ niiden sanojen kohdalle, jotka käyttäjän tulee vastauksessaan täyttää"
            placeholder="Esimerkiksi: Hauki on TYHJÄ"
            margin="normal"
          />
        </div>
        <div>
          {answerOptions.map((option, i) => (
            <div key={i}>
              <Grid container spacing={40} direction="row" alignItems="center">
                <Grid item>
                  <TextField
                    label="Vastausvaihtoehto"
                    value={option.newValue}
                    onChange={handleArrayChange(option, i, null)}
                    className="answerField"
                    helperText='Kirjoita oikea vastausvaihtoehto sanalle ja tallenna sana painamalla +'
                    margin="normal"
                  />
                </Grid>
                <Grid item>
                  <Button onClick={addWord(i)} variant="fab" mini color="primary" aria-label="Add" className='addButton'>
                    <AddIcon className='addIcon' />
                  </Button>
                </Grid>
              </Grid>
              {answerOptions[i].correctValues.length === 0 ? '' : (
                <Typography variant="body1" gutterBottom>
                  {i + 1}:n tyhjän kentän oikeat vastaukset:
                </Typography>
              )}
              <div style={{ display: 'flex', flexWrap: 'wrap' }}>
                {option.correctValues.map((item, j) => (
                  <Chip key={j} label={item} onDelete={handleWordDelete(item, i)} style={{ marginRight: '5px', marginBottom: '10px' }} />
                ))}
              </div>
            </div>
          ))}
        </div>
        <div className="addButtonContain">
          <Button onClick={updateAllAnswerOptions} fullWidth variant="contained" color="primary" aria-label="Add">
            {answerOptions.length === 0 ? 'Luo vastausvaihtoehdoille kentät' : 'Päivitä vastausvaihtoehtojen kentät'}
          </Button>
        </div>
      </React.Fragment>
    )
  }
}

export default FillQuestionForm