export interface EPGProgram {

  title: string

  start: string

  stop: string
}

export interface EPGData {

  [channel: string]: EPGProgram[]
}