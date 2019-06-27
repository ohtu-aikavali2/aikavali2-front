# aikavali-front
[![Build Status](https://travis-ci.org/ohtu-aikavali2/aikavali2-front.svg?branch=master)](https://travis-ci.org/ohtu-aikavali2/aikavali2-front)
[![codecov](https://codecov.io/gh/ohtu-aikavali2/aikavali2-front/branch/master/graph/badge.svg)](https://codecov.io/gh/ohtu-aikavali2/aikavali2-front)

[Backlog](https://docs.google.com/spreadsheets/d/15_vCkjjTOUxaQN1zxxQHbL1P8U5bj6oboSiP0_snezE/edit?usp=sharing)  
[opi.mooc.fi](https://opi.mooc.fi/)

# Definition of Done

- The feature has to be planned and documented accordingly.
- The feature has to pass testing on the Travis CI server.
- The feature has been approved by the customer.

## Start  
Install dependencies:

```npm install```

Create .env file: 

```touch .env```

Add two environmental variables needed for the TMC.
```
REACT_APP_TMC_CLIENT_ID
REACT_APP_TMC_SECRET
```

Start the project:

```npm start```

## Additional scripts
Tests:

```npm test```

Linter:

```npm run lint```
