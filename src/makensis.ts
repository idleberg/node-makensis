export { eventEmitter as events } from './events'

export {
  commandHelp,
  compile,
  headerInfo,
  license,
  nsisDir,
  version,

  // Aliases
  cmdHelp,
  hdrInfo
} from './async';

export {
  commandHelpSync,
  compileSync,
  headerInfoSync,
  licenseSync,
  nsisDirSync,
  versionSync,

  // Aliases
  cmdHelpSync,
  hdrInfoSync
} from './sync';
