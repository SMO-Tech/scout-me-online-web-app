import { playerPostition } from "@/lib/constant";

interface Props {
    playerNumber: string;
    firstNameValue: string;
    lastNameValue: string;
    jerseyNumberValue: string;
    positionValue: string;
    dateOfBirthValue?: string;
    onFirstNameChange: (value: string) => void;
    onLastNameChange: (value: string) => void;
    onPlayerJerseyNumberChange: (value: string) => void;
    onPlayerPlayerPositionChange: (value: string) => void;
    onDateOfBirthChange?: (value: string) => void;
}


const FormLineUpField: React.FC<Props> = ({
    playerNumber,
    firstNameValue,
    lastNameValue,
    jerseyNumberValue,
    positionValue,
    dateOfBirthValue = '',
    onFirstNameChange,
    onLastNameChange,
    onPlayerJerseyNumberChange,
    onPlayerPlayerPositionChange,
    onDateOfBirthChange
}) => {
    return (
        <div className="flex gap-1 sm:flex-row items-start md:items-center justify-center flex-col">
            <p className='text-gray-800 w-15'>{playerNumber}</p>

            <input
                type="text"
                placeholder="First Name"
                className="w-full text-gray-800 px-3 py-2 border border-gray-300 rounded focus:outline-none focus:border-purple-500 focus:ring-1 focus:ring-purple-300"
                autoCapitalize="words"
                value={firstNameValue}
                onChange={(e) => onFirstNameChange(e.target.value)}
            />

            <input
                type="text"
                placeholder="Last Name"
                className="w-full text-gray-800 px-3 py-2 border border-gray-300 rounded focus:outline-none focus:border-purple-500 focus:ring-1 focus:ring-purple-300"
                autoCapitalize="words"
                value={lastNameValue}
                onChange={(e) => onLastNameChange(e.target.value)}
            />

            <input
                type="number"
                placeholder="Jersey Number"
                min="0"
                max="100"
                className="w-40 px-3 py-2 border border-gray-300 text-gray-800 rounded focus:outline-none focus:border-purple-500 focus:ring-1 focus:ring-purple-300"
                value={jerseyNumberValue}
                onChange={(e) => onPlayerJerseyNumberChange(e.target.value)}
            />

            <select
                className="w-full px-3 py-2 border border-gray-300 text-gray-800 rounded  focus:outline-none focus:border-purple-500 focus:ring-1 focus:ring-purple-300"
                value={positionValue}
                onChange={(e) => onPlayerPlayerPositionChange(e.target.value)}

            >
                <option value="" disabled hidden>
                    Select Position
                </option>
                {
                    playerPostition.map((position, index) => {
                        return (
                            <option key={index} value={position} >{position}</option>
                        )
                    })
                }
            </select>

            {onDateOfBirthChange && (
                <div className="flex flex-col w-full">
                    <label className="block text-xs font-medium text-gray-600 mb-1">
                        Date of Birth <span className="text-gray-400 font-normal">(optional)</span>
                    </label>
                    <input
                        type="date"
                        className="w-full px-3 py-2 border border-gray-300 text-gray-800 rounded focus:outline-none focus:border-purple-500 focus:ring-1 focus:ring-purple-300"
                        value={dateOfBirthValue}
                        onChange={(e) => onDateOfBirthChange(e.target.value)}
                    />
                </div>
            )}
        </div>
    )
}

export default FormLineUpField