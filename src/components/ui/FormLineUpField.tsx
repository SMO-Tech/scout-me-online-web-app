
interface Props {
    playerNumber: string;
    playerNameValue: string;
    jerseyNumberValue: string;
    positionValue: string;
    onPlayerNameChange: (value: string) => void;
    onPlayerJerseyNumberChange: (value: string) => void;
    onPlayerPlayerPositionChange: (value: string) => void;
}


const FormLineUpField: React.FC<Props> = ({
    playerNumber,
    playerNameValue,
    jerseyNumberValue,
    positionValue,
    onPlayerNameChange,
    onPlayerJerseyNumberChange,
    onPlayerPlayerPositionChange
}) => {
    return (
        <div className="flex gap-1 sm:flex-row flex-col">
            <p className='text-gray-800 w-15'>{playerNumber}</p>

            <input
                type="text"
                placeholder="Player Name"
                className="w-full text-gray-800 px-3 py-2 border border-gray-300 rounded focus:outline-none focus:border-purple-500 focus:ring-1 focus:ring-purple-300"
                autoCapitalize="words"
                value={playerNameValue}
                onChange={(e) => onPlayerNameChange(e.target.value)}
            />

            <input
                type="number"
                placeholder="Jersey Number"
                min="0"
                max="100"
                className="w-20 px-3 py-2 border border-gray-300 text-gray-800 rounded focus:outline-none focus:border-purple-500 focus:ring-1 focus:ring-purple-300"
                value={jerseyNumberValue}
                onChange={(e) => onPlayerJerseyNumberChange(e.target.value)}
            />

            <select
                className="w-full px-3 py-2 border border-gray-300 text-gray-800 rounded  focus:outline-none focus:border-purple-500 focus:ring-1 focus:ring-purple-300"
                value={positionValue}
                onChange={(e) => onPlayerPlayerPositionChange(e.target.value)}
            >
                <option value="">Select Position</option>
                <option>Goalkeeper</option>
                <option>Defender</option>
                <option>Midfielder</option>
                <option>Forward</option>
            </select>
        </div>
    )
}

export default FormLineUpField