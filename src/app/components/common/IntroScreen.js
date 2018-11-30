import React, { Component} from 'react'
import { connect } from 'react-redux'
import { setHasSeenIntro } from '../../reducers/actions/authActions'
import Intro from 'react-simple-intro'

class IntroScreen extends Component {
  constructor(props) {
    super(props)

    this.slides = [
      {
        title: 'Hei.',
        image: require('../../../assets/intro1.jpg'),
        content: 'Tervetuloa käyttämään aikavälikertaukseen perustuvaa sovellusta!',
        color: '#06c39d'
      },
      {
        title: 'Mitä?',
        image: require('../../../assets/intro2.jpg'),
        content: 'Aikavälikertaus on oppimismenetelmä, jossa materiaali kerrataan optimaalisen aikavälin kuluttua.',
        color: '#39a8e0'
      },
      {
        title: 'Miten?',
        image: require('../../../assets/intro3.jpg'),
        content: 'Vastaamalla opettajien ja muiden opiskelijoiden laatimiin kysymyksiin, sovellus laskee optimiajan, jolloin kysymys kannattaa kysyä uudelleen.',
        color: '#eea330'
      },
      {
        title: 'Miksi?',
        image: require('../../../assets/intro4.jpg'),
        content: 'Sovellus auttaa esimerkiksi valmistautumaan tentteihin. Käyttämällä sovellusta säännöllisesti voi maksimoida sen tuoman hyödyn.',
        color: '#67bed2'
      }
    ]
  }

  render() {
    const { loggedUser } = this.props
    console.log('logged', loggedUser)
    return loggedUser ?
      (
        <Intro
          slides={this.slides}
          active={!loggedUser.hasSeenIntro}
          onFinish={() => this.props.setHasSeenIntro(true)}
        />
      ) :
      null
  }
}

const mapStateToProps = (state) => ({
  loggedUser: state.loggedUser.loggedUser
})

const mapDispatchToProps = {
  setHasSeenIntro
}

export default connect(
  mapStateToProps,
  mapDispatchToProps
)(IntroScreen)