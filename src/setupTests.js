import { configure } from 'enzyme'
import Adapter from 'enzyme-adapter-react-16'
jest.mock('./app/services/authService')
jest.mock('./app/services/questionService')

configure({ adapter: new Adapter() })
