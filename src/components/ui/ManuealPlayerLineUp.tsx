import React from 'react'
import FormLineUpField from './FormLineUpField'

export interface Player {
  firstName: string
  lastName: string
  jerseyNumber: string
  position: string
  dateOfBirth?: string
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
          firstNameValue={players[index]?.firstName || ''}
          lastNameValue={players[index]?.lastName || ''}
          jerseyNumberValue={players[index]?.jerseyNumber || ''}
          positionValue={players[index]?.position || ''}
          dateOfBirthValue={players[index]?.dateOfBirth || ''}
          onFirstNameChange={(value) => onPlayerChange(index, 'firstName', value)}
          onLastNameChange={(value) => onPlayerChange(index, 'lastName', value)}
          onPlayerJerseyNumberChange={(value) => onPlayerChange(index, 'jerseyNumber', value)}
          onPlayerPlayerPositionChange={(value) => onPlayerChange(index, 'position', value)}
          onDateOfBirthChange={(value) => onPlayerChange(index, 'dateOfBirth', value)}
        />
      ))}
    </div>
  )
}

export default ManuealPlayerLineUp
