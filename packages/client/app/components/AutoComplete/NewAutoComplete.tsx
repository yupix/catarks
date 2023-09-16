import { Check, ChevronsUpDown } from "lucide-react"
 
import { cn } from "@/lib/utils"
import { Button } from "@/components/ui/button"
import {
  Command,
  CommandEmpty,
  CommandGroup,
  CommandInput,
  CommandItem,
} from "@/components/ui/command"
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover"
import { hiraganaToKatagana, katakanaToHiragana, replaceNumbersWithRoman } from "~/utils/utils.client"
import React, { useEffect } from "react"
import { ScrollArea, ScrollBar } from "../ui/scroll-area"

type AutoCompleteItem = {
    label: string
    value: string
}

type AutoCompleteProps = {
    options: AutoCompleteItem[]
    placeholder: string
    searchWordPlaceholder?: string
    notfoundText?: string
    label?: string
    onSelected?: (value: string) => void
}

export function calculateMatchScore(inputText: string, searchText: string) {
    // 文字列をカタカナからひらがなに変換
    const inputTextHiragana = katakanaToHiragana(inputText);
    const searchTextHiragana = katakanaToHiragana(searchText);
  
    // 文字列をローマ数字と通常の数字を区別せずに変換
    const inputTextNoNumbers = replaceNumbersWithRoman(inputTextHiragana);
    const searchTextNoNumbers = replaceNumbersWithRoman(searchTextHiragana);
  
    // 検索用の文字列が見つかった回数を数える
    const matches = inputTextNoNumbers.match(new RegExp(searchTextNoNumbers, 'gi'));
    const matchCount = matches ? matches.length : 0;
  
    // スコアを計算する（検索用の文字列の一致数を基に0から1の範囲に変換）
    const score = matchCount / Math.max(inputTextNoNumbers.length, 1);
  
    return score;
  }


export function NewAutoComplete({options, placeholder, notfoundText,searchWordPlaceholder, onSelected}: AutoCompleteProps) {
    const [open, setOpen] = React.useState(false)
    const [value, setValue] = React.useState("")
    const [filteredOptions, setFilteredOptions] = React.useState<AutoCompleteItem[]>(options)
    const [searchWord, setSearchWord] = React.useState("")

    function createCommandFilter(options: AutoCompleteItem[]) {
      function commandFilter(value: string, search: string): number {
          return calculateMatchScore(value, search)
      }
      return commandFilter
  }

  useEffect(() => {
    const replacedSearchWord = hiraganaToKatagana(replaceNumbersWithRoman(searchWord.replace("・", "").toLowerCase()))
    //const hiraganaInputValue = hiraganaToKatagana(replacedSearchWord);
    const filteredOptions = options.filter(
      (option) =>
      replaceNumbersWithRoman(hiraganaToKatagana(option.label
          .replace("・", "")
          .toLowerCase()))
          .includes(replacedSearchWord)
    );
    setFilteredOptions(filteredOptions);
  }, [searchWord])
  

    return (
    <Popover open={open} onOpenChange={setOpen} >
    <PopoverTrigger asChild>
      <Button
        variant="outline"
        role="combobox"
        aria-expanded={open}
        className="w-[200px] justify-between"
      >
        {value
          ? options.find((option) => option.value === value)?.label
          : placeholder}
        <ChevronsUpDown className="ml-2 h-4 w-4 shrink-0 opacity-50" />
      </Button>
    </PopoverTrigger>
    <PopoverContent className="w-[200px] p-0">
      <Command  filter={createCommandFilter(options)} shouldFilter={false} >
        <CommandInput onChangeCapture={(e) => setSearchWord(e.currentTarget.value)} placeholder={searchWordPlaceholder} />
        <CommandEmpty>{notfoundText}</CommandEmpty>
        <ScrollArea  className="h-[200px] z-50">
        <CommandGroup>
          {filteredOptions.map((option) => (
            <CommandItem
              key={option.label}
              onSelect={() => {
                setValue(option.value)
                if (onSelected) {
                  onSelected(option.value)
                }
                setOpen(false)
              }}
            >
              <Check
                className={cn(
                  "mr-2 h-4 w-4",
                  value === option.value ? "opacity-100" : "opacity-0"
                )}
              />
              {option.label}
            </CommandItem>
          ))}
        </CommandGroup>
        </ScrollArea >
      </Command>
    </PopoverContent>
  </Popover>)
}