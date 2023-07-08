import React, { useEffect, useState } from "react";
import {
  hiraganaToKatagana,
  replaceNumbersWithRoman,
} from "~/utils/utils.client";
import { TextInput } from "~/components/common/textInput";

export type AutocompleteInputOption = {
  label: string;
  value: string;
};

interface AutocompleteInputProps {
  options: AutocompleteInputOption[];
  name?: string;
  required?: boolean;
  label?: string;
  onSelected?: (option: AutocompleteInputOption) => void;
}

const AutocompleteInput: React.FC<
  AutocompleteInputProps & { defaultValue?: AutocompleteInputOption }
> = ({ name, options, required, label, onSelected, defaultValue }) => {
  const [inputValue, setInputValue] = useState<string>("");
  const [filteredOptions, setFilteredOptions] = useState<
    AutocompleteInputOption[]
  >([]);
  const [isOptionsVisible, setIsOptionsVisible] = useState<boolean>(false);
  const [selectedOption, setSelectedOption] = useState<{
    label: string;
    value: string;
  } | null>(null);

  useEffect(() => {
    if (defaultValue) {
      setInputValue(defaultValue.label);
      setSelectedOption(defaultValue);
    }
  }, [defaultValue]);

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const inputValue = e.target.value;
    setInputValue(inputValue);
    const hiraganaInputValue = hiraganaToKatagana(
      inputValue.replace("・", "").toLowerCase()
    );
    const filteredOptions = options.filter(
      (option) =>
        option.label
          .replace("・", "")
          .toLowerCase()
          .includes(inputValue.replace("・", "").toLowerCase()) ||
        hiraganaToKatagana(option.label.toLowerCase()).includes(
          hiraganaInputValue
        ) ||
        replaceNumbersWithRoman(
          hiraganaToKatagana(option.label.replace("・", "").toLowerCase())
        ).includes(replaceNumbersWithRoman(hiraganaInputValue))
    );
    setFilteredOptions(filteredOptions);
    setIsOptionsVisible(true);
  };

  const handleOptionClick = (option: { label: string; value: string }) => {
    setInputValue(option.label);
    setFilteredOptions([]);
    setIsOptionsVisible(false);
    setSelectedOption(option);
    if (onSelected) {
      onSelected(option);
    }
  };

  return (
    <div className="relative">
      {selectedOption && (
        <input type="hidden" name={name} value={selectedOption.value} />
      )}
      <TextInput
      label={label}
        value={inputValue}
        onChange={handleInputChange}
        required={required}
      />
      {isOptionsVisible && filteredOptions.length > 0 && (
        <ul className="absolute bg-white z-10 h-36 overflow-y-scroll shadow-md rounded-md p-3" style={{zIndex: 100}}>
          {filteredOptions.map((option) => (
            <li className="normal-case" key={option.value}>
              <button tabIndex={0} onClick={() => handleOptionClick(option)}>
                {option.label}
              </button>
            </li>
          ))}
        </ul>
      )}
    </div>
  );
};

export default AutocompleteInput;
