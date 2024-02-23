import { Iconv } from 'iconv'
import * as fs from 'fs'
import assert from 'assert'

const testNodeIconv = () => {
  const bufferUtf8 = Buffer.from('üäößéàèùçâêôîûæœâïÿ')

  // ------------------------------------ UTF-8 -> CP1252 -----------------------------------------
  console.log('UTF-8 -> CP1252')

  const iconv1252 = new Iconv('UTF-8', 'CP1252')

  const stringCp1252 = iconv1252.convert(bufferUtf8)

  // CP1252 is not exactly supported by Node fs, but CP1252 is a superset
  // of ISO8859-1 which is latin1
  fs.writeFileSync('./bundles/fileCp1252.txt', stringCp1252, { encoding: 'latin1' })

  const bufferCp1252 = fs.readFileSync('./bundles/fileCp1252.txt')

  const iconv1252ToUtf8 = new Iconv('CP1252', 'UTF-8')
  const bufferUtf8from1252 = iconv1252ToUtf8.convert(bufferCp1252)

  assert.equal(bufferUtf8from1252.toString(), bufferUtf8.toString())
  console.log({ bufferUtf8: bufferUtf8from1252.toString() })

  // ------------------------------------ UTF-8 -> 7bit -----------------------------------------
  console.log('UTF-8 -> 7bit')

  // const iconv7bit = new Iconv('UTF-8', 'ASCII')
  // throws EILSEQ - Illegal character sequence
  // that's why we need to TRANSLIT or IGNORE unknown characters
  const iconv7bit = new Iconv('UTF-8', 'ASCII//TRANSLIT')

  const string7bit = iconv7bit.convert(bufferUtf8)
  fs.writeFileSync('./bundles/file7bit.txt', string7bit, { encoding: 'ascii' })

  const buffer7bit = fs.readFileSync('./bundles/file7bit.txt')

  const iconv7bitToUtf8 = new Iconv('ASCII', 'UTF-8')
  const bufferUtf8from7bit = iconv7bitToUtf8.convert(buffer7bit)

  assert.notEqual(bufferUtf8from7bit.toString(), bufferUtf8.toString())
  console.log({ bufferUtf8: bufferUtf8from7bit.toString() })

  // ------------------------------------ UTF-8 -> CP437 -----------------------------------------
  console.log('UTF-8 -> CP437')

  // const iconv437 = new Iconv('UTF-8', 'CP437')
  // throws EILSEQ - Illegal character sequence since œ is missing in CP437
  // that's why we need to TRANSLIT or IGNORE unknown characters

  const iconv437 = new Iconv('UTF-8', 'CP437//TRANSLIT')

  console.log(`œ -> ${iconv437.convert('œ')}`)

  const stringCp437 = iconv437.convert(bufferUtf8)

  // CP437 is not supported by Node fs
  fs.writeFileSync('./bundles/fileCp437.txt', stringCp437)

  const bufferCp437 = fs.readFileSync('./bundles/fileCp437.txt')

  const iconv437ToUtf8 = new Iconv('CP437', 'UTF-8')
  const bufferUtf8from437 = iconv437ToUtf8.convert(bufferCp437)

  assert.equal(bufferUtf8from437.toString(), bufferUtf8.toString().replace('œ', 'oe'))
  console.log({ bufferUtf8: bufferUtf8from437.toString() })
}

export default testNodeIconv
