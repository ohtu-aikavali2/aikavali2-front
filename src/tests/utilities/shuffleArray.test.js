import { shuffle } from '../../app/utilities/shuffleArray'

it('shuffleArray shuffles array (if this test fails, make a lottery. Chanches are 100^100 of this failing)', () => {
  // create a big array
  let array = []
  let length = 100
  for (let i = 0; i < length; i++) {
    array.push(i)
  }
  shuffle(array)
  let difference = false
  for (let i = 0; i < length; i++) {
    if (array[i] !== i) {
      difference = true
      break
    }
  }
  expect(difference).toBe(true)
  expect(array.length).toBe(length)
})
