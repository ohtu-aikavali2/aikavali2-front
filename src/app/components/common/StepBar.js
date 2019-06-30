import React, { Component } from 'react'
import Steps from 'react-simple-steps'
import '../Admin/admin.css'
import { Save as SaveIcon, Add as AddIcon, ArrowForward, ArrowBack as ArrowBackward } from '@material-ui/icons'
import { Button } from '@material-ui/core'

export const styles = {
  steps: {
    width: '100%',
    position: 'sticky',
    bottom: 0,
    paddingBottom: 10,
    backgroundColor: 'white'
  },
  container: {
    display: 'flex',
    justifyContent: 'space-between',
    position: 'relative'
  }
}

export class StepBar extends Component {
  render() {
    const { step, stepBack, stepForward, handleSave, handleNewQuestion, history } = this.props
    return (
      <div style={styles.steps}>
        <Steps
          disabled
          current={step}
          steps={[
            'Valitse kurssi',
            'Valitse tyyppi',
            'Täytä kentät',
            'Valitse käsitteet',
            'Tallenna'
          ]}
        />
        <div className="stepperButtonContainer" style={styles.container}>
          <div>
            <Button
              disabled={step < 1 || step > 4}
              onClick={stepBack}
              variant="contained"
              className="backwardButton"
            >
              {<ArrowBackward className="backwardIcon" />}
              Takaisin
            </Button>
          </div>
          <div>
            <Button
              variant="contained"
              onClick={() => history.push('/courses')}
              color="primary"
            >
              Etusivu
            </Button>
          </div>
          <div>
            {step < 4 && (
              <Button
                style={{ float: 'right' }}
                onClick={() => stepForward()}
                variant="contained"
                className="forwardButton"
              >
                Seuraava
                {<ArrowForward className="forwardIcon" />}
              </Button>
            )}
            {step === 4 && (
              <Button
                color="primary"
                onClick={() => handleSave()}
                variant="contained"
                className="saveButton"
              >
                Tallenna
                {<SaveIcon className="saveIcon" />}
              </Button>
            )}
            {step > 4 && (
              <Button
                onClick={() => handleNewQuestion()}
                variant="contained"
                color="primary"
              >
                Uusi kysymys
                <AddIcon className="addIcon" />
              </Button>
            )}
          </div>
        </div>
      </div>
    )
  }
}
export default StepBar