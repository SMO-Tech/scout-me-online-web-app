import React from 'react'
import FormLineUpField from './FormLineUpField'

export interface Player {
  name: string
  jerseyNumber: string
  position: string
}

interface Props {
  players: Player[]
  onPlayerChange: (index: number, field: keyof Player, value: string) => void
}

const ManuealPlayerLineUp: React.FC<Props> = ({ players, onPlayerChange }) => {
  const numbers = Array.from({ length: 11 }, (_, i) => (i + 1).toString())

  return (
    <div className='flex gap-3 flex-col' >
      {numbers.map((number, index) => (
        <FormLineUpField
          key={number}
          playerNumber={number}
          playerNameValue={players[index]?.name || ''}
          jerseyNumberValue={players[index]?.jerseyNumber || ''}
          positionValue={players[index]?.position || ''}
          onPlayerNameChange={(value) => onPlayerChange(index, 'name', value)}
          onPlayerJerseyNumberChange={(value) => onPlayerChange(index, 'jerseyNumber', value)}
          onPlayerPlayerPositionChange={(value) => onPlayerChange(index, 'position', value)}
        />
      ))}
    </div>
  )
}

export default ManuealPlayerLineUp
