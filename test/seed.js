import mongoose from 'mongoose';

const { ObjectId } = mongoose.Types;

export const ids = [
  '5cbe90460408ff48b836e134',
  '5cbe90d0d5fa061470c311aa',
  '5cc3cca98013871074660a87',
  '5cc3cdc48013871074660a89'
];

export const sessions = [
  { _id: ObjectId(ids[0]), name: 'session 1', rounds: [ObjectId(ids[2])] },
  { _id: ObjectId(ids[1]), name: 'session 2', rounds: [ObjectId(ids[3])] }
];

export const rounds = [
  {
    _id: ObjectId(ids[2]),
    type: 'classic',
    players: ['Player 1', 'Player 2', 'Player 3'],
    winner: 'Player 2',
    session: ObjectId(ids[0])
  },
  {
    _id: ObjectId(ids[3]),
    type: 'g54',
    players: ['Player 1', 'Player 2', 'Player 3'],
    winner: 'Player 1',
    session: ObjectId(ids[1])
  }
];

export const users = [
  {
    _id: ObjectId(ids[0]),
    name: 'some name here',
    deviceId: '123123123123'
  },
  {
    _id: ObjectId(ids[1]),
    name: 'some other name here',
    deviceId: '09856049856094865'
  }
];