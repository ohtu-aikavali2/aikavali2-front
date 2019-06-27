{/* <React.Fragment>
                <div>
                  <TextField
                    label="Kysymyksesi"
                    multiline
                    fullWidth
                    rowsMax="3"
                    value={this.state.question}
                    onChange={this.handleChange('question')}
                    className="questionField"
                    helperText="Kirjoita tähän kysymyksesi ja TYHJÄ niiden sanojen kohdalle, jotka käyttäjän tulee vastauksessaan täyttää"
                    placeholder="Esimerkiksi: Hauki on TYHJÄ"
                    margin="normal"
                  />
                </div>
                <div>
                  {this.state.answerOptions.map((option, i) => (
                    <div key={i}>
                      <Grid container spacing={40} direction="row" alignItems="center">
                        <Grid item>
                          <TextField
                            label="Vastausvaihtoehto"
                            value={option.newValue}
                            onChange={this.handleArrayChange(option, i, null)}
                            className="answerField"
                            helperText='Kirjoita oikea vastausvaihtoehto sanalle ja tallenna sana painamalla +'
                            margin="normal"
                          />
                        </Grid>
                        <Grid item>
                          <Button onClick={this.addWord(i)} variant="fab" mini color="primary" aria-label="Add" className='addButton'>
                            <AddIcon className='addIcon' />
                          </Button>
                        </Grid>
                      </Grid>
                      {this.state.answerOptions[i].correctValues.length === 0 ? '' : (
                        <Typography variant="body1" gutterBottom>
                          {i + 1}:n tyhjän kentän oikeat vastaukset:
                        </Typography>
                      )}
                      <div style={{ display: 'flex', flexWrap: 'wrap' }}>
                        {option.correctValues.map((item, j) => (
                          <Chip key={j} label={item} onDelete={this.handleWordDelete(item, i)} style={{ marginRight: '5px', marginBottom: '10px' }} />
                        ))}
                      </div>

                    </div>
                  ))}
                </div>
                <div className="addButtonContain">
                  <Button onClick={this.updateAllAnswerOptions} fullWidth variant="contained" color="primary" aria-label="Add">
                    {this.state.answerOptions.length === 0 ? 'Luo vastausvaihtoehdoille kentät' : 'Päivitä vastausvaihtoehtojen kentät'}
                  </Button>
                </div>
              </React.Fragment> */}