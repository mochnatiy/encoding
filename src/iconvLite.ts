import * as iconv from 'iconv-lite'
import * as fs from 'fs'
import assert from 'assert'

const testIconvLite = () => {
  const bufferUtf8 = Buffer.from('üäößéàèùçâêôîûæœâïÿ')

  // ------------------------------------ UTF-8 -> CP1252 -----------------------------------------
  console.log('UTF-8 -> CP1252')

  const stringCp1252 = iconv.encode(bufferUtf8.toString(), 'cp1252')

  // CP1252 is not exactly supported by Node fs, but CP1252 is a superset
  // of ISO8859-1 which is latin1
  fs.writeFileSync('./bundles/fileCp1252lite.txt', stringCp1252, { encoding: 'latin1' })

  const bufferCp1252 = fs.readFileSync('./bundles/fileCp1252lite.txt')

  const stringUtf8from1252 = iconv.decode(bufferCp1252, 'cp1252')

  assert.equal(stringUtf8from1252, bufferUtf8.toString())
  console.log({ stringUtf8: stringUtf8from1252 })

  // ------------------------------------ UTF-8 -> 7bit -----------------------------------------
  console.log('UTF-8 -> 7bit')

  const string7bit = iconv.encode(bufferUtf8.toString(), 'ascii')
  fs.writeFileSync('./bundles/file7bitlite.txt', string7bit, { encoding: 'ascii' })

  const buffer7bit = fs.readFileSync('./bundles/file7bitlite.txt')

  const stringUtf8from7bit = iconv.decode(buffer7bit, 'ascii')

   // No transliteration for unknown symbols
  assert.notEqual(stringUtf8from7bit, bufferUtf8.toString())
  console.log({ stringUtf8: stringUtf8from7bit.toString() })

  // ------------------------------------ UTF-8 -> CP437 -----------------------------------------
  console.log('UTF-8 -> CP437')

  // No transliteration for unknown symbols
  console.log(`œ -> ${iconv.encode('œ', 'cp437')}`)

  const stringCp437 = iconv.encode(bufferUtf8.toString(), 'cp437')

  // CP437 is not supported by Node fs
  fs.writeFileSync('./bundles/fileCp437lite.txt', stringCp437)

  const bufferCp437 = fs.readFileSync('./bundles/fileCp437lite.txt')

  const stringUtf8from437 = iconv.decode(bufferCp437, 'cp437')

  // No transliteration for unknown symbols
  assert.notEqual(stringUtf8from437, bufferUtf8.toString().replace('œ', 'oe'))
  console.log({ stringUtf8: stringUtf8from437.toString() })
}

export default testIconvLite
