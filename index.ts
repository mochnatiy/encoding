import * as Iconv from 'iconv'

const iconv = new Iconv('UTF-8', 'ASCII')
const output = iconv.convert('èé')
