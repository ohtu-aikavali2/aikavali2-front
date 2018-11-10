import { configure } from 'enzyme'
import Adapter from 'enzyme-adapter-react-16'
jest.mock('./app/services/authService')
jest.mock('./app/services/questionService')
jest.mock('./app/services/courseService')

configure({ adapter: new Adapter() })
