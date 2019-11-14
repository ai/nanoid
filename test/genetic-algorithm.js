let spawnSync = require('child_process').spawnSync
let chalk = require('chalk')
let path = require('path')
let fs = require('fs')
let geneticAlgorithmConstructor = require('geneticalgorithm')
let gzipSize = require('gzip-size')

if (!process.argv[2]) {
  process.stderr.write(chalk.red('Pass a file with alphabet as argument\n'))
  process.exit(1)
}

let input = path.join(process.cwd(), process.argv[2])
let output = path.join(__dirname, '..', 'compiled.js')

spawnSync('npx', ['webpack', '--mode', 'production', '--output', output, input])
let js = fs.readFileSync(output).toString()
fs.unlinkSync(output)

let match = js.match(/[A-Za-z0-9-_]{30,}/)
if (!match) {
  process.stderr.write(chalk.red('Alphabet was not found\n'))
  process.exit(1)
}
let alphabet = match[0]

function mutationFunction (phenotype) {
  let i = Math.floor(Math.random() * phenotype.alphabet)
  let j = Math.floor(Math.random() * phenotype.alphabet)

  return {
    alphabet: swapChars(phenotype.alphabet, i, j)
  }
}

function swapChars (str, index1, index2) {
  let l = index1 < index2 ? index1 : index2
  let h = index1 > index2 ? index1 : index2
  return str.substring(0, l) +
      str[h] +
      str.substring(l + 1, h) +
      str[l] +
      str.substring(h + 1, str.length)
}

function crossoverFunction (phenotypeA, phenotypeB) {
  let alphabetA = phenotypeA.alphabet
  let alphabetB = phenotypeB.alphabet
  let indexA =
      Math.floor(Math.random() * alphabetA.length / 2 + alphabetA.length / 2)
  let indexB =
      Math.floor(Math.random() + alphabetA.length / 2)
  let newStrA = alphabetA.substring(indexA, alphabetA.length)
  let newStrB = alphabetB.substring(0, indexB)

  return [
    { alphabet: addMissingCharacter(newStrA, alphabetB) },
    { alphabet: addMissingCharacter(newStrB, alphabetA) }
  ]
}

function addMissingCharacter (str, proto) {
  let newStr = str
  for (let i = 0; i < proto.length; i++) {
    if (str.indexOf(proto[i]) === -1) {
      newStr += proto[i]
    }
  }
  return newStr
}

function fitnessFunction (phenotype) {
  let file = js.replace(/[A-Za-z0-9-_]{30,}/, phenotype.alphabet)
  let size = gzipSize.sync(file)

  return -1 * size
}

function sameAlphabet (a, b) {
  a = a.split('').sort().join('')
  b = b.split('').sort().join('')
  for (let i = 0; i < a.length; i++) {
    if (a[i] !== b[i]) {
      return false
    }
  }
  return true
}

const firstPhenotype = { alphabet }

const geneticAlgorithm = geneticAlgorithmConstructor({
  mutationFunction,
  crossoverFunction,
  fitnessFunction,
  population: [firstPhenotype],
  populationSize: 100
})

console.log('Starting with:', firstPhenotype.alphabet)
for (let i = 0; i < 100; i++) {
  geneticAlgorithm.evolve()
}
const best = geneticAlgorithm.best()
console.log('Finished with:', best.alphabet)
const isSame = sameAlphabet(firstPhenotype.alphabet, best.alphabet)
console.log('Same set of characters:',
  isSame ? chalk.green('true') : chalk.red('false'))
console.log(chalk.green('Size new string:',
  gzipSize.sync(js.replace(/[A-Za-z0-9-_]{30,}/, best.alphabet))))
console.log(chalk.yellow('Size old string:',
  gzipSize.sync(js.replace(/[A-Za-z0-9-_]{30,}/, firstPhenotype.alphabet))))
