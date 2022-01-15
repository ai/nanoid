let cleanArgName = (arg) => arg.startsWith('--') ? arg.slice(2) : arg.slice(1)

let parseArgs = (argv) => {
  argv.splice(0, 2)

  let parsedArgs = {}

  let currentArg = null
  argv.forEach((arg) => {
    if (arg.includes('=')) {
      if (currentArg) {
        parsedArgs[currentArg] = true
        currentArg = null
      }
      let argSplit = arg.split('=')
      parsedArgs[cleanArgName(argSplit[0])] = argSplit[1]

      return
    }

    if (arg.startsWith('-') || arg.startsWith('--')) {
      if (currentArg) {
        parsedArgs[currentArg] = true
        currentArg = null
      }

      currentArg = cleanArgName(arg)
      return
    }

    if (currentArg) {
      parsedArgs[currentArg] = arg
      currentArg = null
    }
  })

  if (currentArg) {
    parsedArgs[currentArg] = true
  }

  return parsedArgs
}

module.exports = { parseArgs }
