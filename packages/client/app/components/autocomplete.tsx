import React, { memo, useState } from "react";
import {
  hiraganaToKatagana,
  replaceNumbersWithRoman,
} from "~/utils/utils.client";

type Option = {
  label: string;
  value: string;
};

interface AutocompleteInputProps {
  options: Option[];
  name?: string;
  required?: boolean;
  label?: string;
  onSelected?: (option: Option) => void;
}

const AutocompleteInput: React.FC<AutocompleteInputProps> = ({
  name,
  options,
  required,
  label,
  onSelected,
}) => {
  const [inputValue, setInputValue] = useState<string>("");
  const [filteredOptions, setFilteredOptions] = useState<Option[]>([]);
  const [isOptionsVisible, setIsOptionsVisible] = useState<boolean>(false);
  const [selectedOption, setSelectedOption] = useState<{
    label: string;
    value: string;
  } | null>(null);

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const inputValue = e.target.value;
    setInputValue(inputValue);
    const filteredOptions = options.filter(
      (option) =>
        option.label.toLowerCase().includes(inputValue.toLowerCase()) ||
        hiraganaToKatagana(option.label.toLowerCase()).includes(
          hiraganaToKatagana(inputValue.toLowerCase())
        ) ||
        replaceNumbersWithRoman(
          hiraganaToKatagana(option.label.toLowerCase())
        ).includes(
          replaceNumbersWithRoman(hiraganaToKatagana(inputValue.toLowerCase()))
        )
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

  const Label = () =>
    label ? (
      <label className="label">
        <span className="label-text">{label}</span>
      </label>
    ) : (
      <></>
    );

  return (
    <div className="relative">
      <Label />
      {selectedOption && (
        <input type="hidden" name={name} value={selectedOption.value} />
      )}
      <input
        className="input input-bordered w-full max-w-xs"
        required={required}
        type="text"
        value={inputValue}
        onChange={handleInputChange}
      />
      {isOptionsVisible && filteredOptions.length > 0 && (
        <ul className="absolute bg-white z-10 h-36 overflow-y-scroll shadow-md rounded-md p-3">
          {filteredOptions.map((option) => (
            <li
              className="normal-case"
              key={option.value}
              onClick={() => handleOptionClick(option)}
            >
              {option.label}
            </li>
          ))}
        </ul>
      )}
    </div>
  );
};

export default AutocompleteInput;